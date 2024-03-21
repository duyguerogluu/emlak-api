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


const mongoose = require('mongoose');
const User = require('./User');
const Photo = require('./Photo');

const AdvertSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: null },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    images: [ { type: mongoose.Types.ObjectId, ref: 'Photo' } ],
    location: {
        region: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, default: 'TR' },
        geo: {
            lat: { type: Number, required: true },
            lon: { type: Number, required: true },
        },
    },
    price: {
        amount: { type: Number, required: true },
        currency: { type: String, default: 'TRY' },
    },
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() },

    /* Advert status
     *
     * 0 - IN REVIEW
     * 1 - ACCEPTED
     * 2 - REJECTED
     */
    status: { type: Number, enum: [0, 1, 2], default: 0 },
    status_changer: {
        author: { type: mongoose.Types.ObjectId, ref: 'User' },
        reason: { type: String, default: null },
        changed: { type: Date, required: true },
    },
    advert_id: { type: Number, required: true },
    advert_type: { type: String, required: true },
    m2_gross: { type: Number, required: true },
    m2_net: { type: Number, required: true },
    rooms: {
        living_room: { type: Number, required: true },
        bath: { type: Number, required: true },
        toilet: { type: Number, required: true },
        other: { type: Number, required: true },
    },
    apartment_floor: { type: Number, default: 0 },
    apartment_total_floor: { type: Number, default: 0 },
    heating_type: { type: String, default: null },
    in_site: { type: Boolean, default: false },
    site_name: { type: String, default: null },
}, { collection: 'Advert', usePushEach: true });

AdvertSchema.statics = {
    /** @memberOf Advert */
    async removeAdvertById(id) {
        return this.deleteOne({ _id: id });
    },

    /** @memberOf Advert */
    async findAdvertsByUid(uid) {
        return this.find({ author: uid })
            .populate([
                {
                    path: 'author',
                },
                {
                    path: 'status_changer',
                    populate: [
                        {
                            path: 'author',
                        }
                    ],
                },
                {
                    path: 'images',
                },
            ]);
    },
};

/** @class Advert */
module.exports = mongoose.model('Advert', AdvertSchema);
