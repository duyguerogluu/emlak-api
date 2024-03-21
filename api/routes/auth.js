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

const router = require('express').Router();
const User = require('../../models/User');
const Token = require('../../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        console.log("req.body", req.body);

        let same = false

        if (user) {
            console.log(req.body.password, user.password);
            same = req.body.password === user.password; // await bcrypt.compare(req.body.password, user.password);
            console.log("same", same);
        } else {
            return res.status(401).json({
                succeded: false,
                error: "There is no such user.",
            });
        }

        if (same) {
           const token = createToken(user._id)
            const maxAge = 1000 * 60 * 60 * 24
            const validTime = Date.now() + maxAge

           res.cookie("jwt", token, {
            httpOnly: true,
               maxAge: maxAge,
           });

            const newTokenObj = Token();
            newTokenObj.username = req.body.username;
            newTokenObj.token = token;
            newTokenObj.valid_time = validTime;
            await newTokenObj.save();

            console.log("same", same);

            return res.status(200).json({
                succeded: true,
                message: 'Logged in successfully!',
                token,
                validTime,
            })
        } else {
            return res.status(401).json({
                succeded: false,
                error: "Password are not macthed.",
            });
        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            succeded: false,
            error,
        })
    }
});

router.post('/signup', async (req, res) => {
    const { username, password, first_name, last_name, phone, email } = req.body;

    console.log("req.body", req.body);

    if (!checkValueIsValid(username) || !checkValueIsValid(password) || !checkValueIsValid(first_name) ||
        !checkValueIsValid(phone) || !checkValueIsValid(email)) {
        return res.status(403).json({
            succeded: false,
            error: 'A required field is not provided properly',
        })
    }

    try {
        const user = await User.findOne({ username: username });
        const phoneUser = await User.findOne({ 'phone.phone': phone });
        const emailUser = await User.findOne({ 'email.email': email });

        if (user || phoneUser || emailUser) {
            return res.status(401).json({
                succeded: false,
                error: 'Username/phone/email exists',
            });
        }

        const newUser = User();
        newUser.username = username;
        newUser.password = password;
        newUser.first_name = first_name;
        newUser.last_name = last_name;
        newUser.phone = { phone: phone, verified: Date.now() };
        newUser.email = { email: email, verified: Date.now() };
        const savedUser = await newUser.save();
        savedUser.password = undefined;

        return res.status(200).json({
            succeded: true,
            message: 'User created successfully',
            user: savedUser,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            succeded: false,
            error,
        })
    }
});

router.post('/logout', async (req, res) => {

});

const checkValueIsValid = (value) => value && value.length > 0

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    })
}

module.exports = router;
