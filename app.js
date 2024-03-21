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
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require('mongoose');



mongoose.connect(`mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.xwgcemn.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`);

require("dotenv/config");
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

module.exports = app;