var express = require('express');
var router = express.Router();
var Site = require('../models/site').Site;
var Page = require('../models/page').Page;
var crypto = require('crypto');

router.route('/sites')
.get(function(req, res) {
  Site.find({
    api_token: req.query.api_token
  }, function(err, docs) {
    if(!err) {
      res.json(200, docs);
    } else {
      res.json(500, { 
        message: err 
      });
    }
  });
})
.post(function(req, res) {
  var site = {
    title: req.body.title,
    url: req.body.url,
    app_token: undefined,
    api_token: req.query.api_token,
    slug: req.body.title.trim().replace(/[^a-zA-Z0-9-\s]/g, '').replace(/[^a-zA-Z0-9-]/g, '_').toLowerCase()
  }

  crypto.randomBytes(24, function(ex, buf) {
    site.app_token = buf.toString('hex');
  });

  Site.findOne({
    slug: site.slug,
    application_token: site.app_token
  }, function(err, doc) {
    if (!err && !doc) {

      var newSite = new Site();
      newSite.title = site.title;
      newSite.url = site.url;
      newSite.application_token = site.app_token;
      newSite.api_token = site.api_token;
      newSite.slug = site.slug

      newSite.save(function(err) {
        if (!err) {
          res.json(201, newSite);
        } else {
          res.json(500, {
            message: 'Could not create site. Error: ' + err
          });
        }
      });
    } else if (!err) {
      res.json(403, {
        message: 'Site with that title already exists. Please update instead of create or create with a new site with a different name.'
      });
    } else {
      res.json(500, {
        message: err
      });
    }
  });
})
.delete(function(req, res) {
  Site.findOne({
    slug: req.body.slug,
    api_token: req.query.api_token
  }, function(err, doc) {
    if (!err && doc) {
      doc.remove();
      res.json(200, {
        message: 'Site removed.'
      });
    } else if (!err) {
      res.json(404, {
        message: 'Site not found.'
      });
    } else {
      res.json(403, {
        message: 'Could not delete site. Error: ' + err
      });
    }
  });
})
.put(function(req, res) {
  Site.findOne({
    slug: req.body.slug,
    api_token: req.query.api_token
  }, function(err, doc) {
    if (!err && doc) {
      doc.title = req.body.title;
      doc.url = req.body.url;
      doc.save(function(err) {
        if (!err) {
          res.json(200, {
            message: 'Site updated: ' + req.body.title
          });
        } else {
          res.json(500, {
            message: 'Could not update site. Error: ' + err
          });
        }
      });
    } else if (!err) {
      res.json(404, {
        message: 'Could not find Site.'
      });
    } else {
      res.json(500, {
        message: 'Could not update site. Error: ' + err
      });
    }
  });
})

router.route('/sites/:site_slug/pages')
.get(function(req, res) {
  Site.findOne(req.query.application_token !== undefined ? {
    slug: req.params.site_slug,
    application_token: req.query.application_token
  } : {
    slug: req.params.site_slug,
    api_token: req.query.api_token
  }, function(err, doc) {
    if (!err && doc) {
      Page.find({
        site_slug: req.params.site_slug
      }, function(err, doc) {
        if (!err) {
          res.json(200, doc);
        } else {
          res.json(500, {
            message: err
          });
        }
      });
    } else if (!err) {
      res.json(404, {
        message: 'Site not found.'
      });
    } else {
      res.json(403, {
        message: 'Could not find site. Error: ' + err
      });
    }
  });
})
.post(function(req, res) {
  Site.findOne({
    slug: req.params.site_slug,
    api_token: req.query.api_token
  }, function(err, doc) {
    if (!err && doc) {
      Page.findOne({
        title: req.body.title,
        site_slug: req.params.site_slug
      }, function(err, doc) {
        if (!err && !doc) {
          var page = {
            title: req.body.title,
            html: req.body.html,
            site_slug: req.params.site_slug,
            slug: req.body.title.trim().replace(/[^a-zA-Z0-9-\s]/g, '').replace(/[^a-zA-Z0-9-]/g, '_').toLowerCase()
          }

          var newPage = new Page();
          newPage.title = page.title;
          newPage.html = page.html;
          newPage.site_slug = page.site_slug;
          newPage.slug = page.slug

          newPage.save(function(err) {
            if (!err) {
              res.json(201, newPage);
            } else {
              res.json(500, {
                message: 'Could not create site. Error: ' + err
              });
            }
          });
        } else if (!err) {
          res.json(403, {
            message: 'Page with that title in this Site already exists.'
          });
        } else {
          res.json(500, {
            message: err
          });
        }
      })
    } else if (!err) {
      res.json(404, {
        message: 'Site not found.'
      });
    } else {
      res.json(403, {
        message: 'Could not find site. Error: ' + err
      });
    }
  });
})
.put(function(req, res) {
  Site.findOne({
    slug: req.params.site_slug,
    api_token: req.query.api_token
  }, function(err, doc) {
    if (!err && doc) {
      Page.findOne({
        site_slug: req.params.site_slug,
        slug: req.body.slug
      }, function(err, doc) {
        if (!err && doc) {
          doc.title = req.body.title;
          doc.html = req.body.html;
          doc.save(function(err) {
            if (!err) {
              res.json(200, {
                message: 'Page updated: ' + req.body.title
              });
            } else {
              res.json(500, {
                message: 'Could not update page. Error: ' + err
              });
            }
          });
        }
      })
    } else if (!err) {
      res.json(404, {
        message: 'Could not find Site.'
      });
    } else {
      res.json(500, {
        message: 'Could not update page. Error: ' + err
      });
    }
  });
})
.delete(function(req, res) {
  Site.findOne({
    slug: req.params.site_slug,
    api_token: req.query.api_token
  }, function(err, doc) {
    if (!err && doc) {
      Page.findOne({
        slug: req.body.slug,
        site_slug: req.params.site_slug 
      })
    }
  })
});

router.get('/sites/:slug', function(req, res) {
  Site.findOne(req.query.application_token !== undefined ? {
    slug: req.params.slug,
    application_token: req.query.application_token
  } : {
    slug: req.params.slug,
    api_token: req.query.api_token
  }, function(err, doc) {
    if (!err && doc) {
      res.json(200, doc);
    } else if (!err) {
      res.json(404, {
        message: 'Site not found.'
      });
    } else {
      res.json(403, {
        message: 'Could not find site. Error: ' + err
      });
    }
  });
});

router.get('/sites/:site_slug/pages/:slug', function(req, res) {
  Site.findOne(req.query.application_token !== undefined ? {
    slug: req.params.site_slug,
    application_token: req.query.application_token
  } : {
    slug: req.params.site_slug,
    api_token: req.query.api_token
  }, function(err, doc) {
    if (!err && doc) {
      Page.findOne({
        site_slug: req.params.site_slug,
        slug: req.params.slug
      }, function(err, doc) {
        if (!err) {
          res.json(200, doc);
        } else {
          res.json(500, {
            message: err
          });
        }
      });
    } else if (!err) {
      res.json(404, {
        message: 'Site not found.'
      });
    } else {
      res.json(403, {
        message: 'Could not find site. Error: ' + err
      });
    }
  });
});

module.exports = router;