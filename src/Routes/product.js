const express = require('express');
const Auth = require('../Auth/auth');
const productServices = require('../Services/productServices');
const Router = express.Router();

Router.post('/create-product', productServices.createProduct);
Router.get('/products', Auth, productServices.getProducts);
Router.put('/update-product/:id', productServices.updateProduct);
Router.delete('/delete-product/:id', productServices.deleteProduct);
Router.get('/product', productServices.getProductByName);
Router.get('/product/:id', productServices.getAProduct);

module.exports = Router;