var express = require('express');
var router = express.Router();
var Site = require('../models/site').Site;
var Page = require('../models/page').Page;
var crypto = require('crypto');

router.get('/sites', function(req, res) {
  Site.find({
    api_token: req.query.api_token
  }, function(err, docs) {
    if(!err) {
      res.json(200, { 
        sites: docs 
      });
    } else {
      res.json(500, { 
        message: err 
      });
    }
  });
});

router.post('/sites', function(req, res) {
  var site = {
    title: req.body.site_title,
    url: req.body.site_url,
    app_token: undefined,
    api_token: req.body.site_api_token,
    slug: req.body.site_title.trim().replace(/[^a-zA-Z0-9-\s]/g, '').replace(/[^a-zA-Z0-9-]/g, '_').toLowerCase()
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
          res.json(201, {
            message: 'Site created with title: ' + newSite.title
          });
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
});

router.delete('/sites', function(req, res) {
  Site.findOne({
    slug: req.body.slug,
    api_token: req.body.api_token
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
});

router.put('/sites', function(req, res) {
  Site.findOne({
    slug: req.body.slug,
    api_token: req.body.api_token
  }, function(err, doc) {
    if (!err && doc) {
      doc.title = req.body.site_title;
      doc.url = req.body.site_url;
      doc.save(function(err) {
        if (!err) {
          res.json(200, {
            message: 'Site updated: ' + req.body.site_title
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

router.get('/sites/:slug', function(req, res) {
  Site.findOne({
    slug: req.params.slug,
    application_token: req.query.application_token
  }, function(err, doc) {
    if (!err && doc) {
      res.json(200, {
        site: doc
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

router.get('/sites/:site_slug/pages', function(req, res) {
  Site.findOne({
    slug: req.params.site_slug,
    application_token: req.query.application_token
  }, function(err, doc) {
    if (!err && doc) {
      Page.find({
        site_slug: req.params.site_slug
      }, function(err, doc) {
        if (!err) {
          res.json(200, {
            pages: doc
          });
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

router.get('/sites/:site_slug/pages/:slug', function(req, res) {
  Site.findOne({
    slug: req.params.site_slug,
    application_token: req.query.application_token
  }, function(err, doc) {
    if (!err && doc) {
      Page.findOne({
        site_slug: req.params.site_slug,
        slug: req.params.slug
      }, function(err, doc) {
        if (!err) {
          res.json(200, {
            page: doc
          });
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

router.post('/sites/:site_slug/pages', function(req, res) {
  Site.findOne({
    slug: req.params.site_slug,
    api_token: req.query.api_token
  }, function(err, doc) {
    if (!err && doc) {
      Page.find({
        slug: req.params.site_slug,
        site_slug: req.params.site_slug
      }, function(err, doc) {
        if (!err && !doc) {
          var page = {
            title: req.body.page_title,
            html: req.body.page_html,
            site_slug: req.params.site_slug,
            slug: req.body.page_title.trim().replace(/[^a-zA-Z0-9-\s]/g, '').replace(/[^a-zA-Z0-9-]/g, '_').toLowerCase()
          }

          var newPage = new Page();
          newPage.title = page.title;
          newPage.html = page.html;
          newPage.site_slug = page.site_slug;
          newPage.slug = page.slug

          newPage.save(function(err) {
            if (!err) {
              res.json(201, {
                message: 'Page created with title: ' + newPage.title
              });
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
});

router.put('/sites/:site_slug/pages', function(req, res) {
  Site.findOne({
    slug: req.params.site_slug,
    api_token: req.body.api_token
  }, function(err, doc) {
    if (!err && doc) {
      Page.findOne({
        site_slug: req.params.site_slug,
        slug: req.body.slug
      }, function(err, doc) {
        if (!err && doc) {
          doc.title = req.body.page_title;
          doc.html = req.body.page_html;
          doc.save(function(err) {
            if (!err) {
              res.json(200, {
                message: 'Page updated: ' + req.body.page_title
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

router.delete('/sites/:site_slug/pages', function(req, res) {
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

module.exports = router;