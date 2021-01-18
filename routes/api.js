const router = require('express').Router();
const middleware = require('../middleware');

const usersRouter = require('./users');
const measurementsRouter = require('./measurements');
const stationsRouter = require('./stations');
const devicesRouter = require('./devices');
const connectionsRouter = require('./connections');

router.use('/users', usersRouter);
router.use('/measurements', measurementsRouter);
router.use('/stations', stationsRouter);
router.use('/devices', devicesRouter);
router.use('/connections', connectionsRouter);


module.exports = router;
