const roomRouter = require('./roomRoutes');
const scheduleRouter = require('./scheduleRoutes');
const teacherRouter = require('./teacherRoutes');
function route(app) {
    app.use('/room',roomRouter);
    app.use('/schedule',scheduleRouter);
    app.use('/teacher',teacherRouter);
};

module.exports = route;



