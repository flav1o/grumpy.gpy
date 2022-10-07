const nearley = require("nearley");
const grammar = require("./grumpy.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

try {
	parser.feed("var->12.3");
	console.log(parser.results);
} catch (e) {
	console.log("error => ", e.message);
}
