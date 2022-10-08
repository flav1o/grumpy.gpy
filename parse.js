const nearley = require("nearley");
const grammar = require("./grumpy.js");
const fs = require("mz/fs");
const path = require("path");

async function main() {
	const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
	const filename = process.argv[2];
	const outputFile = path.basename(filename, ".gpy") + ".ast";
	const code = (await fs.readFile(filename)).toString();

	try {
		parser.feed(code);
		const ast = parser.results;
		await fs.writeFile(outputFile, JSON.stringify(ast));

		console.log(JSON.stringify(parser.results, null, 4));
	} catch (e) {
		console.log("error => ", JSON.stringify(e.message, null, 4));
	}
}

main();