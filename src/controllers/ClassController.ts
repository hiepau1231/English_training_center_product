// src/controllers/ClassController.ts
import { Request, Response } from 'express';
import { ClassService } from '../services/ClassServices';

export class ClassController {
  private classService: ClassService;

  constructor() {
    this.classService = new ClassService();
  }

  async getAllClasses(req: Request, res: Response) {
    try {
      const classes = await this.classService.getAllClass();
      if(!classes) {
        return res.status(404).json({ message: 'No classes found !'})
      }
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getClassById(req: Request, res: Response) {
    try {
      const classData = await this.classService.getClassById(Number(req.params.id));
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      res.json(classData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching class', error });
    }
  }

  // async createClass(req: Request, res: Response) {
  //   try {
  //     const classDTO: ClassDTO = req.body;
  //     const newClass = await this.classService.createClass(classDTO);
  //     res.status(201).json(newClass);
  //   } catch (error) {
  //     res.status(400).json({ message: 'Error creating class', error });
  //   }
  // }

  // async updateClass(req: Request, res: Response) {
  //   try {
  //     const classDTO: Partial<ClassDTO> = req.body;
  //     const classId = Number(req.params.id);
  //     const classExists = await this.classService.getClassById(classId);

  //     if (!classExists) {
  //       return res.status(404).json({ message: 'Class not found' });
  //     }

  //     await this.classService.updateClass(classId, classDTO);
  //     res.sendStatus(204);
  //   } catch (error) {
  //     res.status(400).json({ message: 'Error updating class', error });
  //   }
  // }

  // async deleteClass(req: Request, res: Response) {
  //   try {
  //     const classId = Number(req.params.id);
  //     const classExists = await this.classService.getClassById(classId);

  //     if (!classExists) {
  //       return res.status(404).json({ message: 'Class not found' });
  //     }

  //     await this.classService.deleteClass(classId);
  //     res.sendStatus(204);
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error deleting class', error });
  //   }
  // }
}

export default ClassController;
