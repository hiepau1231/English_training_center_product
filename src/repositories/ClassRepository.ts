import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Class } from '../entities/Class';
import { BaseRepository } from './BaseRepository';

export class ClassRepository extends BaseRepository<Class> {
  constructor(dataSource: DataSource = AppDataSource) {
    super(Class, dataSource);
  }
    /**
   * Tìm tất cả các lớp học còn hoạt động (không bị xóa)
   */
  async findAll():Promise<Class[]> {
    const result = await this.repository.find({
      where: { isDeleted: false},
      relations: ['classroom', 'course'],
      select: {
        id: true,
        className: true,
        startDate: true,
        endDate: true,
        classroom: {
          id: true,
        },
        course: {
          id: true,
        },
      },
    });
    return result;
  }
  /**
   * Tìm lớp học còn hoạt động (không bị xóa) theo id
   */
  async findById(id:number):Promise<Class | null> {
    const result = await this.repository.findOne({
      where: { id, isDeleted: false },
      relations: ['classroom', 'course'],
      select: {
        id: true,
        className: true,
        startDate: true,
        endDate: true,
        classroom: {
          id: true,
        },
        course: {
          id: true,
        },
      },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async findActiveClasses(): Promise<Class[]> {
    return await this.repository.find({ where: { isDeleted: false } });
  }
}
