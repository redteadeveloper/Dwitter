import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    currentAccount: {
        type: String,
        required: false,
    }
});

export default mongoose.model('discorddb', schema, 'discorddb');