var events = require('events');

var Scanner = require('./Scanner');
var Token = require('./Token');

var Lexer = function(filePath, rules){
    this.tokens_ = [];
    this.errors_ = [];
    this.index_ = 0;
    this.rules_ = rules;

    this.scanner_ = new Scanner(filePath);
    this.scanner_.on('readable', this.scannerReadable_.bind(this));
};
Lexer.prototype = Object.create(events.EventEmitter.prototype);

/**
 * Returns the number of requested tokens from the file and advances the current position in the
 * file to just after the returned tokens. Once all of the tokens in the file have been consumed,
 * an 'end' event is emitted.
 *
 * @param {number} numTokens The number of requested tokens.
 *
 * @return {Array<Token>} The tokens that were requested.
 */
Lexer.prototype.consume = function(numTokens){
    var tokens = this.peek(numTokens);
    if (this.isExhausted() && tokens) this.emit('end');
    this.index_ += tokens.length;
    return tokens;
};

/**
 * Returns an array of the LexerErrors that have accumulated.
 *
 * @return {Array<LexerError>}
 */
Lexer.prototype.getErrors = function(){
    return this.errors_;
};

/**
 * Returns true when all of the tokens in the file have been consumed.
 *
 * @return {boolean} True if all of the tokens in the file have been consumed.
 */
Lexer.prototype.isExhausted = function(){
    return this.scanner_.isExhausted() && this.index_ === this.tokens_.length;
};

/**
 * Returns the number of requested tokens from the file without updating the current
 * position in the file.
 *
 * @param {number=1} numTokens The number of requested tokens.
 * @param {number=0} offset The number of tokens to offset the current index.
 *
 * @return {Array<Token>} The tokens that were requested.
 */
Lexer.prototype.peek = function(numTokens, offset){
    numTokens = numTokens || 1;
    offset = offset || 0;

    var start;
    var end;
    var token;
    var remainder;
    var requestedTokens = numTokens + offset;

    while (!this.scanner_.isExhausted() && !this.hasSufficientTokens_(requestedTokens)){
        this.tokens_.push(this.fetchNextToken_());
    }

    remainder = this.tokens_.length - this.index_;
    start = (offset > remainder) ? this.index_ + remainder : this.index_ + offset;
    end = (requestedTokens > remainder) ? this.index_ + remainder : this.index_ + requestedTokens;

    return this.tokens_.slice(start, end);
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
Lexer.prototype.fetchNextToken_ = function(){
    var lineNumber = this.scanner_.getLineNumber();
    var characterNumber = this.scanner_.getCharacterNumber();
    var token;

    while(!this.scanner_.isExhausted() && !token){
        this.rules_.every(function(rule){
            var text;
            var result;

            if (rule.string){
                result = this.scanner_.matchString(rule.string);
            } else if (rule.regex){
                result = this.scanner_.matchRegex(rule.regex);
            }

            if (result) text = this.scanner_.consume(result.length);

            if (text){
                token = new Token(text, rule.type, lineNumber, characterNumber);
                return false;
            } else {
                return true;
            }
        }.bind(this));

        if (!this.scanner_.isExhausted() && !token){
            this.recordError_();
            this.scanner_.consume();
        }
    }

    return token;
};

/**
 * Returns true if the lexer has already created enough tokens to satisfy the current request.
 * @private
 *
 * @param {number} requestedTokens The number of tokens being requested.
 *
 * @return {boolean} True if the lexer has already created enough tokens to satisfy the current
 *      request.
 */
Lexer.prototype.hasSufficientTokens_ = function(requestedTokens){
    return this.index_ + requestedTokens <= this.tokens_.length;
};

/**
 * Once the scanner becomes readable, the lexer emits a readable event.
 * @private
 */
Lexer.prototype.scannerReadable_ = function(){
    this.emit('readable');
};

/**
 * Constucts and error for the current scanner position, stores it, and emits and error event.
 * @private
 */
Lexer.prototype.recordError_ = function(){
    var character = this.scanner_.peek();
    var error = new LexerError(this.scanner_.getLineText(), character,
        this.scanner_.getLineNumber(), this.scanner_.getCharacterNumber());
    this.errors_.push(error);
    this.emit('error', error);
};

/**
 * Creates a new LexerError
 *
 * @param {string} lineText The text of the current line.
 * @param {number} lineNumber The current line number.
 * @param {number} characterNumber The current character number.
 *
 * @constructor
 */
var LexerError = function(lineText, character, lineNumber, characterNumber){
    this.lineText_ = lineText;
    this.character_ = character;
    this.lineNumber_ = lineNumber;
    this.characterNumber_ = characterNumber;
};

/**
 * Prints the error to the console.
 */
LexerError.prototype.print = function(){
    var carats = [];
    for(var i = 1; i < this.characterNumber_; i++){
        carats.push(' ');
    }
    carats.push('^');
    console.log('Error lexing the "' +  this.character_ + '" on the following line:');
    console.log(this.lineText_);
    console.log(carats.join(''));
};

module.exports = Lexer;