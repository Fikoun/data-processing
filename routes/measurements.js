const router = require('express').Router();
let Measurement = require('../models/measurement.model');
let User = require('../models/user.model');

router.route('/').get((req, res) => {
   Measurement.find()
    .then(async (measurements) => {
        for (const key in measurements) {
            const measurement = measurements[key].toJSON();
            const preset = await User.findById(measurement.preset);
            measurements[key] = {...measurement, preset};
        }
        res.json(measurements);
    })
    .catch(err => res.status(400).json([err])); 
});

router.route('/add').post((req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const preset = req.body.preset;

    const measurement = new Measurement({name, description, duration, preset});

    measurement.save()
        .then(() => res.json('Successfully added'))
        .catch(err => res.status(400).json([err])); 
});

router.route('/:id').get((req, res) => {
    Measurement.findById(req.params.id)
        .then(async measurement => {
            const preset = await User.findById(measurement.preset);
            res.json({...measurement._doc, preset})
        })
        .catch(err => res.status(400).json([err]))
});

router.route('/:id').delete((req, res) => {
    Measurement.findByIdAndDelete(req.params.id)
        .then(() => res.json('Successufuly deleted.'))
        .catch(err => res.status(400).json([err]))
});

router.route('/update/:id').post((req, res) => {
    Measurement.findById(req.params.id)
        .then(measurement => {
            measurement.name = req.body.name;
            measurement.description = req.body.description;
            measurement.duration = req.body.duration;
        
            measurement.save() 
                .then(() => res.json('Successfully updated '))
                .catch(err => res.status(400).json('Error:' + err)); 
        });
});

module.exports = router;