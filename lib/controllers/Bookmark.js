var _ = require("underscore");

exports.findAll = function(req, res) {
    console.log(req.user._id.toString());
    bookmarkdb.find({_userId: req.user._id.toString()},function (err, items) {
        res.send(items);
    });
};
exports.findOne = function(req, res) {
    
    var id = req.params.id;
    console.log('Retrieving bookmark: ' + id);
    bookmarkdb.findOne({ '_id': id,"_userId": req.user._id.toString() }, function (err, item) {
        res.send(item);
    });
};
exports.add = function(req, res) {
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
};
exports.update = function(req, res) {
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
};
exports.delete = function(req, res) {
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
};

