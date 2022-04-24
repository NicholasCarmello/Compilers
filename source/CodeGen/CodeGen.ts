let jumpTable = []
let staticTable = []
let tempCounter = 0
let firstAssign = null
let scoper;
let image = new Array(256)
let imageCounter = 0
let staticStart = 0;
let offset = 0
let newStatic = ""
let declaration;
let ifStatementCheck = [];
let EqualsCheck = [];
let jumpCounter = 0;
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
        newStatic = newStatic.slice(2, 4) + newStatic.slice(0, 2)

    }

    backpatch() {
        for( var y = 0; y < jumpTable.length; y ++){
            if (image.includes(jumpTable[y][0])){
                let index = image.indexOf(jumpTable[y][0])
                image[index] = jumpTable[y][1]

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
     initializeBooleansInHeap(){
        image[256] = '00'
        image[255] = '101'
        image[254] = '115'
        image[253] = '108'
        image[252] = '97'
        image[251] = '102'
        image[250] = '101'
        image[249] = '117'
        image[248] = '114'
        image[247] = '116'

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
            for (var x = 0; x < staticTable.length; x++) {

                if (staticTable[x][1] == node) {
                    return staticTable[x]
                }
            }
        }
        // Initialize the result string.
        function generateIf(node) {
        }
        function generateWhile(node) {

        }
        function generateEquals(node) {
            if (node.parent.parent.name == "If Statement") {
                //Check if this if statement
                if (arrayAlreadyHasArray(ifStatementCheck,[node.parent.parent.character, node.parent.parent.line])) {
                } else {
                    
                    image[imageCounter] = "AE"
                    imageCounter += 1;
                    ifStatementCheck.push([node.parent.parent.character, node.parent.parent.line])
                }

            }
            if (/^[a-z]$/.test(node.name)) {
                let getTableEntry = getValueOutOfStatic(node.name)
                image[imageCounter] = getTableEntry[0]
                imageCounter += 1;
                image[imageCounter] = "XX"
                imageCounter += 1;
            }else{

            }
            if (arrayAlreadyHasArray(EqualsCheck,[node.parent.character, node.parent.line])) {
                
            }
            else{
                image[imageCounter] = "EC"
                imageCounter += 1;
                EqualsCheck.push([node.parent.character,node.parent.line])
            }
        }
        function generatePrint(node) {
            image[imageCounter] = "AC"
            imageCounter += 1;
            let getTableEntry = getValueOutOfStatic(node.name)
            image[imageCounter] = getTableEntry[0]
            imageCounter += 1;
            image[imageCounter] = "XX"
            imageCounter += 1;
        }
        function generateVarDecl(node) {
            if (node.name != "string" && node.name != 'int' && node.name != 'boolean') {
                image[imageCounter] = 'A9'
                imageCounter += 1;

                //subject to string/int/bool
                if (declaration == 'boolean') {
                    image[imageCounter] = ''

                } else {
                    image[imageCounter] = '00'
                }

                imageCounter += 1;

                //load into memory
                image[imageCounter] = '8D'
                imageCounter += 1;

                image[imageCounter] = 'T' + tempCounter
                imageCounter += 1;

                image[imageCounter] = 'XX'
                imageCounter += 1;

                staticTable.push(['T' + tempCounter.toString(), node.name, offset])
                offset += 1;
                tempCounter += 1;

            } else {
                declaration = node.name
            }

        }
        function generateAssignment(node) {
            if (firstAssign == null) {
                firstAssign = node.name
            } else {
                if (/^[a-z]$/.test(node.name)) {
                    //second side of assignment is a variable
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
                    image[imageCounter] = "A9"
                    imageCounter += 1;

                    image[imageCounter] = "0" + node.name.toString();
                    imageCounter += 1;

                    image[imageCounter] = "8D"
                    imageCounter += 1;

                    let getTableEntry = getValueOutOfStatic(firstAssign)

                    image[imageCounter] = getTableEntry[0]
                    imageCounter += 1;

                    image[imageCounter] = "XX"
                    imageCounter += 1;

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
                    image[imageCounter] = "A2"
                    imageCounter += 1;

                    image[imageCounter] = "01"
                    imageCounter += 1;

                    image[imageCounter] = "FF"
                    imageCounter += 1;
                }
                else if (node.parent.name == "If Statement") {
                    console.log("hello")
                    //If there is ever something in the child of an if statement.. it's going to be one thing .. true or false
                    generateIf(node);

                }
                else if (node.parent.name == "While Statement") {
                    generateWhile(node);
                }
                else if (node.parent.name == "Equals To") {

                    generateEquals(node);
                }






            }
            else {
                // There are children, so note these interior/branch nodes and ...
                // .. recursively expand them.
                currentParent = node.name
                
                for (var i = 0; i < node.children.length; i++) {
                    
                    if(node.name == "If Statement" && node.children[i].name == "Block"){
                        image[imageCounter]= "D0"
                        imageCounter+=1;
                        image[imageCounter] = "J" + jumpCounter

                        jumpTable.push(["J" + jumpCounter,imageCounter])
                        jumpCounter+=1;
                        imageCounter+=1;
                        expand(node.children[i], depth + 1);

                    }
                    else if(node.children[i].name == "If Statement"){
                        
                        expand(node.children[i], depth + 1);
                        jumpTable[jumpTable.length - 1][1] = (imageCounter - jumpTable[jumpTable.length - 1][1] - 1).toString(16)
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