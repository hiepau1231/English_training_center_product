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
        beginnerLevel.levelName = "Beginner";
        beginnerLevel.description = "Beginner level teachers";
        await connection.manager.save(beginnerLevel);
        console.log("Created beginner level");

        const intermediateLevel = new TeacherLevel();
        intermediateLevel.levelName = "Intermediate";
        intermediateLevel.description = "Intermediate level teachers";
        await connection.manager.save(intermediateLevel);
        console.log("Created intermediate level");

        // Add more seed data here as needed

        console.log("Seed data created successfully");
    } catch (error) {
        console.error("Error creating seed data:", error);
    } finally {
        if (connection) {
            await connection.destroy();
        }
    }
}

// Execute the seed function
seedData();
