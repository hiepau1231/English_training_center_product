import 'dotenv/config';
import { AppDataSource } from './config/database';
import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { errorHandler } from './middleware/errorHandler';
import { validateRequest } from './middleware/validateRequest';
import { replaceTeacherSchema, replaceRoomSchema, rescheduleClassSchema } from './validations/classScheduleValidation';

async function testValidation() {
    try {
        // Initialize database connection
        await AppDataSource.initialize();
        console.log('Database connection initialized!');

        // Create test express app
        const app = express();
        app.use(express.json());

        // Test endpoints
        app.put('/test/replace-teacher', validateRequest(replaceTeacherSchema), (req: Request, res: Response) => {
            res.json({ success: true, data: req.body });
        });

        app.put('/test/replace-room', validateRequest(replaceRoomSchema), (req: Request, res: Response) => {
            res.json({ success: true, data: req.body });
        });

        app.put('/test/reschedule', validateRequest(rescheduleClassSchema), (req: Request, res: Response) => {
            res.json({ success: true, data: req.body });
        });

        // Error handler
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            if (err.statusCode) {
                res.status(err.statusCode).json({
                    status: err.status,
                    message: err.message
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
            return;
        });

        console.log('\nStarting validation tests...');

        // Test 1: Replace Teacher Validation
        console.log('\n1. Testing Replace Teacher Validation:');
        
        // Valid case
        const validTeacherResponse = await request(app)
            .put('/test/replace-teacher')
            .send({ newTeacherId: 1 });
        console.log('Valid teacher case:', validTeacherResponse.body);

        // Invalid case - missing teacherId
        const invalidTeacherResponse = await request(app)
            .put('/test/replace-teacher')
            .send({});
        console.log('Invalid teacher case (missing ID):', invalidTeacherResponse.body);

        // Invalid case - string instead of number
        const invalidTeacherTypeResponse = await request(app)
            .put('/test/replace-teacher')
            .send({ newTeacherId: "abc" });
        console.log('Invalid teacher case (wrong type):', invalidTeacherTypeResponse.body);

        // Test 2: Replace Room Validation
        console.log('\n2. Testing Replace Room Validation:');
        
        // Valid case
        const validRoomResponse = await request(app)
            .put('/test/replace-room')
            .send({ newRoomId: 1 });
        console.log('Valid room case:', validRoomResponse.body);

        // Invalid case - missing roomId
        const invalidRoomResponse = await request(app)
            .put('/test/replace-room')
            .send({});
        console.log('Invalid room case (missing ID):', invalidRoomResponse.body);

        // Test 3: Reschedule Validation
        console.log('\n3. Testing Reschedule Validation:');
        
        // Valid case
        const validScheduleResponse = await request(app)
            .put('/test/reschedule')
            .send({ startTime: "09:00", endTime: "10:30" });
        console.log('Valid schedule case:', validScheduleResponse.body);

        // Invalid case - wrong time format
        const invalidTimeFormatResponse = await request(app)
            .put('/test/reschedule')
            .send({ startTime: "9:00", endTime: "10:30" });
        console.log('Invalid schedule case (wrong format):', invalidTimeFormatResponse.body);

        // Invalid case - end time before start time
        const invalidTimeRangeResponse = await request(app)
            .put('/test/reschedule')
            .send({ startTime: "10:00", endTime: "09:00" });
        console.log('Invalid schedule case (wrong range):', invalidTimeRangeResponse.body);

        console.log('\nAll validation tests completed!');

    } catch (error) {
        console.error('Error during tests:', error);
    } finally {
        // Close database connection
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('\nDatabase connection closed!');
        }
    }
}

// Run the tests
testValidation().catch(error => console.error(error)); 