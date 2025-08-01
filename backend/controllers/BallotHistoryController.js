import { BallotHistoryModel } from '../models/BallotHistoryModel.js';

export class BallotHistoryController {
  
  // Get all completed elections
  static async getAllCompletedElections(req, res) {
    try {
      const elections = await BallotHistoryModel.getAllCompletedElections();
      res.json({
        success: true,
        data: elections,
        message: `Found ${elections.length} completed elections`
      });
    } catch (error) {
      console.error('Error fetching completed elections:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Get comprehensive election analysis
  static async getElectionAnalysis(req, res) {
    try {
      const { electionId } = req.params;
      
      // Fetch all data in parallel for better performance
      const [
        summary,
        results,
        voters,
        departmentStats,
        courseStats,
        timeline,
        positionAnalytics,
        voteDistribution
      ] = await Promise.all([
        BallotHistoryModel.getElectionSummary(electionId),
        BallotHistoryModel.getElectionResults(electionId),
        BallotHistoryModel.getElectionVoters(electionId),
        BallotHistoryModel.getDepartmentVotingStats(electionId),
        BallotHistoryModel.getCourseVotingStats(electionId),
        BallotHistoryModel.getVotingTimeline(electionId),
        BallotHistoryModel.getPositionAnalytics(electionId),
        BallotHistoryModel.getVoteDistribution(electionId)
      ]);

      // Process results to separate winners and losers by position
      const positionResults = {};
      results.forEach(result => {
        if (!positionResults[result.positionId]) {
          positionResults[result.positionId] = {
            positionId: result.positionId,
            positionName: result.positionName,
            voteLimit: result.voteLimit,
            candidates: []
          };
        }
        
        positionResults[result.positionId].candidates.push({
          candidateId: result.candidateId,
          candidateName: result.candidateName,
          candidateDepartment: result.candidateDepartment,
          candidateCourse: result.candidateCourse,
          photoUrl: result.photoUrl,
          voteCount: result.voteCount,
          rank: result.rank_position,
          isWinner: result.rank_position <= result.voteLimit
        });
      });

      res.json({
        success: true,
        data: {
          summary,
          positionResults: Object.values(positionResults),
          voters,
          analytics: {
            departmentStats,
            courseStats,
            timeline,
            positionAnalytics,
            voteDistribution
          }
        },
        message: 'Election analysis retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching election analysis:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Get election summary only
  static async getElectionSummary(req, res) {
    try {
      const { electionId } = req.params;
      const summary = await BallotHistoryModel.getElectionSummary(electionId);
      
      if (!summary) {
        return res.status(404).json({
          success: false,
          error: 'Election not found'
        });
      }

      res.json({
        success: true,
        data: summary,
        message: 'Election summary retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching election summary:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Get election results with winners/losers
  static async getElectionResults(req, res) {
    try {
      const { electionId } = req.params;
      const results = await BallotHistoryModel.getElectionResults(electionId);
      
      // Group by position and separate winners/losers
      const positionResults = {};
      results.forEach(result => {
        if (!positionResults[result.positionId]) {
          positionResults[result.positionId] = {
            positionId: result.positionId,
            positionName: result.positionName,
            voteLimit: result.voteLimit,
            winners: [],
            losers: []
          };
        }
        
        const candidate = {
          candidateId: result.candidateId,
          candidateName: result.candidateName,
          candidateDepartment: result.candidateDepartment,
          candidateCourse: result.candidateCourse,
          photoUrl: result.photoUrl,
          voteCount: result.voteCount,
          rank: result.rank_position
        };

        if (result.rank_position <= result.voteLimit) {
          positionResults[result.positionId].winners.push(candidate);
        } else {
          positionResults[result.positionId].losers.push(candidate);
        }
      });

      res.json({
        success: true,
        data: Object.values(positionResults),
        message: 'Election results retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching election results:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Get voters who participated
  static async getElectionVoters(req, res) {
    try {
      const { electionId } = req.params;
      const voters = await BallotHistoryModel.getElectionVoters(electionId);
      
      res.json({
        success: true,
        data: voters,
        message: `Found ${voters.length} voters who participated`
      });
    } catch (error) {
      console.error('Error fetching election voters:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Get department statistics
  static async getDepartmentStats(req, res) {
    try {
      const { electionId } = req.params;
      const stats = await BallotHistoryModel.getDepartmentVotingStats(electionId);
      
      res.json({
        success: true,
        data: stats,
        message: 'Department statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching department stats:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Get course statistics
  static async getCourseStats(req, res) {
    try {
      const { electionId } = req.params;
      const stats = await BallotHistoryModel.getCourseVotingStats(electionId);
      
      res.json({
        success: true,
        data: stats,
        message: 'Course statistics retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching course stats:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Get voting timeline
  static async getVotingTimeline(req, res) {
    try {
      const { electionId } = req.params;
      const timeline = await BallotHistoryModel.getVotingTimeline(electionId);
      
      res.json({
        success: true,
        data: timeline,
        message: 'Voting timeline retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching voting timeline:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Get position analytics
  static async getPositionAnalytics(req, res) {
    try {
      const { electionId } = req.params;
      const analytics = await BallotHistoryModel.getPositionAnalytics(electionId);
      
      res.json({
        success: true,
        data: analytics,
        message: 'Position analytics retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching position analytics:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }

  // Get vote distribution
  static async getVoteDistribution(req, res) {
    try {
      const { electionId } = req.params;
      const distribution = await BallotHistoryModel.getVoteDistribution(electionId);
      
      res.json({
        success: true,
        data: distribution,
        message: 'Vote distribution retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching vote distribution:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
} 