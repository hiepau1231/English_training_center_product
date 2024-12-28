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
exports.ClassService = void 0;
const ClassDTO_1 = require("../dtos/ClassDTO");
const Class_1 = require("../entities/Class");
const ClassRepository_1 = require("../repositories/ClassRepository");
const BaseService_1 = require("./BaseService");
class ClassService extends BaseService_1.BaseService {
    constructor() {
        const classRepository = new ClassRepository_1.ClassRepository();
        super(classRepository);
        this.classRepository = classRepository;
    }
    /**
     * Lấy tất cả lớp học
     */
    getAllClass() {
        return __awaiter(this, void 0, void 0, function* () {
            const classes = yield this.classRepository.findAll();
            return classes.map(this.toDTO);
        });
    }
    /**
     * Lấy lớp học theo ID
     */
    getClassById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const classEntity = yield this.classRepository.findById(id);
            return classEntity ? this.toDTO(classEntity) : null;
        });
    }
    /**
     * Tạo mới lớp học
     */
    createClass(classDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const classEntity = this.toEntity(classDTO);
            const newClass = yield this.classRepository.create(classEntity);
            return this.toDTO(newClass);
        });
    }
    /**
     * Cập nhật lớp học theo ID
     */
    updateClass(id, classDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            // Convert DTO to entity format
            const updateData = Object.assign(Object.assign({}, classDTO), { classroom: classDTO.classroomId ? { id: classDTO.classroomId } : undefined, course: classDTO.courseId ? { id: classDTO.courseId } : undefined });
            // Remove foreign key fields that TypeORM doesn't expect
            delete updateData.classroomId;
            delete updateData.courseId;
            const updatedClass = yield this.classRepository.update(id, updateData);
            return updatedClass ? this.toDTO(updatedClass) : null;
        });
    }
    /**
     * Xóa lớp học theo ID (soft delete)
     */
    deleteClass(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.classRepository.delete(id);
        });
    }
    /**
     * Chuyển đổi từ Entity sang DTO
     */
    toDTO(entity) {
        return new ClassDTO_1.ClassDTO(entity.id, entity.className, entity.startDate, entity.endDate, entity.isDeleted, entity.createdAt, entity.updatedAt, entity.deletedAt, entity.classroom ? entity.classroom.id : null, entity.course ? entity.course.id : null, entity.classroom, entity.course);
    }
    /**
   * Chuyển đổi từ DTO sang Entity
   */
    toEntity(dto) {
        var _a, _b, _c, _d, _e, _f, _g;
        const classEntity = new Class_1.Class();
        classEntity.id = dto.id !== undefined ? dto.id : 0;
        classEntity.className = (_a = dto.className) !== null && _a !== void 0 ? _a : '';
        classEntity.startDate = (_b = dto.startDate) !== null && _b !== void 0 ? _b : new Date();
        classEntity.endDate = (_c = dto.endDate) !== null && _c !== void 0 ? _c : new Date();
        classEntity.isDeleted = (_d = dto.isDeleted) !== null && _d !== void 0 ? _d : false;
        classEntity.createdAt = (_e = dto.createdAt) !== null && _e !== void 0 ? _e : new Date();
        classEntity.updatedAt = (_f = dto.updatedAt) !== null && _f !== void 0 ? _f : new Date();
        classEntity.deletedAt = (_g = dto.deletedAt) !== null && _g !== void 0 ? _g : null;
        // Gán các khóa ngoại từ DTO
        classEntity.classroom = dto.classroomId ? { id: dto.classroomId } : null;
        classEntity.course = dto.courseId ? { id: dto.courseId } : null;
        return classEntity;
    }
}
exports.ClassService = ClassService;
