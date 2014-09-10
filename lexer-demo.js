var fs = require('fs');
var process = require('process');

var js = require('./languages/javascript');
var Lexer = require('./classes/Lexer');
var TokenStringifier = require('./classes/TokenStringifier');

var sourceFileStream = fs.createReadStream(process.argv[2], {encoding: 'utf8'});
var lexer = new Lexer(js.RULES, js.LINE_SEPARATOR);

/**
 * If an error is encountered, print it to the terminal.
 */
lexer.on('error', function(error){
    error.print();
});

/**
 * This statement pipes the source file text stream into the lexer instance.
 * The lexer emits a token stream, which is piped into a TokenStringifier instance.
 * The TokenStrinigifer emits a text representation of the tokens it receives, which is then piped
 * to process.stdout and printed to the terminal.
 */
sourceFileStream.pipe(lexer)
    .pipe(new TokenStringifier())
    .pipe(process.stdout);