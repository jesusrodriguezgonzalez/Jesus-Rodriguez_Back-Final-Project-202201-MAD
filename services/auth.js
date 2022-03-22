import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @author Jesus Rodriguez
 * @param {string} user
 * @returns Returns an encrypted string, JWT token
 * @description
 */
export function createToken(user) {
    const tokenPayload = {
        email: user.email,
        id: user.id,
        name: user.name,
        surname: user.surname,
        age: user.age,
        phone: user.phone,
        city: user.city,
        direction: user.direction,
        current_apartment: user.current_apartment,
        apartments_owner: user.apartments_owner,
        image: user.image,
        rol: user.rol,
    };
    const secret = process.env.SECRET;
    return jwt.sign(tokenPayload, secret);
}

export function verifyToken(token) {
    const secret = process.env.SECRET;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return error.message;
    }
}
