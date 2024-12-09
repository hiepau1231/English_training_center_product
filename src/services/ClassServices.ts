import { ClassDTO } from '../dtos/ClassDTO';
import { Class } from '../entities/classEntity';
import { ClassRepository } from '../repositories/ClassRepository';
import { BaseService } from './BaseService';

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
    const classEntity = this.toEntity(classDTO);
    const newClass = await this.classRepository.create(classEntity);
    return this.toDTO(newClass);
  }


  /**
   * Cập nhật lớp học theo ID
   */
  async updateClass(id: number, classDTO: Partial<ClassDTO>): Promise<ClassDTO | null> {
    const updatedClass = await this.classRepository.update(id, classDTO);
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
    // console.log(entity.classroom);
    // console.log(entity.course);
    
    
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
      entity.assignedTeachers?.map(teacher => teacher.id) || [],
      entity.linkedSchedules?.map(schedule => schedule.id) || [],
      entity.shifts?.map(shift => shift.id) || [],
      entity.classroom,
      entity.course,
      entity.assignedTeachers,
      entity.linkedSchedules,
      entity.shifts
    );
  }
    /**
   * Chuyển đổi từ DTO sang Entity
   */
  protected toEntity(dto: ClassDTO | Partial<ClassDTO>): Class {
    const classEntity = new Class();
    classEntity.id = dto.id !== undefined ? dto.id : 0;
    classEntity.className = dto.className ?? '';  // Nếu className là undefined thì dùng giá trị mặc định ''
    classEntity.startDate = dto.startDate ?? new Date();  // Gán giá trị mặc định nếu là undefined
    classEntity.endDate = dto.endDate ?? new Date();  // Gán giá trị mặc định nếu là undefined
    classEntity.isDeleted = dto.isDeleted ?? false;  // Gán giá trị mặc định nếu là undefined
    classEntity.createdAt = dto.createdAt ?? new Date();  // Gán giá trị mặc định nếu là undefined
    classEntity.updatedAt = dto.updatedAt ?? new Date();  // Gán giá trị mặc định nếu là undefined
    classEntity.deletedAt = dto.deletedAt ?? null;  // Gán giá trị mặc định nếu là undefined
  

    // Gán các khóa ngoại từ DTO
    classEntity.classroom = dto.classroomId ? { id: dto.classroomId } as any : null;
    classEntity.course = dto.courseId ? { id: dto.courseId } as any : null;

    // Gán quan hệ từ các ID trong DTO
    classEntity.assignedTeachers = dto.assignedTeacherIds?.map(id => ({ id })) as any[];
    classEntity.linkedSchedules = dto.linkedScheduleIds?.map(id => ({ id })) as any[];
    classEntity.shifts = dto.shiftIds?.map(id => ({ id })) as any[];

    return classEntity;
  }
}