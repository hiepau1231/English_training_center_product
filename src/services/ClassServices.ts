import { ClassDTO } from '../dtos/ClassDTO';
import { Class } from '../entities/Class';
import { ClassRepository } from '../repositories/ClassRepository';
import { BaseService } from './BaseService';
import { AppDataSource } from '../data-source';

export class ClassService extends BaseService<Class, ClassDTO> {

  private classRepository: ClassRepository;

  constructor() {
    const classRepository = new ClassRepository();
    super(classRepository);
    this.classRepository = classRepository
  }
  /**
   * Lấy tất cả lớp học
   */
  async getAllClass(): Promise<ClassDTO[]> {
    const classes = await this.classRepository.findAll();
    return classes.map(this.toDTO)
  }
  /**
   * Lấy lớp học theo ID
   */
  async getClassById(id: number): Promise<ClassDTO | null> {
    const classEntity = await this.classRepository.findById(id);
    return classEntity ? this.toDTO(classEntity) : null;
  }
  /**
   * Tạo mới lớp học
   */
  async createClass(classDTO: ClassDTO): Promise<ClassDTO> {
    // Ensure database connection is initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const classEntity = this.toEntity(classDTO);
    
    // Convert string dates to Date objects
    if (classDTO.startDate) {
      classEntity.startDate = new Date(classDTO.startDate);
    }
    if (classDTO.endDate) {
      classEntity.endDate = new Date(classDTO.endDate);
    }
    
    const newClass = await this.classRepository.create(classEntity);
    return this.toDTO(newClass);
  }
  /**
   * Cập nhật lớp học theo ID
   */
  async updateClass(id: number, classDTO: Partial<ClassDTO>): Promise<ClassDTO | null> {
    // Convert DTO to entity format
    const updateData: any = {
      ...classDTO,
      classroom: classDTO.classroomId ? { id: classDTO.classroomId } : undefined,
      course: classDTO.courseId ? { id: classDTO.courseId } : undefined
    };

    // Remove foreign key fields that TypeORM doesn't expect
    delete updateData.classroomId;
    delete updateData.courseId;

    const updatedClass = await this.classRepository.update(id, updateData);
    return updatedClass ? this.toDTO(updatedClass) : null;
  }
  /**
   * Xóa lớp học theo ID (soft delete)
   */
  async deleteClass(id: number): Promise<void> {
    await this.classRepository.delete(id);
  }
  /**
   * Chuyển đổi từ Entity sang DTO
   */
  protected toDTO(entity: Class): ClassDTO {
 
    return new ClassDTO(
      entity.id,
      entity.className,
      entity.startDate,
      entity.endDate,
      entity.isDeleted,
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt,
      entity.classroom ? entity.classroom.id : null,
      entity.course ? entity.course.id : null,
      entity.classroom,
      entity.course,
    );
  }
    /**
   * Chuyển đổi từ DTO sang Entity
   */
  protected toEntity(dto: ClassDTO | Partial<ClassDTO>): Class {
    const classEntity = new Class();
    classEntity.id = dto.id !== undefined ? dto.id : 0;
    classEntity.className = dto.className ?? '';
    classEntity.startDate = dto.startDate ?? new Date();
    classEntity.endDate = dto.endDate ?? new Date();
    classEntity.isDeleted = dto.isDeleted ?? false;
    classEntity.createdAt = dto.createdAt ?? new Date();
    classEntity.updatedAt = dto.updatedAt ?? new Date();
    classEntity.deletedAt = dto.deletedAt ?? null;
  
    // Gán các khóa ngoại từ DTO
    classEntity.classroom = dto.classroomId ? { id: dto.classroomId } as any : null;
    classEntity.course = dto.courseId ? { id: dto.courseId } as any : null;

    return classEntity;
  }
}