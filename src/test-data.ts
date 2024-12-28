import { AppDataSource } from './config/database';
import { TeacherLevel } from './entities/TeacherLevel';
import { Teacher } from './entities/Teacher';
import { Room } from './entities/Room';
import { Course } from './entities/Course';
import { ClassSchedule } from './entities/ClassSchedule';

async function insertTestData() {
    try {
        await AppDataSource.initialize();

        // Create teacher levels
        const beginnerLevel = new TeacherLevel();
        beginnerLevel.levelName = 'Beginner';
        beginnerLevel.description = 'For teaching basic English';
        await AppDataSource.manager.save(beginnerLevel);

        const intermediateLevel = new TeacherLevel();
        intermediateLevel.levelName = 'Intermediate';
        intermediateLevel.description = 'For teaching intermediate English';
        await AppDataSource.manager.save(intermediateLevel);

        // Create teachers
        const teacher1 = new Teacher();
        teacher1.teacherName = 'John Doe';
        teacher1.email = 'john@example.com';
        teacher1.phoneNumber = '1234567890';
        teacher1.level = beginnerLevel;
        await AppDataSource.manager.save(teacher1);

        const teacher2 = new Teacher();
        teacher2.teacherName = 'Jane Smith';
        teacher2.email = 'jane@example.com';
        teacher2.phoneNumber = '0987654321';
        teacher2.level = intermediateLevel;
        await AppDataSource.manager.save(teacher2);

        // Create rooms
        const room1 = new Room();
        room1.roomNumber = 'Room A1';
        room1.capacity = 20;
        room1.status = true;
        await AppDataSource.manager.save(room1);

        const room2 = new Room();
        room2.roomNumber = 'Room B1';
        room2.capacity = 30;
        room2.status = true;
        await AppDataSource.manager.save(room2);

        // Create courses
        const course1 = new Course();
        course1.courseName = 'Basic English';
        course1.description = 'English for beginners';
        course1.level = 'Beginner';
        await AppDataSource.manager.save(course1);

        const course2 = new Course();
        course2.courseName = 'Intermediate English';
        course2.description = 'English for intermediate students';
        course2.level = 'Intermediate';
        await AppDataSource.manager.save(course2);

        // Create class schedules
        const schedule1 = new ClassSchedule();
        schedule1.scheduleDate = new Date('2024-03-19');
        schedule1.teacher = teacher1;
        schedule1.room = 'Phòng 101';
        schedule1.course = course1;
        await AppDataSource.manager.save(schedule1);

        const schedule2 = new ClassSchedule();
        schedule2.scheduleDate = new Date('2024-03-19');
        schedule2.teacher = teacher2;
        schedule2.room = 'Phòng 102';
        schedule2.course = course2;
        await AppDataSource.manager.save(schedule2);

        console.log('Test data inserted successfully');
    } catch (error) {
        console.error('Error inserting test data:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

insertTestData();
