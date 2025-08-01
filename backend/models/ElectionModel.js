import { createConnection } from "../config/database.js";
import crypto from "crypto";

// Helper function to format photo URLs consistently
const formatPhotoUrl = (photoUrl) => {
  if (!photoUrl || photoUrl.trim() === '') {
    return null;
  }
  
  // If it's already a full URL (http/https) or data URL, return as is
  if (photoUrl.startsWith('http') || photoUrl.startsWith('data:')) {
    return photoUrl;
  }
  
  // Otherwise, construct full URL using environment variable or fallback
  const baseUrl = process.env.BACKEND_URL || process.env.RAILWAY_PUBLIC_DOMAIN 
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
    : 'https://backend-production-219d.up.railway.app';
    
  return `${baseUrl}/uploads/${photoUrl}`;
};

export class ElectionModel {
  static async getAll() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.*, a.username as createdByUsername,
        (SELECT COUNT(*) FROM election_positions ep WHERE ep.electionId = e.id) as positionCount
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        ORDER BY e.created_at DESC
      `;
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async getActive() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.*, a.username as createdByUsername
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        WHERE e.status = 'active' 
        ORDER BY e.created_at DESC
        LIMIT 1
      `;
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data.length > 0 ? data[0] : null);
      });
    });
  }

  static async getById(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.*, a.username as createdByUsername
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        WHERE e.id = ?
      `;
      db.query(query, [id], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data.length === 0 ? null : data[0]);
      });
    });
  }

  static async hasActiveElection() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT COUNT(*) as count FROM elections WHERE status != 'ended'";
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0].count > 0);
      });
    });
  }

  static async getCurrentElection() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM elections WHERE status != 'ended' ORDER BY created_at DESC LIMIT 1";
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data.length > 0 ? data[0] : null);
      });
    });
  }

  static async getElectionHistory() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT e.*, a.username as createdByUsername,
        (SELECT COUNT(*) FROM election_positions ep WHERE ep.electionId = e.id) as positionCount,
        (SELECT COUNT(*) FROM votes v WHERE v.electionId = e.id) as totalVotes
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        WHERE e.status = 'ended'
        ORDER BY e.endTime DESC
      `;
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async getRealTimeStats() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          COALESCE(COUNT(DISTINCT v.id), 0) as totalVotes,
          COALESCE(COUNT(DISTINCT v.voterId), 0) as uniqueVoters,
          COALESCE(COUNT(DISTINCT v.candidateId), 0) as candidatesWithVotes,
          COALESCE(COUNT(DISTINCT p.id), 0) as totalPositions,
          (SELECT COUNT(DISTINCT v2.voterId) FROM votes v2 INNER JOIN elections e2 ON v2.electionId = e2.id WHERE e2.status = 'active') as votersWhoVoted,
          (SELECT COUNT(*) FROM voters) as totalVoters
        FROM votes v
        LEFT JOIN candidates c ON v.candidateId = c.id
        LEFT JOIN positions p ON c.positionId = p.id
        INNER JOIN elections e ON v.electionId = e.id
        WHERE e.status = 'active'
      `;
      
      db.query(query, (err, data) => {
        db.end();
        if (err) {
          console.error('Database error in getRealTimeStats:', err);
          reject(err);
        } else {
          const stats = data[0] || {};
          stats.voterTurnout = stats.totalVoters > 0 ? 
            Math.round((stats.votersWhoVoted / stats.totalVoters) * 100) : 0;
          resolve(stats);
        }
      });
    });
  }

  static async getActiveElectionResults() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.id as positionId,
          p.name as positionName,
          p.voteLimit,
          c.id as candidateId,
          c.name as candidateName,
          c.photoUrl,
          COUNT(v.id) as voteCount
        FROM positions p
        LEFT JOIN candidates c ON p.id = c.positionId
        LEFT JOIN votes v ON c.id = v.candidateId
        WHERE p.id IN (
          SELECT ep.positionId 
          FROM election_positions ep 
          INNER JOIN elections e ON ep.electionId = e.id
          WHERE e.status = 'active'
        )
        GROUP BY p.id, p.name, p.voteLimit, c.id, c.name, c.photoUrl
        ORDER BY p.displayOrder, p.name, voteCount DESC
      `;
      db.query(query, (err, data) => {
        db.end();
        if (err) {
          console.error('Database error in getActiveElectionResults:', err);
          reject(err);
        } else {
          // Format photo URLs consistently
          const resultsWithPhotoUrl = data.map(result => ({
            ...result,
            photoUrl: formatPhotoUrl(result.photoUrl)
          }));
          resolve(resultsWithPhotoUrl);
        }
      });
    });
  }

  static async getElectionPositions(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, ep.electionId
        FROM positions p
        INNER JOIN election_positions ep ON p.id = ep.positionId
        WHERE ep.electionId = ?
        ORDER BY p.displayOrder
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  static async getElectionCandidates(electionId) {
    return new Promise((resolve, reject) => {
      const db = createConnection();
      
      const query = `
        SELECT 
          c.*,
          p.name as positionName,
          CASE WHEN ec.electionId IS NOT NULL THEN 1 ELSE 0 END as isAssigned
        FROM candidates c
        LEFT JOIN positions p ON c.positionId = p.id
        LEFT JOIN election_candidates ec ON c.id = ec.candidateId AND ec.electionId = ?
        ORDER BY p.displayOrder, c.name
      `;
      
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) {
          console.error('Database error in getElectionCandidates:', err);
          reject(err);
        } else {
          // Format photo URLs consistently
          const candidatesWithPhotoUrl = data.map(candidate => ({
            ...candidate,
            photoUrl: formatPhotoUrl(candidate.photoUrl)
          }));
          resolve(candidatesWithPhotoUrl);
        }
      });
    });
  }

  static async create(electionData) {
    const db = createConnection();
    
    try {
      // Check if there's already an active election in the system
      const hasActive = await this.hasActiveElection();
      if (hasActive) {
        const currentElection = await this.getCurrentElection();
        db.end();
        throw new Error(`Cannot create a new election. There is already an election "${currentElection.title}" in the system. You must end or delete the existing election first to create a new one.`);
      }

      const { title, description, startTime, endTime, positionIds, candidateIds, id, createdBy } = electionData;

      // Convert dates to MySQL datetime format
      const mysqlStartTime = new Date(startTime).toISOString().slice(0, 19).replace('T', ' ');
      const mysqlEndTime = new Date(endTime).toISOString().slice(0, 19).replace('T', ' ');

      // BEGIN TRANSACTION - ACID Atomicity
      await new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      try {
        // Insert the election
        await new Promise((resolve, reject) => {
          db.query("INSERT INTO elections (id, title, description, startTime, endTime, status, created_by) VALUES (?, ?, ?, ?, ?, 'pending', ?)",
            [id, title, description, mysqlStartTime, mysqlEndTime, createdBy], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });

        // Import ID generator once
        const IDGenerator = await import('../utils/idGenerator.js');

        // Add positions to election
        if (positionIds && positionIds.length > 0) {
          const positionValues = [];
          for (const posId of positionIds) {
            const positionId = await IDGenerator.default.getNextElectionPositionID();
            positionValues.push([positionId, id, posId]);
          }
          
          await new Promise((resolve, reject) => {
            const positionQuery = "INSERT INTO election_positions (id, electionId, positionId) VALUES ?";
            db.query(positionQuery, [positionValues], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }

        // Add candidates to election
        if (candidateIds && candidateIds.length > 0) {
          const candidateValues = [];
          for (const candidateId of candidateIds) {
            const electionCandidateId = await IDGenerator.default.getNextElectionCandidateID();
            candidateValues.push([electionCandidateId, id, candidateId]);
          }
          
          await new Promise((resolve, reject) => {
            const candidateQuery = "INSERT INTO election_candidates (id, electionId, candidateId) VALUES ?";
            db.query(candidateQuery, [candidateValues], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }

        // COMMIT TRANSACTION - ACID Durability
        await new Promise((resolve, reject) => {
          db.commit((err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        return { message: "Election created successfully!", id };

      } catch (error) {
        // ROLLBACK TRANSACTION - ACID Consistency
        await new Promise((resolve) => {
          db.rollback(() => resolve());
        });
        throw error;
      }

    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async update(id, electionData) {
    const db = createConnection();
    
    try {
      const { title, description, startTime, endTime, status, positionIds, candidateIds } = electionData;

      console.log('🔄 ElectionModel.update called with:', { id, electionData });

      // Convert dates to MySQL datetime format
      const mysqlStartTime = new Date(startTime).toISOString().slice(0, 19).replace('T', ' ');
      const mysqlEndTime = new Date(endTime).toISOString().slice(0, 19).replace('T', ' ');

      console.log('📅 Converted dates:', { mysqlStartTime, mysqlEndTime });

      // BEGIN TRANSACTION - ACID Atomicity
      await new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      try {
        // Update the election
        await new Promise((resolve, reject) => {
          db.query("UPDATE elections SET title = ?, description = ?, startTime = ?, endTime = ?, status = ? WHERE id = ?",
            [title, description, mysqlStartTime, mysqlEndTime, status, id], (err) => {
            if (err) {
              console.error('❌ Error updating election:', err);
              reject(err);
            } else {
              console.log('✅ Election updated successfully');
              resolve();
            }
          });
        });

        // Update positions if provided
        if (positionIds !== undefined) {
          console.log('🔄 Updating positions:', positionIds);
          // Remove existing positions
          await new Promise((resolve, reject) => {
            db.query("DELETE FROM election_positions WHERE electionId = ?", [id], (err) => {
              if (err) {
                console.error('❌ Error deleting positions:', err);
                reject(err);
              } else {
                console.log('✅ Existing positions deleted');
                resolve();
              }
            });
          });

          // Add new positions
          if (positionIds.length > 0) {
            // Import ID generator once
            const IDGenerator = await import('../utils/idGenerator.js');
            
            const positionValues = [];
            for (const posId of positionIds) {
              const positionId = await IDGenerator.default.getNextElectionPositionID();
              positionValues.push([positionId, id, posId]);
            }
            
            await new Promise((resolve, reject) => {
              const positionQuery = "INSERT INTO election_positions (id, electionId, positionId) VALUES ?";
              db.query(positionQuery, [positionValues], (err) => {
                if (err) {
                  console.error('❌ Error inserting positions:', err);
                  reject(err);
                } else {
                  console.log('✅ New positions inserted');
                  resolve();
                }
              });
            });
          }
        }

        // Update candidates if provided
        if (candidateIds !== undefined) {
          console.log('🔄 Updating candidates:', candidateIds);
          // Remove existing candidates
          await new Promise((resolve, reject) => {
            db.query("DELETE FROM election_candidates WHERE electionId = ?", [id], (err) => {
              if (err) {
                console.error('❌ Error deleting candidates:', err);
                reject(err);
              } else {
                console.log('✅ Existing candidates deleted');
                resolve();
              }
            });
          });

          // Add new candidates
          if (candidateIds.length > 0) {
            // Import ID generator once
            const IDGenerator = await import('../utils/idGenerator.js');
            
            const candidateValues = [];
            for (const candidateId of candidateIds) {
              const electionCandidateId = await IDGenerator.default.getNextElectionCandidateID();
              candidateValues.push([electionCandidateId, id, candidateId]);
            }
            
            await new Promise((resolve, reject) => {
              const candidateQuery = "INSERT INTO election_candidates (id, electionId, candidateId) VALUES ?";
              db.query(candidateQuery, [candidateValues], (err) => {
                if (err) {
                  console.error('❌ Error inserting candidates:', err);
                  reject(err);
                } else {
                  console.log('✅ New candidates inserted');
                  resolve();
                }
              });
            });
          }
        }

        // COMMIT TRANSACTION - ACID Durability
        await new Promise((resolve, reject) => {
          db.commit((err) => {
            if (err) {
              console.error('❌ Error committing transaction:', err);
              reject(err);
            } else {
              console.log('✅ Transaction committed successfully');
              resolve();
            }
          });
        });

        return { message: "Election updated successfully!" };

      } catch (error) {
        console.error('❌ Error in transaction, rolling back:', error);
        // ROLLBACK TRANSACTION - ACID Consistency
        await new Promise((resolve) => {
          db.rollback(() => resolve());
        });
        throw error;
      }

    } catch (error) {
      console.error('❌ Error in ElectionModel.update:', error);
      throw error;
    } finally {
      db.end();
    }
  }

  static async startElection(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      db.query("UPDATE elections SET status = 'active' WHERE id = ?", [id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election started successfully!" });
      });
    });
  }

  static async pauseElection(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      db.query("UPDATE elections SET status = 'paused' WHERE id = ?", [id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election paused successfully!" });
      });
    });
  }

  static async stopElection(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      db.query("UPDATE elections SET status = 'stopped' WHERE id = ?", [id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election stopped successfully!" });
      });
    });
  }

  static async resumeElection(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      db.query("UPDATE elections SET status = 'active' WHERE id = ?", [id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election resumed successfully!" });
      });
    });
  }

  static async endElection(id) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const endTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      db.query("UPDATE elections SET status = 'ended', endTime = ? WHERE id = ?", [endTime, id], (err) => {
        db.end();
        if (err) reject(err);
        else resolve({ message: "Election ended successfully and saved to history!" });
      });
    });
  }

  static async delete(id) {
    const db = createConnection();
    
    try {
      // BEGIN TRANSACTION - ACID Atomicity
      await new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      try {
        // Delete related votes first (due to foreign key constraints)
        await new Promise((resolve, reject) => {
          db.query("DELETE FROM votes WHERE electionId = ?", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        // Delete election candidates
        await new Promise((resolve, reject) => {
          db.query("DELETE FROM election_candidates WHERE electionId = ?", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        // Delete election positions
        await new Promise((resolve, reject) => {
          db.query("DELETE FROM election_positions WHERE electionId = ?", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        // Delete the election
        await new Promise((resolve, reject) => {
          db.query("DELETE FROM elections WHERE id = ?", [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        // COMMIT TRANSACTION - ACID Durability
        await new Promise((resolve, reject) => {
          db.commit((err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        return { message: "Election deleted successfully!" };

      } catch (error) {
        // ROLLBACK TRANSACTION - ACID Consistency
        await new Promise((resolve) => {
          db.rollback(() => resolve());
        });
        throw error;
      }

    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async getPositions(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*
        FROM positions p
        INNER JOIN election_positions ep ON p.id = ep.positionId
        WHERE ep.electionId = ?
        ORDER BY p.name
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
} 