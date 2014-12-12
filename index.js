#!/usr/bin/env node

// JSX to Angular templates

var recast = require("recast");
var builders = recast.types.builders;
var named = recast.types.namedTypes;


function toCode (ast) {
    return recast.print(ast).code;
}


recast.run(function(ast, callback) {
    recast.visit(ast, {

        visitXJSElement: function (path) {
            this.traverse(path);

            var html = toCode(path.value);
            return builders.literal(html);
        },

        visitXJSExpressionContainer: function (path) {

            var html,
                expr = path.value.expression;

            // Support `template literals` for arbitrary syntax
            // TODO: Convert ES6 interpolation to the angular one?
            if (named.TemplateLiteral.check(expr)) {
                html = toCode(expr);
                html = html.substring(1, html.length - 1);
            } else {
                this.traverse(path);
                html = toCode(expr);
            }

            // When not assigned to an attribute use angular interpolation
            if (!named.XJSAttribute.check(path.parentPath.value)) {
                html = '{{ ' + html + ' }}';
            }

            return builders.literal(html);
        }

    });

    callback(ast);
});
