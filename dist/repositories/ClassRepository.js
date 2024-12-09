"use strict";
// src/repositories/UserRepository.ts
// import { AppDataSource } from '../config/database';
// import { getRepository } from 'typeorm';
// import { Class } from '../entities/classEntity';
// import { BaseRepository } from './BaseRepository';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRepository = void 0;
const database_1 = require("../config/database");
const classEntity_1 = require("../entities/classEntity");
const BaseRepository_1 = require("./BaseRepository");
class ClassRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        const classRepository = database_1.AppDataSource.getRepository(classEntity_1.Class);
        super(classRepository);
    }
}
exports.ClassRepository = ClassRepository;
//# sourceMappingURL=ClassRepository.js.map