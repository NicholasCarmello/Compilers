//this retreives the input fields value on the html page



function getData() {
  let programCounter = 1
  let tokenStream: [] = []
  let input: string = (<HTMLInputElement>document.getElementById("Input")).value;
  let splittedInput = input.split("$");
  clearOutput();
  (<HTMLInputElement>document.getElementById("CST")).value = "";

  for (let i = 0; i < splittedInput.length; i++) {
    //lexing starts here

    if (splittedInput.length > 1) {
      if (i == 0) {
        splittedInput.pop()
      }
      tokenStream = this.lexGreedyApproach(splittedInput[i] + "$");
    } else {

      tokenStream = this.lexGreedyApproach(splittedInput[i]);
    }

    console.log(tokenStream)
    //parsing starts here
    let cstTraversal;
    if (tokenStream) {
      let parser = new Parser(tokenStream);
      try {
        output("INFO PARSER - Parsing program " + programCounter)
        parser.parseStart();

      } catch (error) {
        this.output("INFO PARSER - Parser failed with 1 error. Not Printing CST.\n");
        console.log(error)
        continue
      };
      this.output("INFO PARSER - Parser Passed. Printing CST.\n");
      cstTraversal = parser.SyntaxTree.toString();
      (<HTMLInputElement>document.getElementById("CST")).value += cstTraversal + "\n";



      let CSTTreeAntArray = []
      var dict = {};
      CSTTreeAntArray.push(cstConfig)
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
          }
          CSTTreeAntArray.push(rootNode)
          dict[currentNode] = rootNode;
          map1.set(currentNode, rootNode)
          continue
        }
        let nextNode = {
          parent: map1.get(currentNode.parent),
          text: { name: currentNode.name },
          node: currentNode
        }
        dict[currentNode] = nextNode;
        map1.set(currentNode, nextNode)
        CSTTreeAntArray.push(nextNode)
      }
      //Puts the array of the objects into the simple_char_config variable for treant to utilize
      cstChart = CSTTreeAntArray;
      //This initialized the new Treant object with our array of objects
      this.createCST(cstChart)
    }
    //Semantic Analysis starts here. We shouldn't get an error in this parse because the parse for the CST validated everything in our language.
    //parsing starts here

    let astTraversal;
    let astParser = new AstParser(tokenStream);
    astParser.parseStart()
    astTraversal = astParser.SyntaxTree.toString();
    let astTreeantArray = [];
    astTreeantArray.push(astConfig)

    const map2 = new Map();

    (<HTMLInputElement>document.getElementById("AST")).value += astTraversal + "\n";
    for (let j = 0; j < astParser.SyntaxTree.depth2.length; j++) {
      let currentNode = astParser.SyntaxTree.depth2[j];

      if (j == 0) {
        let rootNode = {
          text: { name: currentNode.name },
          node: currentNode
        }
        astTreeantArray.push(rootNode)
        dict[currentNode] = rootNode;
        map2.set(currentNode, rootNode)
        continue
      }
      let nextNode = {
        parent: map2.get(currentNode.parent),
        text: { name: currentNode.name },
        node: currentNode
      }
      dict[currentNode] = nextNode;
      map2.set(currentNode, nextNode)
      astTreeantArray.push(nextNode)
    }


    astChart = astTreeantArray;
    //This initialized the new Treant object with our array of objects
    this.createCST(astChart)

    let scopeTree = new ScopeTree();


    try {
      output("INFO SEMANTIC - Analyzing Program " + programCounter ++ )
      scopeChecker(astParser.SyntaxTree.root, scopeTree)
      output("")
    } catch (error) {
      output("DEBUG SEMANTIC - ERROR - " + error)
      output("INFO SEMANTIC - PROGRAM FINISHED WITH 1 error")
      output("")

      continue
    }
    scopeTree.toSymbolTable();

  }
  this.resetPgmCounter();
}

function scopeChecker(root, scopeTree) {
  // Initialize the result string.
  let ultParent = ""
  let currentParent = ""
  let firstVar = null;
  let secondVar = null;
  let firstBool = null;
  let typeOfExpr = null;
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
          if (secondVar in scopeTree.currentScope){
            throw new Error("Variable already declared in the current scope")
          }
          output("DEBUG SEMANTIC - Variable Declared [" + secondVar + "] as Type " + firstVar)
          scopeTree.currentScope[secondVar] = { "type": firstVar, 'used': false, 'isInitialized': false, "scope": scopeTree.currentScopeNum }
          firstVar = null;
          secondVar = null;
        }
      }
      //Assignment Statement Encounter
      else if (currentParent['name'] == "Assignment Statement") {
        if (firstVar == null) {
          firstVar = node.name
          if (checkScope(firstVar,scopeTree)) {
            //continue
          }
          else {
            //TODO: throw error when variable initialized before being declared.
            throw new Error("Variable initialized before being declared.");

          }
        }
        else {

              secondVar = node.name
              let found = false
              let currentNodde = scopeTree.currentNode
              
              while(currentNodde != root){
               

                if (firstVar in currentNodde.scope){
                  found = true
                  break
                }
                if (currentNodde.parent == null){
                  break
                }
                currentNodde = currentNodde.parent;
              
              }

              let foundSecond = false
              let currentNoddeForSecond = scopeTree.currentNode
              if (/^[a-z]$/.test(secondVar)){
                
                
                while(currentNoddeForSecond != root){
                 
  
                  if (secondVar in currentNoddeForSecond.scope){
                    foundSecond = true
                  }
                  if (currentNoddeForSecond.parent == null){
                    break
                  }
                  currentNoddeForSecond= currentNoddeForSecond.parent;
                
                }

              }
              

         
          if (currentNodde.scope[firstVar]['type'] == 'int' && /^[0-9]$/.test(secondVar)) {
            currentNodde.scope[firstVar]['isInitialized'] = true
            output("DEBUG SEMANTIC - SUCCESS: Variable " + firstVar + " has been initialized with the correct type as int ")
          }
          else if (currentNodde.scope[firstVar]['type'] == 'string' && secondVar[0] == "'") {
            currentNodde.scope[firstVar]['isInitialized'] = true
            output("DEBUG SEMANTIC - SUCCESS: Variable [" + firstVar + "] has been initialized with the correct type as string ")

          }
          else if (currentNodde.scope[firstVar]['type'] == 'boolean' && (secondVar == 'true' || secondVar == "false")) {
            currentNodde.scope[firstVar]['isInitialized'] = true
            output("DEBUG SEMANTIC - SUCCESS: Variable " + firstVar + " has been initialized with the correct type as boolean")

          }
          //finall else if for assignment to id
          else if (foundSecond == true) {
            if (currentNoddeForSecond.scope[firstVar]['type'] == currentNoddeForSecond.scope[secondVar]['type']) {
              currentNoddeForSecond.scope[firstVar]['isInitialized'] = true
              output("DEBUG SEMANTIC - SUCCESS: Variable " + firstVar + " has been initialized ")

            } else {
              //TODO THROW ERROR when mismatch
              
              throw new Error("TYPE MISMATCH - TYPE OF: " + currentNoddeForSecond.scope[secondVar]['type'] + " Does Not match: " + currentNoddeForSecond.scope[firstVar]['type'])

            }
          }
          else {
            if (!(secondVar in scopeTree.currentScope) && /^[a-z]$/.test(secondVar)) {
              //Variable assigned to another variable which isnt in scope.. rip
              //TODO THROW ERROR
              let found = false
              let currentNodde = scopeTree.currentNode
              
              while(currentNodde != root){
               

                if (secondVar in currentNodde.scope){
                  found = true
                }
                if (currentNodde.parent == null){
                  break
                }
                currentNodde = currentNodde.parent;
              
              }
              if (secondVar in currentNodde.scope){
                found = true
              }

              if (found){
                output("DEBUG SEMANTIC - SUCCESS: Variable " + firstVar + " has been initialized ")
              }
              else{
                throw new Error(secondVar + "is not in scope")

              }


            } else {
              //MisMatch
              throw new Error("TYPE MISMATCH - TYPE OF: " + secondVar + " Does Not match: " + currentNodde.scope[firstVar]['type'])

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
        let checker;
        if(/^[a-z]$/.test(node.name)){
           checker = checkScope(node.name,scopeTree)
        }
        if (currentParent['children'].length == 1) {
          if (node.name == "true" || node.name == "false" || node.name[0] == "'" || /^[0-9]$/.test(node.name)) {

          }
          //else must be an id because parse worked 
          else {
            if (checker) {
              //cont
            }
            else {
              throw new Error("Variable not in scope")
            }
          }

        }
      }
      //End Statement

      //Start addition OP
      else if (currentParent['name'] == "Not Equals") {
        //This just checks to see if the other child is of the same type.
        //If it isn't there is an error.
        let first = getType(node.parent['children'][0]['name'],scopeTree)
        let second = getType(node.parent['children'][1]['name'],scopeTree)
        if (first != second){
          throw new Error ("Cant match " + first + " and " +  second +" vars")
        }


      }
      else if (currentParent['name'] == "Equals To") {   
        //This just checks to see if the other child is of the same type.
        //If it isn't there is an error.
        let first = getType(node.parent['children'][0]['name'],scopeTree)
        let second = getType(node.parent['children'][1]['name'],scopeTree)
        if (first != second){
          throw new Error ("Cant match " + first + " and " +  second +" vars")
        }   
      }
      else if (currentParent['name'] == "Addition Op") {
        if (ultParent != "Equals To" && ultParent != "Not Equals") {
          if (firstVar != null && scopeTree.currentScope[firstVar]['type'] != 'int') {

            throw new Error("TYPE MISMATCH - Variable [ " + firstVar + " ] of type [ " + scopeTree.currentScope[firstVar]['type'] + " ]" + " Does not match Int expr")

          }
          if (currentParent['children'][1]['name'] == "Equals To" || currentParent['children'][1]['name'] == "Not Equals") {
            throw new Error("Cant add" + " to int expression ")
          }
          if (!(/^[0-9]$/.test(node.name))) {
            if ((/^[a-z]$/.test(node.name))) {
              if (node.name in scopeTree.currentScope) {
                if (scopeTree.currentScope[node.name]['type'] != 'int') {
                  throw new Error("Cant add type " + scopeTree.currentScope[node.name]['type'] + " to Type Int")
                }
              }
              else {
                throw new Error("Variable isnt in scope")
              }
            }
            else {
              
              throw new Error("Cant add " + getType(node.name,scopeTree) +" to int expression ")
            }
          }
          if (node.name == currentParent['children'][1]['name']) {
            firstVar = null
            secondVar = null
          }
        } else {
          if (firstBool == null) {
            firstBool = node.name

            if (/^[0-9]$/.test(firstBool)) {
              typeOfExpr = 'int'
            }
            else if (/^[a-z]$/.test(node.name)) {
              if (firstBool in scopeTree.currentScope) {
                typeOfExpr = scopeTree.currentScope[firstBool]['type']
              }
            }
            else if (node.name == "true" || node.name == "false") {
              typeOfExpr = 'boolean'
            }
            else if (node.name[0] == "'") {
              typeOfExpr = 'string'

            }

            //this might work for assignment
            
          }
          else {
            if (/^[a-z]$/.test(node.name)) {
              if (node.name in scopeTree.currentScope) {
                if (scopeTree.currentScope[node.name]['type'] != typeOfExpr) {
                  throw new Error('hra');
                }
              }
              else {
                throw new Error("wo")
              }
            }
            else if (/^[0-9]$/.test(node.name)) {
              if (typeOfExpr != 'int') {
                throw new Error("Type of ")
              }

            }
            else if (node.name[0] == "'") {
              if (typeOfExpr != "string") {
                throw new Error("No Erro")
              }

            }
            else if (node.name == "true" || node.name == "false") {
              if (typeOfExpr != 'boolean') {
                throw new Error("")
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

      // .. recursively expand them.
      currentParent = node;
      if (node.name == "Block") {
        if (scopeTree.root == null) {
          scopeTree.addNode("root", scopeTree.currentScopeNum)

        } else {
          scopeTree.currentScopeNum += 1;
          scopeTree.addNode("branch", scopeTree.currentScopeNum)

        }
      }
      for (var i = 0; i < node.children.length; i++) {

        if (node.children[i].name == 'Block') {
          expand(node.children[i], depth + 1);
          scopeTree.currentScopeNum -= 1
          scopeTree.moveUp()
          scopeTree.currentScope = scopeTree.currentNode.scope
        }
        else if (node.children[i].name == "Equals To") {
          ultParent = "Equals To"
          expand(node.children[i], depth + 1);
          ultParent = ""
          firstVar = null;
          secondVar = null;
        } else if (node.children[i].name == "While Statement") {
          firstBool = null;
          expand(node.children[i], depth + 1);

        }
        else if (node.children[i].name == "If Statement"){
          firstBool = null;
          expand(node.children[i], depth + 1);
          currentParent = node;
        }

        else {
          expand(node.children[i], depth + 1);
          currentParent = node;

        }
      }


    }
  }
  // Make the initial call to expand from the root.
  expand(root, 0);
  // Return the result.
};
function checkScope(type,scopeTree){
    let found = false
    let currentNodde = scopeTree.currentNode
    while(currentNodde != scopeTree.root){
     
      if (type in currentNodde.scope){
        found = true
        return true
      }
      if (currentNodde.parent == null){
        break
      }
      currentNodde = currentNodde.parent;
    
    }
    if (type in currentNodde.scope){
     
      return true
    }else{
      

      return false
    }
  
    
  }

//When a test case is chosen on the html page, this function will execute and put one of these progams into the input
function tests(event: any): void {
  var selectedElement = event.target;
  var value = selectedElement.text;
  if (value == "Alans Progam") {
    (<HTMLInputElement>document.getElementById("Input")).value = '{intaintba=0b=0while(a!=3){print(a)while(b!=3){print(b)b=1+bif(b==2){print("there isno spoon")}}b=0a=1+a}}$';
  }
  if (value == "JuiceC If Statement") {
    (<HTMLInputElement>document.getElementById("Input")).value = '{\nint a\na = 1\nif(1 == 1){\nprint("nums")\n}\nif(a == a){\nprint("ids")\n}\nif("hey" == "hey"){\nprint("strings")\n}\nif(true == true){\nprint("booleans")\n}\n} $'
  }
  if (value == "String declaration") {
    (<HTMLInputElement>document.getElementById("Input")).value = '{string f = "hello world"}$';

  }
  if (value == "Int declaration") {
    (<HTMLInputElement>document.getElementById("Input")).value = '{int a = 3}$';
  }
  if (value == "Bool declaration") {
    (<HTMLInputElement>document.getElementById("Input")).value = '{boolean b = false}$';
  }
  if (value == "Multiple Programs") {
    (<HTMLInputElement>document.getElementById("Input")).value = '{}$ \n {{{{{{}}}}}}$ \n {{{{{{}}} /* comments are ignored */ }}}$ \n{ /* comments are still ignored */ int @}$';
  }
  if (value == "No Input Test case") {
    (<HTMLInputElement>document.getElementById("Input")).value = '';
  }
  if (value == "Unterminated String") {
    (<HTMLInputElement>document.getElementById("Input")).value = '"';
  }
  if (value == "Unterminated Comment") {
    (<HTMLInputElement>document.getElementById("Input")).value = '/* hello world';
  }
  if (value == "Unterminated String with invalid grammar") {
    (<HTMLInputElement>document.getElementById("Input")).value = '" THIS IS ALL UPPERCASE WHICH IS INVALID. ALSO its unterminated';
  }
}
function getType(id,scopeTree) {
  let type = id
  if (/^[0-9]$/.test(type)){
    return 'int'
  }
  else if (type == 'false' || type == "true"){
    return 'boolean'
  }
  else if (type[0] == "'"){
    return 'string'
  }
  else if (type == "Equals To" || type == "Not Equals"){
    return 'boolean'
  }
  else if (type == "Addition Op"){
    return 'int'
  }
  else if (/^[a-z]$/.test(type)){
    let found = false
    let currentNodde = scopeTree.currentNode
    while(currentNodde != scopeTree.root){
     

      if (type in currentNodde.scope){
        found = true
        return currentNodde.scope[type]['type']
      }
      if (currentNodde.parent == null){
        break
      }
      currentNodde = currentNodde.parent;
    
    }
    if (type in currentNodde.scope){
      return currentNodde.scope[type]['type']

      found = true
    }
    else{
      throw new Error("Variable isnt in scope")
    }
    
  }
}
function addToSymbolTable(key, values) {
  let tableRow = document.createElement("tr");
  let child1 = document.createElement("td");
  child1.textContent = key
  tableRow.appendChild(child1)
  let child2 = document.createElement("td");
  child2.textContent = values['type']
  tableRow.appendChild(child2)
  let child3 = document.createElement("td");
  child3.textContent = values['scope'];
  tableRow.appendChild(child3);

  (<HTMLInputElement>document.getElementById("table")).append(tableRow);

}
//Clears the output field 
function clearOutput() {
  (<HTMLInputElement>document.getElementById("Output")).value = "";
}
//Clears the input field
function clearInput() {
  (<HTMLInputElement>document.getElementById("Input")).value = "";

}
//Puts the parameter in the output textarea on the html page
function output(output: string): void {
  (<HTMLInputElement>document.getElementById("Output")).value += output + '\n';
}
