"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(entity, dataSource) {
        this.repository = dataSource.getRepository(entity);
    }
    /**
     * Tìm tất cả bản ghi
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find();
        });
    }
    /**
     * Tìm bản ghi theo ID
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.findOne({ where: { id } });
            return result;
        });
    }
    /**
     * Tạo mới một bản ghi
     */
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.repository.create(data);
            return yield this.repository.save(entity);
        });
    }
    /**
     * Cập nhật bản ghi theo ID
     */
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.repository.update(id, data);
                return yield this.findById(id);
            }
            catch (error) {
                console.error('Error updating entity:', error);
                return null;
            }
        });
    }
    /**
     * Xóa bản ghi theo ID (soft delete)
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.softDelete(id);
        });
    }
}
exports.BaseRepository = BaseRepository;
