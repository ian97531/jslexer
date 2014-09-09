var Transform = require('stream').Transform;
var util = require('util');

function LexerPrinter(options){
    Transform.call(this, options);
    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
}

util.inherits(LexerPrinter, Transform);

LexerPrinter.prototype._transform = function(chunk, encoding, done){
    this.push(JSON.stringify(chunk) + '\n');
    done();
};

module.exports = LexerPrinter;