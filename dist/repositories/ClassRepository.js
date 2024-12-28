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
exports.ClassRepository = void 0;
const database_1 = require("../config/database");
const Class_1 = require("../entities/Class");
const BaseRepository_1 = require("./BaseRepository");
class ClassRepository extends BaseRepository_1.BaseRepository {
    constructor(dataSource = database_1.AppDataSource) {
        super(Class_1.Class, dataSource);
    }
    /**
   * Tìm tất cả các lớp học còn hoạt động (không bị xóa)
   */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.find({
                where: { isDeleted: false },
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
        });
    }
    /**
     * Tìm lớp học còn hoạt động (không bị xóa) theo id
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.findOne({
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
        });
    }
    findActiveClasses() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.find({ where: { isDeleted: false } });
        });
    }
}
exports.ClassRepository = ClassRepository;
