let jumpTable = []
let staticTable = []
let tempCounter = 0
let firstAssign = null
let scoper;
let image = new Array(255)
let imageCounter = 0
let staticStart = 0;
let offset = 0
let whileStackmentCheck = [];
let newStatic = ""
let declaration;
let ifStatementCheck = [];
let EqualsCheck = [];
let jumpCounter = 0;
let scopeCounter = 0;
let heapCounter = 255;
let getTableEntry;
let assignmentTemp = [];
let ultParent = "";
let printTemp = 0;
let printEnd = ""
let additionStatementCheck = [];
let assignmentStatementCheck = [];
let newJumpTable = [];
class CodeGen {
    astRoot: any;
    staticCounterToHex() {
        staticStart = imageCounter;
        newStatic = staticStart.toString(16)

        if (newStatic.length < 4) {
            newStatic = "0" + newStatic
        }
        if (newStatic.length < 4) {
            newStatic = "0" + newStatic
        }
        if (newStatic.length < 4) {
            newStatic = "0" + newStatic
        }
        newStatic = newStatic.slice(2, 4) + newStatic.slice(0, 2)
    }
    populateImage() {
        let counter = 256;
        for (var i = 0; i < counter; i++) {
            image[i] = "00"
        }
    }
    backpatch() {
        for (var y = 0; y < newJumpTable.length; y++) {
            if (image.includes(newJumpTable[y][0])) {
                let index = image.indexOf(newJumpTable[y][0])
                image[index] = newJumpTable[y][1]

            }
        }
        for (var x = 0; x < staticTable.length; x++) {
            if (image.includes(staticTable[x][0])) {
                while (image.includes(staticTable[x][0])) {
                    let index = image.indexOf(staticTable[x][0])
                    image[index] = newStatic.slice(0, 2)
                    image[index + 1] = newStatic.slice(2, 4)

                }
                imageCounter += 1;
                this.staticCounterToHex()
            }

        }


    }
    initializeBooleansInHeap() {
        let falseString = "false";
        let trueString = "true";
        image[heapCounter] = "00";
        heapCounter -= 1;

        for (var i = trueString.length - 1; i >= 0; i--) {
            image[heapCounter] = trueString[i].toString().charCodeAt(0).toString(16);
            heapCounter -= 1

        }
        image[heapCounter] = "00";
        heapCounter -= 1;
        for (var i = falseString.length - 1; i >= 0; i--) {

            image[heapCounter] = falseString[i].toString().charCodeAt(0).toString(16);
            heapCounter -= 1

        }


    }
    codeGeneration() {

        function arrayAlreadyHasArray(arr, subarr) {
            for (var i = 0; i < arr.length; i++) {
                let checker = false
                for (var j = 0; j < arr[i].length; j++) {
                    if (arr[i][j] === subarr[j]) {
                        checker = true
                    } else {
                        checker = false
                        break;
                    }
                }
                if (checker) {
                    return true
                }
            }
            return false
        }
        function getValueOutOfStatic(node) {
            //check if its in firstScope
            for (var x = 0; x < staticTable.length; x++) {
                if (staticTable[x][1] == node && (staticTable[x][3] == scopeCounter)) {
                    return staticTable[x]
                }
            }
            let temp = scopeCounter
            while (temp != 0) {
                temp -= 1

                for (var x = 0; x < staticTable.length; x++) {
                    if (staticTable[x][1] == node && staticTable[x][3] == temp) {
                        return staticTable[x]
                    }
                }

            }
        }
        // Initialize the result string.
        function generateIf(node) {
            //Case where its like if true or if false
            image[imageCounter] = "A2";
            imageCounter += 1;
            if (node.name == 'true') {
                image[imageCounter] = "00"
                imageCounter += 1;
            } else {
                image[imageCounter] = "01"
                imageCounter += 1;
            }
            image[imageCounter] = "EC"
            imageCounter += 1;
            image[imageCounter] = "FF"
            imageCounter += 1;
            image[imageCounter] = "00"
            imageCounter += 1;




        }
        function generateWhile(node) {
            //Case where its like while true or while false
            image[imageCounter] = "A2";
            imageCounter += 1;
            if (node.name == 'true') {
                image[imageCounter] = "00"
                imageCounter += 1;
            } else {
                image[imageCounter] = "01"
                imageCounter += 1;
            }
            image[imageCounter] = "EC"
            imageCounter += 1;
            image[imageCounter] = "FF"
            imageCounter += 1;
            image[imageCounter] = "00"
            imageCounter += 1;
        }
        function generateEquals(node) {
            let newNode = node.name.replace(/'/g, '')
            let temp = ""
            let temp2 = ""
            temp = node.parent.children[0];
            temp2 = node.parent.children[1];
            if (node.parent.parent.name == "If Statement") {
                //Check if this if statement
                if (/^[a-z]$/.test(node.parent.children[0].name) && /^[0-9]$/.test(node.parent.children[1].name)) {
                    if (node == node.parent.children[0]) {
                        node = temp2
                    } else {
                        node = temp
                    }
                }
                if (arrayAlreadyHasArray(ifStatementCheck, [node.parent.parent.character, node.parent.parent.line]) || (/^[a-z]$/.test(node.parent.children[0].name) && /^[0-9]$/.test(node.parent.children[1].name)) ||
                    (/^[0-9]$/.test(node.parent.children[0].name) && /^[a-z]$/.test(node.parent.children[1].name)) || (/^[0-9]$/.test(node.parent.children[0].name) && /^[0-9]$/.test(node.parent.children[1].name))) {


                } else {

                    image[imageCounter] = "AE"
                    imageCounter += 1;
                    ifStatementCheck.push([node.parent.parent.character, node.parent.parent.line])
                }
                if (/^[a-z]$/.test(node.name)) {
                    let getTableEntry = getValueOutOfStatic(node.name)
                    image[imageCounter] = getTableEntry[0]
                    imageCounter += 1;
                    image[imageCounter] = "XX"
                    imageCounter += 1;
                }
                else if (/^[0-9]$/.test(node.name[0])) {
                    if (/^[0-9]$/.test(node.parent.children[0].name) && /^[0-9]$/.test(node.parent.children[1].name)) {
                        if (node == node.parent.children[1]) {
                            image[imageCounter] = "FF";
                            imageCounter += 1;
                            image[imageCounter] = "00"
                            imageCounter += 1;
                        } else {
                            image[imageCounter] = "A2"
                            imageCounter += 1;
                            if (node.parent.children[0].name == node.parent.children[1].name) {

                                image[imageCounter] = "00";
                                imageCounter += 1;
                            }
                            else {
                                image[imageCounter] = "01";
                                imageCounter += 1;
                            }

                        }
                    } else {
                        image[imageCounter] = "A2";
                        imageCounter += 1;
                        image[imageCounter] = "0" + node.name;
                        imageCounter += 1;
                    }

                }
                else if (node.name[0] == "'") {

                }
                else if (newNode == "true" || newNode == "false") {

                    if (node.name == "true") {
                        image[imageCounter] = "F5"
                        imageCounter += 1;
                        image[imageCounter] = "00"
                        imageCounter += 1;
                    }
                    else {
                        image[imageCounter] = "FB"
                        imageCounter += 1;
                        image[imageCounter] = "00"
                        imageCounter += 1;
                    }

                }
                if (arrayAlreadyHasArray(EqualsCheck, [node.parent.character, node.parent.line])) {
                }
                else {
                    image[imageCounter] = "EC"
                    imageCounter += 1;
                    EqualsCheck.push([node.parent.character, node.parent.line])
                    console.log(node.parent)
                }

            }

            //while statement
            else {
                if (/^[a-z]$/.test(node.parent.children[0].name) && /^[0-9]$/.test(node.parent.children[1].name)) {
                    if (node == node.parent.children[0]) {
                        node = temp2
                    } else {
                        node = temp
                    }
                }
                if (arrayAlreadyHasArray(whileStackmentCheck, [node.parent.parent.character, node.parent.parent.line]) || (/^[a-z]$/.test(node.parent.children[0].name) && /^[0-9]$/.test(node.parent.children[1].name)) ||
                    (/^[0-9]$/.test(node.parent.children[0].name) && /^[a-z]$/.test(node.parent.children[1].name)) || (/^[0-9]$/.test(node.parent.children[0].name) && /^[0-9]$/.test(node.parent.children[1].name))) {


                } else {

                    image[imageCounter] = "AE"
                    imageCounter += 1;
                    whileStackmentCheck.push([node.parent.parent.character, node.parent.parent.line])
                }
                if (/^[a-z]$/.test(node.name)) {
                    let getTableEntry = getValueOutOfStatic(node.name)
                    image[imageCounter] = getTableEntry[0]
                    imageCounter += 1;
                    image[imageCounter] = "XX"
                    imageCounter += 1;
                }
                else if (/^[0-9]$/.test(node.name[0])) {
                    if (/^[0-9]$/.test(node.parent.children[0].name) && /^[0-9]$/.test(node.parent.children[1].name)) {
                        if (node == node.parent.children[1]) {
                            image[imageCounter] = "FF";
                            imageCounter += 1;
                            image[imageCounter] = "00"
                            imageCounter += 1;
                        } else {
                            image[imageCounter] = "A2"
                            imageCounter += 1;
                            if (node.parent.children[0].name == node.parent.children[1].name) {

                                image[imageCounter] = "00";
                                imageCounter += 1;
                            }
                            else {
                                image[imageCounter] = "01";
                                imageCounter += 1;
                            }

                        }
                    } else {
                        image[imageCounter] = "A2";
                        imageCounter += 1;
                        image[imageCounter] = "0" + node.name;
                        imageCounter += 1;
                    }

                }
                else if (node.name[0] == "'") {

                }
                else if (newNode == "true" || newNode == "false") {

                    if (node.name == "true") {
                        image[imageCounter] = "F5"
                        imageCounter += 1;
                        image[imageCounter] = "00"
                        imageCounter += 1;
                    }
                    else {
                        image[imageCounter] = "FB"
                        imageCounter += 1;
                        image[imageCounter] = "00"
                        imageCounter += 1;
                    }

                }
                if (arrayAlreadyHasArray(EqualsCheck, [node.parent.character, node.parent.line])) {
                }
                else {
                    image[imageCounter] = "EC"
                    imageCounter += 1;
                    EqualsCheck.push([node.parent.character, node.parent.line])
                }

                
            }

        }
        function generatePrint(node) {

            //check if its a variable
            if (/^[a-z]$/.test(node.name)) {
                image[imageCounter] = "AC"
                imageCounter += 1;
                let getTableEntry = getValueOutOfStatic(node.name)
                image[imageCounter] = getTableEntry[0]
                imageCounter += 1;
                image[imageCounter] = "XX"
                imageCounter += 1;
                image[imageCounter] = "A2"
                imageCounter += 1;
                if (getTableEntry[4] == "string" || getTableEntry[4] == "boolean") {
                    image[imageCounter] = "02"
                    imageCounter += 1;
                } else {
                    image[imageCounter] = "01"
                    imageCounter += 1;
                }

                image[imageCounter] = "FF"
                imageCounter += 1;
            }
            //Check if its an int
            else if (/^[0-9]$/.test(node.name[0])) {
                image[imageCounter] = "A0"
                imageCounter += 1;
                image[imageCounter] = node.name
                imageCounter += 1;
                image[imageCounter] = "A2"
                imageCounter += 1;
                image[imageCounter] = "01"
                imageCounter += 1;
                image[imageCounter] = "FF"
                imageCounter += 1;

            }
            else if (node.name[0] == "'") {
                image[imageCounter] = "A0"
                imageCounter += 1;
                populateHeap(node.name)
                //put something here for strings
                image[imageCounter] = (heapCounter + 1).toString(16);
                imageCounter += 1;
                image[imageCounter] = "A2"
                imageCounter += 1;
                image[imageCounter] = "02"
                imageCounter += 1;
                image[imageCounter] = "FF"
                imageCounter += 1;
            }
            else if (node.name == "true" || node.name == "false") {
                image[imageCounter] = "A0"
                imageCounter += 1;
                if (node.name == "true") {
                    image[imageCounter] = "FA"
                }
                else {
                    image[imageCounter] = "F5"
                }
                imageCounter += 1;

                image[imageCounter] = "A2"
                imageCounter += 1;
                image[imageCounter] = "02"
                imageCounter += 1;
                image[imageCounter] = "FF"
                imageCounter += 1;
            }

        }
        function generateVarDecl(node) {
            if (node.name != "string" && node.name != 'int' && node.name != 'boolean') {

                if (declaration != "string" && declaration != "boolean") {
                    image[imageCounter] = 'A9'
                    imageCounter += 1;
                    //subject to string/int/bool
                    image[imageCounter] = '00'
                    imageCounter += 1;
                    //load into memory
                    image[imageCounter] = '8D'
                    imageCounter += 1;

                    image[imageCounter] = 'T' + tempCounter
                    imageCounter += 1;

                    image[imageCounter] = 'XX'
                    imageCounter += 1;

                    staticTable.push(['T' + tempCounter.toString(), node.name, offset, scopeCounter, declaration])
                    offset += 1;
                    tempCounter += 1;
                } else {
                    staticTable.push(['T' + tempCounter.toString(), node.name, offset, scopeCounter, declaration])
                    tempCounter += 1;
                    offset += 1;


                }

            } else {
                declaration = node.name
            }

        }
        function populateHeap(node) {
            image[heapCounter] = "00";
            heapCounter -= 1;

            for (var i = node.length - 1; i > 0; i--) {
                if (node[i] != "'") {
                    image[heapCounter] = node[i].toString().charCodeAt(0).toString(16);

                    heapCounter -= 1
                }
            }

        }
        function generateAddition(node) {
            if (firstAssign != null) {
                if (/^[a-z]$/.test(node.name)) {
                    assignmentTemp.push("AD");
                    let getTableEntry = getValueOutOfStatic(node.name);
                    assignmentTemp.push(getTableEntry[0]);
                    assignmentTemp.push("00");
                }
                else {
                    assignmentTemp.push("A9");
                    assignmentTemp.push("0" + node.name.toString());

                }
                assignmentTemp.push("6D");
                let getTableEntry = getValueOutOfStatic(firstAssign)
                assignmentTemp.push(getTableEntry[0]);
                assignmentTemp.push("00");
                assignmentTemp.push("8D");
                getTableEntry = getValueOutOfStatic(firstAssign)
                assignmentTemp.push(getTableEntry[0])
                assignmentTemp.push("00");
            }
            else if (ultParent == "Print") {
                if (/^[a-z]$/.test(node.name)) {
                    printEnd += node.name
                } else {
                    printTemp += parseInt(node.name)

                }
            }

        }
        //For String comparisons
        function checkEveryElementInArray(node) {
            node = node.replace(/'/g, '')
            let index = node.length - 1
            for (var i = 255; i >= heapCounter; i--) {
                if (String.fromCharCode(parseInt(image[i], 16)).localeCompare(node[index]) == 0) {

                    index -= 1;
                    if (index < 0) {
                        return true
                    }
                }
                else {
                    index = node.length - 1
                }
            }
            return false;
        }
        function generateAssignment(node) {
            if (firstAssign == null) {
                firstAssign = node.name

            } else {
                if (/^[a-z]$/.test(node.name)) {
                    //right side of assignment is a variable
                    //have to look it up
                    image[imageCounter] = "AD"
                    imageCounter += 1;
                    let getTableEntry = getValueOutOfStatic(node.name)
                    image[imageCounter] = getTableEntry[0]
                    imageCounter += 1;

                    image[imageCounter] = "XX"
                    imageCounter += 1;

                    image[imageCounter] = "8D"
                    imageCounter += 1;
                    getTableEntry = getValueOutOfStatic(firstAssign)

                    image[imageCounter] = getTableEntry[0]
                    imageCounter += 1;
                    image[imageCounter] = "XX"
                    imageCounter += 1;


                } else {
                    //this side of the assigment is a string,int or boolean
                    let getTableEntry = getValueOutOfStatic(firstAssign)
                    if (getTableEntry[4] == "string" || getTableEntry[4] == "boolean") {
                        if (getTableEntry[4] == "string" && checkEveryElementInArray(node.name)) {

                        } else {
                            populateHeap(node.name)

                        }
                        image[imageCounter] = "A9"
                        imageCounter += 1;
                        if (getTableEntry[4] == "string") {
                            image[imageCounter] = (heapCounter + 1).toString(16);
                        }
                        else if (node.name == "true") {
                            image[imageCounter] = "FB"

                        }
                        else {
                            image[imageCounter] = "F5"
                        }



                        imageCounter += 1;
                        image[imageCounter] = "8D"
                        imageCounter += 1;
                        getTableEntry = getValueOutOfStatic(firstAssign)
                        image[imageCounter] = getTableEntry[0]
                        imageCounter += 1;
                        image[imageCounter] = "XX"
                        imageCounter += 1;
                    } else {
                        image[imageCounter] = "A9"
                        imageCounter += 1;
                        image[imageCounter] = "0" + node.name.toString();
                        imageCounter += 1;
                        image[imageCounter] = "8D"
                        imageCounter += 1;
                        getTableEntry = getValueOutOfStatic(firstAssign)
                        image[imageCounter] = getTableEntry[0]
                        imageCounter += 1;
                        image[imageCounter] = "XX"
                        imageCounter += 1;
                    }

                }
                firstAssign = null

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
                    generateVarDecl(node)
                }
                else if (node.parent.name == "Assignment Statement") {
                    generateAssignment(node)
                }
                else if (node.parent.name == "Print") {

                    generatePrint(node);

                }
                else if (node.parent.name == "If Statement") {
                    //If there is ever something in the child of an if statement.. it's going to be one thing .. true or false
                    generateIf(node);

                }
                else if (node.parent.name == "While Statement") {
                    generateWhile(node);
                }
                else if (node.parent.name == "Equals To") {

                    generateEquals(node);
                }
                else if (node.parent.name == "Not Equals To"){

                }
                else if (node.parent.name == "Addition Op") {
                    generateAddition(node);
                }






            }
            else {
                // There are children, so note these interior/branch nodes and ...
                // .. recursively expand them.
                currentParent = node.name

                for (var i = 0; i < node.children.length; i++) {

                    if (node.name == "If Statement" && node.children[i].name == "Block") {

                        scopeCounter += 1;
                        image[imageCounter] = "D0"
                        imageCounter += 1;
                        image[imageCounter] = "J" + jumpCounter

                        jumpTable.push(["J" + jumpCounter, imageCounter])
                        jumpCounter += 1;
                        imageCounter += 1;
                        expand(node.children[i], depth + 1);
                        scopeCounter -= 1
                    }
                    else if (node.name == "While Statement" && node.children[i].name == "Block"){
                        scopeCounter += 1;
                        image[imageCounter] = "D0"
                        imageCounter += 1;
                        image[imageCounter] = "J" + jumpCounter

                        jumpTable.push(["J" + jumpCounter, imageCounter])
                        jumpCounter += 1;
                        imageCounter += 1;
                        expand(node.children[i], depth + 1);
                        scopeCounter -= 1
                    }
                    else if (node.children[i].name == "Block") {


                        scopeCounter += 1;
                        expand(node.children[i], depth + 1);
                        scopeCounter -= 1
                    }
                    else if (node.children[i].name == "Print") {
                        ultParent = "Print"
                        expand(node.children[i], depth + 1);
                        if (printTemp != 0) {
                            if (printEnd != "") {
                                image[imageCounter] = "A9"
                                imageCounter += 1;
                                image[imageCounter] = printTemp.toString(16);
                                imageCounter += 1;
                                image[imageCounter] = "6D";
                                imageCounter += 1;
                                let getTableEntry = getValueOutOfStatic(printEnd)
                                image[imageCounter] = getTableEntry[0]
                                imageCounter += 1;
                                image[imageCounter] = "XX"
                                imageCounter += 1;
                                image[imageCounter] = "8D"
                                imageCounter += 1;
                                image[imageCounter] = heapCounter.toString(16);
                                imageCounter += 1;
                                image[imageCounter] = "00"
                                imageCounter += 1;
                                image[imageCounter] = "AC"
                                imageCounter += 1;
                                image[imageCounter] = heapCounter.toString(16);
                                heapCounter -= 3
                                imageCounter += 1;
                                image[imageCounter] = "00"
                                imageCounter += 1;
                                image[imageCounter] = "A2"
                                imageCounter += 1;
                                image[imageCounter] = "01"
                                imageCounter += 1;
                                image[imageCounter] = "FF"
                                imageCounter + 1;
                            }
                            else {
                                image[imageCounter] = "A0"
                                imageCounter += 1;
                                image[imageCounter] = printTemp.toString(16);
                                imageCounter += 1;
                                image[imageCounter] = "A2"
                                imageCounter += 1;
                                image[imageCounter] = "01"
                                imageCounter += 1;
                                image[imageCounter] = "FF"
                                imageCounter += 1;
                            }


                        }
                        printEnd = ""
                        printTemp = 0;
                        ultParent = ""
                    }
                    else if (node.children[i].name == "Assignment Statement") {
                        expand(node.children[i], depth + 1);
                        if (assignmentTemp.length != 0) {
                            if (assignmentTemp.includes("AD")) {
                                let getRidOfAD = assignmentTemp.indexOf("AD")
                                let assignment = assignmentTemp.slice(getRidOfAD, assignmentTemp.length);
                                for (var x = 0; x < assignment.length; x++) {
                                    image[imageCounter] = assignment[x];
                                    imageCounter += 1;
                                }
                                for (var x = 0; x < getRidOfAD; x++) {
                                    image[imageCounter] = assignmentTemp[x];
                                    imageCounter += 1;
                                }

                            }
                            else {
                                for (var x = 0; x < assignmentTemp.length; x++) {
                                    image[imageCounter] = assignmentTemp[x];
                                    imageCounter += 1;
                                }
                            }

                            firstAssign = null;
                            assignmentTemp = [];
                        }


                    }

                    else if (node.children[i].name == "If Statement") {

                        expand(node.children[i], depth + 1);
                        

                        jumpTable[jumpTable.length - 1][1] = (imageCounter - jumpTable[jumpTable.length - 1][1] - 1).toString(16);
                        newJumpTable.push(jumpTable.pop())

                    }
                    else if (node.children[i].name == "While Statement"){
                        expand(node.children[i], depth + 1);
                        jumpTable[jumpTable.length - 1][1] = (imageCounter - jumpTable[jumpTable.length - 1][1] - 1).toString(16);
                        newJumpTable.push(jumpTable.pop())

                    }

                    else {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
        }
        // Make the initial call to expand from the root.
        expand(this.astRoot, 0);
        image[imageCounter] = "00"
        imageCounter += 1;
        // Return the result.

    };




}