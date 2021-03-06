// To turn on debug logging
// process.env.DEBUG='*,-metalsmith-collections,-metalsmith-templates,-metalsmith-markdown';

var debug = require('debug')('saasquatch-docs');

debug('Loading modules');
import site from './site.js';
import metadata from './plugins/metadata.js';

function dev(callback){
  // process.env.GOOGLE_SITE_ID = "ynZGJlNk33o1bpcfo2rLxaty1CgbwBt1SOLVtBtOdn4";
  // process.env.GCSE_CX = "014638356218796023717:iajbhojb63w";
  // process.env.GCSE_KEY  = "AIzaSyAOxNZQO2zvNFv98_HImD1BruDfITNEOFo";
  
  process.env.ROBOTS = "false";
  process.env.JSTRACKERS = "false";

  process.env.ROLLBAR_ID = "none";
  process.env.PINGDOM_ID = "none";
  process.env.ANALYTICSJS_ID = "none";
  process.env.GA_ACCOUNT = "none";
  process.env.GA_PREFIX = "/docs/";
  process.env.TYPEKIT_ID = "none";
  
  debug('Firing off build');
  site()
  .clean(false)
  .build(function(err, files) {
    if (err){
      debug("Build error", err);
      callback(err);
      return;
    }
    debug("Metalsmith build done!", Object.keys(files).length, "files processed");
    callback();
  });
}


export default dev;