const _ = require("lodash");
const fs = require("mz/fs");
const path = require("path");
const operatorMap = require("./operatorMap");

let declaredVariables = [];

async function main() {
    const filename = process.argv[2];
    const outputFile = path.basename(filename, ".ast") + ".js";
    const code = (await fs.readFile(filename)).toString();
    const ast = JSON.parse(code);
    const jsCode = generateJS(_.head(ast));
    await fs.writeFile(outputFile, jsCode);
}

function generateJS(statements) {
    const lines = [];

    for (let statement of statements) {
        if (statement.type === "var_assignment") {
            const value = generateJSForExpression(statement.value);
            if (isVariableDeclared(statement.variableName)) {
                lines.push(`${statement.varname} = ${value};`);
                console.log("declared")
            } else {
                lines.push(`let ${statement.varname} = ${value};`);
                declaredVariables.push(statement.varname);
            }
        }
        if (statement.type === "print_statement") {
            const expression = generateJSForExpression(statement.expression);
            console.log(expression);
            lines.push(`console.log(${expression});`);

        }
        if (statement.type === "while_loop") {
            console.log(statement);
            const condition = generateJSForExpression(statement.condition);
            const body = generateJS(statement.body);
            lines.push(`while (${condition}) {`);
            lines.push(body);
            lines.push("}");
        }
    }
    return lines.join("\n");
}

function generateJSForExpression(expression) {
    if (typeof expression === "object") {
        if (expression.type === "binary_expression") {
            const left = generateJSForExpression(expression.left);
            const right = generateJSForExpression(expression.right);
            const operator = operatorMap[expression.operator];
            return `${left} ${operator} ${right}`;
        }
    } else {
        return expression;
    }
}

function isVariableDeclared(variableName) {
    return _.flatten(declaredVariables.includes(variableName));
}

main();