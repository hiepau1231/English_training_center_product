jest.mock('../app/services/scheduleService', () => ({
    getAllSchedules: jest.fn(),
    findScheduleById: jest.fn(),
    updateScheduleById: jest.fn(),
    softDeleteScheduleById: jest.fn(),
    restoreScheduleById: jest.fn(),
    getAllScheduleDeleted: jest.fn(),
    forceDeletedSchedule: jest.fn(),
}));
const request = require('supertest');
const express = require('express');
const scheduleRouter = require('../routes/scheduleRoutes');
const scheduleService = require('../app/services/scheduleService');

const app = express();
app.use(express.json());
app.use('/schedule', scheduleRouter);

describe('ScheduleController Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if date is not provided', async () => {
        const response = await request(app).post('/schedule').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('date is required');
    });

    it('should return 404 if no schedule found', async () => {
        scheduleService.getAllSchedules.mockResolvedValue(null);

        const response = await request(app).post('/schedule').send({ date: '2024-09-22' });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No schedule found');
    });

    it('should return schedules for a specific date', async () => {
        const mockSchedules = [
            {
                "schedule_id": 16,
                "date": "2024-09-15",
                "attendance": "Present",
                "class_count": 1,
                "shift": {
                    "id": 3,
                    "teaching_shift": "ca số 5-(18-20)"
                },
                "class": {
                    "id": 295,
                    "class_name": "STARTERS 4A - TUTORIAL-1",
                    "course_id": 504,
                    "cm_main": 264,
                    "cm_sub": 253,
                    "course": {
                        "id": 504,
                        "course_name": "MICKEY 4 - Tutorial"
                    },
                    "MainTeacher": {
                        "id": 264,
                        "teacher_name": "ĐẶNG HUỲNH THI THƠ"
                    },
                    "SubTeacher": {
                        "id": 253,
                        "teacher_name": "Nguyễn Ngọc Hải"
                    }
                },
                "classroom": {
                    "id": 1,
                    "classroom_name": "307",
                    "capacity": 15
                }
            },
            {
                "schedule_id": 17,
                "date": "2024-09-15",
                "attendance": "Present",
                "class_count": 1,
                "shift": {
                    "id": 4,
                    "teaching_shift": "15-17"
                },
                "class": {
                    "id": 294,
                    "class_name": "STARTERS 4A - TUTORIAL - 24061",
                    "course_id": 503,
                    "cm_main": 257,
                    "cm_sub": 263,
                    "course": {
                        "id": 503,
                        "course_name": "STARTERS 4 - TUTORIAL"
                    },
                    "MainTeacher": {
                        "id": 257,
                        "teacher_name": "BÙI NGỌC LAN ANH"
                    },
                    "SubTeacher": {
                        "id": 263,
                        "teacher_name": "PHAN THỊ HỒNG TRÂN"
                    }
                },
                "classroom": {
                    "id": 1,
                    "classroom_name": "307",
                    "capacity": 15
                }
            },
            {
                "schedule_id": 20,
                "date": "2024-09-15",
                "attendance": "Present",
                "class_count": 1,
                "shift": {
                    "id": 1,
                    "teaching_shift": "8-10"
                },
                "class": {
                    "id": 296,
                    "class_name": "STARTERS 4A - TUTORIAL",
                    "course_id": 503,
                    "cm_main": 249,
                    "cm_sub": 256,
                    "course": {
                        "id": 503,
                        "course_name": "STARTERS 4 - TUTORIAL"
                    },
                    "MainTeacher": {
                        "id": 249,
                        "teacher_name": "PHẠM NHẬT UYÊN PHƯƠNG"
                    },
                    "SubTeacher": {
                        "id": 256,
                        "teacher_name": "TRẦN THỊ THU HƯƠNG"
                    }
                },
                "classroom": {
                    "id": 1,
                    "classroom_name": "307",
                    "capacity": 15
                }
            }
        ]

        scheduleService.getAllSchedules.mockResolvedValue(mockSchedules);

        const response = await request(app).post('/schedule').send({ date: '2024-10-15' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSchedules);
    });

    it('should return a specific schedule by ID', async () => {
        const mockSchedule = {
            "schedule_id": 16,
            "date": "2024-09-15",
            "attendance": "Present",
            "shift": {
                "id": 3,
                "teaching_shift": "ca số 5-(18-20)"
            },
            "class": {
                "id": 295,
                "class_name": "STARTERS 4A - TUTORIAL-1",
                "course_id": 504,
                "cm_main": 264,
                "cm_sub": 253,
                "course": {
                    "id": 504,
                    "course_name": "MICKEY 4 - Tutorial"
                },
                "MainTeacher": {
                    "id": 264,
                    "teacher_name": "ĐẶNG HUỲNH THI THƠ"
                },
                "SubTeacher": {
                    "id": 253,
                    "teacher_name": "Nguyễn Ngọc Hải"
                }
            },
            "classroom": {
                "id": 1,
                "classroom_name": "307",
                "capacity": 15
            }
        }

        scheduleService.findScheduleById.mockResolvedValue(mockSchedule);

        const response = await request(app).get('/schedule/edit/16');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSchedule);
    });

    it('should return 404 if no schedule found for specific ID', async () => {
        scheduleService.findScheduleById.mockResolvedValue(null);

        const response = await request(app).get('/schedule/edit/999');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No schedule found');
    });

    it('should update a schedule by ID', async () => {
        const mockUpdatedSchedule = {
            "schedule_id": 16,
            "date": "2024-09-15",
            "attendance": "Present",
            "shift": {
                "id": 3,
                "teaching_shift": "ca số 5-(18-20)"
            },
            "class": {
                "id": 295,
                "class_name": "STARTERS 4A - TUTORIAL-1",
                "course_id": 504,
                "cm_main": 264,
                "cm_sub": 253,
                "course": {
                    "id": 504,
                    "course_name": "MICKEY 4 - Tutorial"
                },
                "MainTeacher": {
                    "id": 264,
                    "teacher_name": "ĐẶNG HUỲNH THI THƠ"
                },
                "SubTeacher": {
                    "id": 253,
                    "teacher_name": "Nguyễn Ngọc Hải"
                }
            },
            "classroom": {
                "id": 1,
                "classroom_name": "307",
                "capacity": 15
            }
        }

        scheduleService.updateScheduleById.mockResolvedValue(mockUpdatedSchedule);

        const response = await request(app).put('/schedule/update/16').send(mockUpdatedSchedule);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedSchedule);
    });

    it('should return 404 if trying to update a non-existing schedule', async () => {
        scheduleService.updateScheduleById.mockResolvedValue(null);

        const response = await request(app).put('/schedule/update/999').send({ class_name: 'Math 102' });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No Schdeule found');
    });

    it('should soft delete a schedule by ID', async () => {
        scheduleService.softDeleteScheduleById.mockResolvedValue(true);

        const response = await request(app).patch('/schedule/delete/16');
        expect(response.status).toBe(200);
    });

    it('should return 404 if trying to soft delete a non-existing schedule', async () => {
        scheduleService.softDeleteScheduleById.mockResolvedValue(null);

        const response = await request(app).patch('/schedule/delete/999');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No schedule found');
    });

    it('should restore a schedule by ID', async () => {
        scheduleService.restoreScheduleById.mockResolvedValue(true);

        const response = await request(app).put('/schedule/restore/16');
        expect(response.status).toBe(200);
    });

    it('should return 404 if trying to restore a non-existing schedule', async () => {
        scheduleService.restoreScheduleById.mockResolvedValue(null);

        const response = await request(app).put('/schedule/restore/999');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No schedule found');
    });

    it('should get all deleted schedules', async () => {
        const mockDeletedSchedules =[
            {
                "id": 16,
                "schedule_date": "2024-09-15",
                "attendance": "Present",
                "shift": {
                    "id": 3,
                    "teaching_shift": "ca số 5-(18-20)"
                },
                "class": {
                    "id": 295,
                    "class_name": "STARTERS 4A - TUTORIAL-1",
                    "course_id": 504,
                    "cm_main": 264,
                    "cm_sub": 253,
                    "course": {
                        "id": 504,
                        "course_name": "MICKEY 4 - Tutorial"
                    },
                    "MainTeacher": {
                        "id": 264,
                        "teacher_name": "ĐẶNG HUỲNH THI THƠ"
                    },
                    "SubTeacher": {
                        "id": 253,
                        "teacher_name": "Nguyễn Ngọc Hải"
                    }
                },
                "classroom": {
                    "id": 1,
                    "classroom_name": "307",
                    "capacity": 15
                }
            }
        ]

        scheduleService.getAllScheduleDeleted.mockResolvedValue(mockDeletedSchedules);

        const response = await request(app).get('/schedule/deleted-all');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockDeletedSchedules);
    });

    it('should force delete a schedule by ID', async () => {
        scheduleService.forceDeletedSchedule.mockResolvedValue(true);

        const response = await request(app).delete('/schedule/force-delete/16');
        expect(response.status).toBe(200);
    });

    it('should return 404 if trying to force delete a non-existing schedule', async () => {
        scheduleService.forceDeletedSchedule.mockResolvedValue(null);

        const response = await request(app).delete('/schedule/force-delete/999');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No schedule found');
    });
});