const { sign } = require('jsonwebtoken');

const createAccessToken = userId => {
    return sign({userID}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    })
};

const createRefreshToken = userId => {
    return sign({userID}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '15m',
    })
};

module.export = {
    createAccessToken,
    createRefreshToken
}