import 'dotenv/config';
import { AppDataSource } from "./config/database";
import { TeacherLevelRepository } from "./repositories/TeacherLevelRepository";
import { TeacherRepository } from "./repositories/TeacherRepository";
import { RoomRepository } from "./repositories/RoomRepository";
import { CourseRepository } from "./repositories/CourseRepository";
import { ClassScheduleRepository } from "./repositories/ClassScheduleRepository";

async function testRepositories() {
    try {
        // Initialize the database connection
        await AppDataSource.initialize();
        console.log("Database connection initialized!");

        // Initialize repositories
        const teacherLevelRepo = new TeacherLevelRepository();
        const teacherRepo = new TeacherRepository();
        const roomRepo = new RoomRepository();
        const courseRepo = new CourseRepository();
        const classScheduleRepo = new ClassScheduleRepository();

        // 1. Test TeacherLevel Repository
        console.log("\nTesting TeacherLevel Repository:");
        const seniorLevel = await teacherLevelRepo.createLevel("Senior", "Senior level teacher");
        const juniorLevel = await teacherLevelRepo.createLevel("Junior", "Junior level teacher");
        console.log("Created teacher levels:", await teacherLevelRepo.find());

        // 2. Test Teacher Repository
        console.log("\nTesting Teacher Repository:");
        const teacher1 = teacherRepo.create({
            name: "John Doe",
            levelId: seniorLevel.id,
            status: "active"
        });
        await teacherRepo.save(teacher1);

        const teacher2 = teacherRepo.create({
            name: "Jane Smith",
            levelId: juniorLevel.id,
            status: "active"
        });
        await teacherRepo.save(teacher2);

        console.log("Available teachers:", await teacherRepo.findAvailableTeachers());

        // 3. Test Room Repository
        console.log("\nTesting Room Repository:");
        const room1 = roomRepo.create({
            roomNumber: "A101",
            capacity: 20,
            status: "available"
        });
        await roomRepo.save(room1);

        const room2 = roomRepo.create({
            roomNumber: "A102",
            capacity: 15,
            status: "available"
        });
        await roomRepo.save(room2);

        console.log("Available rooms:", await roomRepo.findAvailableRooms());

        // 4. Test Course Repository
        console.log("\nTesting Course Repository:");
        const course = courseRepo.create({
            name: "English Speaking",
            levelId: seniorLevel.id,
            description: "Advanced speaking course"
        });
        await courseRepo.save(course);
        console.log("Created course:", course);

        // 5. Test ClassSchedule Repository
        console.log("\nTesting ClassSchedule Repository:");
        const today = new Date();
        const schedule = classScheduleRepo.create({
            courseId: course.id,
            teacherId: teacher1.id,
            roomId: room1.id,
            date: today,
            startTime: "09:00",
            endTime: "10:30",
            status: "scheduled"
        });
        await classScheduleRepo.save(schedule);

        // Test finding schedules by date
        const todaySchedules = await classScheduleRepo.findSchedulesByDate(today);
        console.log("Today's schedules:", todaySchedules);

        // Test finding room schedule
        const roomSchedule = await roomRepo.findRoomWithSchedule(room1.id, today);
        console.log("Room schedule:", roomSchedule);

        // Test checking time conflicts
        const hasConflict = await classScheduleRepo.checkTimeConflict(
            room1.id,
            today,
            "09:00",
            "10:30"
        );
        console.log("Has time conflict:", hasConflict);

        console.log("\nAll tests completed successfully!");
    } catch (error) {
        console.error("Error during tests:", error);
    } finally {
        // Close the connection
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log("\nDatabase connection closed!");
        }
    }
}

// Run the tests
testRepositories().catch(error => console.log(error)); 