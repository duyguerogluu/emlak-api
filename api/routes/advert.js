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
const express = require('express');
const mongoose = require('mongoose');
const Advert = require('../../models/Advert');
const router = express.Router();

router.get('/advert', async (req, res) => {
    try{
        const advertList = await Advert.find().limit(30);
        res.json(advertList);
    }catch (e){
         res.json(e);
    }
})


router.post('/advert', async (req, res) => {
    //console.log(req.body, "body");
    const advert = new Advert({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        images: req.body.images,
        price: req.body.price,
        advert_type: req.body.advert_type,
        rooms: req.body.rooms,
    });
    await advert.save();
    res.json(advert);
});

router.get('/:advertId', async (req, res) => {
    try {
        const id = req.params.advertId;
        const advert = await Advert.getPopulatedAdvertById(id);
        res.json(advert);
    } catch (e) {
        res.json(e);
    }
});

router.put('/:advertId', async (req, res) => {

    try{
        const updateAdvert = await Advert.findByIdAndUpdate(req.params.advertId, {
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            images: req.body.images,
            price: req.body.price,
            advert_type: req.body.advert_type,
            rooms: req.body.rooms,
        });
        res.json(updateAdvert);
    }catch(e){
        res.json(e);
    }
});

router.delete('/:advertId', async (req, res) => {
    try{
        const deleteAdvert = await Advert.removeAdvertById(req.params.advertId);
       res.json(deleteAdvert);
    }catch(e){
        res.json(e);
    }
});

module.exports = router;