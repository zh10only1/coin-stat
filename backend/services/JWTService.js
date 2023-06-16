const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = require('../config/environment');
const RefreshToken = require('../models/token');

class JWTService {
    // sign access token
    static signAccessToken(payload, expiryTime) {
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: expiryTime});
    }
    
    // sign refresh token
    static signRefreshToken(payload, expiryTime) {
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: expiryTime});
    }

    // verify access token
    static verifyAccessToken(token) {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    }

    // verify refresh token
    static verifyRefreshToken(token) {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    }

    // store refresh token
    static async storeRefreshToken(token, userId) {
        try {
            const newToken = new RefreshToken({
                token: token,
                userId: userId
            });

            await newToken.save();
        } catch (error) {
            console.log(error);
        }
    }

    static async updateRefreshToken(token, userId) {
        try {
            await RefreshToken.updateOne({
                userId:userId
            },
            {token: token},
            {upsert: true});

        } catch(error) {
            console.log(error);
        }
    }

}

module.exports = JWTService;