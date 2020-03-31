const router = require('express').Router();
const middleware = require('../middleware');

const usersRouter = require('./users');

router.use('/users', usersRouter);


module.exports = router;
