import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    date_created: { type: Date, default: new Date() },
    incident_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Incident',
    },
    text: { type: String, required: true },
});
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});
export const Comment = mongoose.model('Comment', userSchema);
