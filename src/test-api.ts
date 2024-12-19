import 'dotenv/config';
import express from 'express';
import request from 'supertest';
import { AppDataSource } from './config/database';
import { ClassScheduleController } from './controllers/ClassScheduleController';
import { validateRequest } from './middleware/validateRequest';
import { replaceTeacherSchema, replaceRoomSchema, rescheduleClassSchema } from './validations/classScheduleValidation';

const app = express();
app.use(express.json());

// Initialize controller
const classScheduleController = new ClassScheduleController();

// Setup routes with validation
app.get('/api/class-schedules/daily/:teacherId', (req, res) => classScheduleController.getDailySchedules(req, res));
app.put('/api/class-schedules/:id/replace-teacher', validateRequest(replaceTeacherSchema), (req, res) => classScheduleController.replaceTeacher(req, res));
app.put('/api/class-schedules/:id/replace-room', validateRequest(replaceRoomSchema), (req, res) => classScheduleController.replaceRoom(req, res));
app.put('/api/class-schedules/:id/reschedule', validateRequest(rescheduleClassSchema), (req, res) => classScheduleController.rescheduleClass(req, res));

async function runTests() {
    try {
        // Initialize database connection
        await AppDataSource.initialize();
        console.log('Database connection initialized!');

        console.log('\nStarting API tests...\n');

        // Test 1: Get daily schedules
        console.log('1. Testing Get Daily Schedules:');
        const getDailyResponse = await request(app)
            .get('/api/class-schedules/daily/1')
            .expect(200);
        console.log('Get daily schedules response:', getDailyResponse.body);

        // Test 2: Replace teacher
        console.log('\n2. Testing Replace Teacher:');
        const replaceTeacherResponse = await request(app)
            .put('/api/class-schedules/1/replace-teacher')
            .send({ newTeacherId: 2 })
            .expect(200);
        console.log('Replace teacher response:', replaceTeacherResponse.body);

        // Test 3: Replace room
        console.log('\n3. Testing Replace Room:');
        const replaceRoomResponse = await request(app)
            .put('/api/class-schedules/1/replace-room')
            .send({ newRoomId: 2 })
            .expect(200);
        console.log('Replace room response:', replaceRoomResponse.body);

        // Test 4: Reschedule class
        console.log('\n4. Testing Reschedule Class:');
        const rescheduleResponse = await request(app)
            .put('/api/class-schedules/1/reschedule')
            .send({
                startTime: '10:00',
                endTime: '11:30'
            })
            .expect(200);
        console.log('Reschedule class response:', rescheduleResponse.body);

        console.log('\nAll API tests completed!');

    } catch (error) {
        console.error('Error during tests:', error);
    } finally {
        // Close database connection
        await AppDataSource.destroy();
        console.log('\nDatabase connection closed!');
    }
}

// Run the tests
runTests(); 