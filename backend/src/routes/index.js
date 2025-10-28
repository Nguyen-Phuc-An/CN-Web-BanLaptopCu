const express = require('express');
const usersCtrl = require('../controllers/usersController');
const categoriesCtrl = require('../controllers/categoriesController');
const productsCtrl = require('../controllers/productsController');
const ordersCtrl = require('../controllers/ordersController');
const reviewsCtrl = require('../controllers/reviewsController');
const wishlistsCtrl = require('../controllers/wishlistsController');
const messagesCtrl = require('../controllers/messagesController');
const authRoutes = require('./auth');

const router = express.Router();

/* Users */
router.post('/users', usersCtrl.create);
router.get('/users/:id', usersCtrl.getOne);
router.put('/users/:id', usersCtrl.update);
router.delete('/users/:id', usersCtrl.remove);

/* Categories */
router.post('/categories', categoriesCtrl.create);
router.get('/categories', categoriesCtrl.list);
router.get('/categories/:id', categoriesCtrl.getOne);
router.put('/categories/:id', categoriesCtrl.update);
router.delete('/categories/:id', categoriesCtrl.remove);

/* Products */
router.post('/products', productsCtrl.create);
router.get('/products', productsCtrl.list);
router.get('/products/:id', productsCtrl.getOne);
router.put('/products/:id', productsCtrl.update);
router.delete('/products/:id', productsCtrl.remove);

/* Orders */
router.post('/orders', ordersCtrl.create);
router.get('/orders/:id', ordersCtrl.getOne);
router.get('/users/:userId/orders', ordersCtrl.listForUser);
router.put('/orders/:id/status', ordersCtrl.updateStatus);
router.delete('/orders/:id', ordersCtrl.remove);

/* Reviews */
router.post('/reviews', reviewsCtrl.createOrUpdate);
router.get('/products/:productId/reviews', reviewsCtrl.listByProduct);
router.delete('/products/:productId/reviews/:userId', reviewsCtrl.remove);

/* Wishlists */
router.post('/wishlists', wishlistsCtrl.add);
router.get('/users/:userId/wishlists', wishlistsCtrl.list);
router.delete('/users/:userId/wishlists/:productId', wishlistsCtrl.remove);

/* Messages */
router.post('/messages', messagesCtrl.send);
router.get('/messages/conversation/:userA/:userB', messagesCtrl.conversation);
router.put('/messages/mark-read', messagesCtrl.markRead);

// mount auth
router.use('/auth', authRoutes);

module.exports = router;