const router = require('express').Router();
const middleware = require('../middleware');

const usersRouter = require('./users');
const measurementsRouter = require('./measurements');

router.use('/users', usersRouter);
router.use('/measurements', measurementsRouter);


module.exports = router;
