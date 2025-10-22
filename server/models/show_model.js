import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
    showName: {
        type: String,
        required: true,
        trim: true
    },
    timing: {
        type: Date,
        required: true
    },
    length: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hall',
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'cancelled', 'completed'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

const Show = mongoose.model('Show', showSchema);

export default Show;