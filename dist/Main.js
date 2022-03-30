//this retreives the input fields value on the html page
function getData() {
    let tokenStream = [];
    let input = document.getElementById("Input").value;
    let splittedInput = input.split("$");
    simple_chart_config = [];
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
        let root;
        let traversal;
        if (tokenStream) {
            let parser = new Parser(tokenStream);
            try {
                parser.parseStart();
            }
            catch (error) {
                this.output("INFO PARSER - Parser failed with 1 error. Not Printing CST.\n");
                break;
            }
            traversal = parser.SyntaxTree.toString();
            root = parser.SyntaxTree.root;
            this.output("INFO PARSER - Parser failed. Not Printing CST.\n");
            this.output("INFO PARSER - Parser Passed. Printing CST.\n");
            document.getElementById("CST").value += traversal + "\n";
            let CSTTreeAntArray = [];
            var dict = {};
            CSTTreeAntArray.push(config);
            const map1 = new Map();
            //This for loop goes through every node and creates a Treant representation according to the Treant Docs.
            //The Docs can be found at https://fperucic.github.io/treant-js/
            //This could actually be done at the end of the first for loop to save time. I just wanted things to happen in sequence
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
            simple_chart_config = CSTTreeAntArray;
            //This initialized the new Treant object with our array of objects
            this.createCST(simple_chart_config);
        }
        //Semantic Analysis starts here
    }
    this.resetPgmCounter();
}
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