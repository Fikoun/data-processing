const router = require('express').Router();
let Measurement = require('../models/measurement.model');
let User = require('../models/user.model');
const middleware = require('../middleware');

// @route   GET /measurements
// @desc    Gets all measurements
// @access  user
router.route('/').get(middleware, (req, res) => {
    Measurement.find()
        .then((measurements) => {
            res.json(measurements);
        })
        .catch(err => res.status(400).json(err));
});

// @route   POST /measurements/add
// @desc    Adds new measurement
// @access  user
router.route('/add').post(middleware, (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const duration = Number(req.body.duration);

    const measurement = new Measurement({ name, description, duration });

    measurement.save()
        .then(() => res.json('Successfully added'))
        .catch(err => res.status(400).json(err));
});

// @route   GET /measurements/:id
// @desc    Gets measurement by id
// @access  user
router.route('/:id').get(middleware, (req, res) => {
    Measurement.findById(req.params.id)
        .then(async measurement => {
            res.json(measurement)
        })
        .catch(err => res.status(400).json(err))
});

// @route   GET /measurements/delete/:id
// @desc    Deletes measurement by id
// @access  user
router.route('/delete/:id').get(middleware, (req, res) => {
    Measurement.findByIdAndDelete(req.params.id)
        .then(() => res.json('Successufuly deleted.'))
        .catch(err => res.status(400).json(err))
});

// @route   POST /measurements/:id
// @desc    Updates measurement by id
// @access  user
router.route('/update/:id').post(middleware, (req, res) => {
    Measurement.findById(req.params.id)
        .then(measurement => {
            measurement.name = req.body.name;
            measurement.description = req.body.description;
            measurement.duration = req.body.duration;

            measurement.save()
                .then(() => res.json('Successfully updated '))
                .catch(err => res.status(400).json(err));
        });
});

// @route   GET /measurements//:id
// @desc    (Example - runs random data)
// @access  user
router.route('/run/:id').get(middleware, async (req, res) => {
    const random = (low, high) => (Math.random() * (high - low) + low);

    try {
        const measurement = await Measurement.findById(req.params.id);
        const data = measurement.data;

        const loop = (i) => {
            if (i == measurement.duration)
                return res.json(true)
            
            setTimeout(async () => {
                let time = Date.now();
                
                let temperature = random(i + 2, 32);
                let layer = temperature - random(2, 5);

                data.push({time, value: temperature}, {time, value: layer});
                await Measurement.findByIdAndUpdate(measurement._id, { data })
                loop(i + 1)
            }, 1000);
        }
        loop(0)
    } catch (error) {
        res.status(400).json(error);
    }

});

module.exports = router;