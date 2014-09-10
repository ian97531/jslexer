#jslexer


A Lexer class that conforms to the stream.Transform protocol. The lexer expects source text to be piped into it, and will produce Token instances as defined in the jsdefinition.js file. 


###Example Usage

The lexer-demo.js file is included as a harness to allow you to easily test the functionality of the Lexer. Any file path that you pass in as the final argument will be converted into a series of tokens and output to stdout by the script.

```Shell
$> node lexer-demo.js ./lexer-demo.js
```

The demo script uses creates an fs.ReadStream to start streaming the contents of the file passed into the script as an argument. The output of this read stream is then piped into an instance of the Lexer class which transforms the stream from text to instances of the Token class. 

jslexer includes convenience class called TokenStringifier. The lexer-demo.js script pipes the token stream output of the Lexer  into an instance of the TokenStringifier class to convert the tokens into strings that are subsequently piped to stdout so that you can see each token on the command line as it’s created.

###Lexer Class

The Lexer class is instantiated with two required parameters, and an optional third parameter.

The first parameter is a required array of rules to be used by that instance when parsing any incoming text. The format for these rules is explained below in the Rules section of this document. The rules tell the lexer how to identify the various token types.

The second parameter is the line separator character that should be used by the the lexer. This is used to help the lexer understand which line number to associate with each token.

The optional third parameter is an options dictionary that is passed to the stream.Transform parent class constructor.

As with any classes that implement the stream.Readable protocol, this class can be used in flowing or non-flowing mode. In non-flowing mode, a ‘readable’ event will be emitted any time tokens are available to be consumed. The user can then call Lexer.read to receive these tokens one at a time. If the user attaches an an event listener, this will cause the lexer to enter flowing mode. The lexer will emit a ‘data’ event as soon as a token is available.

###Token Class

Included with the Lexer class is a Token class that defines the format for tokens emitted by the lexer. Below is an example token:

```JSON
{
	"text":"pipe",
	"type":"IDENTIFIER",
	"line":20,
	"character":6
}
```

The rules used to tokenize incoming source code, and the set of token type values available are defined in the jsdefinitions.js file. See the Rules section for more information on the jsdefinitions.js file.

###Rules

Rules used by the Lexer to define tokens have a simple format and come in two flavors: string-based rules and regular expression-based rules.

An example string-based rule might look like this:
```JavaScript
{ 
	string: ‘do’,
	type: ‘DO_STATEMENT’
}
```

An example regular expression-based rule might look like this:
```JavaScript
{ 
	regex: new RegExp('/\\*(?:.|\n)*?\\*\\/'),
	type: ‘COMMENT’
}
```

###Error Handling
When the Lexer encounters a location in the incoming source at which point none of the provided rules match the upcoming characters, a LexerError is instantiated and emitted with an ‘error’ event. 

The LexerError instance will contain the line of text that contained the error, the line number and character number where the occurred, as well as the character the lexer was positioned at when the error occurred.

You can use the LexerError.print method to print a user-friendly error message to the console.

After emitting the error, the lexer will advance one character and continue to attempt to match rules.
