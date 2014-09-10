/**
 * This file defines the Lexer class. Instances of the Lexer class accept streams of source text,
 * and will transform those streams into streams of token instances using the rules provided to the
 * Lexer constructor.
 */

var StringDecoder = require('string_decoder').StringDecoder;
var Transform = require('stream').Transform;
var util = require('util');

var LexerError = require('./LexerError');
var Token = require('./Token');

/**
 * Creates an instance of the Lexer class.
 *
 * @param {Array<Object>} rules An array of rules used to map sequences of characters in the
 *      incoming stream of source text into token instances.
 * @param {string} separator The character that should be used to identify line endings in the
 *      incoming stream of source text.
 * @param {Object=} options An optional object that will be passed to the stream.Transform
 *      constructor.
 *
 * @constructor
 */
var Lexer = function(rules, separator, options){
    Transform.call(this, options);
    this._writableState.objectMode = false;
    this._readableState.objectMode = true;
    this._decoder = new StringDecoder('utf8');

    this._text = '';
    this._rules = rules;
    this._separator = separator;
    this._line = 1;
    this._character = 1;
    this._inputComplete = false;
    this._exhaustedCurrentChunk = false;
    this._partialLine = null;
    this._currentLineStart = '';
};
util.inherits(Lexer, Transform);

/**
 * Returns the number of requested characters from the file and advances the current position in
 * the file to just after the returned characters. Once all of the characters in the file have been
 * consumed, an 'end' event is emitted.
 *
 * @param {number} numCharacters The number of requested characters.
 *
 * @return {string} The characters that were requested.
 */
Lexer.prototype._consume = function(numCharacters){
    var foundCharacters = this._peek(numCharacters);
    var lines = foundCharacters.split(this._separator);
    var discard;

    if (foundCharacters.length){
        if (lines.length > 1){
            this._line += lines.length - 1;
            this._currentLineStart = lines[lines.length - 1];
            this._character = 1;
        } else {
            this._currentLineStart += foundCharacters;
        }

        this._character += lines.pop().length;

        this._text = this._text.slice(foundCharacters.length);

        if (this._text.length === 0){
            this._exhaustedCurrentChunk = true;
        }
    }

    return foundCharacters;
};

/**
 * Fetches the next token from file being read by the scanner. A LexerError is created if the file
 * is not yet exhausted, but no token can be read. In this case, the current character is consumed
 * and the method continues trying to generate a token. If the end of the file is reached, nothing
 * is returned.
 * @private
 *
 * @return {Token} A token object that represents the next token in the file.
 */
Lexer.prototype._fetchNextToken = function(){
    var lineNumber = this._getLineNumber();
    var characterNumber = this._getCharacterNumber();
    var token;

    while(!this._isExhausted() && !token){
        this._rules.every(function(rule){
            var text;
            var result;

            if (rule.string){
                result = this._matchString(rule.string);
            } else if (rule.regex){
                result = this._matchRegex(rule.regex);
            }

            if (result && (this._inputComplete || this._getRemainder(result.length))){
                text = this._consume(result.length);
            } else if (result){
                this._exhaustedCurrentChunk = true;
            }

            if (text){
                token = new Token(text, rule.type, lineNumber, characterNumber);
                return false;
            } else {
                return true;
            }
        }.bind(this));

        if (!this._isExhausted() && !token){
            this._recordError();
            this._consume();
        }
    }

    return token;
};

/**
 * Required by the stream.Transform parent class. This method finishing converting any remaining
 * tokens.
 *
 * @param {Function} done The callback to be called when the method has finished generating tokens.
 */
Lexer.prototype._flush = function(done){
    this._inputComplete = true;
    this._exhaustedCurrentChunk = false;

    if (this._partialLine){
        this._text += '\n' + this._partialLine;
        this._partialLine = null;
    }

    var token = this._fetchNextToken();
    while(token){
        this.push(token);
        token = this._fetchNextToken();
    }
    this.push(null);
    done();
};

/**
 * Returns the current character index on the current line.
 *
 * @return {number} The current character index on the current line.
 */
Lexer.prototype._getCharacterNumber = function(){
    return this._character;
};

/**
 * Returns the current line number.
 *
 * @return {number} The current line number.
 */
Lexer.prototype._getLineNumber = function(){
    return this._line;
};

/**
 * Returns the text of the current line.
 *
 * @return {string} The current line text.
 */
Lexer.prototype._getLineText = function(){
    return this._currentLineStart + this._text.split(this._separator)[0];
};

/**
 * Returns the number of characters requested if it's less than or equal to the number of
 * characters remaining in the file. Otherwise, it returns the numer of characters that remain
 * in the file.
 * @private
 *
 * @param {number} numCharacters The number of requested characters.
 *
 * @return {number} The number of characters that may be requested from the file.
 */
Lexer.prototype._getRemainder = function(offset){
    offset = offset || 0;
    var remainingCharacters = this._text.length - (offset);
    return (remainingCharacters < 0) ? remainingCharacters : 0;
};

/**
 * Returns true when all of the characters in the file have been consumed.
 *
 * @return {boolean} True if all of the characters in the file have been consumed.
 */
Lexer.prototype._isExhausted = function(){
    return this._exhaustedCurrentChunk;
};

/**
 * Returns the number of characters requested if it's less than or equal to the number of
 * characters remaining in the file. Otherwise, it returns the numer of characters that remain
 * in the file.
 * @private
 *
 * @param {number} numCharacters The number of requested characters.
 *
 * @return {number} The number of characters that may be requested from the file.
 */
Lexer.prototype._limitCharacters = function(numCharacters){
    return (this._text.length <= numCharacters) ? this._text.length : numCharacters;
};

/**
 * Will check to see if a regex matches the next characters in the file. If so, the matching
 * characters are returned, if no the return value is undefined.
 *
 * @param {RegExp} regex A regular expression to test to see if it matches the next characters
 *      in the file.
 *
 * @return {string|undefined} The matching string, if a match is found. Otherwise, returns
 *      undefined.
 */
Lexer.prototype._matchRegex = function(regex, offset){
    offset = offset || 0;
    var remainder = this._text.substr(offset);
    var result = regex.exec(remainder, 'm');

    if (result && result.index === 0){
        return result[0];
    }
};

/**
 * Will check to see if a string matches the next characters in the file. If so, the matching
 * characters are returned, if no the return value is undefined.
 *
 * @param {string} string The string to match.
 * @param {number=0} offset The number of characters to offset the current index.
 *
 * @return {string|undefined} The matching string, if a match is found. Otherwise, returns
 *      undefined.
 */
Lexer.prototype._matchString = function(string, offset){
    var match = this._peek(string.length, offset);
    if (match === string){
        return match;
    }
};

/**
 * Returns the number of requested characters from the file without updating the current
 * position in the file.
 *
 * @param {number=1} numCharacters The number of requested characters.
 * @param {number=0} offset The number of characters to offset the current index.
 *
 * @return {string} The characters that were requested.
 */
Lexer.prototype._peek = function(numCharacters, offset){
    numCharacters = numCharacters || 1;
    offset = offset || 0;
    numCharacters = this._limitCharacters(numCharacters + offset);
    offset = this._limitCharacters(offset || 0);
    numCharacters = numCharacters - offset;
    return this._text.substr(offset, numCharacters);
};

/**
 * Constucts and error for the current scanner position, stores it, and emits and error event.
 * @private
 */
Lexer.prototype._recordError = function(){
    var character = this._peek();
    var error = new LexerError(this._getLineText(), character,
        this._getLineNumber(), this._getCharacterNumber());
    this.emit('error', error);
};

/**
 * Required by the stream.Transform parent class. This method accepts chunks of input text,
 * and converts the text to tokens as it's able to.
 *
 * @param {string} chunk The incoming data.
 * @param {string} encoding The encoding of the incoming data.
 * @param {Function} done The callback to be called when the method has finished generating tokens.
 */
Lexer.prototype._transform = function(chunk, encoding, done){
    var newChunk = this._decoder.write(chunk);

    if (this._partialLine){
        newChunk = this.partialLine + newChunk;
        this.partialLine = null;
    }

    var newLines = newChunk.split(this._separator);
    var lastLine = newLines[newLines.length - 1];
    if (lastLine !== ''){
        this.partialLine = newLines.pop();
    }

    this._text += newLines.join(this._separator);
    this._exhaustedCurrentChunk = false;

    var token = this._fetchNextToken();
    while(token){
        if (this.push(token)){
            token = this._fetchNextToken();
        }
    }

    done();
};

module.exports = Lexer;