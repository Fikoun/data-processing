const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const middleware = require('../middleware');

let User = require('../models/user.model');

// @route   POST /users/register
// @desc    Adds new user (register)
// @access  public
router.route('/register').post(async (req, res) => {
    if (!req.body.name || !req.body.name.firstname || !req.body.name.lastname || !req.body.email || !req.body.password)
        return res.status(400).json(["Fill out all fields!"]);
        
    try {
        if (await User.findOne({ email: req.body.email }))
            return res.status(400).json(["Email already in use!"])

        const password = await bcrypt.hash(req.body.password, 13);
        const user = new User({ ...req.body, password  });
        user.save();
        
        // Generate "session token" JWT
        const token = await jwt.sign(
            { id: user.id, },
            process.env.JWT_KEY,
            { expiresIn: 1800 });

        res.json({ token })
    } catch (error) {
        res.status(400).json(error)
    }
});
 
// @route   POST /users/login
// @desc    Authenticates and returns JWT (login)
// @access  public
router.route('/login').post(async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Validate fields
    if (!email || !password)
        return res.status(400).json("Fill out all fields");

    // Validate user and password
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password))
        return res.status(400).json("Credentials not valid")

    // console.log(user);
    

    // Generate "session token" JWT
    const token = await jwt.sign(
        { id: user.id, },
        process.env.JWT_KEY,
        { expiresIn: 1800 });

    return res.json({ user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        permission: user.permission,
                    }, token });
});

// @route   POST /users/auth
// @desc    Authenticates user by token
// @access  public
router.route('/auth').post(async (req, res) => {
    const authorization = req.header('Authorization')
    
    if (!authorization || authorization.split(" ").length < 2)
        res.status(401).json("No token!");

    const token = authorization.split(" ")[1];

    try {
        const data = jwt.verify(token , process.env.JWT_KEY)
        const user = await User.findById( data.id ).select('-password');
        
        res.json({ user, token })
    } catch (error) {
        return res.status(400).json("Token invalid!")
    }
});




// @route   GET /users
// @desc    Fetches all users without the password field
// @access  admin
router.route('/').get(middleware, (req, res) => {
    User.find().select('-password')
        .then(users => res.json(users))
        .catch(err => res.status(400).json(err));
});


module.exports = router;