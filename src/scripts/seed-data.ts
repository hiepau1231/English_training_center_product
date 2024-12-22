import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { TeacherLevel } from '../entities/TeacherLevel';
import { Teacher } from '../entities/Teacher';
import { Room } from '../entities/Room';
import { Course } from '../entities/Course';
import { ClassSchedule } from '../entities/ClassSchedule';

async function seedData() {
    let connection = null;
    try {
        // Initialize connection
        connection = await AppDataSource.initialize();
        console.log("Database connection initialized");

        // Create teacher levels
        const beginnerLevel = new TeacherLevel();
        beginnerLevel.name = "Beginner";
        beginnerLevel.description = "Beginner level teachers";
        await connection.manager.save(beginnerLevel);
        console.log("Created beginner level");

        const intermediateLevel = new TeacherLevel();
        intermediateLevel.name = "Intermediate";
        intermediateLevel.description = "Intermediate level teachers";
        await connection.manager.save(intermediateLevel);
        console.log("Created intermediate level");

        // Create teachers
        const teacher1 = new Teacher();
        teacher1.name = "John Doe";
        teacher1.levelId = beginnerLevel.id;
        teacher1.status = "active";
        await connection.manager.save(teacher1);
        console.log("Created teacher 1");

        const teacher2 = new Teacher();
        teacher2.name = "Jane Smith";
        teacher2.levelId = intermediateLevel.id;
        teacher2.status = "active";
        await connection.manager.save(teacher2);
        console.log("Created teacher 2");

        // Create rooms
        const room1 = new Room();
        room1.roomNumber = "101";
        room1.capacity = 20;
        room1.status = "available";
        await connection.manager.save(room1);
        console.log("Created room 1");

        const room2 = new Room();
        room2.roomNumber = "102";
        room2.capacity = 25;
        room2.status = "available";
        await connection.manager.save(room2);
        console.log("Created room 2");

        // Create courses
        const course1 = new Course();
        course1.name = "Basic English";
        course1.levelId = beginnerLevel.id;
        course1.description = "Basic English course for beginners";
        await connection.manager.save(course1);
        console.log("Created course 1");

        const course2 = new Course();
        course2.name = "Intermediate English";
        course2.levelId = intermediateLevel.id;
        course2.description = "English course for intermediate students";
        await connection.manager.save(course2);
        console.log("Created course 2");

        // Create class schedules
        const schedule1 = new ClassSchedule();
        schedule1.courseId = course1.id;
        schedule1.teacherId = teacher1.id;
        schedule1.roomId = room1.id;
        schedule1.date = new Date("2024-03-19");
        schedule1.startTime = "09:00";
        schedule1.endTime = "10:30";
        schedule1.status = "scheduled";
        await connection.manager.save(schedule1);
        console.log("Created schedule 1");

        const schedule2 = new ClassSchedule();
        schedule2.courseId = course2.id;
        schedule2.teacherId = teacher2.id;
        schedule2.roomId = room2.id;
        schedule2.date = new Date("2024-03-19");
        schedule2.startTime = "11:00";
        schedule2.endTime = "12:30";
        schedule2.status = "scheduled";
        await connection.manager.save(schedule2);
        console.log("Created schedule 2");

        console.log("Data seeding completed successfully");
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.destroy();
            console.log("Database connection closed");
        }
    }
}

// Run seed
seedData().catch(error => {
    console.error("Fatal error during seeding:", error);
    process.exit(1);
}); 