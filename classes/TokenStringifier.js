/**
 * This file defines the TokenStrinigifier class. This class is included as a convenience to allow
 * developers to easily print the token stream output of the Lexer class to the command line or a
 * file. It accepts an input stream of token instances and emits an output stream of those tokens
 * in string form.
 */

var Transform = require('stream').Transform;
var util = require('util');

/**
 * Creates a TokenStringifier instance. The instance will accept an input stream of token instances.
 * It will transform the token instances into an output stream of text representations of those
 * tokens.
 *
 * @param {Object=} options An optional options object that will be passed to the stream.Transform
 *      constructor.
 *
 * @constructor
 */
function TokenStringifier(options){
    Transform.call(this, options);
    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
}
util.inherits(TokenStringifier, Transform);

/**
 * Required by the stream.Transform parent class. This method accepts chunks in the form of token
 * instances and converts them to text representations of those tokens.
 *
 * @param {Token} chunk The incoming data.
 * @param {string} encoding The encoding of the incoming data.
 * @param {Function} done The callback to be called when the method has finished transforming
 *      incoming tokens.
 */
TokenStringifier.prototype._transform = function(chunk, encoding, done){
    this.push(JSON.stringify(chunk) + '\n');
    done();
};

module.exports = TokenStringifier;