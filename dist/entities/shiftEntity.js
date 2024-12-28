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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shift = void 0;
const typeorm_1 = require("typeorm");
const Class_1 = require("./Class");
const scheduleEntity_1 = require("./scheduleEntity");
let Shift = class Shift {
};
exports.Shift = Shift;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Shift.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'teaching_shift', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Shift.prototype, "teachingShift", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false }),
    __metadata("design:type", Date)
], Shift.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Shift.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'deleted_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Shift.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_deleted', type: 'boolean', default: false, nullable: false }),
    __metadata("design:type", Boolean)
], Shift.prototype, "isDeleted", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => scheduleEntity_1.Schedule, (schedule) => schedule.shifts),
    (0, typeorm_1.JoinTable)({
        name: 'schedule_shift',
        joinColumn: { name: 'shift_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'schedule_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Shift.prototype, "relatedSchedules", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Class_1.Class, (classEntity) => classEntity.shifts, { nullable: false }),
    __metadata("design:type", Class_1.Class)
], Shift.prototype, "associatedClass", void 0);
exports.Shift = Shift = __decorate([
    (0, typeorm_1.Entity)('shifts') // Tên bảng giữ nguyên
], Shift);
