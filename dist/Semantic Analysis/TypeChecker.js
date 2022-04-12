class TypeChecker {
    scopeChecker(root, scopeTree) {
        // Initialize the result string.
        let ultParent = "";
        let currentParent = "";
        let firstVar = null;
        let secondVar = null;
        let firstBool = null;
        let typeOfExpr = null;
        let warningCounter = 0;
        let warnings = [];
        // Recursive function to handle the expansion of the nodes.
        function expand(node, depth) {
            // Space out based on the current depth so
            // this looks at least a little tree-like.
            // If there are no children (i.e., leaf nodes)...
            if (!node.children || node.children.length === 0) {
                // ... note the leaf node.
                if (node.parent.name == "VarDecl") {
                    if (firstVar == null) {
                        firstVar = node.name;
                    }
                    else {
                        secondVar = node.name;
                        if (secondVar in scopeTree.currentScope) {
                            throw new Error("Variable already declared in the current scope at " + node.line + "," + node.character);
                        }
                        output("DEBUG SEMANTIC - Variable Declared [" + secondVar + "] as Type " + firstVar + " at " + node.line + "," + node.character);
                        scopeTree.currentScope[secondVar] = { "type": firstVar, 'isUsed': false, 'isInitialized': false, "scope": scopeTree.currentScopeNum, "line": node.line, "char": node.character };
                        firstVar = null;
                        secondVar = null;
                    }
                }
                //Assignment Statement Encounter
                else if (node.parent.name == "Assignment Statement") {
                    if (firstVar == null) {
                        firstVar = node.name;
                        if (this.checkScope(firstVar, scopeTree)) {
                            //continue
                        }
                        else {
                            //TODO: throw error when variable initialized before being declared.
                            throw new Error("Variable initialized before being declared at line at " + node.line + "," + node.character);
                        }
                    }
                    else {
                        secondVar = node.name;
                        let found = false;
                        let currentNodde = scopeTree.currentNode;
                        while (scopeTree.currentNode != root) {
                            if (firstVar in scopeTree.currentNode.scope) {
                                found = true;
                                break;
                            }
                            if (scopeTree.currentNode.parent == null) {
                                break;
                            }
                            scopeTree.currentNode = scopeTree.currentNode.parent;
                        }
                        let foundSecond = false;
                        let currentNoddeForSecond = scopeTree.currentNode;
                        if (/^[a-z]$/.test(secondVar)) {
                            while (currentNoddeForSecond != root) {
                                if (secondVar in currentNoddeForSecond.scope) {
                                    foundSecond = true;
                                }
                                if (currentNoddeForSecond.parent == null) {
                                    break;
                                }
                                currentNoddeForSecond = currentNoddeForSecond.parent;
                            }
                        }
                        if (scopeTree.currentNode.scope[firstVar]['type'] == 'int' && /^[0-9]$/.test(secondVar)) {
                            console.log(node.name);
                            scopeTree.currentNode.scope[firstVar]['isInitialized'] = true;
                            output("DEBUG SEMANTIC - SUCCESS: Variable " + firstVar + " has been initialized with the correct type as int at " + node.line + "," + node.character);
                            scopeTree.currentNode = currentNodde;
                        }
                        else if (scopeTree.currentNode.scope[firstVar]['type'] == 'string' && secondVar[0] == "'") {
                            console.log(node.name);
                            scopeTree.currentNode.scope[firstVar]['isInitialized'] = true;
                            output("DEBUG SEMANTIC - SUCCESS: Variable [" + firstVar + "] has been initialized with the correct type as string at " + node.line + "," + node.character);
                            scopeTree.currentNode = currentNodde;
                        }
                        else if (scopeTree.currentNode.scope[firstVar]['type'] == 'boolean' && (secondVar == 'true' || secondVar == "false")) {
                            console.log(node.name);
                            scopeTree.currentNode.scope[firstVar]['isInitialized'] = true;
                            output("DEBUG SEMANTIC - SUCCESS: Variable " + firstVar + " has been initialized with the correct type as boolean at " + node.line + "," + node.character);
                            scopeTree.currentNode = currentNodde;
                        }
                        //finall else if for assignment to id
                        else if (foundSecond == true) {
                            if (currentNoddeForSecond.scope[firstVar]['type'] == currentNoddeForSecond.scope[secondVar]['type']) {
                                currentNoddeForSecond.scope[firstVar]['isInitialized'] = true;
                                output("DEBUG SEMANTIC - SUCCESS: Variable " + firstVar + " has been initialized at " + node.line + "," + node.character);
                            }
                            else {
                                //TODO THROW ERROR when mismatch
                                throw new Error("TYPE MISMATCH - TYPE OF: " + currentNoddeForSecond.scope[secondVar]['type'] + " Does Not match: " + currentNoddeForSecond.scope[firstVar]['type'] + "at " + node.line + "," + node.character);
                            }
                        }
                        else {
                            if (!(secondVar in scopeTree.currentScope) && /^[a-z]$/.test(secondVar)) {
                                //Variable assigned to another variable which isnt in scope.. rip
                                //TODO THROW ERROR
                                let found = false;
                                let currentNodde = scopeTree.currentNode;
                                while (currentNodde != root) {
                                    if (secondVar in currentNodde.scope) {
                                        found = true;
                                    }
                                    if (currentNodde.parent == null) {
                                        break;
                                    }
                                    currentNodde = currentNodde.parent;
                                }
                                if (secondVar in currentNodde.scope) {
                                    found = true;
                                }
                                if (found) {
                                    output("DEBUG SEMANTIC - SUCCESS: Variable " + firstVar + " has been initialized at " + node.line + "," + node.character);
                                }
                                else {
                                    throw new Error("Varable " + secondVar + " is not in scope at " + node.line + "," + node.character);
                                }
                            }
                            else {
                                throw new Error("TYPE MISMATCH - TYPE OF: " + secondVar + " Does Not match: " + firstVar + "at " + node.line + ',' + node.character);
                            }
                        }
                        firstVar = null;
                        secondVar = null;
                    }
                }
                //End Assignment statement
                //Start Print Statement
                else if (node.parent.name == "Print") {
                    //This whole print block will only execute if the thing inside print is one production.
                    //This means only id, true, false and strings will execute this. 
                    //int exprs with addition ops and boolexpr will be excecuted else where.
                    //Int exprs will be executed in the addition Op 'else if' statement
                    //Bool Exprs will be executed 
                    let checker;
                    if (/^[a-z]$/.test(node.name)) {
                        checker = this.checkScope(node.name, scopeTree);
                    }
                    if (currentParent['children'].length == 1) {
                        if (node.name == "true" || node.name == "false" || node.name[0] == "'" || /^[0-9]$/.test(node.name)) {
                        }
                        //else must be an id because parse worked 
                        else {
                            if (checker) {
                                output("DEBUG - SEMANTIC ANALYSIS - SUCCESS - Variable [" + node.name + "] is used in print statement at " + node.line + "," + node.character);
                                if (node.name in scopeTree.currentScope) {
                                    if (scopeTree.currentScope[node.name]['isInitialized'] == false) {
                                        output("DEBUG - SEMANTIC ANALYSIS - WARNING - [" + node.name + "] was used before being initialized at " + node.line + "," + node.character);
                                        warningCounter += 1;
                                    }
                                    scopeTree.currentScope[node.name]['isUsed'] = true;
                                }
                                else {
                                    let currNode = scopeTree.currentNode;
                                    while (scopeTree.currentNode != scopeTree.root) {
                                        scopeTree.currentNode = scopeTree.currentNode.parent;
                                        if (node.name in scopeTree.currentNode.scope) {
                                            if (scopeTree.currentNode.scope[node.name]['isInitialized'] == false) {
                                                output("DEBUG - SEMANTIC ANALYSIS - WARNING - [" + node.name + "] was used before being initialized at " + node.line + "," + node.character);
                                                warningCounter += 1;
                                                scopeTree.currentNode.scope[node.name]['isUsed'] = true;
                                                break;
                                            }
                                            else {
                                                scopeTree.currentNode.scope[node.name]['isUsed'] = true;
                                            }
                                        }
                                    }
                                    scopeTree.currentNode = currNode;
                                }
                            }
                            else {
                                throw new Error("Variable not in scope at " + node.line + "," + node.character);
                            }
                        }
                    }
                }
                //End Statement
                //Start addition OP
                else if (node.parent.name == "Not Equals") {
                    //This just checks to see if the other child is of the same type.
                    //If it isn't there is an error.
                    let first = this.getType(node.parent['children'][0]['name'], scopeTree, node, warnings);
                    let second = this.getType(node.parent['children'][1]['name'], scopeTree, node, warnings);
                    if (first != second) {
                        throw new Error("Cant match types " + first + " and " + second + " at " + node.line + "," + node.character);
                    }
                }
                else if (node.parent.name == "Equals To") {
                    //This just checks to see if the other child is of the same type.
                    //If it isn't there is an error.
                    let first = this.getType(node.parent['children'][0]['name'], scopeTree, node, warnings);
                    let second = this.getType(node.parent['children'][1]['name'], scopeTree, node, warnings);
                    if (firstVar != null) {
                        if (this.getType(firstVar, scopeTree, node, warningCounter) == 'boolean') {
                        }
                    }
                    if (first != second) {
                        throw new Error("Cant match types " + first + " and " + second + " at " + node.line + "," + node.character);
                    }
                }
                else if (node.parent.name == "Addition Op") {
                    if (ultParent != "Equals To" && ultParent != "Not Equals") {
                        if (firstVar != null && this.getType(firstVar, scopeTree, node, warnings) != 'int') {
                            throw new Error("TYPE MISMATCH - Variable [ " + firstVar + " ] of type [ " + scopeTree.currentScope[firstVar]['type'] + " ]" + " Does not match Int expr at" + node.line + "," + node.character);
                        }
                        if (currentParent['children'][1]['name'] == "Equals To" || currentParent['children'][1]['name'] == "Not Equals") {
                            throw new Error("Can't add Equals To or not Equals operator" + " to int expression at " + node.line + "," + node.character);
                        }
                        if (!(/^[0-9]$/.test(node.name))) {
                            if ((/^[a-z]$/.test(node.name))) {
                                let found = false;
                                let currNode = scopeTree.currentNode;
                                if (node.name in scopeTree.currentScope) {
                                    scopeTree.currentScope[node.name]['isUsed'] = true;
                                    if (scopeTree.currentScope[node.name]['isInitialized'] == false) {
                                        output("DEBUG - SEMANTIC ANALYSIS - WARNING - [" + node.name + "] was used before being initialized at " + node.line + "," + node.character);
                                    }
                                    found = true;
                                }
                                else {
                                    while (scopeTree.currentNode != scopeTree.root) {
                                        scopeTree.currentNode = scopeTree.currentNode.parent;
                                        if (node.name in scopeTree.currentNode.scope) {
                                            found = true;
                                            if (scopeTree.currentNode.scope[node.name]['type'] != 'int') {
                                                throw new Error("Can't add type " + scopeTree.currentNode.scope[node.name]['type'] + " to Type Int at " + node.line + "," + node.character);
                                            }
                                            if (scopeTree.currentNode.scope[node.name]['isInitialized'] == false) {
                                                output("DEBUG - SEMANTIC ANALYSIS - WARNING - [" + node.name + "] was used before being initialized at " + node.line + "," + node.character);
                                                warningCounter += 1;
                                                scopeTree.currentNode.scope[node.name]['isUsed'] = true;
                                                break;
                                            }
                                            scopeTree.currentNode.scope[node.name]['isUsed'] = true;
                                        }
                                    }
                                }
                                scopeTree.currentNode = currNode;
                                if (found == false) {
                                    throw new Error("Variable isn't in scope at " + node.line + "," + node.character);
                                }
                            }
                            else {
                                throw new Error("Cant add " + this.getType(node.name, scopeTree, node, warnings) + " to int expression at " + node.line + "," + node.character);
                            }
                        }
                        if (currentParent['children'][0] != "Addition Op" && currentParent['children'][1] != "Addition Op") {
                            firstVar = null;
                            secondVar = null;
                        }
                    }
                    else {
                        if (firstBool == null) {
                            firstBool = node.name;
                            if (/^[0-9]$/.test(firstBool)) {
                                typeOfExpr = 'int';
                            }
                            else if (/^[a-z]$/.test(node.name)) {
                                if (firstBool in scopeTree.currentScope) {
                                    typeOfExpr = scopeTree.currentScope[firstBool]['type'];
                                }
                            }
                            else if (node.name == "true" || node.name == "false") {
                                typeOfExpr = 'boolean';
                            }
                            else if (node.name[0] == "'") {
                                typeOfExpr = 'string';
                            }
                        }
                        else {
                            if (/^[a-z]$/.test(node.name)) {
                                let found = false;
                                let currNode = scopeTree.currentNode;
                                if (node.name in scopeTree.currentScope) {
                                    scopeTree.currentScope[node.name]['isUsed'] = true;
                                    if (scopeTree.currentScope[node.name]['isInitialized'] == false) {
                                        output("DEBUG - SEMANTIC ANALYSIS - WARNING - [" + node.name + "] was used before being initialized at " + node.line + "," + node.character);
                                    }
                                    found = true;
                                }
                                else {
                                    while (scopeTree.currentNode != scopeTree.root) {
                                        scopeTree.currentNode = scopeTree.currentNode.parent;
                                        if (node.name in scopeTree.currentNode.scope) {
                                            if (scopeTree.currentNode.scope[node.name]['type'] != 'int') {
                                                throw new Error("Variable of type " + scopeTree.currentNode.scope[node.name]['type'] + " at " + node.line + "," + node.character + " does not match type int");
                                            }
                                            found = true;
                                            if (scopeTree.currentNode.scope[node.name]['isInitialized'] == false) {
                                                output("DEBUG - SEMANTIC ANALYSIS - WARNING - [" + node.name + "] was used before being initialized at " + node.line + "," + node.character);
                                                warningCounter += 1;
                                                scopeTree.currentNode.scope[node.name]['isUsed'] = true;
                                                break;
                                            }
                                            scopeTree.currentNode.scope[node.name]['isUsed'] = true;
                                        }
                                    }
                                    scopeTree.currentNode = currNode;
                                }
                                if (found == false) {
                                    throw new Error("Variable isn't in scope");
                                }
                            }
                            else if (/^[0-9]$/.test(node.name)) {
                                if (typeOfExpr != 'int') {
                                    throw new Error("Type of Int does not match " + this.getType(typeOfExpr, scopeTree, node, warnings));
                                }
                            }
                            else if (node.name[0] == "'") {
                                if (typeOfExpr != "string") {
                                    throw new Error("Type of String does not match " + this.getType(typeOfExpr, scopeTree, node, warnings));
                                }
                            }
                            else if (node.name == "true" || node.name == "false") {
                                if (typeOfExpr != 'boolean') {
                                    throw new Error("Type of boolean does not match " + this.getType(typeOfExpr, scopeTree, node, warnings));
                                }
                            }
                        }
                    }
                }
                //End addition Op parent
                //Start While Statement
            }
            //Second block for interior nodes
            else {
                // There are children, so note these interior/branch nodes and ...
                console.log(node);
                // .. recursively expand them.
                currentParent = node;
                if (node.name == "Block") {
                    if (scopeTree.root == null) {
                        scopeTree.addNode("root", scopeTree.currentScopeNum);
                    }
                    else {
                        scopeTree.currentScopeNum += 1;
                        scopeTree.addNode("branch", scopeTree.currentScopeNum);
                    }
                }
                for (var i = 0; i < node.children.length; i++) {
                    if (node.children[i].name == 'Block') {
                        expand(node.children[i], depth + 1);
                        scopeTree.currentScopeNum -= 1;
                        scopeTree.moveUp();
                        scopeTree.currentScope = scopeTree.currentNode.scope;
                    }
                    else if (node.children[i].name == "Equals To" || node.children[i].name == "Not Equals") {
                        ultParent = "Equals To";
                        expand(node.children[i], depth + 1);
                        ultParent = "";
                        firstVar = null;
                        secondVar = null;
                    }
                    else if (node.children[i].name == "While Statement") {
                        firstBool = null;
                        expand(node.children[i], depth + 1);
                    }
                    else if (node.children[i].name == "If Statement") {
                        firstBool = null;
                        expand(node.children[i], depth + 1);
                    }
                    else {
                        expand(node.children[i], depth + 1);
                    }
                }
            }
        }
        // Make the initial call to expand from the root.
        if (!root.children || root.children.length < 1) {
        }
        else {
            expand(root, 0);
        }
        // Return the result.
    }
    ;
    getType(id, scopeTree, node, warnings) {
        let type = id;
        if (/^[0-9]$/.test(type)) {
            return 'int';
        }
        else if (type == "false" || type == "true") {
            return 'boolean';
        }
        else if (type[0] == "'") {
            return 'string';
        }
        else if (type == "Equals To" || type == "Not Equals") {
            return 'boolean';
        }
        else if (type == "Addition Op") {
            return 'int';
        }
        else if (/^[a-z]$/.test(type)) {
            let currentNodde = scopeTree.currentNode;
            while (scopeTree.currentNode != scopeTree.root) {
                if (type in scopeTree.currentNode.scope) {
                    scopeTree.currentNode.scope[type]['isUsed'] = true;
                    scopeTree.currentNode = currentNodde;
                    if (scopeTree.currentNode.scope[type]['isInitialized'] == false) {
                        output("DEBUG SEMANTIC - WARNING - Variable [" + type + "] is used before being initialized at " + node.line + "," + node.character);
                    }
                    let placeHolder = scopeTree.currentNode.scope[type]['type'];
                    scopeTree.currentNode = currentNodde;
                    return placeHolder;
                }
                if (scopeTree.currentNode.parent == null) {
                    break;
                }
                scopeTree.currentNode = scopeTree.currentNode.parent;
            }
            if (type in scopeTree.currentNode.scope) {
                scopeTree.currentNode.scope[type]['isUsed'] = true;
                if (scopeTree.currentNode.scope[type]['isInitialized'] == false) {
                    output("DEBUG SEMANTIC - WARNING - Variable [" + type + "] is used before being initialized at " + node.line + "," + node.character);
                }
                let placeHolder = scopeTree.currentNode.scope[type]['type'];
                scopeTree.currentNode = currentNodde;
                return placeHolder;
            }
            else {
                scopeTree.currentNode = currentNodde;
                throw new Error("Variable isn't in scope at " + node.line + ',' + node.character);
            }
        }
    }
    addToSymbolTable(key, values) {
        //child1 is the variable. i.e: a
        if (values['isUsed'] == false) {
            output("DEBUG SEMANTIC - WARNING - Variable [ " + key + " ] was declared at " + values['line'] + "," + values['char'] + ", but was never used.");
        }
        if (values['isInitialized'] == false) {
            output("DEBUG SEMANTIC - WARNING - Variable [ " + key + " ] was declared at " + values['line'] + "," + values['char'] + ", but was never initialized.");
        }
        else {
            if (values['isUsed'] == false) {
                output("DEBUG SEMANTIC - WARNING - Variable [ " + key + " ] was initialized at " + values['line'] + "," + values['char'] + ", but was never used.");
            }
        }
        let tableRow = document.createElement("tr");
        let child1 = document.createElement("td");
        child1.textContent = key;
        tableRow.appendChild(child1);
        //Child2 is the type
        let child2 = document.createElement("td");
        child2.textContent = values['type'];
        tableRow.appendChild(child2);
        //child3 is the scope
        let child3 = document.createElement("td");
        child3.textContent = values['scope'];
        tableRow.appendChild(child3);
        //child4 is the line
        //child6 is the "isUsed" attribute
        let child6 = document.createElement("td");
        child6.textContent = values['isUsed'];
        tableRow.appendChild(child6);
        //child7 is the "isInitialized attribute"
        let child7 = document.createElement("td");
        child7.textContent = values['isInitialized'];
        tableRow.appendChild(child7);
        let child4 = document.createElement("td");
        child4.textContent = values['line'];
        tableRow.appendChild(child4);
        //child5 is the position
        let child5 = document.createElement("td");
        child5.textContent = values['char'];
        tableRow.appendChild(child5);
        document.getElementById("table").append(tableRow);
    }
    checkScope(type, scopeTree) {
        let currentNodde = scopeTree.currentNode;
        while (currentNodde != scopeTree.root) {
            if (type in currentNodde.scope) {
                return true;
            }
            if (currentNodde.parent == null) {
                break;
            }
            currentNodde = currentNodde.parent;
        }
        if (type in currentNodde.scope) {
            return true;
        }
        else {
            return false;
        }
    }
}
//# sourceMappingURL=TypeChecker.js.map