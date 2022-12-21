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
        const { donate, paymentId, userId, image, slug } = data_donate;

        await Donates.create({ donate, paymentId, userId, image, slug })
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

const GetDonatesBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const donates = await Donates.findAll({
            where: {
                slug: slug
            }
        });
        return res.status(200).json({
            donates: donates
        })
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to retrive Donates',
        });
    }
}


module.exports = { CreateDonates, GetAllDonates, GetDonatesBySlug };