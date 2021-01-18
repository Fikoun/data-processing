const router = require('express').Router();
let Connection = require('../models/connection.model');
let Device = require('../models/device.model');
const { logged, auth } = require('../middleware');
const process = require('child_process')
const socket = require('../socket');
const fs = require('fs');

// @route   GET /connections
// @desc    Gets all connections
// @access  user
router.route('/').get(async (req, res) => {
    Connection.find()
        .then((connections) => res.json(connections))
        .catch(err => {
            console.error(err);
            res.status(400).json(err)
        });
});


// @route   GET /connections/device/:device/
// @desc    Gets all connections by device id
// @access  user
router.route('/device/:device').get(async (req, res) => {
    Device.findById(req.params.device).populate("connections")
        .then((device) => res.json(device.connections))
        .catch(err => {
            console.error(err);
            res.status(400).json(err)
        });
});

// @route   POST /connections/add
// @desc    Adds new connections to a device
// @access  user
router.route('/add').post(async (req, res) => {
    const connection = new Connection(req.body);

    connection.save()
        .then(() => res.json('Successfully added'))
        .catch(err => res.status(400).json(err));
});

// @route   POST /connections/connection/:is
// @desc    Adds new connections to a device
// @access  user
router.route('/connection/:id_device/:id_connection').post(async (req, res) => {
    try {
        let device = await Device.findById(req.params.id_device);
        console.log(device);

        // console.log(device.connections);
        // console.log(req.params);

        device.connections.push(req.params.id_connection)

        await device.save();

        res.json(device.populate("connections").connections);
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
});

module.exports = router;