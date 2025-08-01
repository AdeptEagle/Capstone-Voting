import { createConnection } from "../config/database.js";

async function updatePhotoColumn() {
  const db = createConnection();
  
  try {
    console.log('Updating photo column type...');
    
    // Modify the photoUrl column to MEDIUMTEXT
    await new Promise((resolve, reject) => {
      const query = "ALTER TABLE candidates MODIFY COLUMN photoUrl MEDIUMTEXT";
      db.query(query, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log('✅ Photo column updated successfully');
  } catch (error) {
    console.error('❌ Error updating photo column:', error.message);
    throw error;
  } finally {
    db.end();
  }
}

// Run the update if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  updatePhotoColumn()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { updatePhotoColumn };