const roomRouter = require('./roomRoutes');
const teacherRouter = require('./teacherRoutes');
const uploadRouter = require('./uploadRoutes');
function route(app) {
  app.use('/room', roomRouter);
  app.use('/teacher', teacherRouter);
  app.use('/upload', uploadRouter);
}

module.exports = route;
