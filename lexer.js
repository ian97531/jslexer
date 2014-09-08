var process = require('process');

var Lexer = require('./lib/Lexer');
var jsdefs = require('./lib/jsdefinitions');

var done = false;
var tokens = [];
var lexer = new Lexer(process.argv[2], jsdefs.RULES);
lexer.on('readable', function(){
    while(!done){
        tokens = tokens.concat(lexer.consume());
    }
});

lexer.on('error', function(error){
    error.print();
});

lexer.on('end', function(){
    done = true;
    var errors = lexer.getErrors();
    console.log('Complete with ' + tokens.length + ' tokens.');
    console.log('Complete with ' + errors.length + ' errors.');
});