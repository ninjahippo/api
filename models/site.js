var mongoose = require('mongoose');
var Schema = mongoose.Schema;
      
var siteSchema = new Schema({
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    url: { 
      type: String, 
      required: false 
    },
    application_token: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    api_token: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    }
});
      
var site = mongoose.model('site', siteSchema);
      
module.exports = {
  Site: site
};