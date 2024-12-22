import { DataSource, DeepPartial, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }
  /**
   * Tìm tất cả bản ghi
   */
  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }
  /**
   * Tìm bản ghi theo ID
   */
  async findById(id: number): Promise<T | null> {
    const result = await this.repository.findOne({ where: { id } as any });
    return result
    
  }
  /**
   * Tạo mới một bản ghi
   */
  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }
  /**
   * Cập nhật bản ghi theo ID
   */
  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    try {
      await this.repository.update(id, data);
      return await this.findById(id);
    } catch (error) {
      console.error('Error updating entity:', error);
      return null;
    }
  }
  /**
   * Xóa bản ghi theo ID (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
