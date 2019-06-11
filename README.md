![logo](saz2jmx.png)

# saz2jmx
A utility to convert fiddler capture archive (saz) to jmeter script (jmx). It exports the jmx with good defaults and boilerplate.


## Motivation
As a Performance tester (or "http hacker") we quite regularly play with tools like [Fiddler](https://www.telerik.com/fiddler) which helps us to log/inspect/edit/save all http(s) traffic between the client and the server. Another favorite tool is [Apache JMeter](https://jmeter.apache.org) which is responsible to generating heavy http/or any kind of traffic and measuring transaction attributes. This tool/js library attempts to bridge the gap between the two by providing users to generate a jmeter script from a fiddler capture archive.

### Alternatives and their pain points
* [HTTP(S) Test Script Recorder](https://jmeter.apache.org/usermanual/jmeter_proxy_step_by_step.html): JMeter's very own http traffic recorder. The interface is hard to use and does not allow you to save the recorded data (easily 😉)
* [Blazemeter Chrome Extension](https://www.blazemeter.com/blog/the-new-blazeMeter-chrome-extension-v4-easily-script-jmeter-and-selenium): doesnt save the responses which are very crucial for correlation also some bugs on GET query string conversion.

## Usage

Make sure you have Nodejs and npm installed. [Latest LTS Version: 10.16.0 (includes npm 6.9.0)](https://nodejs.org/en/download/). 

There are multiple options to use this library.

### as a library

1. install the package `npm i saz2jmx`
2. sample javascript, say `script.js`
```javascript
let saz2jmx = require('saz2jmx');
saz2jmx('c:/path/to/imported.saz', 'exports/exported.jmx');
```
3. Execute `node script.js`

### as an npm executable

execute it directly without installing the package

```shell
npx saz2jmx -s source.saz -d destination.jmx
```

### as a global command

install the package by running `npm i -g saz2jmx`. Then run the command as shown below.

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

## Contributors welcome!
Just send pull requests with feature/bug description. We can discuss about the approach through comments in [issues page](https://github.com/dnafication/saz2jmx/issues)

## Features/Issues/Bugs?
[Click here](https://github.com/dnafication/saz2jmx/issues/new) to create new issue.

## TODO
- ability make samplers configurable (pass in a json maybe?)
- ability add additional jmeter components
- create `jmx` from bzt configs (`yml`) (I know its reinventing the wheel! but reinventing in JS, `bzt` is in python)
