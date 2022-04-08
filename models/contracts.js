import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    user_owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    user_tenant: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    start_date: { type: String },
    end_date: { type: String },
    id_apartment: {
        type: mongoose.Types.ObjectId,
        ref: 'Apartment',
    },
    document: { type: [] },
    fee: { type: Number },
});
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});
export const Contract = mongoose.model('Contract', userSchema);
