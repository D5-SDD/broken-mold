var path = require('path');
var fs = require('fs');
var packager = require('electron-packager');

const DIST = 'dist';
const NAME = 'brokenmold';
const PRODUCT_NAME = 'Broken Mold';
const PLATFORM = 'win32';
const ARCH = 'ia32';

var options = {
  dir: '.',
  out: DIST,
  platform: PLATFORM,
  arch: ARCH,
  name: NAME,
  ignore: [
    /^\..*$/,
    /^src$/,
    /^test$/,
    /^README.*$/,
    /^webpack.*$/
  ]
};

packager(options, function (err) {
  if (err) {
    console.log(err, err.stack);
    process.exit(1);
  }

  // rename the folder
  var dir = path.join(DIST, NAME + '-' + PLATFORM + '-' + ARCH);
  if (fs.existsSync(dir)) {
    fs.renameSync(dir, path.join(DIST, PRODUCT_NAME));
  }

  console.log('Successfully packaged application');
});
