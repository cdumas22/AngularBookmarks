'use strict';

var index = require('./controllers'),
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
 
  app.route('/api/bookmarks')
    .all( middleware.auth)
    .get(bookmarks.findAll)
    .post(bookmarks.add);
  app.route('/api/bookmarks/:id')
    .all( middleware.auth)
    .get(bookmarks.findOne)
    .put(bookmarks.update)
    .delete(bookmarks.delete);
  app.route('/api/bookmarks/removeFollowing/:id')
    .all( middleware.auth)
    .delete(bookmarks.removeFollowing);
    
  app.route('/api/tags')
    .all( middleware.auth)
    .get(tags.findAll)
    .post(tags.add);
  app.route('/api/tags/:id')
    .all( middleware.auth)
    .get(tags.findOne)
    .put(tags.update)
    .delete(tags.delete);
    
    
  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });
  
  app.route('/app*', middleware.auth, index.index);
    
  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/bookmarks/*', middleware.auth, index.partials.bookmarks);
    
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};