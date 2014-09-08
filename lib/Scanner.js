var events = require('events');
var fs = require('fs');

var LINE_SEPARATOR = '\n';

/**
 * Constructs a new Scanner, which inherits from EventEmitter.
 * @constructor
 */
var Scanner = function(filePath){
    this.fileParts_ = [];
    this.fileContents_ = null;
    this.position_ = 0;
    this.line_ = 1;
    this.character_ = 1;

    this.stream = fs.createReadStream(filePath, {encoding: 'utf8'});
    this.stream.on('readable', this.readFile_.bind(this));
    this.stream.once('end', this.endFile_.bind(this));
};
Scanner.prototype = Object.create(events.EventEmitter.prototype);

/**
 * Returns the number of requested characters from the file and advances the current position in
 * the file to just after the returned characters. Once all of the characters in the file have been
 * consumed, an 'end' event is emitted.
 *
 * @param {number} numCharacters The number of requested characters.
 *
 * @return {string} The characters that were requested.
 */
Scanner.prototype.consume = function(numCharacters){
    var foundCharacters = this.peek(numCharacters);
    var lines = foundCharacters.split(LINE_SEPARATOR);

    if (foundCharacters.length){
        if (lines.length > 1){
            this.line_ += lines.length - 1;
            this.character_ = 1;
        }

        this.character_ += lines.pop().length;

        if (this.isExhausted()){
            this.emit('end');
        }
    }

    this.position_ += foundCharacters.length;
    return foundCharacters;
};

/**
 * Returns the current character index on the current line.
 *
 * @return {number} The current character index on the current line.
 */
Scanner.prototype.getCharacterNumber = function(){
    return this.character_;
};

/**
 * Returns the current line number.
 *
 * @return {number} The current line number.
 */
Scanner.prototype.getLineNumber = function(){
    return this.line_;
};

/**
 * Returns the text of the current line.
 *
 * @return {string} The current line text.
 */
Scanner.prototype.getLineText = function(){
    return this.fileContents_.split(LINE_SEPARATOR)[this.line_ - 1];
};

/**
 * Returns true when all of the characters in the file have been consumed.
 *
 * @return {boolean} True if all of the characters in the file have been consumed.
 */
Scanner.prototype.isExhausted = function(){
    return this.fileContents_.length === this.position_;
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
Scanner.prototype.matchRegex = function(regex, offset){
    offset = offset || 0;
    var remainder = this.fileContents_.substr(this.position_ + offset);
    var result = regex.exec(remainder);

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
Scanner.prototype.matchString = function(string, offset){
    var match = this.peek(string.length, offset);
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
Scanner.prototype.peek = function(numCharacters, offset){
    numCharacters = numCharacters || 1;
    offset = offset || 0;
    numCharacters = this.limitCharacters_(numCharacters + offset);
    offset = this.limitCharacters_(offset || 0);
    numCharacters = numCharacters - offset;
    return this.fileContents_.substr(this.position_ + offset, numCharacters);
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
Scanner.prototype.limitCharacters_ = function(numCharacters){
    var remainingCharacters = this.fileContents_.length - this.position_;
    return (remainingCharacters <= numCharacters) ? remainingCharacters : numCharacters;
};

/**
 * Reads the contents of the file stream.
 * @private
 */
Scanner.prototype.readFile_ = function(){
    var buffer = this.stream.read();
    do {
        this.fileParts_.push(buffer);
        buffer = this.stream.read();
    } while (buffer);
};

/**
 * Cleans up when the end of the file has been reached.
 * @private
 */
Scanner.prototype.endFile_ = function(){
    this.fileContents_ = this.fileParts_.join('');
    this.emit('readable');
};

module.exports = Scanner;