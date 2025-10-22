import mongoose from 'mongoose';
import Show from './show_model.js';
import Hall from './hall_model.js';
import Seat from './seat_model.js';

const ticketSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['booked', 'cancelled', 'completed'],
        default: 'booked'
    },
    seats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat',
        required: true,
    }],
    hall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hall',
        required: true
    }
}, { timestamps: true });

ticketSchema.pre('save', async function (next) {
    if (this.isNew) {
        const show = await Show.findById(this.show);
        const hall = await Hall.findById(show.hall);
        const seats = await Seat.find({ _id: { $in: this.seats } });

        this.totalPrice = seats.reduce((total, seat) => {
            const seatTypePrice = hall.seatTypes.find(st => st.type === seat.type)?.price || 0;
            return total + seatTypePrice;
        }, 0);
    }
    next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;