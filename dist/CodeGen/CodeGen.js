let image = [];
let jumps = [];
let staticTable = new Map();
let tempCounter = 0;
let firstAssign = null;
let scoper;
class CodeGen {
    astRoot;
    codeGeneration() {
        // Initialize the result string.
        function generatePrint(node) {
            image.push("AC");
            image.push(staticTable[node.name].address);
            image.push("XX");
        }
        function generateVarDecl(node) {
            if (node.name != "string" && node.name != 'int' && node.name != 'boolean') {
                image.push('A9');
                //subject to string/int/bool
                image.push('00');
                //load into memory
                image.push('8D');
                image.push('T' + tempCounter);
                image.push('XX');
                staticTable[node.name] = { "address": 'T' + tempCounter };
                tempCounter += 1;
            }
            else {
                let declaration = node.name;
            }
        }
        function generateAssignment(node) {
            if (firstAssign == null) {
                firstAssign = node.name;
            }
            else {
                if (/^[a-z]$/.test(node.name)) {
                    //second side of assignment is a variable
                    //have to look it up
                    image.push("AD");
                    image.push(staticTable[node.name].address);
                    image.push("XX");
                    image.push("8D");
                    image.push(staticTable[firstAssign].address);
                    image.push("XX");
                }
                else {
                    image.push("A9");
                    image.push("0" + node.name);
                    image.push("8D");
                    image.push(staticTable[firstAssign].address);
                    image.push("XX");
                }
                firstAssign = null;
            }
        }
        let currentParent;
        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth) {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0) {
                // ... note the leaf node.
                if (currentParent == "VarDecl") {
                    generateVarDecl(node);
                }
                if (currentParent == "Assignment Statement") {
                    generateAssignment(node);
                }
                if (currentParent == "Print") {
                    generatePrint(node);
                }
            }
            else {
                // There are children, so note these interior/branch nodes and ...
                // .. recursively expand them.
                currentParent = node.name;
                for (var i = 0; i < node.children.length; i++) {
                    if (currentParent == "Print") {
                        expand(node.children[i], depth + 1);
                        image.push("A2");
                        image.push("01");
                        image.push("FF");
                    }
                    else {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.astRoot, 0);
        // Return the result.
    }
    ;
}
//# sourceMappingURL=CodeGen.js.map