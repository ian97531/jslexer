/**
 * This file provides the rules that are used by the lexer to separate the characters in a
 * JavaScript source file into their corresponding token types.
 */

var identifiers = require('./identifiers').IDENTIFIER;
var startCharacters = require('./identifiers').START_CHARACTERS;
var tokenTypes = require('./tokens');

/**
 * Rule definitions for lexing JavaScript files.
 */

/**
 * Rules used strings to tokens. Each rule contains a string, regular expression or function that
 * can be used to identify the next token in the character stream.
 * @type {Array<Object>}
 * @const
 * @static
 */
var RULES = [
    {
        regex: new RegExp(identifiers),
        type: tokenTypes.IDENTIFIER
    },{
        string: 'do',
        type: tokenTypes.DO_STATEMENT
    }, {
        string: 'if',
        type: tokenTypes.IF_STATEMENT
    }, {
        string: 'in',
        type: tokenTypes.IN_STATEMENT
    }, {
        string: 'for',
        type: tokenTypes.FOR_STATEMENT
    }, {
        string: 'let',
        type: tokenTypes.LET_STATEMENT
    }, {
        string: 'new',
        type: tokenTypes.NEW_OPERATOR
    }, {
        string: 'try',
        type: tokenTypes.TRY_STATEMENT
    }, {
        string: 'var',
        type: tokenTypes.VAR_STATEMENT
    }, {
        string: 'case',
        type: tokenTypes.CASE_STATEMENT
    }, {
        string: 'else',
        type: tokenTypes.ELSE_STATEMENT
    }, {
        string: 'enum',
        type: tokenTypes.ENUM_STATEMENT
    }, {
        string: 'false',
        type: tokenTypes.BOOLEAN_LITERAL
    }, {
        string: 'null',
        type: tokenTypes.NULL_LITERAL
    }, {
        string: 'this',
        type: tokenTypes.THIS_IDENTIFIER
    }, {
        string: 'true',
        type: tokenTypes.NULL_LITERAL
    }, {
        string: 'void',
        type: tokenTypes.VOID_OPERATOR
    }, {
        string: 'with',
        type: tokenTypes.WITH_STATEMENT
    }, {
        string: 'break',
        type: tokenTypes.BREAK_STATEMENT
    }, {
        string: 'catch',
        type: tokenTypes.CATCH_STATEMENT
    }, {
        string: 'class',
        type: tokenTypes.DEAD_KEYWORD
    }, {
        string: 'const',
        type: tokenTypes.CONST_STATEMENT
    }, {
        string: 'super',
        type: tokenTypes.DEAD_KEYWORD
    }, {
        string: 'throw',
        type: tokenTypes.THROW_STATEMENT
    }, {
        string: 'while',
        type: tokenTypes.WHILE_STATEMENT
    }, {
        string: 'yield',
        type: tokenTypes.YIELD_STATEMENT
    }, {
        string: 'delete',
        type: tokenTypes.DELETE_OPERATOR
    }, {
        string: 'export',
        type: tokenTypes.EXPORT_STATEMENT
    }, {
        string: 'import',
        type: tokenTypes.IMPORT_STATEMENT
    }, {
        string: 'public',
        type: tokenTypes.FUTURE_KEYWORD
    }, {
        string: 'return',
        type: tokenTypes.RETURN_STATEMENT
    }, {
        string: 'static',
        type: tokenTypes.FUTURE_KEYWORD
    }, {
        string: 'switch',
        type: tokenTypes.SWITCH_STATEMENT
    }, {
        string: 'typeof',
        type: tokenTypes.TYPEOF_OPERATOR
    }, {
        string: 'default',
        type: tokenTypes.DEFAULT_KEYWORD
    }, {
        string: 'extends',
        type: tokenTypes.DEAD_KEYWORD
    }, {
        string: 'finally',
        type: tokenTypes.FINALLY_STATEMENT
    }, {
        string: 'package',
        type: tokenTypes.FUTURE_KEYWORD
    }, {
        string: 'private',
        type: tokenTypes.FUTURE_KEYWORD
    }, {
        string: 'continue',
        type: tokenTypes.CONTINUE_STATEMENT
    }, {
        string: 'debugger',
        type: tokenTypes.DEBUGGER_STATEMENT
    }, {
        string: 'function',
        type: tokenTypes.FUNCTION_STATEMENT
    }, {
        string: 'arguments',
        type: tokenTypes.ARGS_IDENTIFIER
    }, {
        string: 'interface',
        type: tokenTypes.FUTURE_KEYWORD
    }, {
        string: 'protected',
        type: tokenTypes.FUTURE_KEYWORD
    }, {
        string: 'implements',
        type: tokenTypes.FUTURE_KEYWORD
    }, {
        string: '}',
        type: tokenTypes.CLOSE_BRACE
    }, {
        string: '{',
        type: tokenTypes.OPEN_BRACE
    }, {
        string: '(',
        type: tokenTypes.OPEN_PAREN
    }, {
        string: ')',
        type: tokenTypes.CLOSE_PAREN
    }, {
        string: '[',
        type: tokenTypes.OPEN_BRACKET
    }, {
        string: ']',
        type: tokenTypes.CLOSE_BRACKET
    }, {
        regex: new RegExp('//[^\n]+'),
        type: tokenTypes.COMMENT
    }, {
        regex: new RegExp('/\\*(?:.|\n)*?\\*\\/'),
        type: tokenTypes.COMMENT
    }, {
        regex: new RegExp('[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?(?!' + startCharacters + ')'),
        type: tokenTypes.NUMBER_LITERAL
    }, {
        regex: new RegExp('0(?:x|X)[0-9A-Fa-f]+(?!' + startCharacters + ')'),
        type: tokenTypes.NUMBER_LITERAL
    },  {
        regex: new RegExp('(?:\\+|-)?Infinity'),
        type: tokenTypes.NUMBER_LITERAL
    }, {
        string: 'NaN',
        type: tokenTypes.NUMBER_LITERAL
    }, {
        string: 'undefined',
        type: tokenTypes.UNDEFINED_LITERAL
    }, {
        string: ';',
        type: tokenTypes.SEMICOLON
    }, {
        regex: new RegExp('\'.*?[^\\\\]?\''),
        type: tokenTypes.STRING
    }, {
        regex: new RegExp('".*?[^\\\\]?"'),
        type: tokenTypes.STRING
    }, {
        regex: new RegExp('\\s+'),
        type: tokenTypes.WHITESPACE
    }, {
        string: '>>>=',
        type: tokenTypes.ZERO_FILL_RIGHT_SHIFT_ASSIGNMENT_OPERATOR
    }, {
        string: '===',
        type: tokenTypes.STRICT_EQUAL_OPERATOR
    }, {
        string: '!==',
        type: tokenTypes.STRICT_NOT_EQUAL_OPERATOR
    }, {
        string: '<<=',
        type: tokenTypes.LEFT_SHIFT_ASSIGNMENT_OPERATOR
    }, {
        string: '>>=',
        type: tokenTypes.RIGHT_SHIFT_ASSIGNMENT_OPERATOR
    }, {
        string: '>>>',
        type: tokenTypes.ZERO_FILL_RIGHT_SHIFT_OPERATOR
    }, {
        string: '||',
        type: tokenTypes.LOGICAL_OR_OPERATOR
    }, {
        string: '|=',
        type: tokenTypes.BITWISE_OR_OPERATOR
    }, {
        string: '+=',
        type: tokenTypes.ADDITION_ASSIGNMENT_OPERATOR
    }, {
        string: '-=',
        type: tokenTypes.SUBTRACTION_ASSIGNMENT_OPERATOR
    }, {
        string: '*=',
        type: tokenTypes.MULTIPLICATION_ASSIGNMENT_OPERATOR
    }, {
        string: '/=',
        type: tokenTypes.DIVISION_ASSIGNMENT_OPERATOR
    }, {
        string: '%=',
        type: tokenTypes.REMAINDER_ASSIGNMENT_OPERATOR
    }, {
        string: '&=',
        type: tokenTypes.BITWISE_AND_ASSIGNMENT_OPERATOR
    }, {
        string: '^=',
        type: tokenTypes.BITWISE_XOR_ASSIGNMENT_OPERATOR
    }, {
        string: '==',
        type: tokenTypes.EQUAL_OPERATOR
    }, {
        string: '!=',
        type: tokenTypes.NOT_EQUAL_OPERATOR
    }, {
        string: '<<',
        type: tokenTypes.LEFT_SHIFT_OPERATOR
    }, {
        string: '>>',
        type: tokenTypes.RIGHT_SHIFT_OPERATOR
    }, {
        string: '>=',
        type: tokenTypes.GREATER_THAN_EQUAL_OPERATOR
    }, {
        string: '<=',
        type: tokenTypes.LESS_THAN_EQUAL_OPERATOR
    }, {
        string: '++',
        type: tokenTypes.INCREMENT_OPERATOR
    }, {
        string: '--',
        type: tokenTypes.DECREMENT_OPERATOR
    }, {
        string: '&&',
        type: tokenTypes.LOGICAL_AND_OPERATOR
    }, {
        string: '=',
        type: tokenTypes.ASSIGNMENT_OPERATOR
    }, {
        string: '|',
        type: tokenTypes.BITWISE_OR_OPERATOR
    }, {
        string: '!',
        type: tokenTypes.LOGICAL_NOT_OPERATOR
    }, {
        string: '&',
        type: tokenTypes.BITWISE_AND_OPERATOR
    }, {
        string: '>',
        type: tokenTypes.GREATER_THAN_OPERATOR
    }, {
        string: '<',
        type: tokenTypes.LESS_THAN_OPERATOR
    }, {
        string: '%',
        type: tokenTypes.REMAINDER_OPERATOR
    }, {
        string: '^',
        type: tokenTypes.BITWISE_XOR_OPERATOR
    }, {
        string: '~',
        type: tokenTypes.BITWISE_NOT_OPERATOR
    }, {
        string: '+',
        type: tokenTypes.ADDITION_OPERATOR
    }, {
        string: '-',
        type: tokenTypes.SUBTRACTION_OPERATOR
    }, {
        string: '*',
        type: tokenTypes.MULTIPLICATION_OPERATOR
    }, {
        string: '/',
        type: tokenTypes.DIVISION_OPERATOR
    }, {
        string: '?',
        type: tokenTypes.TERNARY_OPERATOR
    }, {
        string: ':',
        type: tokenTypes.COLON
    }, {
        string: ',',
        type: tokenTypes.COMMA
    }, {
        string: '.',
        type: tokenTypes.PERIOD
    }
];

module.exports = RULES;
