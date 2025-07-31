import { PositionModel } from "../models/PositionModel.js";

export class PositionController {
  static async getAllPositions(req, res) {
    try {
      // Check if user is admin or superadmin to show all positions
      const showAll = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
      const positions = await PositionModel.getAll(showAll);
      res.json(positions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }



  static async createPosition(req, res) {
    try {
      const result = await PositionModel.create(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePosition(req, res) {
    try {
      const positionId = req.params.id;
      const result = await PositionModel.update(positionId, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deletePosition(req, res) {
    try {
      const positionId = req.params.id;
      const result = await PositionModel.delete(positionId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteMultiplePositions(req, res) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "Please select positions to delete" });
      }
      
      const result = await PositionModel.deleteMultiple(ids);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPositionById(req, res) {
    try {
      const positionId = req.params.id;
      const position = await PositionModel.getById(positionId);
      if (!position) {
        return res.status(404).json({ error: "Position not found" });
      }
      res.json(position);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 