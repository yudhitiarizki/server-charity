const { Users, Charities, Donates, Payments } = require('../models');


const GetCharities = async (req, res) => {
    try {
        const donates = await Donates.findAll();

        var charities = await Charities.findAll({
            include: [{
                model: Users,
                attributes: ['firstName', 'lastName', 'email']
            }],
            order: [
                ['createdAt', 'DESC']
            ]
        });

        charities = charities.map((charity) => {
            charity = charity.dataValues;
            charity.User = charity.User.dataValues;
            var raise = 0;
            donates.forEach(donate => {
                if(donate.slug === charity.slug){
                    raise += donate.donate;
                };
            });
            return {
                ...charity,
                raise: raise
            }
        })

        return res.status(200).json({ charities: charities });
        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to retrieve Charity.',
        });
    };
};

const GetCharitiesBySlug = async (req, res) => {
    try {
        const donates = await Donates.findAll();
        const { slug } = req.params; 

        var charities = await Charities.findOne({
            include: [{
                model: Users,
                attributes: ['firstName', 'lastName', 'email']
            }],
            where: {
                slug: slug
            }
        });

        charities = charities.dataValues;
        charities.User = charities.User.dataValues;

        const payment = await Payments.findAll({
            where: {
                userId: charities.userId
            }
        })

        
        var raise = 0;
        donates.forEach(donate => {
            if(donate.charityId === charities.charityId){
                raise += donate.donate;
            };
        });

        charities.raise = raise;
        charities.payments = payment;

        return res.status(200).json({ charities: charities });
        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to retrieve Charity.',
        });
    };
};

const GetCharitiesByUserId = async (req, res) => {
    try {
        const { userId } = data_user;
        const donates = await Donates.findAll();

        var charities = await Charities.findAll({
            include: [{
                model: Users,
                attributes: ['firstName', 'lastName', 'email']
            }],
            where: {
                userId: userId
            }
        });

        charities = charities.map((charity) => {
            charity = charity.dataValues;
            charity.User = charity.User.dataValues;
            var raise = 0;
            donates.forEach(donate => {
                if(donate.charityId === charity.charityId){
                    raise += donate.donate;
                };
            });
            return {
                ...charity,
                raise: raise
            }
        })

        return res.status(200).json({ charities: charities });
        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to retrieve Charity.',
        });
    };
}

const CreateCharities = async (req, res) => {
    try {
        const { userId } = data_user;
        const { title, description, goal, slug, image } = data_charity;

        await Charities.create({ userId, title, description, goal, slug, image })

        return res.status(201).json({ 
            message: 'You have succeeded in creating a charity.' 
        });
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to create charity',
        });
    }
}

const UpdateCharities = async (req, res) => {
    try {
        const { userId } = data_user;
        const { charityId, title, description, goal, slug, image } = data_charity; 

        const updateCount = await Charities.update(
            { title, description, goal, slug, image },
            { where: { charityId, userId } }
        );

        if (updateCount < 1) {
            return res.status(401).json({
            message: 'Charity not Update',
            });
        };
        return res.status(200).json({ message: 'Charity has been Update' });

    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to update charity',
        });
    };
};

const DeleteCharities = async (req, res) => {
    try {

        const { charityId } = req.params;
        const deleteCount = await Charities.destroy({ 
            where: { 
                charityId: charityId 
            } 
        });

        if (deleteCount < 1) {
            return res.status(401).json({
              message: 'The Charity was not properly deleted.',
            });
        }

        return res.status(201).json({ message: 'Charity deleted.' });
        
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        return res.status(400).json({
          message: 'Failed to delete charity',
        });
    };
};

module.exports = { GetCharities, GetCharitiesBySlug, GetCharitiesByUserId, CreateCharities, UpdateCharities, DeleteCharities };