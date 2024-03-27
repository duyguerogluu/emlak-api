/*
 *  This file is part of emlak-api.
 *
 *  emlak-api is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  emlak-api is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *   along with emlak-api.  If not, see <https://www.gnu.org/licenses/>.
 */

const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

const authenticateToken = async (req, res, next) => {
    if (process.env.ENABLE_AUTH == 0) {
        return next();
    }

    const noAuthRoutes = [
        '/login',
        '/signup',
    ];

    if (noAuthRoutes.findIndex(v => v == req.path) >= 0) {
        return next();
    }

    try {
        const token = req.cookies.jwt;

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err) => {
                if (err) {
                    console.error(err.toString());
                    return res.status(403).json({ 'error': 'Invalid auth token' })
                } else {
                    req.user = Token.getUserByToken(token);
                    return next();
                }
            })
        } else {
            return res.status(403).json({ 'error': 'No token specified' })
        }
    } catch (error) {
        return res.status(500).json({
            error: 'Server error',
        })
    }
}

module.exports = {
    authenticateToken,
};