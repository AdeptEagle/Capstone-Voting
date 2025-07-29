import { createConnection } from "../config/database.js";

/**
 * Transaction Helper for ACID compliance
 * Provides standardized transaction management across the application
 */
export class TransactionHelper {
  
  /**
   * Execute a function within a database transaction
   * @param {Function} operation - The operation to execute within the transaction
   * @returns {Promise} - Result of the operation
   */
  static async executeInTransaction(operation) {
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
        // Execute the operation with the database connection
        const result = await operation(db);
        
        // COMMIT TRANSACTION - ACID Durability
        await new Promise((resolve, reject) => {
          db.commit((err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        return result;

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

  /**
   * Execute multiple operations in a single transaction
   * @param {Array<Function>} operations - Array of operations to execute
   * @returns {Promise<Array>} - Results of all operations
   */
  static async executeMultipleInTransaction(operations) {
    return this.executeInTransaction(async (db) => {
      const results = [];
      for (const operation of operations) {
        const result = await operation(db);
        results.push(result);
      }
      return results;
    });
  }

  /**
   * Execute a read operation with transaction isolation
   * @param {Function} operation - The read operation to execute
   * @returns {Promise} - Result of the operation
   */
  static async executeReadInTransaction(operation) {
    const db = createConnection();
    
    try {
      // Set transaction isolation level for reads
      await new Promise((resolve, reject) => {
        db.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED", (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // BEGIN TRANSACTION
      await new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      try {
        const result = await operation(db);
        
        // COMMIT TRANSACTION
        await new Promise((resolve, reject) => {
          db.commit((err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        return result;

      } catch (error) {
        // ROLLBACK TRANSACTION
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
}

/**
 * Transaction decorator for class methods
 * @param {Function} target - The target method
 * @param {string} propertyKey - The method name
 * @param {PropertyDescriptor} descriptor - The property descriptor
 */
export function withTransaction(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function (...args) {
    return TransactionHelper.executeInTransaction(async (db) => {
      // Pass the database connection as the first argument
      return await originalMethod.apply(this, [db, ...args]);
    });
  };
  
  return descriptor;
} 