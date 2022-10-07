const nearley = require("nearley");
const grammar = require("./grumpy.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

try {
	parser.feed("helloHolder->hello");
	console.log(parser.results);
} catch (e) {
	console.log("error => ", e.message);
}
