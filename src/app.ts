import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import routes from './routes';
const app: Application = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);
  
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');

    // Start the server if the database connection is successful
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });