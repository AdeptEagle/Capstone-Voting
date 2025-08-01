import { createConnection } from "../config/database.js";

async function updateVoteConstraint() {
  const db = createConnection();
  
  try {
    console.log('Updating vote constraint...');
    
    // Drop the existing constraint
    await new Promise((resolve, reject) => {
      const query = "ALTER TABLE votes DROP INDEX unique_vote";
      db.query(query, (err) => {
        if (err) {
          if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.log('Constraint already dropped or does not exist');
            resolve();
          } else {
            reject(err);
          }
        } else {
          resolve();
        }
      });
    });
    
    // Add the new constraint
    await new Promise((resolve, reject) => {
      const query = "ALTER TABLE votes ADD CONSTRAINT unique_vote UNIQUE (voterId, electionId, candidateId)";
      db.query(query, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Vote constraint updated successfully');
  } catch (error) {
    console.error('❌ Error updating vote constraint:', error.message);
    throw error;
  } finally {
    db.end();
  }
}

// Run the update if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  updateVoteConstraint()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { updateVoteConstraint };