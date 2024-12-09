
import { DataSource } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Class } from '../entities/classEntity';
import { BaseRepository } from './BaseRepository';

export class ClassRepository extends BaseRepository<Class> {
  constructor(dataSource: DataSource = AppDataSource) {
    super(Class, dataSource);
  }
  async findById(id:number):Promise<Class | null> {
    const result = await this.repository.findOne({
      where: { id },
      relations: ['classroom', 'course'], // Bao gồm quan hệ classroom và course
    });

    // Kiểm tra và trả về kết quả
    if (!result) {
      return null; // Nếu không tìm thấy lớp học, trả về null
    }

    console.log(result); // Log kết quả tìm được
    return result; 
  }
  /**
   * Tìm tất cả các lớp học còn hoạt động (không bị xóa)
   */
  async findActiveClasses(): Promise<Class[]> {
    return await this.repository.find({ where: { isDeleted: false } });
  }
}
