/* jshint undef:true, unused:true, node:true */

var assert = require('assert');
var through = require('through');

var recast = require('recast');
var types = recast.types;
var n = types.namedTypes;
var b = types.builders;


/**
 * Visits an AST to convert JSX Elements into Angular template strings.
 *
 * @private
 */
function NgJsxVisitor() {
  types.PathVisitor.call(this);

  this.elementVisitor = new NgJsxElementVisitor();
}
NgJsxVisitor.prototype = Object.create(types.PathVisitor.prototype);
NgJsxVisitor.prototype.constructor = NgJsxVisitor;

/**
 * Visits JSX Elements serializing each root node as a string
 *
 * @param {Path} path
 */
NgJsxVisitor.prototype.visitXJSElement = function(path) {
  // Transform the contents
  this.traverse(path, this.elementVisitor);

  // Serialize as a string literal
  var html = recast.print(path.value).code;
  return b.literal(html);
};


/**
 * Visits an AST to convert JSX Elements into Angular template strings.
 *
 * @private
 */
function NgJsxElementVisitor () {
  types.PathVisitor.call(this);
};
NgJsxElementVisitor.prototype = Object.create(types.PathVisitor.prototype);
NgJsxElementVisitor.prototype.constructor = NgJsxElementVisitor;

/**
 * Visits JSX Expressions converting them to Angular template interpolations
 *
 * @param {Path} path
 */
NgJsxElementVisitor.prototype.visitXJSExpressionContainer = function (path) {
  var html,
      expr = path.value.expression;

  html = recast.print(expr).code;

  // Support `template literals` for arbitrary syntax
  // TODO: Convert ES6 interpolation to the angular one?
  if (n.TemplateLiteral.check(expr)) {
      html = html.substring(1, html.length - 1);
  }

  // When not assigned to an attribute use angular interpolation
  if (!n.XJSAttribute.check(path.parentPath.value)) {
      html = '{{ ' + html + ' }}';
  } else {
      html = '"' + html + '"';
  }

  return html;
};


/**
 * Transform an Esprima AST generated from ES6 by replacing JSX Elements with
 * an equivalent Angular template string.
 *
 * @param {Object} ast
 * @return {Object}
 */
function transform(ast) {
  return types.visit(ast, new NgJsxVisitor());
}

/**
 * Transform React's JSX source code by replacing JSX Elements with an
 * equivalent Angular template string.
 *
 *   compile('var foo = <foo>{bar}</foo>');
 *   `var foo = "<foo>{{ bar }}</foo>"`
 *
 * @param {string} source
 * @param {{sourceFileName: string, sourceMapName: string}} mapOptions
 * @return {string}
 */
function compile(source, mapOptions) {
  mapOptions = mapOptions || {};

  var recastOptions = {
    sourceFileName: mapOptions.sourceFileName,
    sourceMapName: mapOptions.sourceMapName
  };

  var ast = recast.parse(source, recastOptions);
  return recast.print(transform(ast), recastOptions);
}

module.exports = function () {
  var data = '';
  return through(write, end);

  function write (buf) { data += buf; }
  function end () {
      this.queue(module.exports.compile(data).code);
      this.queue(null);
  }
};

module.exports.compile = compile;
module.exports.transform = transform;
