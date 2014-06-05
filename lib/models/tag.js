'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var TagSchema = new Schema({ 
  title:  { type: String, unique: false }, 
  created: {type: Date, required: true, default: Date}, 
  updated: Date, 
  bookmarks:  [ {type : Schema.ObjectId, ref : 'Bookmark'} ],
  user: {type: Schema.ObjectId, ref: 'User'}
 });

TagSchema.pre('remove', function(next){
    this.model('Bookmark').update(
        {_id: {$in: this.bookmarks}}, 
        {$pull: {tags: this._id}}, 
        {multi: true},
        next
    );
});

mongoose.model('Tag', TagSchema);