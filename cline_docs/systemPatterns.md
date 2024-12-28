# System Patterns

## Database Schema
### Class Schedules
- Extended schema with additional fields for better tracking:
  - Date fields: schedule_date, start_date, end_date
  - Reference fields: shift_id, course_id, room_id, teacher_id
  - Descriptive fields: course_name, class_name, main_teacher
  - Metrics: number_of_students
- Foreign key constraints ensure data integrity
- Soft delete pattern with is_deleted flag

## Data Access
- Repository pattern for database operations
- TypeORM for ORM functionality
- Entity-DTO pattern for data transformation
- Soft delete implementation across entities

## API Architecture
- REST API design
- Express.js middleware for request processing
- Validation middleware for request data
- Error handling middleware
- Response standardization

## Security
- File upload restrictions
- Input validation
- Error message sanitization

## Architecture
- TypeScript-based Node.js backend
- TypeORM for database management
- REST API architecture

## Key Patterns
- Repository pattern for data access
- Service layer for business logic
- Controller layer for request handling
- Entity-based data modeling
- Middleware for request processing
- Data validation layer