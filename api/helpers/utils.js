const mongoose = require('mongoose');

async function connectToDB(req, res, next) {
    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.xwgcemn.mongodb.net/${process.env.DATABASE_NAME1}?retryWrites=true&w=majority`);
        }

        return next();
    } catch (e) {
        return res.status(500).json({ 'error': e.toString() })
    }
}

module.exports = {
    connectToDB,
};
