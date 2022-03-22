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
        pepe: 'pepe',
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
