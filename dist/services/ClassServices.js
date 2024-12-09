"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassService = void 0;
const ClassRepository_1 = require("../repositories/ClassRepository");
class ClassService {
    constructor() {
        this.classRepository = new ClassRepository_1.ClassRepository();
    }
    async getAllClass() {
        return this.classRepository.findAll();
    }
    async getClassById(id) {
        return this.classRepository.findById(id);
    }
    // async createClass(classDTO: ClassDTO): Promise<Class> {
    //   // return this.classRepository.create(classDTO);
    //   const classEntity = this.mapDtoToEntity(classDTO);
    //   return this.classRepository.create(classEntity);
    // }
    async updateClass(id, classDTO) {
        await this.classRepository.update(id, classDTO);
    }
    async deleteClass(id) {
        await this.classRepository.delete(id);
    }
}
exports.ClassService = ClassService;
//# sourceMappingURL=ClassServices.js.map