import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    direction: { type: String, required: true },
    cp: { type: Number, required: true },
    province: { type: String, required: true },
    current_tenant: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    history_tenant: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
        default: [],
    },
    status: {
        type: String,
        required: true,
        enum: ['Leased', 'Available'],
        default: 'Available',
    },
    photos: [],
    incidents: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Incident',
            },
        ],
        default: [],
    },
    owner: { type: String, required: true },
});
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});
export const Apartment = mongoose.model('Apartment', userSchema);
