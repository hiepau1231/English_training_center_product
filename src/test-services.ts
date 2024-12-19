import 'dotenv/config';
import { AppDataSource } from "./config/database";
import { ClassScheduleService } from "./services/ClassScheduleService";
import { ClassScheduleRepository } from "./repositories/ClassScheduleRepository";
import { TeacherRepository } from "./repositories/TeacherRepository";
import { RoomRepository } from "./repositories/RoomRepository";
import { TeacherLevelRepository } from "./repositories/TeacherLevelRepository";
import { AppError } from './utils/AppError';

async function testServices() {
    try {
        // Initialize the database connection
        await AppDataSource.initialize();
        console.log("Database connection initialized!");

        // Initialize repositories
        const classScheduleRepo = new ClassScheduleRepository();
        const teacherRepo = new TeacherRepository();
        const roomRepo = new RoomRepository();
        const teacherLevelRepo = new TeacherLevelRepository();

        // Initialize service
        const classScheduleService = new ClassScheduleService(
            classScheduleRepo,
            teacherRepo,
            roomRepo
        );

        // Create test data
        console.log("\nCreating test data...");

        // 1. Create teacher levels
        const seniorLevel = await teacherLevelRepo.createLevel("Senior", "Senior level teacher");
        const juniorLevel = await teacherLevelRepo.createLevel("Junior", "Junior level teacher");
        console.log("Created teacher levels");

        // 2. Create teachers
        const teacher1 = teacherRepo.create({
            name: "John Doe",
            levelId: seniorLevel.id,
            status: "active"
        });
        await teacherRepo.save(teacher1);

        const teacher2 = teacherRepo.create({
            name: "Jane Smith",
            levelId: seniorLevel.id,
            status: "active"
        });
        await teacherRepo.save(teacher2);
        console.log("Created teachers");

        // 3. Create rooms
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
        console.log("Created rooms");

        // 4. Create a schedule
        const today = new Date();
        const schedule = classScheduleRepo.create({
            courseId: 1, // Assuming course exists
            teacherId: teacher1.id,
            roomId: room1.id,
            date: today,
            startTime: "09:00",
            endTime: "10:30",
            status: "scheduled"
        });
        await classScheduleRepo.save(schedule);
        console.log("Created schedule");

        // Test service methods
        console.log("\nTesting service methods:");

        // 1. Test getDailySchedules
        console.log("\n1. Testing getDailySchedules:");
        const dailySchedules = await classScheduleService.getDailySchedules(today);
        console.log("Daily schedules:", dailySchedules);

        // 2. Test findAvailableReplacementTeachers
        console.log("\n2. Testing findAvailableReplacementTeachers:");
        const availableTeachers = await classScheduleService.findAvailableReplacementTeachers(
            schedule.id,
            today,
            "09:00",
            "10:30"
        );
        console.log("Available replacement teachers:", availableTeachers);

        // 3. Test findAvailableReplacementRooms
        console.log("\n3. Testing findAvailableReplacementRooms:");
        const availableRooms = await classScheduleService.findAvailableReplacementRooms(
            today,
            "09:00",
            "10:30",
            15
        );
        console.log("Available replacement rooms:", availableRooms);

        // 4. Test replaceTeacher
        console.log("\n4. Testing replaceTeacher:");
        try {
            const updatedSchedule = await classScheduleService.replaceTeacher(
                schedule.id,
                teacher2.id
            );
            console.log("Schedule after teacher replacement:", updatedSchedule);
        } catch (error) {
            if (error instanceof AppError) {
                console.log("Error replacing teacher:", error.message);
            } else {
                console.log("Unknown error replacing teacher");
            }
        }

        // 5. Test replaceRoom
        console.log("\n5. Testing replaceRoom:");
        try {
            const updatedSchedule = await classScheduleService.replaceRoom(
                schedule.id,
                room2.id
            );
            console.log("Schedule after room replacement:", updatedSchedule);
        } catch (error) {
            if (error instanceof AppError) {
                console.log("Error replacing room:", error.message);
            } else {
                console.log("Unknown error replacing room");
            }
        }

        // 6. Test rescheduleClass
        console.log("\n6. Testing rescheduleClass:");
        try {
            const updatedSchedule = await classScheduleService.rescheduleClass(
                schedule.id,
                "11:00",
                "12:30"
            );
            console.log("Schedule after rescheduling:", updatedSchedule);
        } catch (error) {
            if (error instanceof AppError) {
                console.log("Error rescheduling class:", error.message);
            } else {
                console.log("Unknown error rescheduling class");
            }
        }

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
testServices().catch(error => console.log(error)); 