var _ = require("underscore");
var mongoose = require('mongoose'),
    Bookmark = mongoose.model('Bookmark');

var ObjectId = mongoose.Types.ObjectId; 


exports.removeFollowing = function(req, res) {
    Bookmark.findById(req.params.id, function(err, bookmark){
        var shares = _.without(bookmark.shares, req.user.email);;
        Bookmark.update({_id: bookmark.id}, {$set: {shares: shares}}, function(err, resp){
            if (err) return res.json(400, err);
            res.send(200);
        }); 
    });
};

exports.findAll = function(req, res) {
    Bookmark.find().or([{user: req.user},{shares: req.user.email}]).populate('user', '_id name email').populate('tags', '_id title').exec(function(err, resp) {
        if (err) return res.json(400, err);
        res.send(resp);
    });
};
exports.findOne = function(req,res) {
    Bookmark.findOne({_id: req.params.id, user: req.user}).populate('user', '_id name email').populate('tags', '_id title').exec(function(err, resp) {
        if (err) return res.json(400, err);
        res.send(resp);
    });
};
exports.add = function(req,res) {
    var b = req.body;
    b.tags = _.pluck(b.tags, '_id');
    
    var newBookmark = new Bookmark(_.omit(b, ['user']));
    newBookmark.user = req.user;
    
    newBookmark.save(function(err, resp) {
        if (err) return res.json(400, err);
        res.send(resp);
    });
};
exports.update = function(req,res) {
    Bookmark.findById(req.params.id, function (err, bookmark) {
        if (err) return res.json(400, err);
        console.log(bookmark.user.id, bookmark.user._id, new ObjectId(bookmark.user.id));
        var bookmarkUser = new ObjectId(bookmark.user.id);
        if(!bookmarkUser.equals(req.user._id)) return res.json(401, 'unauthorized');
        var newBookmark = _.omit(req.body, ['user', '_id']);
        
        newBookmark.updated = new Date();
        newBookmark.user = req.user;
        newBookmark.tags = _.pluck(newBookmark.tags, '_id');
        
        bookmark = _.extend(bookmark, newBookmark);
        
        bookmark.save(function (err) {
            if (err) return res.json(400, err);
            Bookmark.findOne({_id: bookmark._id, user: req.user}).populate('user', '_id name email').populate('tags', '_id title').exec(function(err, resp) {
                if (err) return res.json(400, err);
                res.send(resp);
            });
        });
    });
};
exports.delete = function(req,res) {
    var id = req.params.id;
    Bookmark.findById(id, function(err, bookmark){
        var bookmarkUser = new ObjectId(bookmark.user.id);
        if(!bookmarkUser.equals(req.user._id)) return res.json(401, 'unauthorized');
        Bookmark.remove({_id: req.params.id}, function(err, resp){
            if(err) return res.json(400, err);
            res.send('success');
        });
    });
};
/*exports.findAll = function(req, res) {
    console.log(req.user._id.toString());
    bookmarkdb.find({_userId: req.user._id.toString()},function (err, items) {
        res.send(items);
    });
};*/
/*exports.findOne = function(req, res) {
    
    var id = req.params.id;
    console.log('Retrieving bookmark: ' + id);
    bookmarkdb.findOne({ '_id': id,"_userId": req.user._id.toString() }, function (err, item) {
        res.send(item);
    });
};*/
/*exports.add = function(req, res) {
    var bookmark = req.body;
    bookmark.created = new Date();
    bookmark._userId = req.user._id.toString();
    console.log('Adding bookmark: ' + JSON.stringify(bookmark));
    bookmarkdb.insert(bookmark, function (err, result) {
        if (err) {
            res.send({ 'error': 'An error has occurred' });
        } else {
            console.log('Success: ' + JSON.stringify(result));
            res.send(result);
        }
    });
};*/
/*exports.update = function(req, res) {
    var id = req.params.id;
    var bookmark = req.body;
    if (bookmark.lock === "false") {
        bookmark.lock = false;
    }
    if (bookmark.lock === "true") {
        bookmark.lock = true;
    }
    bookmark.updated = new Date();
    bookmark._userId = req.user._id.toString();
    console.log('Updating bookmark: ' + id);
    bookmarkdb.update({ '_id': id }, bookmark, { safe: true }, function (err, result) {
        if (err) {
            console.log('Error updating bookmark: ' + err);
            res.send({ 'error': 'An error has occurred' });
        } else {
            console.log('' + result + ' document(s) updated');
            bookmark._id = id;
            res.send(bookmark);
            bookmarkdb.persistence.compactDatafile();
        }
    });
};*/
/*exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting bookmark: ' + id);
    bookmarkdb.remove({ '_id': id }, { safe: true }, function (err, result) {
        if (err) {
            res.send({ 'error': 'An error has occurred - ' + err });
        } else {
            console.log('' + result + ' Bookmark document(s) deleted');
            res.send({ 'success': result + ' Bookmark(s) deleted'});
            bookmarkdb.persistence.compactDatafile();
        }
    });
};*/

