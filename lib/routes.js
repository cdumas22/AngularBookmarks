'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware'),
    tags = require('./controllers/Tag'),
    bookmarks = require('./controllers/Bookmark');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);
 
    app.get('/api/bookmarks', middleware.auth, bookmarks.findAll);
    app.get('/api/bookmarks/:id', middleware.auth, bookmarks.findOne);
    app.post('/api/bookmarks', middleware.auth, bookmarks.add);
    app.put('/api/bookmarks/:id', middleware.auth, bookmarks.update);
    app.delete('/api/bookmarks/:id', middleware.auth, bookmarks.delete);
    
    app.get('/api/tags', middleware.auth, tags.findAll);
    app.get('/api/tags/:id', middleware.auth, tags.findOne);
    app.post('/api/tags', middleware.auth, tags.add);
    app.put('/api/tags/:id', middleware.auth, tags.update);
    app.delete('/api/tags/:id', middleware.auth, tags.delete);
    
    
  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/main*',middleware.auth, index.partials.main);
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};