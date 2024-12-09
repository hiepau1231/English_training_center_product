// src/services/BaseService.ts

import { ObjectLiteral } from 'typeorm';
import { BaseRepository } from '../repositories/BaseRepository';

export abstract class BaseService<T extends ObjectLiteral, DTO> {
  protected repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  /**
   * Lấy tất cả bản ghi và chuyển đổi sang DTO
   */
  async getAll(): Promise<DTO[]> {
    const entities = await this.repository.findAll();
    return entities.map((entity) => this.toDTO(entity));
  }

  /**
   * Lấy bản ghi theo ID và chuyển đổi sang DTO
   */
  async getById(id: number): Promise<DTO | null> {
    const entity = await this.repository.findById(id);
    return entity ? this.toDTO(entity) : null;
  }

  /**
   * Tạo mới một bản ghi từ DTO
   */
  async create(dto: DTO): Promise<DTO> {
    const entity = this.toEntity(dto);
    const createdEntity = await this.repository.create(entity);
    return this.toDTO(createdEntity);
  }

  /**
   * Cập nhật bản ghi theo ID từ DTO
   */
  async update(id: number, dto: Partial<DTO>): Promise<DTO | null> {
    const entity = this.toEntity(dto);
    const updatedEntity = await this.repository.update(id, entity);
    return updatedEntity ? this.toDTO(updatedEntity) : null;
  }

  /**
   * Xóa bản ghi theo ID (soft delete)
   */
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Phương thức trừu tượng để chuyển đổi từ entity sang DTO
   */
  protected abstract toDTO(entity: T): DTO;

  /**
   * Phương thức trừu tượng để chuyển đổi từ DTO sang entity
   */
  protected abstract toEntity(dto: DTO | Partial<DTO>): T;
}
