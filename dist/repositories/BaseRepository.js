"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findAll() {
        return await this.repository.find();
    }
    async findById(id) {
        return await this.repository.findOne({ where: { id } });
    }
    async create(data) {
        const record = this.repository.create(data);
        return await this.repository.save(record);
    }
    async update(id, data) {
        await this.repository.update(id, data);
    }
    async delete(id) {
        await this.repository.softDelete(id);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map