const { Donates } = require('../models');

const GetAllDonates = async (req, res) => {
    try {
        const donate = await Donates.findAll();
        res.status(200).json({donate: donate});
    } catch (error) {
        return res.status(400).json({
            message: error
        });
    };
}

const CreateDonates = async (req, res) => {
    try {
        const { charityId } = req.params;
        const { donate, paymentId, userId, transfer } = data_donate;

        await Donates.create({ donate, paymentId, userId, transfer, charityId })
        return res.status(201).json({ 
            message: 'You have succeeded to Donates' 
        });
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to Donates',
        });
    };
};

module.exports = { CreateDonates, GetAllDonates };