var _ = require('underscore');
var mongoose = require('mongoose'),
    Tag = mongoose.model('Tag');

exports.findAll = function(req, res) {
    Tag.find({user: req.user}, '_id title').exec(function(err, resp) {
        if (err) return res.json(400, err);
        res.send(resp);
    });
};
exports.findOne = function(req,res) {
    Tag.findOne({_id: req.params.id, user: req.user}, '_id title').exec(function(err, resp) {
        if (err) return res.json(400, err);
        res.send(resp);
    });
};
exports.add = function(req,res) {
    var newTag = new Tag(req.body);
    newTag.user = req.user;
    newTag.save(function(err) {
        if (err) return res.json(400, err);
        res.send(newTag);
    });
};
exports.update = function(req,res) {
    Tag.findById(req.params.id, function (err, tag) {
        if (err) return res.json(400, err);
        var newTag = _.omit(req.body, ['user', '_id']);
        
        newTag.updated = new Date();
        newTag.user = req.user;

        tag = _.extend(tag, newTag);
        
        tag.save(function (err) {
            if (err) return handleError(err);
            res.send(tag);
        });
    });
};
exports.delete = function(req,res) {
    var id = req.params.id;
    Tag.remove({_id: req.params.id}, function(err, resp){
        if(err) return res.json(400, err);
        res.send('success');
    });
};



/*

exports.findAll = function (req, res) {
    tagdb.find({"_userId": req.user._id.toString()},function (err, items) {
        res.send(items);
    });
};
exports.findOne = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving tag: ' + id);
    tagdb.findOne({ '_id': id,"_userId": req.user._id.toString() }, function (err, item) {
        res.send(item);
    });
};
exports.add = function (req, res) {
    var tag = req.body;
    console.log('Adding tag: ' + JSON.stringify(tag));
    tag._userId = req.user._id.toString();
    tagdb.insert(tag, function (err, result) {
        if (err) {
            res.send({ 'error': 'An error has occurred' });
        } else {
            console.log('Success: ' + JSON.stringify(result));
            res.send(result);
        }
    });
};
exports.update = function (req, res) {
    var id = req.params.id;
    var tag = req.body;
    tag.updated = new Date();
    tag._userId = req.user._id.toString();
    console.log('Updating tag: ' + id);
    tagdb.update({ '_id': id }, tag, { safe: true }, function (err, result) {
        if (err) {
            console.log('Error updating: ' + err);
            res.send({ 'error': 'An error has occurred' });
        } else {
            console.log('' + result + ' document(s) updated');
            tag._id = id;
            res.send(tag);
            updateTagOnBookmarks(tag);
            tagdb.persistence.compactDatafile();
        }
    });
};
exports.delete = function (req, res) {
    var id = req.params.id;
    console.log('Deleting tag: ' + id);
    tagdb.remove({ '_id': id }, { safe: true }, function (err, result) {
        if (err) {
            res.send({ 'error': 'An error has occurred - ' + err });
        } else {
            console.log('' + result + ' tag document(s) deleted');
            removeTagFromBookmarks(id);
            res.send({ 'success': result + ' tag(s) deleted'});
            tagdb.persistence.compactDatafile();
        }
    });
};

function updateTagOnBookmarks(tag) {
    bookmarkdb.find({},function(err, bookmarks) {
        _.each(bookmarks, function(bookmark) {
            if(_.contains(_.pluck(bookmark.tags, "_id"), tag._id)) {
                bookmark.tags = _.reject(bookmark.tags, function(t) { return t._id === tag._id });
                bookmark.tags.push(tag);
                bookmarkdb.update({ '_id': bookmark._id },bookmark, {safe:true});
            }
        });
    });
}

function removeTagFromBookmarks(id) {
    bookmarkdb.find({},function (err, bookmarks) {
        _.each(bookmarks, function(bookmark) {
            if(_.contains(_.pluck(bookmark.tags, '_id'), id)){
                bookmark.tags = _.reject(bookmark.tags, function(tag) {
                    return tag._id === id 
                });
                console.log(JSON.stringify(bookmark.tags));
                bookmarkdb.update({ '_id': bookmark._id }, bookmark, { safe: true }, function (err, result) {
                    if (err) {
                        console.log('Error removing tag from bookmark: ' + err);
                    } else {
                        console.log('removed tag from bookmark:' + bookmark._id + ' : tag: ' + id);
                    }
                });
            } 
        });
        bookmarkdb.persistence.compactDatafile();
    });
}
*/
