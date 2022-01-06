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
    displayname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    login: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    follower: {
        type: Array,
        required: false,
    },
    following: {
        type: Array,
        required: false,
    },
});

export default mongoose.model('accountdb', schema, 'accountdb');