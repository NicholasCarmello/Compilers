class Parser {
    constructor(tokenStream) {
        this.tokenPointer = 0;
        this.tokenStream = [];
        this.matchAlreadyFailed = false;
        this.returnStringForError = "";
        this.tokenStream = tokenStream;
        this.SyntaxTree = new ConcreteSyntaxTree();
    }
    //This is just a function that checks the token and sees if it's the right token
    //The purpose of this is too leave the parser if there isn't a token satisfied.
    //This occurs before every this.match() function call beacause the match function increments the token stream pointer.
    checkMatch(test) {
        if (test == this.tokenStream[this.tokenPointer][1]) {
            console.log("Right brace");
            console.log(test);
            output("DEBUG PARSER - SUCCESS - Expected: " + test + ", Received: " + this.tokenStream[this.tokenPointer][0]);
            return true;
        }
        else {
            console.log(this.tokenStream[this.tokenPointer][0] + " stream");
            if (this.returnStringForError == "") {
                this.returnStringForError = "DEBUG PARSER - ERROR - Expected: " + test + ", Recieved: " + this.tokenStream[this.tokenPointer][0];
            }
            return false;
        }
    }
    //Start of the Parser. It adds the root node to the tree.
    parseStart() {
        this.SyntaxTree.addNode("root", "Program");
        this.parseBlock();
        if (!this.checkMatch("EOP")) {
            return false;
        }
        this.match("EOP");
        this.SyntaxTree.moveUp();
    }
    //Parse block is simply an opening brace. Adds a branch Node to the tree
    parseBlock() {
        this.SyntaxTree.addNode("branch", "Block");
        if (!this.checkMatch("Left Curly")) {
            return false;
        }
        this.match("Left Curly");
        //This is for those cases where there are epsilons. Also known as at the end of all statement lists
        if (this.tokenStream[this.tokenPointer][1] == "Right Curly") {
            this.SyntaxTree.addNode("branch", "Statement List");
            this.SyntaxTree.moveUp();
        }
        this.parseStatementList();
        console.log(this.tokenStream[this.tokenPointer]);
        if (!this.checkMatch("Right Curly")) {
            return false;
        }
        this.match("Right Curly");
        this.SyntaxTree.moveUp();
    }
    //Parse statement list parses a statement followed by a statementlist. 
    //The statement list has to check the token stream for the right character because
    //it can be many things such as print statement and type string
    parseStatementList() {
        if (this.tokenStream[this.tokenPointer][1] == 'Print Statement' ||
            this.tokenStream[this.tokenPointer][1] == 'Type String' ||
            this.tokenStream[this.tokenPointer][1] == 'Type Int' ||
            this.tokenStream[this.tokenPointer][1] == 'Type Bool' ||
            this.tokenStream[this.tokenPointer][1] == 'If Statement' ||
            // '{' means block statement
            this.tokenStream[this.tokenPointer][1] == 'Left Curly' ||
            this.tokenStream[this.tokenPointer][1] == 'While statement' ||
            this.tokenStream[this.tokenPointer][1] == 'ID') {
            this.SyntaxTree.addNode("branch", "Statement List");
            this.parseStatement();
            this.parseStatementList();
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Right Curly") {
            console.log("hrergera");
        }
    }
    //Parse prints adds a branch node and checks to see if the print statement is a 
    //print statement followed by an expression
    parsePrint() {
        this.SyntaxTree.addNode("branch", "Print");
        if (!this.checkMatch("Print Statement")) {
            return false;
        }
        this.match("Print Statement");
        if (!this.checkMatch("Left Paren")) {
            return false;
        }
        this.match("Left Paren");
        this.parseExpr();
        if (!this.checkMatch("Right Paren")) {
            return false;
        }
        this.match("Right Paren");
        this.SyntaxTree.moveUp();
    }
    //Assignment statement is a statement that assigns a string, bool or int to a variable
    //Don't get this confused with the Equals to operator
    parseAssignmentStatement() {
        this.SyntaxTree.addNode("branch", "Assignment Statement");
        this.parseId();
        if (!this.checkMatch("Assignment Op")) {
            return false;
        }
        this.match("Assignment Op");
        this.parseExpr();
        this.SyntaxTree.moveUp();
    }
    //Var Decl is short for variable declaration. 
    //In our grammar, we declare variables and then assign values to them
    //This is done in 2 lines
    parseVarDecl() {
        this.SyntaxTree.addNode("branch", "VarDecl");
        this.parseType();
        this.parseId();
        this.SyntaxTree.moveUp();
    }
    //Parse type checks for Type Int, Bool and string and goes down the appropriate path
    //For each of those respectively. They all get a branch node added before continuing the parse
    parseType() {
        if (this.tokenStream[this.tokenPointer][1] == "Type Int") {
            this.SyntaxTree.addNode("branch", "Type Int");
            if (!this.checkMatch("Type Int")) {
                return false;
            }
            this.match("Type Int");
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Bool") {
            if (!this.checkMatch("Type Bool")) {
                return false;
            }
            this.match("Type Bool");
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type String") {
            if (!this.checkMatch("Type String")) {
                return false;
            }
            this.match("Type String");
        }
    }
    //A while statement is while block 
    parseWhileStatement() {
        this.SyntaxTree.addNode("branch", "While Statement");
        if (!this.checkMatch("While statement")) {
            return false;
        }
        this.match("While statement");
        this.parseBooleanExpression();
        this.parseBlock();
        this.SyntaxTree.moveUp();
    }
    //Parse if statement will go down parseBoolExpr and parseBlock functions
    parseIfStatement() {
        this.SyntaxTree.addNode("branch", "If Statement");
        if (!this.checkMatch("If Statement")) {
            return false;
        }
        this.match("If Statement");
        this.parseBooleanExpression();
        this.parseBlock();
        this.SyntaxTree.moveUp();
    }
    //An Expr can be an int, string, bool, Id or num. 
    //Each has their own function call down below
    parseExpr() {
        this.SyntaxTree.addNode("branch", "Expression");
        if (this.tokenStream[this.tokenPointer][1] == "Type Int") {
            this.parseIntExpr();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type String") {
            this.parseStringExpression();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Bool") {
            this.parseBooleanExpression();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "ID") {
            this.parseId();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Num") {
            this.parseIntExpr();
        }
        this.SyntaxTree.moveUp();
    }
    //Parse Int Expr checks if its a type num or a type num followed by an addition sign
    //Each has it's own path and function calls
    parseIntExpr() {
        this.SyntaxTree.addNode("branch", "Int Expr");
        if (this.tokenStream[this.tokenPointer][1] == "Type Num" && this.tokenStream[this.tokenPointer + 1][1] == "Addition Op") {
            this.parseDigit();
            this.parseIntOp();
            this.parseExpr();
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Num") {
            this.parseDigit();
            this.SyntaxTree.moveUp();
        }
    }
    //Parse int op just checks for the addition operator
    parseIntOp() {
        this.SyntaxTree.addNode("branch", "Addition Op");
        if (!this.checkMatch("Addition Op")) {
            return false;
        }
        this.match('Addition Op');
        this.SyntaxTree.moveUp();
    }
    //Parse digit looks for the type Nums and adds it to the tree
    parseDigit() {
        this.SyntaxTree.addNode("branch", "Digit");
        if (!this.checkMatch("Type Num")) {
            return false;
        }
        this.match('Type Num');
        this.SyntaxTree.moveUp();
    }
    //Parse String Expression loops for the Type Strings and adds it to the tree
    parseStringExpression() {
        this.SyntaxTree.addNode("branch", "String");
        if (!this.checkMatch("Type String")) {
            return false;
        }
        this.match("Type String");
        this.SyntaxTree.moveUp();
    }
    //Parse Bool Expression can be a couple things. It can be the values "true" and "false". Or The value of bool expression could be a Left Paren folloed by an Expr and bool op. 
    parseBooleanExpression() {
        this.SyntaxTree.addNode("branch", "Bool Expr");
        if (this.tokenStream[this.tokenPointer][1] == "Type Bool") {
            if (!this.checkMatch("Type Bool")) {
                return false;
            }
            this.match("Type Bool");
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Left Paren") {
            if (!this.checkMatch("Left Paren")) {
                return false;
            }
            this.match("Left Paren");
            this.parseExpr();
            this.parseBoolOp();
            this.parseExpr();
            if (!this.checkMatch("Right Paren")) {
                return false;
            }
            this.match("Right Paren");
            this.SyntaxTree.moveUp();
        }
    }
    //Bool Op can be either an equals sign: = , or a not equals sign: != 
    parseBoolOp() {
        this.SyntaxTree.addNode("branch", "Bool Op");
        if (this.tokenStream[this.tokenPointer][1] == "Not Equals") {
            if (!this.checkMatch("Not Equals")) {
                return false;
            }
            this.match("Not Equals");
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Equals To") {
            if (!this.checkMatch("Equals To")) {
                return false;
            }
            this.match("Equals To");
        }
        this.SyntaxTree.moveUp();
    }
    parseId() {
        this.SyntaxTree.addNode("branch", "ID");
        if (this.tokenStream[this.tokenPointer][1] == "ID") {
            if (!this.checkMatch("ID")) {
                return false;
            }
            this.match("ID");
            this.SyntaxTree.moveUp();
        }
    }
    //Statement is one of the most important productions because it has everything in it. 
    //It has print statements, Booleans, strings, ints, IDs, blocks and while statements.
    //Each of them have their own paths. parseStatement and parseStatementList functions look identical because statementlist has to check parseStatement to see the right path.
    parseStatement() {
        this.SyntaxTree.addNode("branch", "statement");
        if (this.tokenStream[this.tokenPointer][1] == "Print Statement") {
            this.parsePrint();
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "Type Int" || this.tokenStream[this.tokenPointer][1]
            == "Type Bool" || this.tokenStream[this.tokenPointer][1]
            == "Type String") {
            this.parseVarDecl();
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "ID") {
            this.parseAssignmentStatement();
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "While statement") {
            this.parseWhileStatement();
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "If Statement") {
            this.parseIfStatement();
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "Left Curly") {
            this.parseBlock();
            this.SyntaxTree.moveUp();
        }
    }
    //Match is where we match our tokens and consume tokens. This moves the pointer one to the right once a token has been consumed.  
    match(test) {
        if (test == this.tokenStream[this.tokenPointer][1]) {
            this.SyntaxTree.addNode("leaf", this.tokenStream[this.tokenPointer][0]);
            this.tokenPointer += 1;
            return true;
        }
        else {
            this.returnStringForError = "Expected [" + test + "] Received " + this.tokenStream[this.tokenPointer][0];
            return false;
        }
    }
}
//# sourceMappingURL=Parser.js.map