//this retreives the input fields value on the html page
function getData() {
    let tokenStream = [];
    let input = document.getElementById("Input").value;
    let splittedInput = input.split("$");
    clearOutput();
    document.getElementById("CST").value = "";
    for (let i = 0; i < splittedInput.length; i++) {
        //lexing starts here
        if (splittedInput.length > 1) {
            if (i == 0) {
                splittedInput.pop();
            }
            tokenStream = this.lexGreedyApproach(splittedInput[i] + "$");
        }
        else {
            tokenStream = this.lexGreedyApproach(splittedInput[i]);
        }
        //parsing starts here
        let cstTraversal;
        if (tokenStream) {
            let parser = new Parser(tokenStream);
            try {
                parser.parseStart();
            }
            catch (error) {
                this.output("INFO PARSER - Parser failed with 1 error. Not Printing CST.\n");
                console.log(error);
                break;
            }
            ;
            this.output("INFO PARSER - Parser Passed. Printing CST.\n");
            cstTraversal = parser.SyntaxTree.toString();
            document.getElementById("CST").value += cstTraversal + "\n";
            let CSTTreeAntArray = [];
            var dict = {};
            CSTTreeAntArray.push(cstConfig);
            const map1 = new Map();
            //This for loop goes through every node and creates a Treant representation according to the Treant Docs.
            //The Docs can be found at https://fperucic.github.io/treant-js/
            //This could actually be done after the first for loop to save time. I just wanted things to happen in sequence instead of printing after everything
            for (let j = 0; j < parser.SyntaxTree.depth2.length; j++) {
                let currentNode = parser.SyntaxTree.depth2[j];
                if (j == 0) {
                    let rootNode = {
                        text: { name: currentNode.name },
                        node: currentNode
                    };
                    CSTTreeAntArray.push(rootNode);
                    dict[currentNode] = rootNode;
                    map1.set(currentNode, rootNode);
                    continue;
                }
                let nextNode = {
                    parent: map1.get(currentNode.parent),
                    text: { name: currentNode.name },
                    node: currentNode
                };
                dict[currentNode] = nextNode;
                map1.set(currentNode, nextNode);
                CSTTreeAntArray.push(nextNode);
            }
            //Puts the array of the objects into the simple_char_config variable for treant to utilize
            cstChart = CSTTreeAntArray;
            //This initialized the new Treant object with our array of objects
            this.createCST(cstChart);
        }
        //Semantic Analysis starts here. We shouldn't get an error in this parse because the parse for the CST validated everything in our language.
        //parsing starts here
        let astTraversal;
        let astParser = new AstParser(tokenStream);
        astParser.parseStart();
        astTraversal = astParser.SyntaxTree.toString();
        let astTreeantArray = [];
        astTreeantArray.push(astConfig);
        const map2 = new Map();
        document.getElementById("AST").value += astTraversal + "\n";
        for (let j = 0; j < astParser.SyntaxTree.depth2.length; j++) {
            let currentNode = astParser.SyntaxTree.depth2[j];
            if (j == 0) {
                let rootNode = {
                    text: { name: currentNode.name },
                    node: currentNode
                };
                astTreeantArray.push(rootNode);
                dict[currentNode] = rootNode;
                map2.set(currentNode, rootNode);
                continue;
            }
            let nextNode = {
                parent: map2.get(currentNode.parent),
                text: { name: currentNode.name },
                node: currentNode
            };
            dict[currentNode] = nextNode;
            map2.set(currentNode, nextNode);
            astTreeantArray.push(nextNode);
        }
        astChart = astTreeantArray;
        //This initialized the new Treant object with our array of objects
        this.createCST(astChart);
        let scopeTree = new ScopeTree();
        try {
            scopeChecker(astParser.SyntaxTree.root, scopeTree);
        }
        catch (error) {
            output("DEBUG SEMANTIC - " + error);
        }
        scopeTree.toString();
    }
    this.resetPgmCounter();
}
/*
function scopeCheck(root, scopeTree) {
  // Initialize the result string.
  var traversalResult = "";


  let currentParent = ""
  let firstVar = null;
  let secondVar = null;
  let firstBool = null;
  let secondBool = null;
  // Recursive function to handle the expansion of the nodes.
  function expand(node, depth) {
    // Space out based on the current depth so
    // this looks at least a little tree-like.



    // If there are no children (i.e., leaf nodes)...
    if (!node.children || node.children.length === 0) {
      // ... note the leaf node.

      if (currentParent['name'] == "VarDecl") {
        if (firstVar == null) {
          firstVar = node.name
        } else {
          secondVar = node.name
          output("Variable Declared " + firstVar)
          scopeTree.currentScope[secondVar] = { "type": firstVar, 'used': false, 'isInitialized': false, "scope": scopeTree.currentScopeNum }
          firstVar = null;
          secondVar = null;
        }
      }
      //Assignment Statement Encounter
      else if (currentParent['name'] == "Assignment Statement") {
        if (firstVar == null) {
          firstVar = node.name
          if (firstVar in scopeTree.currentScope) {
            //continue
          }
          else {
            //TODO: throw error when variable initialized before being declared.
            output("Error: Variable initialized before being declared.")
          }
        }
        //else block only executes when there is no other children in assignment statement. Exampe: a = 1 , b = "s"
        else {
          secondVar = node.name
          if (scopeTree.currentScope[firstVar]['type'] == 'int' && /^[0-9]$/.test(secondVar)) {
            scopeTree.currentScope[firstVar]['isInitialized'] = true
          }
          else if (scopeTree.currentScope[firstVar]['type'] == 'string' && secondVar[0] == "'") {
            scopeTree.currentScope[firstVar]['isInitialized'] = true

          }
          else if (scopeTree.currentScope[firstVar]['type'] == 'boolean' && (secondVar == 'true' || secondVar == "false")) {
            scopeTree.currentScope[firstVar]['isInitialized'] = true

          }
          //finall else if for assignment to id
          else if (secondVar in scopeTree.currentScope) {
            if (scopeTree.currentScope[firstVar]['type'] == scopeTree.currentScope[secondVar]['type']) {
              scopeTree.currentScope[firstVar]['isInitialized'] = true
            } else {
              //TODO THROW ERROR when mismatch
              throw new Error("TYPE MISMATCH - TYPE OF: " + scopeTree.currentScope[secondVar]['type'] + " Does Not match: " + scopeTree.currentScope[firstVar]['type'])

            }
          }
          else {
            if (!(secondVar in scopeTree.currentScope) && /^[a-z]$/.test(secondVar)) {
              //Variable assigned to another variable which isnt in scope.. rip
              //TODO THROW ERROR
              throw new Error(secondVar + "is not in scope")


            } else {
              //MisMatch
              throw new Error("TYPE MISMATCH - TYPE OF: " + secondVar + " Does Not match: " + scopeTree.currentScope[firstVar]['type'])

            }

          }

          firstVar = null;
          secondVar = null;
        }
      }
      //End Assignment statement

      //Start Print Statement
      else if (currentParent['name'] == "Print") {
        //This whole print block will only execute if the thing inside print is one production.
        //This means only id, true, false and strings will execute this.
        //int exprs with addition ops and boolexpr will be excecuted else where.
        //Int exprs will be executed in the addition Op 'else if' statement
        //Bool Exprs will be executed
        if (currentParent['children'].length == 1) {
          if (node.name == "true" || node.name == "false" || node.name[0] == "'" || /^[0-9]$/.test(node.name)) {
            console.log(node.name)

          }
          //else must be an id because parse worked
          else {
            if (node.name in scopeTree.currentScope) {
              //cont
            }
            else {
              output("variable not in scope..Can't print")
            }
          }

        }
      }
      //End Statement

      //Start addition OP
      else if (currentParent['name'] == "Not Equals") {
        let child = currentParent['children'][1].name
        //if(){

        // }
      }
      else if (currentParent['name'] == "Equals To") {

      }
      else if (currentParent['name'] == "Addition Op") {
        if (!(/^[0-9]$/.test(node.name))) {
          throw new Error("Cant add" + "to int expression ")
        }
        if ((/^[a-z]$/.test(node.name))) {
          if (node.name in scopeTree.currentScope) {
            if (scopeTree.currentScope[node.name]['type'] != 'int') {
              throw new Error("Cant add to int expression")

            }
          }
          else {
            console.log(scopeTree.currentScope)
            console.log(node.name)
            throw new Error("Not in Scope")

          }
        }
        //if first var isnt null, its an assignment statement and we will include that in type checking
        //first var is usually the variable on the left hand side of an assign statement
        if (firstVar != null) {
          //first check if the
          //Actually this case only happens in intExprs :)
          //only need to check for ints
          if (secondVar == null) {

            secondVar = node.name
            console.log(secondVar)
            //Checking the left side of right
            if (scopeTree.currentScope[firstVar]['type'] == 'int' && /^[0-9]$/.test(secondVar)) {
              scopeTree.currentScope[firstVar]['isInitialized'] = true
            } else {
              output("error")
            }


          }
          //check for more type ints in the recursive expr.
          else {
            //Int Expr allows any expr after the additon symbol so we need to check for strings and bools and ids.
            //TODO BOOL EXPR on right side
            //TODO finish id on right hand side
            secondVar = node.name;

            if (secondVar == "true" || secondVar == "false" || secondVar[0] == "'") {
              //TYPE mismatch error
              output("error")
            }
            else if (secondVar in scopeTree.currentScope) {
              if (scopeTree.currentScope[secondVar]['type'] != 'int') {
                //TYPE Mismatch error
                output("error")
              }
            }
            else {
              if (/^[0-9]$/.test(secondVar)) {

              }
              else {
                if (!(secondVar in scopeTree.currentScope)) {
                  output("variable not in current scope")
                }
              }
            }

          }
        }
        //if first var is null, then its part of an expr statement in print,if statement and while. Pretty cool
        else {//Int expr
          //console.log(node.name)
        }

      }
      //End addition Op parent
      //Start While Statement

    }
    //Second block for interior nodes
    else {
      // There are children, so note these interior/branch nodes and ...

      // .. recursively expand them.
      currentParent = node;

      if (node.name == "Block") {
        if (scopeTree.root == null) {
          scopeTree.addNode("root", scopeTree.currentScopeNum)

        } else {
          scopeTree.addNode("branch", ++scopeTree.currentScopeNum)

        }
      }
      for (var i = 0; i < node.children.length; i++) {
        if (node.children[i].name == 'Block') {
          expand(node.children[i], depth + 1);
          scopeTree.currentScopeNum -= 1
          scopeTree.moveUp()
          scopeTree.currentScope = scopeTree.currentNode.scope





        } else {
          expand(node.children[i], depth + 1);

        }
      }
    }
  }
  // Make the initial call to expand from the root.
  expand(root, 0);
  // Return the result.
};*/
function scopeChecker(root, scopeTree) {
    // Initialize the result string.
    var traversalResult = "";
    let currentParent = "";
    let firstVar = null;
    let secondVar = null;
    let firstBool = null;
    let secondBool = null;
    // Recursive function to handle the expansion of the nodes.
    function expand(node, depth) {
        // Space out based on the current depth so
        // this looks at least a little tree-like.
        // If there are no children (i.e., leaf nodes)...
        if (!node.children || node.children.length === 0) {
            // ... note the leaf node.
            if (currentParent['name'] == "VarDecl") {
                if (firstVar == null) {
                    firstVar = node.name;
                }
                else {
                    secondVar = node.name;
                    output("Variable Declared " + firstVar);
                    scopeTree.currentScope[secondVar] = { "type": firstVar, 'used': false, 'isInitialized': false, "scope": scopeTree.currentScopeNum };
                    firstVar = null;
                    secondVar = null;
                }
            }
            //Assignment Statement Encounter
            else if (currentParent['name'] == "Assignment Statement") {
                if (firstVar == null) {
                    firstVar = node.name;
                    if (firstVar in scopeTree.currentScope) {
                        //continue
                    }
                    else {
                        //TODO: throw error when variable initialized before being declared.
                        output("Error: Variable initialized before being declared.");
                    }
                }
                else {
                    secondVar = node.name;
                    if (scopeTree.currentScope[firstVar]['type'] == 'int' && /^[0-9]$/.test(secondVar)) {
                        scopeTree.currentScope[firstVar]['isInitialized'] = true;
                    }
                    else if (scopeTree.currentScope[firstVar]['type'] == 'string' && secondVar[0] == "'") {
                        scopeTree.currentScope[firstVar]['isInitialized'] = true;
                    }
                    else if (scopeTree.currentScope[firstVar]['type'] == 'boolean' && (secondVar == 'true' || secondVar == "false")) {
                        scopeTree.currentScope[firstVar]['isInitialized'] = true;
                    }
                    //finall else if for assignment to id
                    else if (secondVar in scopeTree.currentScope) {
                        if (scopeTree.currentScope[firstVar]['type'] == scopeTree.currentScope[secondVar]['type']) {
                            scopeTree.currentScope[firstVar]['isInitialized'] = true;
                        }
                        else {
                            //TODO THROW ERROR when mismatch
                            output("TYPE MISMATCH - TYPE OF: " + scopeTree.currentScope[secondVar]['type'] + " Does Not match: " + scopeTree.currentScope[firstVar]['type']);
                        }
                    }
                    else {
                        if (!(secondVar in scopeTree.currentScope) && /^[a-z]$/.test(secondVar)) {
                            //Variable assigned to another variable which isnt in scope.. rip
                            //TODO THROW ERROR
                            output(secondVar + "is not in scope");
                        }
                        else {
                            //MisMatch
                            console.log("hello World");
                            output("TYPE MISMATCH - TYPE OF: " + secondVar + " Does Not match: " + scopeTree.currentScope[firstVar]['type']);
                        }
                    }
                    firstVar = null;
                    secondVar = null;
                }
            }
            //End Assignment statement
            //Start Print Statement
            else if (currentParent['name'] == "Print") {
                //This whole print block will only execute if the thing inside print is one production.
                //This means only id, true, false and strings will execute this. 
                //int exprs with addition ops and boolexpr will be excecuted else where.
                //Int exprs will be executed in the addition Op 'else if' statement
                //Bool Exprs will be executed 
                if (currentParent['children'].length == 1) {
                    if (node.name == "true" || node.name == "false" || node.name[0] == "'" || /^[0-9]$/.test(node.name)) {
                    }
                    //else must be an id because parse worked 
                    else {
                        if (node.name in scopeTree.currentScope) {
                            //cont
                        }
                        else {
                            throw new Error("Variable not in scope");
                        }
                    }
                }
            }
            //End Statement
            //Start addition OP
            else if (currentParent['name'] == "Not Equals") {
                let child = currentParent['children'][1].name;
                //if(){
                // }
            }
            else if (currentParent['name'] == "Equals To") {
                //if its not null, its a Equals to in a print, if and while
                if (firstVar == null) {
                }
                else {
                    if (scopeTree.currentScope[firstVar]['type'] != 'boolean') {
                        throw new Error("Type mismatch - Variable [ " + firstVar + " ] of type [ " + scopeTree.currentScope[firstVar]['type'] + " ]" + " Does not match Bool expr");
                    }
                }
            }
            else if (currentParent['name'] == "Addition Op") {
                if (firstVar != null && scopeTree.currentScope[firstVar]['type'] != 'int') {
                    throw new Error("Type mismatch - Variable [ " + firstVar + " ] of type [ " + scopeTree.currentScope[firstVar]['type'] + " ]" + " Does not match Int expr");
                }
                if (currentParent['children'][1]['name'] == "Equals To" || currentParent['children'][1]['name'] == "Not Equals") {
                    throw new Error("Cant add" + "to int expression ");
                }
                if (!(/^[0-9]$/.test(node.name))) {
                    if ((/^[a-z]$/.test(node.name))) {
                        if (node.name in scopeTree.currentScope) {
                            if (scopeTree.currentScope[node.name]['type'] != 'int') {
                                throw new Error("Cant add type " + scopeTree.currentScope[node.name]['type'] + " to Type Int");
                            }
                        }
                        else {
                            throw new Error("Variable isnt in scope");
                        }
                    }
                    else {
                        throw new Error("Cant add" + "to int expression ");
                    }
                }
            }
            //End addition Op parent
            //Start While Statement
        }
        //Second block for interior nodes
        else {
            // There are children, so note these interior/branch nodes and ...
            // .. recursively expand them.
            currentParent = node;
            if (node.name == "Block") {
                if (scopeTree.root == null) {
                    scopeTree.addNode("root", scopeTree.currentScopeNum);
                }
                else {
                    scopeTree.addNode("branch", ++scopeTree.currentScopeNum);
                }
            }
            for (var i = 0; i < node.children.length; i++) {
                if (node.children[i].name == 'Block') {
                    expand(node.children[i], depth + 1);
                    scopeTree.currentScopeNum -= 1;
                    scopeTree.moveUp();
                    scopeTree.currentScope = scopeTree.currentNode.scope;
                }
                else if (node.children[i].name == "Assignment Op") {
                    firstVar = null;
                    secondVar = null;
                    expand(node.children[i], depth + 1);
                }
                else if (node.children[i].name == "Equals to") {
                    expand(node.children[i].children[0], depth + 1);
                    expand(node.children[i].children[1], depth + 1);
                }
                else {
                    expand(node.children[i], depth + 1);
                }
            }
        }
    }
    // Make the initial call to expand from the root.
    expand(root, 0);
    // Return the result.
}
;
//When a test case is chosen on the html page, this function will execute and put one of these progams into the input
function tests(event) {
    var selectedElement = event.target;
    var value = selectedElement.text;
    if (value == "Alans Progam") {
        document.getElementById("Input").value = '{intaintba=0b=0while(a!=3){print(a)while(b!=3){print(b)b=1+bif(b==2){print("there isno spoon")}}b=0a=1+a}}$';
    }
    if (value == "JuiceC If Statement") {
        document.getElementById("Input").value = '{\nint a\na = 1\nif(1 == 1){\nprint("nums")\n}\nif(a == a){\nprint("ids")\n}\nif("hey" == "hey"){\nprint("strings")\n}\nif(true == true){\nprint("booleans")\n}\n} $';
    }
    if (value == "String declaration") {
        document.getElementById("Input").value = '{string f = "hello world"}$';
    }
    if (value == "Int declaration") {
        document.getElementById("Input").value = '{int a = 3}$';
    }
    if (value == "Bool declaration") {
        document.getElementById("Input").value = '{boolean b = false}$';
    }
    if (value == "Multiple Programs") {
        document.getElementById("Input").value = '{}$ \n {{{{{{}}}}}}$ \n {{{{{{}}} /* comments are ignored */ }}}$ \n{ /* comments are still ignored */ int @}$';
    }
    if (value == "No Input Test case") {
        document.getElementById("Input").value = '';
    }
    if (value == "Unterminated String") {
        document.getElementById("Input").value = '"';
    }
    if (value == "Unterminated Comment") {
        document.getElementById("Input").value = '/* hello world';
    }
    if (value == "Unterminated String with invalid grammar") {
        document.getElementById("Input").value = '" THIS IS ALL UPPERCASE WHICH IS INVALID. ALSO its unterminated';
    }
}
function addToSymbolTable(key, values) {
    let tableRow = document.createElement("tr");
    let child1 = document.createElement("td");
    child1.textContent = key;
    tableRow.appendChild(child1);
    let child2 = document.createElement("td");
    child2.textContent = values['type'];
    tableRow.appendChild(child2);
    let child3 = document.createElement("td");
    child3.textContent = values['scope'];
    tableRow.appendChild(child3);
    document.getElementById("table").append(tableRow);
}
//Clears the output field 
function clearOutput() {
    document.getElementById("Output").value = "";
}
//Clears the input field
function clearInput() {
    document.getElementById("Input").value = "";
}
//Puts the parameter in the output textarea on the html page
function output(output) {
    document.getElementById("Output").value += output + '\n';
}
//# sourceMappingURL=Main.js.map