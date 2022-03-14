import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type_incidence: { type: String, required: true },
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
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium',
    },
    date_created: { type: Date },
    date_closed: { type: Date },
});
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});
export const User = mongoose.model('User', userSchema);
