'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Share = new Schema({
    email: String
});
/**
 * Thing Schema
 */
var BookmarkSchema = new Schema({ 
  title: String, 
  description: String,
  url: String,
  created: {type: Date, required: true, default: Date}, 
  updated: Date, 
  count: Number,
  favicon: String,
  tags: [ {type : Schema.ObjectId, ref : 'Tag'} ],
  user: {type: Schema.ObjectId, ref: 'User'},
  shares: [String]
 });

/**
 * Validations
 */
BookmarkSchema.path('count').validate(function (num) {
  return num >= 0;
}, 'Count must be positive');

mongoose.model('Bookmark', BookmarkSchema);
