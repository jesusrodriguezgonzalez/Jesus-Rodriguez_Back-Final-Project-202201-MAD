import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwd: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String },
    age: { type: Number },
    phone: { type: Number },
    city: { type: String },
    direction: { type: String },
    apartment_history: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Apartment',
            },
        ],
        default: [],
    },
    current_apartment: { type: String },
    rol: { type: String },
    image: { type: String },
});
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
        delete returnedObject.passwd;
    },
});
export const User = mongoose.model('User', userSchema);
