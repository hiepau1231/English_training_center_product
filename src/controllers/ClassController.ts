import { Request, Response } from 'express';
import { ClassDTO } from '../dtos/ClassDTO';
import { ClassService } from '../services/ClassServices';
import { AppDataSource } from '../data-source';
import { ClassSchedule } from '../entities/ClassSchedule';
import { AppError } from '../utils/AppError';
import { IsNull } from 'typeorm';

interface ScheduleResponse {
    id: number;
    date: Date;
    dayOfWeek: string;
    shift: {
        id?: number;
        teachingShift?: string;
        startTime?: string;
        endTime?: string;
    };
    room: {
        id?: number;
        name?: string;
        type?: string;
        capacity?: number;
        currentStudents: number;
    };
    class: {
        id?: number;
        name?: string;
        numberOfStudents?: number;
        type: string;
    };
    course: {
        id?: number;
        name?: string;
        level?: string;
    };
    teacher: {
        id?: number;
        name?: string;
        level?: string;
        experience?: string;
    };
}

export class ClassController {
  private classService: ClassService;
  private scheduleRepository = AppDataSource.getRepository(ClassSchedule);

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
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
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

  async createClass(req: Request, res: Response) {
    try {
      const classDTO: ClassDTO = req.body;
      const newClass = await this.classService.createClass(classDTO);
      res.status(201).json(newClass);
    } catch (error) {
      res.status(400).json({ message: 'Error creating class', error });
    }
  }

  async updateClass(req: Request, res: Response) {
    try {
      const classDTO: Partial<ClassDTO> = req.body;
      const classId = Number(req.params.id);
      const classExists = await this.classService.getClassById(classId);

      if (!classExists) {
        return res.status(404).json({ message: 'Class not found' });
      }

     await this.classService.updateClass(classId, classDTO);
      res.status(200).json({ message: `Update Class with ID ${classId} successfully ! `});
    } catch (error) {
      res.status(400).json({ message: 'Error updating class', error });
    }
  }

  async deleteClass(req: Request, res: Response) {
    try {
      const classId = Number(req.params.id);
      const classExists = await this.classService.getClassById(classId);

      if (!classExists) {
        return res.status(404).json({ message: 'Class not found' });
      }

      await this.classService.deleteClass(classId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: 'Error deleting class', error });
    }
  }

  async getDailySchedules(req: Request, res: Response) {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const schedules = await this.scheduleRepository.find({
        where: {
          scheduleDate: date,
          deletedAt: IsNull()
        },
        relations: {
          teacher: {
            level: true
          },
          room: true,
          class: {
            course: true
          },
          shift: true
        }
      });

      const formattedSchedules: ScheduleResponse[] = schedules.map(schedule => {
        const scheduleDate = new Date(schedule.scheduleDate);
        const dayOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][scheduleDate.getDay()];
        const className = schedule.class?.className || '';

        return {
          id: schedule.id,
          date: schedule.scheduleDate,
          dayOfWeek,
          shift: {
            id: schedule.shift?.id,
            teachingShift: schedule.shift?.teachingShift,
            startTime: schedule.shift?.startTime,
            endTime: schedule.shift?.endTime
          },
          room: {
            id: schedule.room?.id,
            name: schedule.room?.roomNumber,
            type: schedule.room?.type,
            capacity: schedule.room?.capacity,
            currentStudents: schedule.class?.numberOfStudents || 0
          },
          class: {
            id: schedule.class?.id,
            name: className,
            numberOfStudents: schedule.class?.numberOfStudents,
            type: className.toLowerCase().includes('tutorial') ? 'Tutorial' :
                  className.toLowerCase().includes('minispeaking') ? 'Mini Speaking' : 'Regular'
          },
          course: {
            id: schedule.class?.course?.id,
            name: schedule.class?.course?.courseName,
            level: schedule.class?.course?.level
          },
          teacher: {
            id: schedule.teacher?.id,
            name: schedule.teacher?.teacherName,
            level: schedule.teacher?.level?.levelName,
            experience: schedule.teacher?.experience
          }
        };
      });

      res.json({
        success: true,
        data: formattedSchedules
      });
    } catch (error) {
      console.error('Error in getDailySchedules:', error);
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error'
        });
      }
    }
  }
}

export default ClassController;
