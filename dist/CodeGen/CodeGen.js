let jumpTable = [];
let staticTable = [];
let tempCounter = 0;
let firstAssign = null;
let scoper;
let image = new Array(255);
let imageCounter = 0;
let staticStart = 0;
let offset = 0;
let newStatic = "";
let declaration;
let ifStatementCheck = [];
let EqualsCheck = [];
let jumpCounter = 0;
let scopeCounter = 0;
let heapCounter = 255;
let rooter = 0;
let getTableEntry;
let asciiTable = {
    a: "61", b: "62", c: "63", d: "64", e: "65", f: "66", g: "67", h: "68", i: "69", j: "6a", k: "6b", l: "6c", m: "6d", n: "6e", o: "6f",
    p: "70", q: "71", r: "72", s: "73", t: "74", u: "75", v: "76", w: "77", x: "78", y: "79", z: "7a"
};
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
        if (newStatic.length < 4) {
            newStatic = "0" + newStatic;
        }
        newStatic = newStatic.slice(2, 4) + newStatic.slice(0, 2);
    }
    populateImage() {
        let counter = 256;
        for (var i = 0; i < counter; i++) {
            image[i] = "00";
        }
    }
    backpatch() {
        for (var y = 0; y < jumpTable.length; y++) {
            if (image.includes(jumpTable[y][0])) {
                let index = image.indexOf(jumpTable[y][0]);
                image[index] = jumpTable[y][1];
            }
        }
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
    initializeBooleansInHeap() {
        let falseString = "false";
        let trueString = "true";
        image[heapCounter] = "00";
        heapCounter -= 1;
        for (var i = trueString.length - 1; i >= 0; i--) {
            image[heapCounter] = asciiTable[trueString[i]];
            heapCounter -= 1;
        }
        image[heapCounter] = "00";
        heapCounter -= 1;
        for (var i = falseString.length - 1; i >= 0; i--) {
            image[heapCounter] = asciiTable[falseString[i]];
            heapCounter -= 1;
        }
    }
    codeGeneration() {
        function arrayAlreadyHasArray(arr, subarr) {
            for (var i = 0; i < arr.length; i++) {
                let checker = false;
                for (var j = 0; j < arr[i].length; j++) {
                    if (arr[i][j] === subarr[j]) {
                        checker = true;
                    }
                    else {
                        checker = false;
                        break;
                    }
                }
                if (checker) {
                    return true;
                }
            }
            return false;
        }
        function getValueOutOfStatic(node) {
            //check if its in firstScope
            for (var x = 0; x < staticTable.length; x++) {
                if (staticTable[x][1] == node && (staticTable[x][3] == scopeCounter)) {
                    return staticTable[x];
                }
            }
            let temp = scopeCounter;
            while (temp != 0) {
                temp -= 1;
                for (var x = 0; x < staticTable.length; x++) {
                    if (staticTable[x][1] == node && staticTable[x][3] == temp) {
                        return staticTable[x];
                    }
                }
            }
        }
        // Initialize the result string.
        function generateIf(node) {
            //Case where its like if true or if false
        }
        function generateWhile(node) {
            //Case where its like while true or while false
        }
        function generateEquals(node) {
            if (node.parent.parent.name == "If Statement") {
                //Check if this if statement
                if (arrayAlreadyHasArray(ifStatementCheck, [node.parent.parent.character, node.parent.parent.line])) {
                }
                else {
                    image[imageCounter] = "AE";
                    imageCounter += 1;
                    ifStatementCheck.push([node.parent.parent.character, node.parent.parent.line]);
                }
            }
            if (/^[a-z]$/.test(node.name)) {
                let getTableEntry = getValueOutOfStatic(node.name);
                image[imageCounter] = getTableEntry[0];
                imageCounter += 1;
                image[imageCounter] = "XX";
                imageCounter += 1;
            }
            else if (/^[0-9]$/.test(node.name[0])) {
                image[imageCounter] = "A2";
                imageCounter += 1;
                image[imageCounter] = "0" + node.name;
                imageCounter += 1;
            }
            else if (node.name[0] == "'") {
            }
            else if (node.name == "true" || node.name == "false") {
            }
            if (arrayAlreadyHasArray(EqualsCheck, [node.parent.character, node.parent.line])) {
            }
            else {
                image[imageCounter] = "EC";
                imageCounter += 1;
                EqualsCheck.push([node.parent.character, node.parent.line]);
            }
        }
        function generatePrint(node) {
            //check if its a variable
            if (/^[a-z]$/.test(node.name)) {
                image[imageCounter] = "AC";
                imageCounter += 1;
                let getTableEntry = getValueOutOfStatic(node.name);
                image[imageCounter] = getTableEntry[0];
                imageCounter += 1;
                image[imageCounter] = "XX";
                imageCounter += 1;
                image[imageCounter] = "A2";
                imageCounter += 1;
                if (getTableEntry[4] == "string" || getTableEntry[4] == "boolean") {
                    image[imageCounter] = "02";
                    imageCounter += 1;
                }
                else {
                    image[imageCounter] = "01";
                    imageCounter += 1;
                }
                image[imageCounter] = "FF";
                imageCounter += 1;
            }
            //Check if its an int
            else if (/^[0-9]$/.test(node.name[0])) {
                image[imageCounter] = "A0";
                imageCounter += 1;
                image[imageCounter] = node.name;
                imageCounter += 1;
                image[imageCounter] = "A2";
                imageCounter += 1;
                image[imageCounter] = "01";
                imageCounter += 1;
                image[imageCounter] = "FF";
                imageCounter += 1;
            }
            else if (node.name[0] == "'") {
                image[imageCounter] = "A0";
                imageCounter += 1;
                populateHeap(node.name);
                //put something here for strings
                image[imageCounter] = (heapCounter + 1).toString(16);
                imageCounter += 1;
                image[imageCounter] = "A2";
                imageCounter += 1;
                image[imageCounter] = "02";
                imageCounter += 1;
                image[imageCounter] = "FF";
                imageCounter += 1;
            }
            else if (node.name == "true" || node.name == "false") {
                image[imageCounter] = "A0";
                imageCounter += 1;
                if (node.name == "true") {
                    image[imageCounter] = "FB";
                }
                else {
                    image[imageCounter] = "F5";
                }
                imageCounter += 1;
                image[imageCounter] = "A2";
                imageCounter += 1;
                image[imageCounter] = "02";
                imageCounter += 1;
                image[imageCounter] = "FF";
                imageCounter += 1;
            }
        }
        function generateVarDecl(node) {
            if (node.name != "string" && node.name != 'int' && node.name != 'boolean') {
                if (declaration != "string" && declaration != "boolean") {
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
                    staticTable.push(['T' + tempCounter.toString(), node.name, offset, scopeCounter, declaration]);
                    offset += 1;
                    tempCounter += 1;
                }
                else {
                    staticTable.push(['T' + tempCounter.toString(), node.name, offset, scopeCounter, declaration]);
                    tempCounter += 1;
                    offset += 1;
                }
            }
            else {
                declaration = node.name;
            }
        }
        function populateHeap(node) {
            image[heapCounter] = "00";
            heapCounter -= 1;
            for (var i = node.length - 1; i > 0; i--) {
                if (node[i] != "'") {
                    image[heapCounter] = asciiTable[node[i]];
                    heapCounter -= 1;
                }
            }
        }
        function generateAddition(node) {
        }
        function generateAssignment(node) {
            if (firstAssign == null) {
                firstAssign = node.name;
            }
            else {
                if (/^[a-z]$/.test(node.name)) {
                    //right side of assignment is a variable
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
                    //this side of the assigment is a string,int or boolean
                    let getTableEntry = getValueOutOfStatic(firstAssign);
                    if (getTableEntry[4] == "string" || getTableEntry[4] == "boolean") {
                        if (getTableEntry[4] == "string") {
                            populateHeap(node.name);
                        }
                        image[imageCounter] = "A9";
                        imageCounter += 1;
                        if (getTableEntry[4] == "string") {
                            image[imageCounter] = (heapCounter + 1).toString(16);
                        }
                        else if (node.name == "true") {
                            image[imageCounter] = "FC";
                        }
                        else {
                            image[imageCounter] = "F5";
                        }
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
                        image[imageCounter] = "0" + node.name.toString();
                        imageCounter += 1;
                        image[imageCounter] = "8D";
                        imageCounter += 1;
                        getTableEntry = getValueOutOfStatic(firstAssign);
                        image[imageCounter] = getTableEntry[0];
                        imageCounter += 1;
                        image[imageCounter] = "XX";
                        imageCounter += 1;
                    }
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
                if (node.parent.name == "VarDecl") {
                    generateVarDecl(node);
                }
                else if (node.parent.name == "Assignment Statement") {
                    generateAssignment(node);
                }
                else if (node.parent.name == "Print") {
                    generatePrint(node);
                }
                else if (node.parent.name == "If Statement") {
                    console.log("hello");
                    //If there is ever something in the child of an if statement.. it's going to be one thing .. true or false
                    generateIf(node);
                }
                else if (node.parent.name == "While Statement") {
                    generateWhile(node);
                }
                else if (node.parent.name == "Equals To") {
                    generateEquals(node);
                }
                else if (node.parent.name == "Addition Op") {
                    generateAddition(node);
                }
            }
            else {
                // There are children, so note these interior/branch nodes and ...
                // .. recursively expand them.
                currentParent = node.name;
                for (var i = 0; i < node.children.length; i++) {
                    if (node.name == "If Statement" && node.children[i].name == "Block") {
                        scopeCounter += 1;
                        image[imageCounter] = "D0";
                        imageCounter += 1;
                        image[imageCounter] = "J" + jumpCounter;
                        jumpTable.push(["J" + jumpCounter, imageCounter]);
                        jumpCounter += 1;
                        imageCounter += 1;
                        expand(node.children[i], depth + 1);
                        scopeCounter -= 1;
                    }
                    else if (node.children[i].name == "Block") {
                        scopeCounter += 1;
                        expand(node.children[i], depth + 1);
                        scopeCounter -= 1;
                    }
                    else if (node.children[i].name == "If Statement") {
                        expand(node.children[i], depth + 1);
                        jumpTable[jumpTable.length - 1][1] = (imageCounter - jumpTable[jumpTable.length - 1][1] - 1).toString(16);
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