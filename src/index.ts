import "reflect-metadata";
import express from "express";
import cors from 'cors';
import { AppDataSource } from "./data-source";
import roomRoutes from "./routes/roomRoutes";
import importRoutes from "./routes/import.routes";
import testRoutes from "./routes/test.routes";
import classRouter from "./routes/ClassRoute";
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route handler
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to English Training Center API' });
});

// Add routes
app.use('/api/rooms', roomRoutes);
app.use('/api/import', importRoutes);
app.use('/api/test', testRoutes);
app.use('/api/classes', classRouter);

// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    }); 