/**
  * This file defines the Token class. The Lexer creates instances of the Token class as it consumes
  * characters from its input stream of source text. The token instance captures the text that
  * corresponds to that token, the token type (defined by the language module for that language),
  * and the line number and character number where the token started.
  */

/**
 * Creates and returns a token, given the text, type, line, and characters.
 *
 * @param {string} text The string that the token represents.
 * @param {TOKEN_TYPE} type The type of the token to be created.
 * @param {number} line The line number in the source code where the token starts.
 * @param {number} character The character number in source code where the token starts.
 *
 * @return {Object} The newly created token object.
 */
function Token(text, type, line, character){
    this.token_ = Object.freeze({
        text: text,
        type: type,
        line: line,
        character: character
    });
}

Token.prototype = {
    toJSON: function(){
        return this.token_;
    },

    getText: function(){
        return this.token_.text;
    },

    getType: function(){
        return this.token_.type;
    },

    getLineNumber: function(){
        return this.token_.line;
    },

    getCharacterNumber: function(){
        return this.token_.character;
    }
};

module.exports = Token;