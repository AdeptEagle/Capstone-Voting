import { createConnection } from '../config/database.js';

const resetVoterStatus = async () => {
  const db = createConnection();
  
  return new Promise((resolve, reject) => {
    const query = 'UPDATE voters SET hasVoted = 0';
    
    db.query(query, (err, result) => {
      db.end();
      if (err) {
        console.error('Error resetting voter status:', err);
        reject(err);
      } else {
        console.log(`Reset hasVoted field for ${result.affectedRows} voters`);
        resolve(result);
      }
    });
  });
};

// Run the reset
resetVoterStatus()
  .then(() => {
    console.log('Voter status reset completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to reset voter status:', error);
    process.exit(1);
  }); 