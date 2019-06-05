# saz2jmx
A utility to convert fiddler capture (saz) to jmeter script (jmx). It exports the jmx with good defaults and boilerplate.

## Usage
1. install the package `npm i saz2jmx`
2. sample script
```javascript
let saz2jmx = require('saz2jmx');
saz2jmx('c:/path/to/imported.saz', 'exports/exported.jmx');
```
3. or run it as a CLI
```shell
Usage: saz2jmx [options]

example: saz2jmx -s source.saz -d destination.jmx

Options:
  -v, --version                    output the version number
  -s, --source <source>            source .saz file
  -d, --destination <destination>  destination .jmx file
  -h, --help                       output usage information
```
That's it, really!

## TODO
- ability make samplers configurable (pass in a json maybe?)
- ability add additional jmeter components
- create `jmx` from bzt configs (`yml`) (I know its reinventing the wheel! but reinventing in JS, `bzt` is in python)
