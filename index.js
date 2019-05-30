const sazParser = require('saz-parser');
const _ = require('lodash');
const { JMX } = require('./jmx');

const jmx = new JMX('./template.jmx');

/**
 * saz2jmx
 * This program converts sazfile to jmx with good defaults
 *
 * @param {path} sazFile path to saz file
 * @param {path} exportedFile path where the file needs to be exported
 */
function saz2jmx(sazFile, exportedFile) {
  sazParser(sazFile, function(err, sessions) {
    if (err) {
      throw err;
    }
    // console.log(_.keys(sessions).sort())
    _.keys(sessions)
      .sort()
      .forEach((key, i) => {
        if (i < 1) {
          // console.log(sessions[key])
        }
        jmx.addNewHTTPSampler(sessions[key], key);
      });

    jmx.exportAs(exportedFile);
  });
}

// sample usage
// saz2jmx('c:/git/20190529_SP_ConnectORderFTTN_ACTIVE.saz', 'exports/holyshit.jmx')

module.exports = saz2jmx;
