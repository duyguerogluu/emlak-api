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
const Photo = require('../../models/Photo');
const router = express.Router();
const fs = require('fs');
const { makeID } = require('../helpers/utils');

const dir = './upload/advert';

router.get('/', async (req, res) => {
    try{
        const advertList = await Advert.find().limit(30);
        res.json(advertList);
    }catch (e){
         res.json(e);
    }
})


router.post('/', async (req, res) => {
    const model = req.body;

    // delete unwanted variables from model
    delete model._id;
    delete model.status;
    delete model.status_changer;
    delete model.created;
    delete model.modified;

    const advert = new Advert(model);
    await advert.save();
    res.json(advert);
});

router.get('/:advertId', async (req, res) => {
    try {
        const advert = await Advert.getPopulatedAdvertById(req.params.advertId);
        res.json(advert);
    } catch (e) {
        res.json(e);
    }
});

router.get('/images', async (req, res) => {
    const input = req.body.images;

    // Girdi eger yoksa ya da liste degilse 403 dondur
    if (!input || !Array.isArray(input)) {
        return res.status(403).json({ 'error': 'Forbidden' })
    }

    try {
        // Yukleme klasoru yoksa hata dondur
        if (!fs.existsSync(dir)) {
            return res.status(404).json({ 'error': 'Not found' });
        }

        var images = {}
        for (let i = 0; i < input.length; i++) {
            const photoId = input[i];
            const photoObj = await Photo.getPopulatedPhotoById(photoId);
            if (!photoObj) {
                continue;
            }

            const filename = `${dir}/${photoObj.path}`;
            if (!fs.existsSync(filename)) {
                continue;
            }

            const data = fs.readFileSync(filename);
            images[id] = data.toString('base64');
        }

        if (images.length < 1) {
            return res.status(404).json({ 'error': 'Not found' });
        }

        return res.status(200).json(images);
    } catch (e) {
        console.log(e)
        return res.status(500).json({ 'error': e.toString() })
    }
});

router.put('/images', async (req, res) => {
    const input = req.body.images;

    // Girdi eger yoksa ya da liste degilse 403 dondur
    if (!input || !Array.isArray(input) || !req.user) {
        return res.status(403).json({ 'error': 'Forbidden' })
    }

    try {
        // Klasor yoksa olustur
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Dosyanin olup olmama durumuna gore dosya adi belirle (dosya uzunlugu 64 karakter)
        function safeMakeID() {
            let filename = null

            do {
                const id = makeID(64)
                filename = `${dir}/${id}`
            } while (!fs.existsSync(filename))

            return filename;
        }

        // Gelen dosyalari kaydet
        var images = []
        for (let i = 0; i < input.length; i++) {
            // Dosya konumunu getir
            const filename = safeMakeID()

            // Base64 -> veri cevrimi
            const item = input[i].bytes
            const buff = Buffer.from(item, 'base64')
            const text = buff.toString('binary')

            // Dosyaya kaydet
            fs.writeFileSync(filename, text)

            // Resmin dosya yolunu parcalara ayir ve dosya adini listeye kaydet
            const routeWays = filename.split('/')
            const lastSplit = routeWays[routeWays.length - 1]

            const photoObj = new Photo({
                type: 'advert',
                path: lastSplit,
                user: req.user,
            });
            const savedPhotoObj = await photoObj.save();
            images.push(savedPhotoObj._id);
        }

        return res.status(200).json({ images })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ 'error': e.toString() })
    }
});

/*
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
*/

router.delete('/:advertId', async (req, res) => {
    try{
        const deleteAdvert = await Advert.removeAdvertById(req.params.advertId);
       res.json(deleteAdvert);
    }catch(e){
        res.json(e);
    }
});

module.exports = router;