#!/usr/bin/env node

// JSX to Angular templates

var recast = require("recast");
var builders = recast.types.builders;
var named = recast.types.namedTypes;


function toCode (ast) {
    return recast.print(ast).code;
}

recast.run(function(ast, callback) {
    var elementsCounter = 0;

    recast.visit(ast, {

        visitXJSElement: function (path) {

            elementsCounter++;
            this.traverse(path);
            elementsCounter--;

            // Only wrap as a string the root node
            if (0 === elementsCounter) {
                var html = toCode(path.value);
                return builders.literal(html);
            }
        },

        // TODO: Handle regular expressions ?

        visitXJSExpressionContainer: function (path) {

            var html,
                expr = path.value.expression;

            html = toCode(expr);

            // Support `template literals` for arbitrary syntax
            // TODO: Convert ES6 interpolation to the angular one?
            if (named.TemplateLiteral.check(expr)) {
                html = html.substring(1, html.length - 1);
            }

            // When not assigned to an attribute use angular interpolation
            if (!named.XJSAttribute.check(path.parentPath.value)) {
                html = '{{ ' + html + ' }}';
            } else {
                html = '"' + html + '"';
            }

            return html;
            //return builders.literal(html);
        }

    });

    callback(ast);
});
