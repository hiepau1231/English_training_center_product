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
exports.ClassController = void 0;
const ClassServices_1 = require("../services/ClassServices");
const data_source_1 = require("../data-source");
const ClassSchedule_1 = require("../entities/ClassSchedule");
const AppError_1 = require("../utils/AppError");
const typeorm_1 = require("typeorm");
class ClassController {
    constructor() {
        this.scheduleRepository = data_source_1.AppDataSource.getRepository(ClassSchedule_1.ClassSchedule);
        this.classService = new ClassServices_1.ClassService();
    }
    getAllClasses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classes = yield this.classService.getAllClass();
                if (!classes) {
                    return res.status(404).json({ message: 'No classes found !' });
                }
                res.status(200).json(classes);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'An unknown error occurred' });
                }
            }
        });
    }
    getClassById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classData = yield this.classService.getClassById(Number(req.params.id));
                if (!classData) {
                    return res.status(404).json({ message: 'Class not found' });
                }
                res.json(classData);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching class', error });
            }
        });
    }
    createClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classDTO = req.body;
                const newClass = yield this.classService.createClass(classDTO);
                res.status(201).json(newClass);
            }
            catch (error) {
                res.status(400).json({ message: 'Error creating class', error });
            }
        });
    }
    updateClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classDTO = req.body;
                const classId = Number(req.params.id);
                const classExists = yield this.classService.getClassById(classId);
                if (!classExists) {
                    return res.status(404).json({ message: 'Class not found' });
                }
                yield this.classService.updateClass(classId, classDTO);
                res.status(200).json({ message: `Update Class with ID ${classId} successfully ! ` });
            }
            catch (error) {
                res.status(400).json({ message: 'Error updating class', error });
            }
        });
    }
    deleteClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classId = Number(req.params.id);
                const classExists = yield this.classService.getClassById(classId);
                if (!classExists) {
                    return res.status(404).json({ message: 'Class not found' });
                }
                yield this.classService.deleteClass(classId);
                res.sendStatus(204);
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting class', error });
            }
        });
    }
    getDailySchedules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = req.query.date ? new Date(req.query.date) : new Date();
                const schedules = yield this.scheduleRepository.find({
                    where: {
                        scheduleDate: date,
                        deletedAt: (0, typeorm_1.IsNull)()
                    },
                    relations: {
                        teacher: {
                            level: true
                        },
                        room: true,
                        class: {
                            course: true
                        },
                        shift: true
                    }
                });
                const formattedSchedules = schedules.map(schedule => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
                    const scheduleDate = new Date(schedule.scheduleDate);
                    const dayOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][scheduleDate.getDay()];
                    const className = ((_a = schedule.class) === null || _a === void 0 ? void 0 : _a.className) || '';
                    return {
                        id: schedule.id,
                        date: schedule.scheduleDate,
                        dayOfWeek,
                        shift: {
                            id: (_b = schedule.shift) === null || _b === void 0 ? void 0 : _b.id,
                            teachingShift: (_c = schedule.shift) === null || _c === void 0 ? void 0 : _c.teachingShift,
                            startTime: (_d = schedule.shift) === null || _d === void 0 ? void 0 : _d.startTime,
                            endTime: (_e = schedule.shift) === null || _e === void 0 ? void 0 : _e.endTime
                        },
                        room: {
                            id: (_f = schedule.room) === null || _f === void 0 ? void 0 : _f.id,
                            name: (_g = schedule.room) === null || _g === void 0 ? void 0 : _g.roomNumber,
                            type: (_h = schedule.room) === null || _h === void 0 ? void 0 : _h.type,
                            capacity: (_j = schedule.room) === null || _j === void 0 ? void 0 : _j.capacity,
                            currentStudents: ((_k = schedule.class) === null || _k === void 0 ? void 0 : _k.numberOfStudents) || 0
                        },
                        class: {
                            id: (_l = schedule.class) === null || _l === void 0 ? void 0 : _l.id,
                            name: className,
                            numberOfStudents: (_m = schedule.class) === null || _m === void 0 ? void 0 : _m.numberOfStudents,
                            type: className.toLowerCase().includes('tutorial') ? 'Tutorial' :
                                className.toLowerCase().includes('minispeaking') ? 'Mini Speaking' : 'Regular'
                        },
                        course: {
                            id: (_p = (_o = schedule.class) === null || _o === void 0 ? void 0 : _o.course) === null || _p === void 0 ? void 0 : _p.id,
                            name: (_r = (_q = schedule.class) === null || _q === void 0 ? void 0 : _q.course) === null || _r === void 0 ? void 0 : _r.courseName,
                            level: (_t = (_s = schedule.class) === null || _s === void 0 ? void 0 : _s.course) === null || _t === void 0 ? void 0 : _t.level
                        },
                        teacher: {
                            id: (_u = schedule.teacher) === null || _u === void 0 ? void 0 : _u.id,
                            name: (_v = schedule.teacher) === null || _v === void 0 ? void 0 : _v.teacherName,
                            level: (_x = (_w = schedule.teacher) === null || _w === void 0 ? void 0 : _w.level) === null || _x === void 0 ? void 0 : _x.levelName,
                            experience: (_y = schedule.teacher) === null || _y === void 0 ? void 0 : _y.experience
                        }
                    };
                });
                res.json({
                    success: true,
                    data: formattedSchedules
                });
            }
            catch (error) {
                console.error('Error in getDailySchedules:', error);
                if (error instanceof AppError_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        });
    }
}
exports.ClassController = ClassController;
exports.default = ClassController;
