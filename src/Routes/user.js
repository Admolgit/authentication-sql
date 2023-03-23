const express = require('express');
const authGuard = require('../Auth/auth');
const userServices = require('../Services/userServices');
const Router = express.Router();

Router.post('/login', userServices.userLogin);
Router.post('/register', userServices.registerUser);
Router.get('/users', authGuard, userServices.getUser);
Router.get('/:id', authGuard, userServices.getAUser);

module.exports = Router;