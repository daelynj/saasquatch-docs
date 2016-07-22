var extname = require('path').extname;
var parser = require("swagger-parser");
var yaml = require('js-yaml');

var Resolver = require('swagger-client/lib/resolver');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

var parsers = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad
};

/**
 * Metalsmith plugin to process Swagger.io files and add them as dereferenced output
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin(opts){
  opts = opts || {};

  return function(files, metalsmith, done){
    var metadata = metalsmith.metadata();
    var exts = Object.keys(parsers);

    var file = opts.path;
    var ext = extname(file);
    if (!~exts.indexOf(ext)) return done(new Error('unsupported metadata type "' + ext + '"'));
    
    if (!files[file]){
      // TODO: Fix or replace metalsmith-watch. It doesn't live-reload all files, and doesn't cache our Swagger.yaml contents
      //return done(new Error('file "' + file + '" not found'));
      console.error('file "' + file + '" not found');
      return done();
    }
    
    var parse = parsers[ext];
    var str = files[file].contents.toString();

    // Different than `metalsmith-metadata` (we want to leave our lovely JSON files for future donwloadability)
    // delete files[file]; 
    
    try {
        var data = parse(str);
    } catch (e) {
        return done(new Error('malformed data in "' + file + '"'));
    }

    parser.parse(data, function(err, api, swaggerMetaD) {
        if(err){
            return done(new Error("Swagger parsing error: " + err.message, err));
        }
    
        new Resolver().resolve(api, null, function (spec, unresolved) {
          // console.log("Parsed spec", spec);
          
          var numUnresolved = Object.keys(unresolved).length;
          if(numUnresolved !=0 ){
            console.error("Found unresolved Swagger paths", unresolved);
            return done(new Error("Found unresolved Swagger paths. See logs for details."));
          }
          Object.keys(spec.paths).forEach(function(k,v){
            // LV: Cleans up the `parameters` cruft field added by Swagger JS. Messes up templates. And doesn't seem spec compliant?
            delete spec.paths[k]["parameters"];
          });
          
          metadata['swagger'] = api;
          done();
        });

    });

  };
}