var mongoose = require('mongoose');
var Schema = mongoose.Schema;
      
var pageSchema = new Schema({
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    site_slug: {
      type: String,
      required: true
    },
    html: {
      type: String,
      required: true
    },
    deletable: {
      type: Boolean,
      default: true
    },
    slug: {
      type: String,
      required: true
    }
});
      
var page = mongoose.model('page', pageSchema);
      
module.exports = {
  Page: page
};