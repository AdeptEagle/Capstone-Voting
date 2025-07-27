import VoterGroupModel from '../models/VoterGroupModel.js';

class VoterGroupController {
  // Get all voter groups
  static async getAllVoterGroups(req, res) {
    try {
      const voterGroups = await VoterGroupModel.getAll();
      res.json(voterGroups);
    } catch (error) {
      console.error('Error getting voter groups:', error);
      res.status(500).json({ error: 'Failed to get voter groups' });
    }
  }

  // Get voter group by ID
  static async getVoterGroupById(req, res) {
    try {
      const { id } = req.params;
      const voterGroup = await VoterGroupModel.getById(id);
      
      if (!voterGroup) {
        return res.status(404).json({ error: 'Voter group not found' });
      }
      
      res.json(voterGroup);
    } catch (error) {
      console.error('Error getting voter group:', error);
      res.status(500).json({ error: 'Failed to get voter group' });
    }
  }

  // Create a new voter group
  static async createVoterGroup(req, res) {
    try {
      const { name, description, type } = req.body;
      
      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }

      const voterGroupData = {
        name,
        description,
        type,
        created_by: req.user.id
      };

      const result = await VoterGroupModel.create(voterGroupData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating voter group:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Voter group with this name already exists' });
      } else {
        res.status(500).json({ error: 'Failed to create voter group' });
      }
    }
  }

  // Update a voter group
  static async updateVoterGroup(req, res) {
    try {
      const { id } = req.params;
      const { name, description, type } = req.body;
      
      if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
      }

      const voterGroupData = {
        name,
        description,
        type
      };

      const result = await VoterGroupModel.update(id, voterGroupData);
      res.json(result);
    } catch (error) {
      console.error('Error updating voter group:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Voter group with this name already exists' });
      } else {
        res.status(500).json({ error: 'Failed to update voter group' });
      }
    }
  }

  // Delete a voter group
  static async deleteVoterGroup(req, res) {
    try {
      const { id } = req.params;
      await VoterGroupModel.delete(id);
      res.json({ message: 'Voter group deleted successfully' });
    } catch (error) {
      console.error('Error deleting voter group:', error);
      res.status(500).json({ error: 'Failed to delete voter group' });
    }
  }

  // Get members of a voter group
  static async getVoterGroupMembers(req, res) {
    try {
      const { id } = req.params;
      const members = await VoterGroupModel.getMembers(id);
      res.json(members);
    } catch (error) {
      console.error('Error getting voter group members:', error);
      res.status(500).json({ error: 'Failed to get voter group members' });
    }
  }

  // Add member to voter group
  static async addMemberToGroup(req, res) {
    try {
      const { voterGroupId, voterId } = req.body;
      
      if (!voterGroupId || !voterId) {
        return res.status(400).json({ error: 'Voter group ID and voter ID are required' });
      }

      await VoterGroupModel.addMember(voterGroupId, voterId);
      res.json({ message: 'Member added to group successfully' });
    } catch (error) {
      console.error('Error adding member to group:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Voter is already a member of this group' });
      } else {
        res.status(500).json({ error: 'Failed to add member to group' });
      }
    }
  }

  // Remove member from voter group
  static async removeMemberFromGroup(req, res) {
    try {
      const { voterGroupId, voterId } = req.body;
      
      if (!voterGroupId || !voterId) {
        return res.status(400).json({ error: 'Voter group ID and voter ID are required' });
      }

      await VoterGroupModel.removeMember(voterGroupId, voterId);
      res.json({ message: 'Member removed from group successfully' });
    } catch (error) {
      console.error('Error removing member from group:', error);
      res.status(500).json({ error: 'Failed to remove member from group' });
    }
  }

  // Get voter groups by type
  static async getVoterGroupsByType(req, res) {
    try {
      const { type } = req.params;
      const voterGroups = await VoterGroupModel.getByType(type);
      res.json(voterGroups);
    } catch (error) {
      console.error('Error getting voter groups by type:', error);
      res.status(500).json({ error: 'Failed to get voter groups by type' });
    }
  }

  // Get voter groups for a specific voter
  static async getVoterGroupsForVoter(req, res) {
    try {
      const { voterId } = req.params;
      const voterGroups = await VoterGroupModel.getVoterGroups(voterId);
      res.json(voterGroups);
    } catch (error) {
      console.error('Error getting voter groups for voter:', error);
      res.status(500).json({ error: 'Failed to get voter groups for voter' });
    }
  }

  // Get available voters (not in any group)
  static async getAvailableVoters(req, res) {
    try {
      const availableVoters = await VoterGroupModel.getAvailableVoters();
      res.json(availableVoters);
    } catch (error) {
      console.error('Error getting available voters:', error);
      res.status(500).json({ error: 'Failed to get available voters' });
    }
  }
}

export default VoterGroupController; 