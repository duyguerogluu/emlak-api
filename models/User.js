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

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

const PhoneSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    verified: { type: Date, default: Date.now() },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    _id: false,
    id: false,
});

const EMailSchema = new mongoose.Schema({
    email: { type: String, required: true },
    verified: { type: Date, default: Date.now() },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    _id: false,
    id: false,
});


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, default: '' },
    password: { type: String, required: true },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
    adverts: [ { type: mongoose.Types.ObjectId, ref: 'Advert' } ],
    orders: [ { type: mongoose.Types.ObjectId, ref: 'Order' } ],
    phone: { type: PhoneSchema },
    email: { type: EMailSchema },
    location: [{
        region: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, default: 'TR' },
        geo: {
            lat: { type: Number, required: true },
            lon: { type: Number, required: true },
        },
    }],
}, { collection: 'User', usePushEach: true });

UserSchema.statics = {
    /** @memberOf User */
    async getUserById(id) {
        return this.findOne({ _id: id })
            .populate([
                {
                    path: 'adverts'
                }
            ]);
    },
}

UserSchema.pre("save", function (next) {
    const user = this;
    user.password = bcrypt.hashSync(user.password, process.env.JWT_SALT);
    console.log(user.password);
    next();
});

/** @class User */
module.exports = mongoose.model("User", UserSchema);