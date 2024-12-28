"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const typeorm_1 = require("typeorm");
const Class_1 = require("./Class");
const classroomEntity_1 = require("./classroomEntity");
const shiftEntity_1 = require("./shiftEntity");
let Schedule = class Schedule {
};
exports.Schedule = Schedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Schedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Schedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shift_id', nullable: true }),
    __metadata("design:type", Number)
], Schedule.prototype, "shiftId", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Schedule.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Schedule.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'schedule_date', type: 'date', nullable: true }),
    __metadata("design:type", String)
], Schedule.prototype, "scheduleDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => classroomEntity_1.Classroom, (classroom) => classroom.schedules, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", Object)
], Schedule.prototype, "classroom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', name: 'is_deleted', default: false }),
    __metadata("design:type", Boolean)
], Schedule.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shiftEntity_1.Shift, (shift) => shift.schedules, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", Object)
], Schedule.prototype, "shift", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Class_1.Class, (classEntity) => classEntity.schedules),
    (0, typeorm_1.JoinTable)({
        name: 'class_schedule',
        joinColumn: { name: 'schedule_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'class_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Schedule.prototype, "classes", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => shiftEntity_1.Shift, (shift) => shift.schedules),
    (0, typeorm_1.JoinTable)({
        name: 'schedule_shifts',
        joinColumn: { name: 'schedule_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'shift_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Schedule.prototype, "shifts", void 0);
exports.Schedule = Schedule = __decorate([
    (0, typeorm_1.Entity)('schedules')
], Schedule);
