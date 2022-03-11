//this retreives the input fields value on the html page
function getData() {
    let tokenStream = [];
    let input = document.getElementById("Input").value;
    let splittedInput = input.split("$");
    clearOutput();
    for (let i = 0; i < splittedInput.length; i++) {
        //lexing 
        if (splittedInput.length > 1) {
            if (i == 0) {
                splittedInput.pop();
            }
            tokenStream = this.lexGreedyApproach(splittedInput[i] + "$");
        }
        else {
            tokenStream = this.lexGreedyApproach(splittedInput[i]);
        }
        //parsing
        let node = {
            text: "",
            children: []
        };
        let root;
        let traversal;
        let newTrav = [];
        if (tokenStream) {
            let parser = new Parser(tokenStream);
            let parserSuccess = parser.parseStart();
            traversal = parser.SyntaxTree.toString();
            output(traversal);
            root = parser.SyntaxTree.depth2;
        }
        let counter = 0;
        let man = "";
        for (let i = 0; i < traversal.length; i++) {
            if (traversal[i] == "-") {
                counter += 1;
                if (counter > newTrav.length) {
                    newTrav.push([]);
                }
                man += traversal[i];
                continue;
            }
            if (traversal[i] == '\n') {
                newTrav[counter].push(man);
                counter = 0;
                continue;
            }
            man += traversal[i];
        }
        console.log(newTrav);
        for (let i = newTrav.length; i > 0; i--) {
            //let node_structure ={text:{name: newTrav.}}
        }
        this.hello();
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