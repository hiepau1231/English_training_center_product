jest.mock('../app/services/teacherService', () => ({
    getTeacherSchedules: jest.fn(),
    getTeacherScheduleById: jest.fn(),
    updateTeacherScheduleById: jest.fn(),
    softDeleteTeacherScheduleById: jest.fn(),
    getDeletedTeacherScheduleAll: jest.fn(),
    restoreTeacherScheduleById: jest.fn(),
    forceDeleteTeacherScheduleById: jest.fn(),
}));
const request = require('supertest');
const express = require('express');
const app = express();
const teacherRouter = require('../routes/teacherRoutes');

app.use(express.json());
app.use('/teacher', teacherRouter);
const teacherService = require('../app/services/teacherService');



describe('TeacherController Tests', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if date is not provided', async () => {
        const response = await request(app).post('/teacher').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('date is required');
    });

    it('should return 404 if no teacher schedule found', async () => {
        teacherService.getTeacherSchedules.mockResolvedValue(null);

        const response = await request(app).post('/teacher').send({ date: '2024-10-10' });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No teacher Schedule found');
    });

    it('should return teacher schedules', async () => {
        const mockSchedules = [
            {
                "id": 295,
                "class_name": "STARTERS 4A - TUTORIAL-1",
                "start_date": "2024-05-27",
                "end_date": "2024-08-20",
                "schedules": [
                    {
                        "attendance": "Present",
                        "schedule_date": "2024-09-15"
                    }
                ],
                "classroom": {
                    "classroom_name": "307",
                    "type": "Phòng Online",
                    "capacity": 15
                },
                "course": {
                    "course_name": "MICKEY 4 - Tutorial",
                    "status": "active",
                    "level": "Beginner"
                },
                "MainTeacher": {
                    "teacher_name": "ĐẶNG HUỲNH THI THƠ"
                },
                "SubTeacher": {
                    "teacher_name": "Nguyễn Ngọc Hải"
                }
            },
            {
                "id": 294,
                "class_name": "STARTERS 4A - TUTORIAL - 24061",
                "start_date": "2024-03-07",
                "end_date": "2024-09-27",
                "schedules": [
                    {
                        "attendance": "Present",
                        "schedule_date": "2024-09-15"
                    }
                ],
                "classroom": {
                    "classroom_name": "307",
                    "type": "Phòng Online",
                    "capacity": 15
                },
                "course": {
                    "course_name": "STARTERS 4 - TUTORIAL",
                    "status": "active",
                    "level": "Beginner"
                },
                "MainTeacher": {
                    "teacher_name": "BÙI NGỌC LAN ANH"
                },
                "SubTeacher": {
                    "teacher_name": "PHAN THỊ HỒNG TRÂN"
                }
            },
            {
                "id": 296,
                "class_name": "STARTERS 4A - TUTORIAL",
                "start_date": "2024-11-17",
                "end_date": "2024-12-31",
                "schedules": [
                    {
                        "attendance": "Present",
                        "schedule_date": "2024-09-15"
                    }
                ],
                "classroom": {
                    "classroom_name": "307",
                    "type": "Phòng Online",
                    "capacity": 15
                },
                "course": {
                    "course_name": "STARTERS 4 - TUTORIAL",
                    "status": "active",
                    "level": "Beginner"
                },
                "MainTeacher": {
                    "teacher_name": "PHẠM NHẬT UYÊN PHƯƠNG"
                },
                "SubTeacher": {
                    "teacher_name": "TRẦN THỊ THU HƯƠNG"
                }
            }
        ];
        teacherService.getTeacherSchedules.mockResolvedValue(mockSchedules);

        const response = await request(app).post('/teacher').send({ date: '2024-09-15' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSchedules);
    });

    it('should return a specific teacher schedule by ID', async () => {
        const mockSchedule = {
            "id": 295,
            "class_name": "STARTERS 4A - TUTORIAL-1",
            "start_date": "2024-05-27",
            "end_date": "2024-08-20",
            "schedules": [
                {
                    "id": 16,
                    "attendance": "Present",
                    "schedule_date": "2024-09-15"
                }
            ],
            "classroom": {
                "id": 1,
                "classroom_name": "307",
                "type": "Phòng Online",
                "capacity": 15
            },
            "course": {
                "id": 504,
                "course_name": "MICKEY 4 - Tutorial",
                "status": "active",
                "level": "Beginner"
            },
            "MainTeacher": {
                "id": 264,
                "teacher_name": "ĐẶNG HUỲNH THI THƠ"
            },
            "SubTeacher": {
                "id": 253,
                "teacher_name": "Nguyễn Ngọc Hải"
            }
        };
        teacherService.getTeacherScheduleById.mockResolvedValue(mockSchedule);

        const response = await request(app).get('/teacher/edit/295');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSchedule);
    });

    it('should return 404 if no schedule found for specific ID', async () => {
        teacherService.getTeacherScheduleById.mockResolvedValue(null);

        const response = await request(app).get('/teacher/edit/1');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No teacher Schedule found');
    });

    it('should update a teacher schedule by ID', async () => {
        const mockUpdatedSchedule = {
            "id": 295,
            "class_name": "STARTERS 4A - TUTORIAL-1",
            "start_date": "2024-05-27",
            "end_date": "2024-08-20",
            "schedules": [
                {
                    "id": 16,
                    "attendance": "Present",
                    "schedule_date": "2024-09-15"
                }
            ],
            "classroom": {
                "id": 1,
                "classroom_name": "307",
                "type": "Phòng Online",
                "capacity": 15
            },
            "course": {
                "id": 504,
                "course_name": "MICKEY 4 - Tutorial",
                "status": "active",
                "level": "Beginner"
            },
            "MainTeacher": {
                "id": 264,
                "teacher_name": "ĐẶNG HUỲNH THI THƠ"
            },
            "SubTeacher": {
                "id": 253,
                "teacher_name": "Nguyễn Ngọc Hải"
            }
        };
        teacherService.updateTeacherScheduleById.mockResolvedValue(mockUpdatedSchedule);

        const response = await request(app).put('/teacher/update/295').send(mockUpdatedSchedule);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedSchedule);
    });

    it('should return 404 if trying to update a non-existing schedule', async () => {
        teacherService.updateTeacherScheduleById.mockResolvedValue(null);

        const response = await request(app).put('/teacher/update/292').send({ class_name: 'Math' });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No teacher Schedule found');
    });

    it('should soft delete a teacher schedule by ID', async () => {
        teacherService.softDeleteTeacherScheduleById.mockResolvedValue(true);

        const response = await request(app).patch('/teacher/delete/295');
        expect(response.status).toBe(200);
    });

    it('should return 404 if trying to soft delete a non-existing schedule', async () => {
        teacherService.softDeleteTeacherScheduleById.mockResolvedValue(null);

        const response = await request(app).patch('/teacher/delete/1');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No teacher Schedule found');
    });

    it('should get all deleted teacher schedules', async () => {
        const mockDeletedSchedules = [
            {
                "id": 295,
                "class_name": "STARTERS 4A - TUTORIAL-1",
                "start_date": "2024-05-27",
                "end_date": "2024-08-20",
                "schedules": [
                    {
                        "id": 16,
                        "attendance": "Present",
                        "schedule_date": "2024-09-15"
                    }
                ],
                "classroom": {
                    "id": 1,
                    "classroom_name": "307",
                    "type": "Phòng Online",
                    "capacity": 15
                },
                "course": {
                    "id": 504,
                    "course_name": "MICKEY 4 - Tutorial",
                    "status": "active",
                    "level": "Beginner"
                },
                "MainTeacher": {
                    "id": 264,
                    "teacher_name": "ĐẶNG HUỲNH THI THƠ"
                },
                "SubTeacher": {
                    "id": 253,
                    "teacher_name": "Nguyễn Ngọc Hải"
                }
            }
        ];
        teacherService.getDeletedTeacherScheduleAll.mockResolvedValue(mockDeletedSchedules);

        const response = await request(app).get('/teacher/deleted-all/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockDeletedSchedules);
    });

    it('should restore a teacher schedule by ID', async () => {
        teacherService.restoreTeacherScheduleById.mockResolvedValue(true);

        const response = await request(app).put('/teacher/restore/295');
        expect(response.status).toBe(200);
    });

    it('should return 404 if trying to restore a non-existing schedule', async () => {
        teacherService.restoreTeacherScheduleById.mockResolvedValue(null);

        const response = await request(app).put('/teacher/restore/1');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No teacher Schedule found');
    });

    it('should force delete a teacher schedule by ID', async () => {
        teacherService.forceDeleteTeacherScheduleById.mockResolvedValue(true);

        const response = await request(app).delete('/teacher/force-delete/295');
        expect(response.status).toBe(200);
    });

    it('should return 404 if trying to force delete a non-existing schedule', async () => {
        teacherService.forceDeleteTeacherScheduleById.mockResolvedValue(null);

        const response = await request(app).delete('/teacher/force-delete/1');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No teacher Schedule found');
    });
});