import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type_incidence: {
        type: String,
        required: true,
        enum: ['Administrative', 'Break', 'Paid'],
    },
    id_apartment: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Apartment',
            },
        ],
    },
    id_user: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open',
        required: true,
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium',
        required: true,
    },
    date_created: { type: Date },
    date_closed: { type: Date },
});
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});
export const Incident = mongoose.model('Incident', userSchema);
