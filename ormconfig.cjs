const { DataSource } = require('typeorm');
const path = require('path');

module.exports = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'english_tranning_center',
  entities: [
    'dist/entities/Room.js',
    'dist/entities/Teacher.js',
    'dist/entities/TeacherLevel.js',
    'dist/entities/ClassTeacher.js',
    'dist/entities/ClassSchedule.js',
    'dist/entities/Course.js',
    'dist/entities/Class.js',
    'dist/entities/Shift.js'
  ],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: true,
  charset: 'utf8mb4',
  timezone: '+07:00',
  supportBigNumbers: true,
  bigNumberStrings: false,
  extra: {
    connectionLimit: 10
  }
});
