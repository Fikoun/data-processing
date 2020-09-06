const router = require('express').Router();
let Station = require('../models/station.model');
const { logged, auth } = require('../middleware');
const SerialPort = require('serialport');
const process = require('child_process')
const socket = require('../socket');
const fs = require('fs');


let localStationProcess;
const stations = [];
//  .spawn('node');

const getStatus = (station) => {
    let status = 'offline';
    socket.clients.forEach((config, client) => {
        if (config.id == station._id)
            status = 'online';

    })
    station.status = status;
    station.save()
    return station;
}

const stationsStatus = (req, res) => {
    Station.find()
        .then((stations) => {
            stations = stations.map(getStatus)
            res.json(stations);
        })
        .catch(err => {
            console.error(err);
            res.status(400).json(err)
        });
}

// @route   GET /devices/variables/
// @desc    Gets all devices from stations
// @access  user
router.route('/variables').get(async (req, res) => {
    try {
        let variables = [];
        Station.find()
            .then((stations) => {
                stations.forEach((station) => {
                    variables = [...variables, ...station.devices]
                })
                res.json(variables);
            })
            .catch(err => {
                console.error(err);
                res.status(400).json(err)
            });
    } catch (err) {
        res.status(400).json(err)
    }
    /*
        normane vrati z db
        component device do syncne databázi a fetchne
        potom propojení s grafem :)
    */
});

// @route   GET /devices/station/:id
// @desc    Gets all devices from station by id
// @access  user
router.route('/status/:id/:port').get(async (req, res) => {
    try {
        let station = await Station.findById(req.params.id);
        //      DB !!!
        let devices = false
        socket.clients.forEach((config, client) => {
            if (config.id == station._id) {
                devices = [];
                client.once('devices', (devices) => res.json(devices))
                client.emit('getDevices')
            }
        })

        if (devices === false)
            return res.status(400).json("Station is offline")

        res.json(devices);
    } catch (err) {
        res.status(400).json(err)
    }
});

// @route   POST /devices/add
// @desc    Adds new device
// @access  user
router.route('/add/:id').post(async (req, res) => {
    try {
        let station = await Station.findById(req.params.id);

        station.devices.push({
            name: req.body.name,
            port: req.body.port,
            commands: [{ name: 'get', command: req.body.command }]
        })

        station.save();
        res.json(station.devices);
    } catch (err) {
        console.log(err);

        res.status(400).json(err)
    }
});

// @route   POST /stations/start/:id
// @desc    Tryes to connect or starts local DataStation
// @access  user
router.route('/status/:id').get((req, res) => {
    Station.findById(req.params.id).then((station) => {
        station = getStatus(station);
        setTimeout(() => {
            res.json(station)
        }, 1000);
    })
        .catch(err => res.status(400).json(err));
});

// @route   POST /stations/user
// @desc    Creates local instance in DB and start DataStation
// @access  user
router.route('/setup').get(async (req, res) => {
    const station = new Station({
        name: 'local',
        status: 'offline',
        devices: []
    });


    station.save()
        .then((station) => {
            try {
                // Write local DataStation config
                const local_config = { host: 'localhost', port: '8000', id: station._id }
                fs.writeFileSync('data_station/config.json', JSON.stringify(local_config))

                // Kill running local station
                if (localStationProcess)
                    localStationProcess.kill();

                // Spawn new instance of local DataStation
                localStationProcess = process.spawn('node', ['data_station/index.js']);
                // console.log(localStationProcess);
                localStationProcess.stdout.on('data', (data) => res.json(data.toString()))
            } catch (err) {
                res.status(400).json(err)
            }
        })
        .catch(err => res.status(400).json(err));
});

// @route   POST /devices/command
// @desc    SENDS command to device and get response.
// @access  user
router.route('/command/:id').post(async (req, res) => {
    try {
        let station = await Station.findOne({
            devices: {
                $elemMatch: { _id: req.params.id }
            }
        });

        // console.log({station, d:station.devices});
        
        let device = station.devices.find((d) => d._id == req.params.id)

        socket.clients.forEach((config, client) => {
            if (config.id == station._id) {
                // console.log({found: config, device});
                
                client.once('response', (response) => {
                    // console.log({value, device});
                    if (response.error)
                        return res.status(400).json(response.error)
                    console.log(response)
                        
                    res.json({ ...device._doc, value: response.data })
                })
                if (req.body.command == 'default')
                    req.body.command = device.commands[0].command;

                client.emit('command', { path: device.port, ...req.body})
            }
        })
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
});



router.route('/stop/:id').get(async (req, res) => {
    try {
        let station = await Station.findById(req.params.id);
        if (station.name == 'local') {
            if (localStationProcess)
                localStationProcess.kill();
        }
    } catch (err) {
        res.status(400).json(err)
    }
    res.json(true);
});

// @route   POST /devices/remove
// @desc    removes device
// @access  user
router.route('/remove').post(logged, (req, res) => {
    Station.findByIdAndDelete(req.body.id)
        .then(() => res.json('Successfully removed'))
        .catch(err => res.status(400).json(err));
});

// @route   POST /devices/command
// @desc    Sends command to device
// @access  user
router.route('/command').post(logged, (req, res) => {

    if (!connections[req.body.port]) {
        try {
            connections[req.body.port] = new SerialPort(req.body.port, {
                baudRate: 9600
            });
        } catch (err) {
            return res.status(400).json(err);
        }
    }

    let serial = connections[req.body.port];

    serial.once('error', function (err) {
        return res.status(400).json({ err });
        // console.log(err); 
    });
    serial.once('data', function (data) {
        // console.log(data[0]);
        
        res.json(String.fromCharCode(data[0]));
    });

    serial.write("get\n")
});



router.route('/ports').get(logged, async (req, res) => {

    const ports = await SerialPort.list()

    // console.log(ports);
    res.json(ports);


});

module.exports = router;