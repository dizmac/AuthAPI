const router = require('express').Router();
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../validation')




router.post('/register', async (req, res) => {
    console.log(`Received a requested from ${req.connection.remoteAddress} at port ${req.connection.remotePort}`)

    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const emailExists = await User.findOne({email: req.body.email})

    if (emailExists) return res.status(400).send('Email already exists')

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        const savedUser = await user.save();
        res.send(`User "${savedUser.name}" has been registered with the ID "${savedUser._id}"`);
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async (req, res) => {

    console.log(`Received a requested from ${req.connection.remoteAddress} at port ${req.connection.remotePort}`)

    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    console.log("No errors")
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
    if (!user) return res.status(404).send('Email does not exist')
    console.log("Email exists")

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) return res.status(400).send('The password is incorrect.')

    res.end(`Logged in`)
})

router.get('/info', async (req, res) => {
    console.log(`Received a requested from ${req.connection.remoteAddress} at port ${req.connection.remotePort}`)

    const user = await User.findOne({email: req.body.email})
    if (!user) return res.status(404).send("User doesn't exist")
    res.json(
        {
            "username": user.name,
            "userID": user._id,
            "email": user.email
        }
    )
})

module.exports = router;