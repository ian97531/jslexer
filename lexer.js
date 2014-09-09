var process = require('process');
var fs = require('fs');

var Lexer = require('./lib/Lexer');
var LexerPrinter = require('./lib/LexerPrinter');
var jsdefs = require('./lib/jsdefinitions');

var tokens = [];
var file = fs.createReadStream(process.argv[2], {encoding: 'utf8'});
var lexer = new Lexer(jsdefs.RULES, jsdefs.LINE_SEPARATOR);

// Single line comment.
lexer.on('error', function(error){
    error.print();
});

/**
 * Stuff!
 */
file.pipe(lexer)
    .pipe(new LexerPrinter())
    .pipe(process.stdout);