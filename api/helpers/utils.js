const mongoose = require('mongoose');

// Rastgele harflerden bir String olustur ve geri don
function makeID(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

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
    makeID,
    connectToDB,
};
