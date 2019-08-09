const parser = require('saz2js');
const _ = require('lodash');
const { JMX } = require('./jmx');

const jmx = new JMX(__dirname + '/template.jmx');

const options = {
  req: true, // determines if the sessions object will contain request data
  res: true, // determines if the sessions object will contain response data
  meta: true // determines if the sessions object will contain meta information
};

/**
 * saz2jmx
 * This program converts sazfile to jmx with good defaults
 *
 * @param {path} sazFile path to saz file
 * @param {path} exportedFile path where the file needs to be exported
 */
function saz2jmx(sazFile, exportedFile) {
  parser(sazFile, options, function(err, sessions) {
    if (err) {
      throw err;
    }
    // console.log(_.keys(sessions).sort())
    _.keys(sessions)
      .sort()
      .forEach(key => {
        jmx.addNewHTTPSampler(sessions[key], key);
      });

    jmx.exportAs(exportedFile);
  });
}

// sample usage
// saz2jmx('c:/git/sample.saz', 'exports/exported_file.jmx')

module.exports = saz2jmx;
