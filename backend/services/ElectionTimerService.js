import { createConnection } from "../config/database.js";
import { ElectionModel } from "../models/ElectionModel.js";

export class ElectionTimerService {
  static timers = new Map(); // Store active timers
  static checkInterval = null; // Global check interval

  // Initialize the timer service
  static async initialize() {
    console.log('🕐 Initializing Election Timer Service...');
    
    // Start the global check interval
    this.startGlobalCheck();
    
    // Load and start timers for existing active elections
    await this.loadActiveElections();
  }

  // Start global check every minute
  static startGlobalCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      await this.checkAllElections();
    }, 60000); // Check every minute

    console.log('✅ Global election timer check started (every 60 seconds)');
  }

  // Load existing active elections and start their timers
  static async loadActiveElections() {
    try {
      const db = createConnection();
      const elections = await new Promise((resolve, reject) => {
        const query = `
          SELECT id, title, endTime, status 
          FROM elections 
          WHERE status IN ('active', 'pending') 
          AND endTime IS NOT NULL
        `;
        db.query(query, (err, data) => {
          db.end();
          if (err) reject(err);
          else resolve(data);
        });
      });

      for (const election of elections) {
        await this.startElectionTimer(election.id, election.endTime, election.title);
      }

      console.log(`📋 Loaded ${elections.length} active elections with timers`);
    } catch (error) {
      console.error('❌ Error loading active elections:', error);
    }
  }

  // Start timer for a specific election
  static async startElectionTimer(electionId, endTime, electionTitle) {
    try {
      const endDate = new Date(endTime);
      const now = new Date();
      const timeUntilEnd = endDate.getTime() - now.getTime();

      // Clear existing timer if any
      this.stopElectionTimer(electionId);

      if (timeUntilEnd <= 0) {
        // Election should have already ended
        console.log(`⏰ Election ${electionId} (${electionTitle}) should have ended, ending now...`);
        await this.endElection(electionId, electionTitle);
        return;
      }

      // Set timer for when election should end
      const timer = setTimeout(async () => {
        console.log(`⏰ Timer expired for election ${electionId} (${electionTitle}), ending now...`);
        await this.endElection(electionId, electionTitle);
      }, timeUntilEnd);

      // Store timer reference
      this.timers.set(electionId, {
        timer,
        endTime: endDate,
        title: electionTitle,
        startedAt: now
      });

      console.log(`⏰ Started timer for election ${electionId} (${electionTitle}) - ends in ${Math.floor(timeUntilEnd / 1000 / 60)} minutes`);
    } catch (error) {
      console.error(`❌ Error starting timer for election ${electionId}:`, error);
    }
  }

  // Stop timer for a specific election
  static stopElectionTimer(electionId) {
    const timerData = this.timers.get(electionId);
    if (timerData) {
      clearTimeout(timerData.timer);
      this.timers.delete(electionId);
      console.log(`⏹️ Stopped timer for election ${electionId}`);
    }
  }

  // End an election automatically
  static async endElection(electionId, electionTitle) {
    try {
      // Stop the timer
      this.stopElectionTimer(electionId);

      // Update election status to ended
      const db = createConnection();
      const endTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      await new Promise((resolve, reject) => {
        db.query(
          "UPDATE elections SET status = 'ended', endTime = ? WHERE id = ?", 
          [endTime, electionId], 
          (err) => {
            db.end();
            if (err) reject(err);
            else resolve();
          }
        );
      });

      console.log(`✅ Election ${electionId} (${electionTitle}) automatically ended at ${endTime}`);
      
      // Log the automatic ending
      console.log(`📊 Election "${electionTitle}" (ID: ${electionId}) has been automatically ended and saved to history.`);
      
    } catch (error) {
      console.error(`❌ Error ending election ${electionId}:`, error);
    }
  }

  // Check all elections for expiration
  static async checkAllElections() {
    try {
      const db = createConnection();
      const elections = await new Promise((resolve, reject) => {
        const query = `
          SELECT id, title, endTime, status 
          FROM elections 
          WHERE status IN ('active', 'pending') 
          AND endTime IS NOT NULL
          AND endTime <= NOW()
        `;
        db.query(query, (err, data) => {
          db.end();
          if (err) reject(err);
          else resolve(data);
        });
      });

      for (const election of elections) {
        console.log(`⏰ Found expired election ${election.id} (${election.title}), ending now...`);
        await this.endElection(election.id, election.title);
      }

      if (elections.length > 0) {
        console.log(`📊 Ended ${elections.length} expired elections`);
      }
    } catch (error) {
      console.error('❌ Error checking elections:', error);
    }
  }

  // Get time remaining for an election
  static getTimeRemaining(electionId) {
    const timerData = this.timers.get(electionId);
    if (!timerData) return null;

    const now = new Date();
    const timeRemaining = timerData.endTime.getTime() - now.getTime();
    
    if (timeRemaining <= 0) return 0;
    
    return {
      total: timeRemaining,
      days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((timeRemaining % (1000 * 60)) / 1000)
    };
  }

  // Get all active timers info
  static getActiveTimers() {
    const activeTimers = [];
    for (const [electionId, timerData] of this.timers) {
      const timeRemaining = this.getTimeRemaining(electionId);
      if (timeRemaining !== null) {
        activeTimers.push({
          electionId,
          title: timerData.title,
          endTime: timerData.endTime,
          timeRemaining
        });
      }
    }
    return activeTimers;
  }

  // Cleanup method
  static cleanup() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    for (const [electionId, timerData] of this.timers) {
      clearTimeout(timerData.timer);
    }
    this.timers.clear();

    console.log('🧹 Election Timer Service cleaned up');
  }
} 