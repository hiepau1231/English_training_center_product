import 'dotenv/config';
import { AppDataSource } from "./config/database";
import { TeacherLevel } from "./entities/TeacherLevel";
import { Teacher } from "./entities/Teacher";
import { Room } from "./entities/Room";

async function testConnection() {
    try {
        // Initialize the database connection
        await AppDataSource.initialize();
        console.log("Database connection has been initialized!");

        // Test creating a teacher level
        const teacherLevel = new TeacherLevel();
        teacherLevel.name = "Senior";
        teacherLevel.description = "Senior level teacher";
        await AppDataSource.manager.save(teacherLevel);
        console.log("Teacher level has been saved!");

        // Test creating a teacher
        const teacher = new Teacher();
        teacher.name = "John Doe";
        teacher.levelId = teacherLevel.id;
        teacher.status = "active";
        await AppDataSource.manager.save(teacher);
        console.log("Teacher has been saved!");

        // Test creating a room
        const room = new Room();
        room.roomNumber = "A101";
        room.capacity = 20;
        room.status = "available";
        await AppDataSource.manager.save(room);
        console.log("Room has been saved!");

        // Test querying data
        const teachers = await AppDataSource.manager.find(Teacher, {
            relations: {
                level: true
            }
        });
        console.log("Loaded teachers: ", teachers);

    } catch (error) {
        console.error("Error during test:", error);
    } finally {
        // Close the connection
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log("Connection closed!");
        }
    }
}

// Run the test
testConnection().catch(error => console.log(error)); 