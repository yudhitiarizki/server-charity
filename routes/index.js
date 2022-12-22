const express = require("express");

// Middleware
const { AuthReg, AuthLog, AuthPay, AuthChar, AuthDon } = require('../middleware/AuthBody');
const AuthToken = require('../middleware/AuthToken');

const FileUploads = require('../middleware/FileUploads');
const UploadFile = require('../middleware/UploadFile');

//function Routes
const { Register, Login } = require('../controllers/Users');
const { CreatePayments, UpdatePayments, GetPayments, GetPaymentsById, DeletePayments, GetPaymentsBySlug } = require('../controllers/Payments');
const { GetCharities, GetCharitiesBySlug, GetCharitiesByUserId, CreateCharities, UpdateCharities, DeleteCharities } = require('../controllers/Charities');
const { CreateDonates, GetAllDonates, GetDonatesBySlug } = require('../controllers/Donates');
const RefreshToken = require('../controllers/RefreshToken');

const router = express.Router();
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//Routes

// User
router.post('/register', AuthReg, Register);
router.post('/login', AuthLog, Login);
router.get('/refreshtoken', AuthToken, RefreshToken);

// Payment
router.get('/payment', GetPayments);
router.post('/payment', AuthToken, AuthPay, CreatePayments);
router.get('/payment/:userId', AuthToken, GetPaymentsById);
router.put('/payment/:paymentId', AuthToken, AuthPay, UpdatePayments);
router.delete('/payment/:paymentId', AuthToken, DeletePayments);
router.get('/payment-slug/:slug', GetPaymentsBySlug);

// Charity
router.get('/charity', GetCharities);
router.get('/charity/:slug', GetCharitiesBySlug);
router.get('/charity-user', AuthToken, GetCharitiesByUserId);
router.post('/charity', AuthToken, UploadFile, AuthChar, CreateCharities );
router.put('/charity/:charityId', AuthToken, FileUploads, AuthChar, UpdateCharities);
router.delete('/charity/:charityId', AuthToken, DeleteCharities);

// Donate
router.post('/donate', UploadFile, AuthDon, CreateDonates);
router.get('/donate', GetAllDonates);
router.get('/donate/:slug', GetDonatesBySlug);

module.exports = router;