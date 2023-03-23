const express = require('express');
const authGuard = require('../Auth/auth');
const productServices = require('../Services/productServices');
const Router = express.Router();

Router.post('/create-product', authGuard, productServices.createProduct);
Router.get('/products', authGuard, productServices.getProducts);
Router.put('/update-product/:id', authGuard, productServices.updateProduct);
Router.delete('/delete-product/:id', authGuard, productServices.deleteProduct);
Router.get('/product', authGuard, productServices.getProductByName);
Router.get('/product/:id', authGuard, productServices.getAProduct);

module.exports = Router;