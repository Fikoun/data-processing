const router = require('express').Router();

let Measurement = require('../models/measurement.model');
let Device = require('../models/device.model');
let Station = require('../models/station.model');
let User = require('../models/user.model');

const {logged, auth} = require('../middleware');
const SerialPort = require('serialport');
const socket = require('../socket');

// @route   GET /measurements
// @desc    Gets all measurements
// @access  user
router.route('/').get(logged, (req, res) => {
    Measurement.find()
        .then((measurements) => {
            res.json(measurements);
        })
        .catch(err => res.status(400).json(err));
});

// @route   POST /measurements/add
// @desc    Adds new measurement
// @access  user
router.route('/add').post(logged, (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const device = req.body.device;

    const measurement = new Measurement({ name, description, duration, device });

    measurement.save()
        .then(() => res.json('Successfully added'))
        .catch(err => res.status(400).json(err));
});

// @route   GET /measurements/:id
// @desc    Gets measurement by id
// @access  user
router.route('/:id').get(logged, (req, res) => {
    Measurement.findById(req.params.id)
        .then(async measurement => {
            res.json(measurement)
        })
        .catch(err => res.status(400).json(err))
});

// @route   GET /measurements/delete/:id
// @desc    Deletes measurement by id
// @access  user
router.route('/delete/:id').get(logged, (req, res) => {
    Measurement.findByIdAndDelete(req.params.id)
        .then(() => res.json('Successufuly deleted.'))
        .catch(err => res.status(400).json(err))
});

// @route   POST /measurements/:id
// @desc    Updates measurement by id
// @access  user
router.route('/update/:id').post(logged, (req, res) => {
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

const connections = [];
// @route   GET /measurements/:id
// @desc    (Example - runs random data)
// @access  user
router.route('/run/:id').get(logged, async (req, res) => {
    const random = (low, high) => (Math.random() * (high - low) + low);

    try {
        const measurement = await Measurement.findById(req.params.id);
        let station = await Station.findOne({
            devices: {
                $elemMatch: { _id: measurement.device }
            }
        });
        let device = station.devices.find((d) => d._id.toString() == measurement.device.toString())

        let client;
        socket.clients.forEach((config, c) => {
            if (config.id == station._id)
                client = c
        })   
        
        // console.log({ds:station.devices, device, id:measurement.device});
        
        measurement.state = 'running';
        await measurement.save();
        
        var duration = measurement.duration;
        if (duration == 0) {
            duration = 100000000;
        }
        duration = 100000000;


        const loop = async (i) => {
            const measurement = await Measurement.findById(req.params.id);
            const data = measurement.data;

            if (i == duration || measurement.state != 'running')
                return res.headersSent ? true : res.json(true);
            
            setTimeout(() => {
                client.once('response', async (response) => {
                    let d = response.data;
                    console.log({d});

                    if(d.error)
                        return res.status(400).json(d.error);

                    let time = Date.now();
                    let temperature = parseFloat(d);
                    let layer = temperature + random(2, 5);

                    data.push({time, value: temperature}, {time, value: layer});
                    await Measurement.findByIdAndUpdate(measurement._id, { data })
                    loop(i + 1)
                })

                console.log("emit");
                
                client.emit('command', {path: device.port, command: 'C'})

            }, 1000);
        }
        loop(0)
    } catch (error) {
        console.log(error);
        
        res.status(400).json(error);
    }
    res.json('started')
});


router.route('/stop/:id').get(logged, async (req, res) => {

    try {
        const measurement = await Measurement.findById(req.params.id);

        measurement.state = 'new';
        measurement.save();
        
        res.json("stopped")
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;