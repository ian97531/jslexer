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
    this._lineText = lineText;
    this._character = character;
    this._lineNumber = lineNumber;
    this._characterNumber = characterNumber;
};

/**
 * Prints the error to the console.
 */
LexerError.prototype.print = function(){
    var carats = [];
    for(var i = 1; i < this._characterNumber; i++){
        carats.push(' ');
    }
    carats.push('^');
    console.log('Error lexing the "' +  this._character + '" on the following line:');
    console.log(this._lineText);
    console.log(carats.join(''));
    console.log('Line Number: ' + this._lineNumber +
                ', Character Number: ' + this._characterNumber);
    console.log('');
};

module.exports = LexerError;