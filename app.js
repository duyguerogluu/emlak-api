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
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require("cors");
app.use(cors());

require("dotenv/config");

const { connectToDB } = require('./api/helpers/utils');
app.use(connectToDB);

const { authenticateToken } = require('./middlewares/authmiddleware');
app.use(authenticateToken);

const advertRoutes = require('./api/routes/advert');
const userRoutes = require('./api/routes/user');
const authRoutes = require('./api/routes/auth');
app.use('/', authRoutes);
app.use('/adverts', advertRoutes);
app.use('/users', userRoutes);

module.exports = app;