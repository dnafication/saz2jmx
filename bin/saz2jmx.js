#!/usr/bin/env node

const project = require('../package.json');
const saz2jmx = require('../index');

var program = require('commander');

program
  .version(project.version, '-v, --version')
  .description(project.description)
  .description('example: saz2jmx -s source.saz -d destination.jmx')
  .option('-s, --source <source>', 'source .saz file')
  .option('-d, --destination <destination>', 'destination .jmx file')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
} else if (program.source && program.destination) {
  saz2jmx(program.source, program.destination);
} else {
  program.outputHelp();
}
