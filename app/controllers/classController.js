
const classService = require('../services/classService');
const moment = require('moment');

class ClassController {

  async getClasses(req, res) {
    try {
      const classes = await classService.getClasses();
      res.status(200).json(classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ error: 'Error fetching classes' });
    }
  }

  async getClass(req, res) {
    try {
      const classData = await classService.getClass(req.params.id);
      if (classData) {
        res.status(200).json(classData);
      } else {
        res.status(404).json({ error: 'Class not found' });
      }
    } catch (error) {
      console.error('Error fetching class:', error);
      res.status(500).json({ error: 'Error fetching class' });
    }
  }

  async updateClass(req, res) {
    try {
      const classId = req.params.id;
      const updateData = req.body;

      if (updateData.start_date) {
        const formattedStartDate = moment(updateData.start_date);
        if (formattedStartDate.isValid()) {
          updateData.start_date = formattedStartDate.toISOString();
        } else {
          return res.status(400).json({ error: 'Invalid start date format' });
        }
      }

      if (updateData.end_date) {
        const formattedEndDate = moment(updateData.end_date);
        if (formattedEndDate.isValid()) {
          updateData.end_date = formattedEndDate.toISOString();
        } else {
          return res.status(400).json({ error: 'Invalid end date format' });
        }
      }

      const response = await classService.updateClass(classId, updateData);
      if (response) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ error: 'Class not found' });
      }
    } catch (error) {
      console.error('Error updating class:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async softDeleteClass(req, res) {
    try {
      const classId = req.params.id;
      const response = await classService.softDeleteClass(classId);
      if (response) {
        res.status(200).json({ message: 'Class soft deleted successfully' });
      } else {
        res.status(404).json({ error: 'Class not found' });
      }
    } catch (error) {
      console.error('Error soft deleting class:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async forceDeleteClass(req, res) {
    try {
      const classId = req.params.id;
      const response = await classService.forceDeleteClass(classId);
      if (response) {
        res.status(200).json({ message: 'Class force deleted successfully' });
      } else {
        res.status(404).json({ error: 'Class not found' });
      }
    } catch (error) {
      console.error('Error force deleting class:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async restoreClass(req, res) {
    try {
      const classId = req.params.id;
      const response = await classService.restoreClass(classId);
      if (response) {
        res.status(200).json({ message: 'Class restored successfully' });
      } else {
        res.status(404).json({ error: 'Class not found' });
      }
    } catch (error) {
      console.error('Error restoring class:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getDeletedClasses(req, res) {
    try {
      const deletedClasses = await classService.getDeletedClasses();
      res.status(200).json(deletedClasses);
    } catch (error) {
      console.error('Error fetching deleted classes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = new ClassController();
