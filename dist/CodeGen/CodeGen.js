let jumps = [];
let staticTable = [];
let tempCounter = 0;
let firstAssign = null;
let scoper;
let image = new Array();
let imageCounter = 0;
let staticStart = 0;
let offset = 0;
let newStatic = "";
class CodeGen {
    astRoot;
    staticCounterToHex() {
        staticStart = imageCounter;
        newStatic = staticStart.toString(16);
        if (newStatic.length < 4) {
            newStatic = "0" + newStatic;
        }
        if (newStatic.length < 4) {
            newStatic = "0" + newStatic;
        }
        newStatic = newStatic.slice(2, 4) + newStatic.slice(0, 2);
    }
    backpatch() {
        for (var x = 0; x < staticTable.length; x++) {
            if (image.includes(staticTable[x][0])) {
                while (image.includes(staticTable[x][0])) {
                    let index = image.indexOf(staticTable[x][0]);
                    image[index] = newStatic.slice(0, 2);
                    image[index + 1] = newStatic.slice(2, 4);
                }
                imageCounter += 1;
                this.staticCounterToHex();
            }
        }
    }
    codeGeneration() {
        function getValueOutOfStatic(node) {
            for (var x = 0; x < staticTable.length; x++) {
                if (staticTable[x][1] == node) {
                    return staticTable[x];
                }
            }
        }
        // Initialize the result string.
        function generatePrint(node) {
            image[imageCounter] = "AC";
            imageCounter += 1;
            let getTableEntry = getValueOutOfStatic(node.name);
            image[imageCounter] = getTableEntry[0];
            imageCounter += 1;
            image[imageCounter] = "XX";
            imageCounter += 1;
        }
        function generateVarDecl(node) {
            if (node.name != "string" && node.name != 'int' && node.name != 'boolean') {
                image[imageCounter] = 'A9';
                imageCounter += 1;
                //subject to string/int/bool
                image[imageCounter] = '00';
                imageCounter += 1;
                //load into memory
                image[imageCounter] = '8D';
                imageCounter += 1;
                image[imageCounter] = 'T' + tempCounter;
                imageCounter += 1;
                image[imageCounter] = 'XX';
                imageCounter += 1;
                staticTable.push(['T' + tempCounter.toString(), node.name, offset]);
                console.log(staticTable);
                offset += 1;
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
                    image[imageCounter] = "AD";
                    imageCounter += 1;
                    let getTableEntry = getValueOutOfStatic(node.name);
                    image[imageCounter] = getTableEntry[0];
                    imageCounter += 1;
                    image[imageCounter] = "XX";
                    imageCounter += 1;
                    image[imageCounter] = "8D";
                    imageCounter += 1;
                    getTableEntry = getValueOutOfStatic(firstAssign);
                    image[imageCounter] = getTableEntry[0];
                    imageCounter += 1;
                    image[imageCounter] = "XX";
                    imageCounter += 1;
                }
                else {
                    image[imageCounter] = "A9";
                    imageCounter += 1;
                    image[imageCounter] = "0" + node.name;
                    imageCounter += 1;
                    image[imageCounter] = "8D";
                    imageCounter += 1;
                    let getTableEntry = getValueOutOfStatic(firstAssign);
                    console.log(firstAssign);
                    console.log(staticTable);
                    image[imageCounter] = getTableEntry[0];
                    imageCounter += 1;
                    image[imageCounter] = "XX";
                    imageCounter += 1;
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
                        image[imageCounter] = "A2";
                        imageCounter += 1;
                        image[imageCounter] = "01";
                        imageCounter += 1;
                        image[imageCounter] = "FF";
                        imageCounter += 1;
                    }
                    else {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.astRoot, 0);
        image[imageCounter] = "00";
        imageCounter += 1;
        // Return the result.
    }
    ;
}
//# sourceMappingURL=CodeGen.js.map