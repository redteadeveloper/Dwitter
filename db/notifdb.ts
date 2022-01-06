import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    created: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    target: {
        type: Array,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    read: {
        type: Array,
        required: true,
    }
});

export default mongoose.model('notifdb', schema, 'notifdb');