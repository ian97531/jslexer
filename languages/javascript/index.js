/**
 * This module provides the rules, token types, and line separating character used to lex source
 * files in the JavaScript/ECMAScript language.
 */

var RULES = require('./rules');
var TOKENS = require('./tokens');

var LINE_SEPARATOR = '\n';

module.exports = {
    LINE_SEPARATOR: LINE_SEPARATOR,
    RULES: RULES,
    TOKENS: TOKENS
};