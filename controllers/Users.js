const { Users } = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
require('dotenv').config();

const Register = async (req, res) => {
    const user = data_user;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(user.password, salt)
    try {
        await Users.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: hashPassword
        });
        res.json({message: "Register Successfully"});
    } catch (err) {
        return res.status(400).send({
            message: err
        });
    };
};

const Login = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, password } = data_user;
        
        const accessToken = jwt.sign({ userId, firstName, lastName, email, password }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '7d'
        });

        const refreshToken = jwt.sign({ userId, firstName, lastName, email, password }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await Users.update({ refreshToken: refreshToken }, {
            where: {
                userId: userId
            }
        });

        res.json({ userId, firstName, lastName, email, accessToken });

    } catch (err) {
        return res.status(400).send({
            message: err
        });
    };
};



module.exports = { Register, Login };