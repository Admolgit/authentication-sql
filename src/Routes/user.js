const express = require('express');
const userServices = require('../Services/userServices');
const Router = express.Router();

Router.post('/login', userServices.userLogin);
Router.post('/register', userServices.registerUser);
Router.get('/users', userServices.getUser);
Router.get('/:id', userServices.getAUser);

module.exports = Router;