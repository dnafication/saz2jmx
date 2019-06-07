![logo](saz2jmx.png)

# saz2jmx
A utility to convert fiddler capture archive (saz) to jmeter script (jmx). It exports the jmx with good defaults and boilerplate.


## Motivation
As a Performance tester (or "http hacker") we play with tools like [Fiddler](https://www.telerik.com/fiddler) quite often which allows us to log/inspect/edit/save all http(s) traffic between the client and the server. Another favorite tool is [Apache JMeter](https://jmeter.apache.org) which is responsible to generating a heavy traffic and measuring transaction attributes. This tool/js library attempts to bridge the gap between the two by providing users to generate a jmeter script from a fiddler capture archive.

## Usage

### as a library

1. install the package `npm i saz2jmx`
2. sample javascript
```javascript
let saz2jmx = require('saz2jmx');
saz2jmx('c:/path/to/imported.saz', 'exports/exported.jmx');
```

### as an npm executable

execute it directly
`npx saz2jmx -s source.saz -d destination.jmx`

### as a global command

install the package `npm i -g saz2jmx`

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
