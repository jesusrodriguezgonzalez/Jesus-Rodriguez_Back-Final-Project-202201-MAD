import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    direction: { type: String, required: true },
    cp: { type: Number, required: true },
    province: { type: String, required: true },
    alias: { type: String },
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
        enum: ['Alquilada', 'Disponible'],
        default: 'Disponible',
    },
    photos: {
        type: String,
        default:
            'https://us.123rf.com/450wm/infinityyy/infinityyy1911/infinityyy191100073/133539567-icono-de-casa-vector-s%C3%ADmbolo-de-logotipo-plano-simple.jpg?ver=6',
    },
    incidents: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Incident',
            },
        ],
        default: [],
    },
    // owner: { type: String },
    owner: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
});
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v;
    },
});
export const Apartment = mongoose.model('Apartment', userSchema);
