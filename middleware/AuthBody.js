const { Users, Payments, Charities } = require('../models');
const bcrypt = require("bcrypt");

const re_name = /^[a-zA-Z0-9 ]+$/;
const re_title = /^[a-zA-Z0-9.!? ]+$/;
const re_password = /^[a-zA-Z0-9]{2,30}$/;
const RE_HTML_ERROR = /<[\s\S]*?>/; 
const re_email= /^[a-zA-Z0-9@.]+$/;
const re_number = /^[0-9]+$/;

const AuthReg = async (req, res, next) => {
    const { firstName, lastName, email, password, repassword } = req.body;

    const user = await Users.findOne({
        where: {
            email: email
        }}
    )

    if( firstName.match(RE_HTML_ERROR) || lastName.match(RE_HTML_ERROR) || email.match(RE_HTML_ERROR) || password.match(RE_HTML_ERROR)){
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };

    if (user){
        return res.status(412).send({
            message: 'Your Email has been register'
        })
    }

    if (firstName.search(re_name) === -1){
        return res.status(412).send({
            message: 'First name doesnt match with Format'
        })
    };

    if (lastName.search(re_name) === -1){
        return res.status(412).send({
            message: 'Last name doesnt match with Format'
        })
    };

    if (password.search(re_password) === -1) {
        return res.status(412).send({
            message: 'The format of the Password does not match.',
        });
        };
    
    if(!email.includes('@') || email.search(re_email) === -1){
        return res.status(412).send({
            message: 'Fill your email with real email'
            });
    };

    if (password !== repassword) {
    return res.status(412).send({
        message: 'The passwords do not match.',
        });
    };
    
    data_user = {
        firstName: firstName, lastName:lastName, email:email, password:password
    };

    next();
};

const AuthLog = async (req, res, next) => {
    const { email, password } = req.body;

    if(!email.includes('@') || email.search(re_email) === -1){
        return res.status(412).send({
            message: 'Fill your email with real email'
            });
    };

    if(password.match(RE_HTML_ERROR)){
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };


    const user = await Users.findOne({
        where: {
            email: email
        }}
    );


    if (!user){
        return res.status(412).send({
            message: 'Your Email not Registered'
        })
    };

    const match = await bcrypt.compare(password, user.password);
    if (!match){
        return res.status(400).json({ message: "Wrong Password" });
    }

    data_user = {
        userId: user.dataValues.userId,
        firstName: user.dataValues.firstName,
        lastName: user.dataValues.lastName,
        email: user.dataValues.email,
        password: user.dataValues.password
    };

    next();
};

const CreateSlug = (input) => {
    var slug = input.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    slug = slug + '-' + Date.now();

    return slug;
}

const AuthPay = async (req, res, next) => {

    var { method, number, username } = req.body.data;


    data_payment = {
        method: method, 
        number: number, 
        username: username
    }

    if (req.params.paymentId){
        const { paymentId } = req.params;
        data_payment.paymentId = paymentId;
        var payment = await Payments.findOne({
            where: {
                paymentId: paymentId
            }
        })
        payment = payment.dataValues;
        if(!method){
            data_payment.method = payment.method
        }
        if(!number || number === ''){
            data_payment.number = payment.number
        }
        if(!username || username === ''){
            data_payment.username = payment.username
        }
    };

    if( method.match(RE_HTML_ERROR) || number.match(RE_HTML_ERROR) || username.match(RE_HTML_ERROR)){
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };

    if (isNaN(number)){
        return res.status(412).send({
            message: 'Please add number on field Number Payment'
        })
    };

    if (username.search(re_name) === -1){
        return res.status(412).send({
            message: 'Username doesnt match with Format'
        })
    };

    next()
}

const AuthChar = async (req, res, next) => {
    var { title, description, goal } = req.body;
    const slug = CreateSlug(title);

    if(!req.params.charityId){
        if(!req.body.fileName) {
            return res.status(412).send({
                message: 'Image not found!'
            })
        }
    }

    const image = req.body.fileName;

    data_charity = {
        title: title, 
        description: description, 
        goal: goal,
        slug: slug,
        image: image
    };

    

    if (req.params.charityId){
        const { charityId } = req.params;
        data_charity.charityId = charityId;
        var charity = await Charities.findOne({
            where: {
                charityId: charityId
            }
        })
        charity = charity.dataValues;
        if(!title){
            title = charity.title
        }
        if(!description){
            description = charity.description
        }
        if(!goal){
            goal = charity.goal
        }

    } else {
        if(!title){
            return res.status(400).send({
                message: 'Please write the title!'
            })
        }
        if(!description){
            return res.status(400).send({
                message: 'Please write description!'
            })
        }
        if(!goal){
            return res.status(400).send({
                message: 'Please write this goal!'
            })
        }
    }

    if( title.match(RE_HTML_ERROR) || description.match(RE_HTML_ERROR) || goal.match(RE_HTML_ERROR)){
        return res.status(400).send({
            message: 'Dont write HTML Tag on Field'
        });
    };

    if (title.search(re_title) === -1){
        return res.status(412).send({
            message: 'title doesnt match with Format'
        })
    };
    next();
}

const AuthDon = async (req, res, next) => {
    const { donate, paymentId, userId, slug } = req.body;
    if(!req.body.fileName) {
        return res.status(412).send({
            message: 'Image not found!'
        })
    }

    const image = req.body.fileName;

    if ( donate === ''){
        return res.status(400).send({
            message: 'Please write this amount!'
        })
    }

    data_donate = {
        donate, paymentId, userId, image, slug
    };

    next();
}

module.exports = { AuthReg, AuthLog, AuthPay, AuthChar, AuthDon };