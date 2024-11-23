jest.mock('../app/services/roomService', () => ({
  getAllRooms: jest.fn(),
  findRoomById: jest.fn(),
  updateRoomById: jest.fn(),
  softDeleteRoomById: jest.fn(),
  getAllDeleted: jest.fn(),
  restoreRoomById: jest.fn(),
  forceDeleteRoomById: jest.fn(),
}));

const request = require('supertest');
const express = require('express');
const roomRouter = require('../routes/roomRoutes');
const roomService = require('../app/services/roomService');

const app = express();
app.use(express.json());
app.use('/room', roomRouter);

describe('RoomController Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if classroomName or scheduleDate is not provided', async () => {
    const response = await request(app).post('/room').send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'classroom_name and schedule_date are required'
    );
  });

  it('should return 404 if no rooms found', async () => {
    roomService.getAllRooms.mockResolvedValue(null);

    const response = await request(app)
      .post('/room')
      .send({ classroomName: 'Room A', scheduleDate: '2024-10-10' });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No rooms found');
  });

  it('should return rooms for given classroomName and scheduleDate', async () => {
    const mockRooms = [
      { id: 1, name: 'Room A', capacity: 30 },
      { id: 2, name: 'Room B', capacity: 25 },
    ];
    roomService.getAllRooms.mockResolvedValue(mockRooms);

    const response = await request(app)
      .post('/room')
      .send({ classroomName: 'Room A', scheduleDate: '2024-10-10' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRooms);
  });

  it('should return a room by ID', async () => {
    const mockRoom = {
      id: 295,
      class_name: 'STARTERS 4A - TUTORIAL-1',
      start_date: '2024-05-27',
      end_date: '2024-08-20',
      updated_at: '2024-10-10T13:22:19.000Z',
      deleted_at: null,
      schedules: [
        {
          schedule_date: '2024-09-15',
          shift: {
            teaching_shift: 'ca số 5-(18-20)',
          },
        },
      ],
      classroom: {
        classroom_name: '307',
        capacity: 15,
        type: 'Phòng Online',
      },
      course: {
        course_name: 'MICKEY 4 - Tutorial',
      },
      MainTeacher: {
        teacher_name: 'ĐẶNG HUỲNH THI THƠ',
      },
    };
    roomService.findRoomById.mockResolvedValue(mockRoom);

    const response = await request(app).get('/room/edit/295');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRoom);
  });

  it('should return 404 if no room found for specific ID', async () => {
    roomService.findRoomById.mockResolvedValue(null);

    const response = await request(app).get('/room/edit/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No rooms found');
  });

  it('should update a room by ID', async () => {
    const mockUpdatedRoom = { id: 1, name: 'Updated Room', capacity: 30 };
    roomService.updateRoomById.mockResolvedValue(mockUpdatedRoom);

    const response = await request(app)
      .put('/room/update/295')
      .send(mockUpdatedRoom);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedRoom);
  });

  it('should return 404 if trying to update a non-existing room', async () => {
    roomService.updateRoomById.mockResolvedValue(null);

    const response = await request(app)
      .put('/room/update/999')
      .send({ name: 'Updated Room' });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No rooms found');
  });

  it('should soft delete a room by ID', async () => {
    roomService.softDeleteRoomById.mockResolvedValue(true);

    const response = await request(app).patch('/room/delete/295');
    expect(response.status).toBe(200);
  });

  it('should return 404 if trying to soft delete a non-existing room', async () => {
    roomService.softDeleteRoomById.mockResolvedValue([0]);

    const response = await request(app).patch('/room/delete/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      'Classroom not found or already deleted'
    );
  });

  it('should get all deleted rooms', async () => {
    const mockDeletedRooms = [{ id: 1, name: 'Deleted Room' }];
    roomService.getAllDeleted.mockResolvedValue(mockDeletedRooms);

    const response = await request(app).get('/room/deleted-all');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockDeletedRooms);
  });

  it('should restore a room by ID', async () => {
    roomService.restoreRoomById.mockResolvedValue(true);

    const response = await request(app).put('/room/restore/295');
    expect(response.status).toBe(200);
  });

  it('should return 404 if trying to restore a non-existing room', async () => {
    roomService.restoreRoomById.mockResolvedValue([0]);
    const response = await request(app).put('/room/restore/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Class not found or already active');
  });

  it('should force delete a room by ID', async () => {
    roomService.forceDeleteRoomById.mockResolvedValue(true);

    const response = await request(app).delete('/room/force-delete/295');
    expect(response.status).toBe(200);
  });
  it('should return 404 if trying to force delete a non-existing room', async () => {
    roomService.forceDeleteRoomById.mockResolvedValue([0]);
    const response = await request(app).delete('/room/force-delete/999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Class not found');
  });
});
