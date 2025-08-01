import { createConnection } from "../config/database.js";

export class BallotHistoryModel {
  
  // Get all completed elections with summary data
  static async getAllCompletedElections() {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          e.id,
          e.title,
          e.description,
          e.startTime,
          e.endTime,
          e.status,
          e.created_at,
          a.username as createdBy,
          COUNT(DISTINCT v.voterId) as totalVoters,
          COUNT(v.id) as totalVotes,
          COUNT(DISTINCT ep.positionId) as totalPositions,
          COUNT(DISTINCT ec.candidateId) as totalCandidates,
          TIMESTAMPDIFF(MINUTE, e.startTime, e.endTime) as durationMinutes
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        LEFT JOIN votes v ON e.id = v.electionId
        LEFT JOIN election_positions ep ON e.id = ep.electionId
        LEFT JOIN election_candidates ec ON e.id = ec.electionId
        WHERE e.status = 'ended'
        GROUP BY e.id
        ORDER BY e.endTime DESC
      `;
      db.query(query, (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Get detailed election results with winners and losers per position
  static async getElectionResults(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.id as positionId,
          p.name as positionName,
          p.voteLimit,
          c.id as candidateId,
          c.name as candidateName,
          c.departmentName as candidateDepartment,
          c.courseName as candidateCourse,
          c.photoUrl,
          COUNT(v.id) as voteCount,
          RANK() OVER (PARTITION BY p.id ORDER BY COUNT(v.id) DESC) as rank_position
        FROM positions p
        INNER JOIN election_positions ep ON p.id = ep.positionId
        LEFT JOIN candidates c ON p.id = c.positionId
        LEFT JOIN election_candidates ec ON c.id = ec.candidateId AND ec.electionId = ?
        LEFT JOIN votes v ON c.id = v.candidateId AND v.electionId = ?
        WHERE ep.electionId = ?
        GROUP BY p.id, c.id
        ORDER BY p.name, voteCount DESC, c.name
      `;
      db.query(query, [electionId, electionId, electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Get all voters who participated in an election
  static async getElectionVoters(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT DISTINCT
          vo.id,
          vo.name,
          vo.studentId,
          vo.departmentName,
          vo.courseName,
          vo.hasVoted,
          COUNT(v.id) as votesCount,
          MIN(v.created_at) as firstVoteTime,
          MAX(v.created_at) as lastVoteTime,
          TIMESTAMPDIFF(SECOND, MIN(v.created_at), MAX(v.created_at)) as votingDurationSeconds
        FROM voters vo
        LEFT JOIN votes v ON vo.id = v.voterId AND v.electionId = ?
        WHERE vo.hasVoted = 1 OR v.voterId IS NOT NULL
        GROUP BY vo.id
        ORDER BY firstVoteTime ASC
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Get department-wise voting statistics
  static async getDepartmentVotingStats(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          vo.departmentName,
          COUNT(DISTINCT vo.id) as totalVoters,
          COUNT(DISTINCT v.voterId) as votersWhoVoted,
          COUNT(v.id) as totalVotes,
          ROUND((COUNT(DISTINCT v.voterId) / COUNT(DISTINCT vo.id)) * 100, 2) as participationRate,
          MIN(v.created_at) as firstVoteTime,
          MAX(v.created_at) as lastVoteTime
        FROM voters vo
        LEFT JOIN votes v ON vo.id = v.voterId AND v.electionId = ?
        GROUP BY vo.departmentName
        ORDER BY participationRate DESC, totalVotes DESC
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Get course-wise voting statistics
  static async getCourseVotingStats(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          vo.departmentName,
          vo.courseName,
          COUNT(DISTINCT vo.id) as totalVoters,
          COUNT(DISTINCT v.voterId) as votersWhoVoted,
          COUNT(v.id) as totalVotes,
          ROUND((COUNT(DISTINCT v.voterId) / COUNT(DISTINCT vo.id)) * 100, 2) as participationRate
        FROM voters vo
        LEFT JOIN votes v ON vo.id = v.voterId AND v.electionId = ?
        GROUP BY vo.departmentName, vo.courseName
        ORDER BY vo.departmentName, participationRate DESC
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Get hourly voting timeline
  static async getVotingTimeline(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          DATE_FORMAT(v.created_at, '%Y-%m-%d %H:00:00') as hour,
          COUNT(v.id) as votesCount,
          COUNT(DISTINCT v.voterId) as uniqueVoters
        FROM votes v
        WHERE v.electionId = ?
        GROUP BY DATE_FORMAT(v.created_at, '%Y-%m-%d %H:00:00')
        ORDER BY hour ASC
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Get position performance analytics
  static async getPositionAnalytics(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.id as positionId,
          p.name as positionName,
          p.voteLimit,
          COUNT(DISTINCT c.id) as totalCandidates,
          COUNT(v.id) as totalVotes,
          COUNT(DISTINCT v.voterId) as uniqueVoters,
          ROUND(COUNT(v.id) / COUNT(DISTINCT c.id), 2) as avgVotesPerCandidate,
          MAX(candidate_votes.voteCount) as maxVotes,
          MIN(candidate_votes.voteCount) as minVotes,
          STDDEV(candidate_votes.voteCount) as voteStdDev
        FROM positions p
        INNER JOIN election_positions ep ON p.id = ep.positionId
        LEFT JOIN candidates c ON p.id = c.positionId
        LEFT JOIN election_candidates ec ON c.id = ec.candidateId AND ec.electionId = ?
        LEFT JOIN votes v ON c.id = v.candidateId AND v.electionId = ?
        LEFT JOIN (
          SELECT candidateId, COUNT(*) as voteCount
          FROM votes 
          WHERE electionId = ?
          GROUP BY candidateId
        ) candidate_votes ON c.id = candidate_votes.candidateId
        WHERE ep.electionId = ?
        GROUP BY p.id
        ORDER BY p.name
      `;
      db.query(query, [electionId, electionId, electionId, electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Get vote distribution by time periods
  static async getVoteDistribution(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          CASE 
            WHEN HOUR(v.created_at) BETWEEN 6 AND 11 THEN 'Morning (6AM-12PM)'
            WHEN HOUR(v.created_at) BETWEEN 12 AND 17 THEN 'Afternoon (12PM-6PM)'
            WHEN HOUR(v.created_at) BETWEEN 18 AND 23 THEN 'Evening (6PM-12AM)'
            ELSE 'Night (12AM-6AM)'
          END as timePeriod,
          COUNT(v.id) as voteCount,
          COUNT(DISTINCT v.voterId) as uniqueVoters,
          ROUND((COUNT(v.id) / (SELECT COUNT(*) FROM votes WHERE electionId = ?)) * 100, 2) as percentage
        FROM votes v
        WHERE v.electionId = ?
        GROUP BY timePeriod
        ORDER BY voteCount DESC
      `;
      db.query(query, [electionId, electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Get comprehensive election summary
  static async getElectionSummary(electionId) {
    const db = createConnection();
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          e.id,
          e.title,
          e.description,
          e.startTime,
          e.endTime,
          e.status,
          e.created_at,
          a.username as createdBy,
          COUNT(DISTINCT v.voterId) as totalVoters,
          COUNT(v.id) as totalVotes,
          COUNT(DISTINCT ep.positionId) as totalPositions,
          COUNT(DISTINCT ec.candidateId) as totalCandidates,
          TIMESTAMPDIFF(MINUTE, e.startTime, e.endTime) as durationMinutes,
          (SELECT COUNT(*) FROM voters WHERE hasVoted = 1) as totalEligibleVoters,
          ROUND((COUNT(DISTINCT v.voterId) / (SELECT COUNT(*) FROM voters WHERE hasVoted = 1)) * 100, 2) as participationRate,
          MIN(v.created_at) as firstVoteTime,
          MAX(v.created_at) as lastVoteTime
        FROM elections e
        LEFT JOIN admins a ON e.created_by = a.id
        LEFT JOIN votes v ON e.id = v.electionId
        LEFT JOIN election_positions ep ON e.id = ep.electionId
        LEFT JOIN election_candidates ec ON e.id = ec.electionId
        WHERE e.id = ?
        GROUP BY e.id
      `;
      db.query(query, [electionId], (err, data) => {
        db.end();
        if (err) reject(err);
        else resolve(data[0]);
      });
    });
  }
} 