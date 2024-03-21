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
const User = require('../../models/User');
const router = express.Router();

/*
router.get('/dashboard ',autmiddleware.authenticateToken, (req, res, next) => {
    res.render('dashboard',{
        link:'dashboard',
    });
});
*/


/*
router.post('/logout', AuthUtils.checkJWT, (req, res, next) => {

});
*/

router.get('/', async (req, res) => {
    try{
        const userList = await User.find().limit(10);
        res.json(userList);
    }catch (e){
         res.json(e);
    }
});

/*
router.post('/', (req, res) => {
    //console.log(req.body, "body");
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    user.save(); //db save
    //res.status(200).json({message: 'Products create ekranında POST requesti çalıştı.'});
    res.json(user);
});

router.get('/:userId', async (req, res) => {
    try {
        const id = req.params.userId;
        const user = await User.findById(id);
        res.json(user);
    } catch (e) {
        res.json(e);
    }
});

router.put('/:userId', (req, res) => {

    try{
        const updateUser = User.findByIdAndUpdate(req.params.userId, {
            username: req.body.username,
            password: req.body.password,
        });
        res.json(updateUser);
    }catch(e){
        res.json(e);
    }
});


router.delete('/:userId', (req, res) => {
    try{
       const deleteUser = User.findByIdAndDelete(req.params.userId);
       res.json(deleteUser);
    }catch(e){
        res.json(e);
    }
});
*/

module.exports = router;
