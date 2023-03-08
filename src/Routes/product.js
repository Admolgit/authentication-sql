const express = require('express');
const productServices = require('../Services/productServices');
const Router = express.Router();

Router.post('/create-product', productServices.createProduct);
Router.get('/products', productServices.getProducts);
Router.post('/update-product/:id', productServices.updateProduct);
Router.get('/product', productServices.getProductByName);
Router.get('/product/:id', productServices.getAProduct);

module.exports = Router;