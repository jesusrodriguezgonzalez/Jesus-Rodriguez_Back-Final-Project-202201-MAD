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
    status: { type: String },
    priority: { type: String },
    date_created: { type: Date },
    date_closed: { type: Date },
});
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});
export const User = mongoose.model('User', userSchema);
