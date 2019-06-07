const convert = require("xml-js");
const fs = require("fs");
const _ = require("lodash");
const jp = require("jsonpath");
const _url = require("url");

const { ensureDirectoryExistence } = require("./utils");

/**
 * JMX class
 */
class JMX {
  constructor(jmxFile) {
    // this.jmxFile = jmxFile;
    this.template = fs.readFileSync(jmxFile, "utf8");
    this.templateJS = convert.xml2js(this.template);
    this.outputJS = convert.xml2js(this.template);
  }

  /**
   * exports the current state of outputJS
   *
   * @param {string} fileName path of the file example '/path/to/file.jmx'
   */
  exportAs(fileName) {
    ensureDirectoryExistence(fileName);
    fs.writeFileSync(fileName, convert.js2xml(this.outputJS));
    return null;
  }

  toJSON() {
    return convert.xml2json(this.template);
  }

  toString() {
    return `JMX - ${this.jmxFile}`;
  }

  /**
   * Takes in array of element items and returns a hashtree element
   * the array is optional
   *
   * @param {Array} items
   */
  _createHashTree(items) {
    return {
      type: "element",
      name: "hashTree",
      elements: items || null
    };
  }

  /**
   * Object factory for header object.
   * Takes in name and value of the headers and returns a header element
   *
   * @param {string} name
   * @param {string} value
   */
  _createHeader(name, value) {
    // sample header object from template
    const header = jp.nodes(
      this.templateJS,
      '$..elements[?(@.attributes.elementType=="Header")]'
    )[0].value;

    // modify the object
    _.set(header, "attributes.name", name);
    _.set(header, "elements[0].elements[0].text", name);
    _.set(header, "elements[1].elements[0].text", value);

    // return a copy of the object
    return _.cloneDeep(header);
  }

  /**
   * This object factory takes in array of header objects
   * and returns a header manager element
   *
   * @param {Array} headers
   */
  _createHeaderManager(headers) {
    // http header manager
    const headerManager = jp.nodes(
      this.templateJS,
      '$..elements[?(@.name=="hashTree")].elements[?(@.name=="HeaderManager")]'
    )[0].value;

    // remove existing headers
    // headerManager.elements[0].elements = [];

    // push provide headers
    // headers.forEach(header => headerManager.elements[0].elements.push(header));
    _.set(headerManager, "elements[0].elements", headers);

    // return a copy of the object
    return _.cloneDeep(headerManager);
  }

  /**
   * Create a response assertion element
   *
   * TODO allow users to add assertions
   */
  _createResponseAssertion() {
    return jp.nodes(
      this.templateJS,
      '$..elements[?(@.name=="hashTree")].elements[?(@.name=="ResponseAssertion")]'
    )[0].value;
  }

  /**
   * Returns a sampler element
   * @param {string} name name of the sampler
   * @param {string} method GET | POST | DELETE | PUT | HEAD etc
   * @param {string} url in standard url format
   * @param {string} body the body content
   * @param {object} options object of additional attributes, not implemented
   *
   * TODO implement support for additional options of sampler
   */
  _createSampler(name, method, url, body, options) {
    // http sampler proxy, I am using nodes here so I can use the path in future if needed.
    // jp.query can be used as well.
    const sampler = jp.nodes(
      this.templateJS,
      '$..elements[?(@.name=="hashTree")].elements[?(@.name=="HTTPSamplerProxy")]'
    )[0].value;

    function queryAndReplace(name, value) {
      let path = jp.nodes(
        sampler,
        `$..elements[?(@.attributes.name=="${name}" && @.elements)]`
      )[0].path;

      // path of the object
      path = jp.stringify(path).slice(2);

      // set the new text
      _.set(sampler, path + ".elements[0].text", value);
    }

    // reassign url
    url = _url.parse(url);
    if (url.port == null) {
      if (url.protocol.replace(":", "") === "https") {
        url.port = 443;
      } else if (url.protocol.replace(":", "") === "http") {
        url.port = 80;
      }
    }

    // set the name
    _.set(sampler, "attributes.testname", name);
    queryAndReplace("HTTPSampler.method", method);

    queryAndReplace("HTTPSampler.domain", url.hostname);
    queryAndReplace("HTTPSampler.port", url.port);
    queryAndReplace("HTTPSampler.protocol", url.protocol.replace(":", ""));
    queryAndReplace("HTTPSampler.path", url.path);
    queryAndReplace("Argument.value", body);

    return _.cloneDeep(sampler);
  }

  addNewHTTPSampler({ request, response }, name) {
    const tmpHeaders = [];
    const { headers, method, url, content } = request;
    const { statusCode } = response;

    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        // ignore unnecessary headers
        if (
          ![
            "Host",
            "Content-Length",
            "Connection",
            "Cookie",
            "Origin"
          ].includes(key)
        ) {
          tmpHeaders.push(this._createHeader(key, headers[key]));
        }
      }
    }

    const hm = this._createHeaderManager(tmpHeaders);
    const ht = this._createHashTree();
    const xht = this._createHashTree([
      hm,
      ht,
      this._createResponseAssertion(),
      ht
    ]);
    const s = this._createSampler(name + "-HTTPSampler", method, url, content);

    // case of redirection, just add a comment
    if (statusCode === "302") {
      // Redirection detected, next sampler may be unnecessary
      _.set(
        s,
        "elements[15].elements[0].text",
        "Redirection detected, next sampler may be unnecessary"
      );
    } else {
      _.set(s, "elements[15].elements[0].text", "");
    }

    const tgHT = _.get(
      this.outputJS,
      "elements[0].elements[0].elements[1].elements[1].elements"
    );

    tgHT.push(s);
    tgHT.push(xht);
  }
}

module.exports.JMX = JMX;
