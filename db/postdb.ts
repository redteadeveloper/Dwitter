import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false,
    },
    like: {
        type: Array,
        required: false,
    },
    comment: {
        type: Array,
        required: false,
    },
});

export default mongoose.model('postdb', schema, 'postdb');