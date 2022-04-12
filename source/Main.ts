//this retreives the input fields value on the html page



function getData() {
  let warningCounter = 0;
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
    let typeChecker = new TypeChecker();

    try {
      output("INFO SEMANTIC - Analyzing Program " + programCounter++)
      typeChecker.scopeChecker(astParser.SyntaxTree.root, scopeTree)
      output("INFO SEMANTIC - PROGRAM SUCCESSFULLY FINISHED WITH 0 ERRORS AND " + " WARNINGS")
      if (astParser.SyntaxTree.root.children < 1) {
      } else {
        scopeTree.toSymbolTable();
      }

      output("")
    } catch (error) {
      output("DEBUG SEMANTIC - ERROR - " + error)
      output("INFO SEMANTIC - PROGRAM FINISHED WITH 1 ERROR")
      output("")
      continue
    }

  }
  this.resetPgmCounter();
}

function addToSymbolTable(key, values) {
  //child1 is the variable. i.e: a

  if (values['isUsed'] == false) {

    output("DEBUG SEMANTIC - WARNING - Variable [ " + key + " ] was declared at " + values['line'] + "," + values['char'] + ", but was never used.");
  }
  if (values['isInitialized'] == false) {
    output("DEBUG SEMANTIC - WARNING - Variable [ " + key + " ] was declared at " + values['line'] + "," + values['char'] + ", but was never initialized.");
  } else {
    if (values['isUsed'] == false) {
      output("DEBUG SEMANTIC - WARNING - Variable [ " + key + " ] was initialized at " + values['line'] + "," + values['char'] + ", but was never used.")
    }
  }
  let tableRow = document.createElement("tr");
  let child1 = document.createElement("td");
  child1.textContent = key
  tableRow.appendChild(child1)
  //Child2 is the type
  let child2 = document.createElement("td");
  child2.textContent = values['type']
  tableRow.appendChild(child2)
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

  (<HTMLInputElement>document.getElementById("table")).append(tableRow);

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
