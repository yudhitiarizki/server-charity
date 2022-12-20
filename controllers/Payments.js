const { Users, Payments, Charities } = require('../models');


const GetPayments = async (req, res) => {
    try {
        const payment = await Payments.findAll();
        res.status(200).json({payment: payment});
    } catch (error) {
        return res.status(400).json({
            message: error
        });
    };
};

const GetPaymentsById = async (req, res) => {
    try {
        const { userId } = req.params;
        const payment = await Payments.findAll({
            where: {
                userId: userId
            }
        });
        res.status(200).json({payment: payment});
    } catch (error) {
        return res.status(400).json({
            message: error
        });
    };
};


const CreatePayments = async (req, res) => {
    const { userId } = data_user;
    const { method, number, username } = data_payment;

    try {
        await Payments.create({
            userId, method, number, username
        });
        res.json({message: "Payments has been Created"});
        
    } catch (error) {
        return res.status(400).send({
            message: error
        });
    };
};

const UpdatePayments = async (req, res) => {
    try {
        const { userId } = data_user;
        const { paymentId, method, number, username } = data_payment;

        const updateCount = await Payments.update(
            { method, number, username },
            { where: { paymentId, userId } }
        );

        if (updateCount < 1) {
            return res.status(401).json({
            message: 'Payment not Change',
            });
        };
        return res.status(200).json({ message: 'Payment has been Update' });
    } catch (error) {
        return res.status(400).send({
            message: error
        });
    };
};

const DeletePayments = async (req, res) => {
    try {

        const { paymentId } = req.params;
        const deleteCount = await Payments.destroy({ 
            where: { 
                paymentId: paymentId 
            } 
        });

        if (deleteCount < 1) {
            return res.status(401).json({
              message: 'The payment was not properly deleted.',
            });
        }

        return res.status(201).json({ message: 'Payment deleted.' });
        
    } catch (error) {
        return res.status(400).send({
            message: error
        });
    };
}

const GetPaymentsBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        var charities = await Charities.findOne({
            where: {
                slug: slug
            }
        });

        const payment = await Payments.findAll({
            where: {
                userId: charities.userId
            }
        })

        return res.status(200).json({
            payments: payment
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to retrieve Payments',
        });
    }
}


module.exports = { CreatePayments, UpdatePayments, GetPayments, GetPaymentsById, DeletePayments, GetPaymentsBySlug };