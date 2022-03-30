class AstParser {
    tokenPointer = 0;
    tokenStream = [];
    SyntaxTree;
    matchAlreadyFailed = false;
    returnStringForError = "";
    constructor(tokenStream) {
        this.tokenStream = tokenStream;
        this.SyntaxTree = new AbstractSyntaxTree();
    }
    //Start of the Parser. It adds the root node to the tree.
    parseStart() {
        this.SyntaxTree.addNode("root", "Program");
        this.parseBlock();
        this.SyntaxTree.moveUp();
    }
    //Parse block is simply an opening brace. Adds a branch Node to the tree
    parseBlock() {
        this.SyntaxTree.addNode("branch", "Block");
        this.tokenPointer += 1;
        //This is for those cases where there are epsilons. Also known as at the end of all statement lists
        if (this.tokenStream[this.tokenPointer][1] == "Right Curly") {
            this.SyntaxTree.addNode("branch", "Statement List");
            this.SyntaxTree.moveUp();
        }
        this.parseStatementList();
        this.tokenPointer += 1;
        this.SyntaxTree.moveUp();
    }
    //Parse statement list parses a statement followed by a statementlist. 
    //The statement list has to check the token stream for the right character because
    //it can be many things such as print statement and type string
    parseStatementList() {
        if (this.tokenStream[this.tokenPointer][1] == 'Print Statement' ||
            this.tokenStream[this.tokenPointer][1] == 'varDecl' ||
            this.tokenStream[this.tokenPointer][1] == 'If Statement' ||
            // '{' means block statement
            this.tokenStream[this.tokenPointer][1] == 'Left Curly' ||
            this.tokenStream[this.tokenPointer][1] == 'While statement' ||
            this.tokenStream[this.tokenPointer][1] == 'ID') {
            this.parseStatement();
            this.parseStatementList();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Right Curly") {
        }
        else {
            this.returnStringForError = "DEBUG PARSER - ERROR - Expected: " + "StatementList" + ", Recieved: " + this.tokenStream[this.tokenPointer][0];
            output(this.returnStringForError);
            this.tokenPointer += 1;
            throw new Error("Check Output");
        }
    }
    //Parse prints adds a branch node and checks to see if the print statement is a 
    //print statement followed by an expression
    parsePrint() {
        this.SyntaxTree.addNode("branch", "Print");
        this.tokenPointer += 1;
        this.tokenPointer += 1;
        this.parseExpr();
        this.tokenPointer += 1;
        this.SyntaxTree.moveUp();
    }
    //Assignment statement is a statement that assigns a string, bool or int to a variable
    //Don't get this confused with the Equals to operator
    parseAssignmentStatement() {
        this.SyntaxTree.addNode("branch", "Assignment Statement");
        this.parseId();
        this.tokenPointer += 1;
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
        if (this.tokenStream[this.tokenPointer][1] == "varDecl") {
            if (this.tokenStream[this.tokenPointer][0] == "int") {
                this.match("varDecl");
            }
            else if (this.tokenStream[this.tokenPointer][0] == "boolean") {
                this.match("varDecl");
            }
            else if (this.tokenStream[this.tokenPointer][0] == "string") {
                this.match("varDecl");
            }
        }
    }
    //A while statement is while block 
    parseWhileStatement() {
        this.SyntaxTree.addNode("branch", "While Statement");
        this.match("While statement");
        this.parseBooleanExpression();
        this.parseBlock();
        this.SyntaxTree.moveUp();
    }
    //Parse if statement will go down parseBoolExpr and parseBlock functions
    parseIfStatement() {
        this.SyntaxTree.addNode("branch", "If Statement");
        this.match("If Statement");
        this.parseBooleanExpression();
        this.parseBlock();
        this.SyntaxTree.moveUp();
    }
    //An Expr can be an int, string, bool, Id or num. 
    //Each has their own function call down below
    parseExpr() {
        if (this.tokenStream[this.tokenPointer][1] == "Type Int") {
            this.parseIntExpr();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type String") {
            this.parseStringExpression();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Bool" || "Left Paren") {
            this.parseBooleanExpression();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "ID") {
            this.parseId();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Num") {
            this.parseIntExpr();
        }
    }
    //Parse Int Expr checks if its a type num or a type num followed by an addition sign
    //Each has it's own path and function calls
    parseIntExpr() {
        if (this.tokenStream[this.tokenPointer][1] == "Type Num" && this.tokenStream[this.tokenPointer + 1][1] == "Addition Op") {
            this.parseDigit();
            this.parseIntOp();
            this.parseExpr();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Num") {
            this.parseDigit();
        }
    }
    //Parse int op just checks for the addition operator
    parseIntOp() {
        this.SyntaxTree.addNode("branch", "Addition Op");
        this.match('Addition Op');
        this.SyntaxTree.moveUp();
    }
    //Parse digit looks for the type Nums and adds it to the tree
    parseDigit() {
        this.match('Type Num');
    }
    //Parse String Expression loops for the Type Strings and adds it to the tree
    parseStringExpression() {
        this.match("Type String");
    }
    //Parse Bool Expression can be a couple things. It can be the values "true" and "false". Or The value of bool expression could be a Left Paren folloed by an Expr and bool op. 
    parseBooleanExpression() {
        if (this.tokenStream[this.tokenPointer][1] == "Type Bool") {
            this.match("Type Bool");
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Left Paren") {
            this.tokenPointer += 1;
            this.parseExpr();
            this.parseBoolOp();
            this.parseExpr();
            this.tokenPointer += 1;
            this.SyntaxTree.moveUp();
        }
    }
    //Bool Op can be either an equals sign: = , or a not equals sign: != 
    parseBoolOp() {
        this.SyntaxTree.addNode("branch", "Bool Op");
        if (this.tokenStream[this.tokenPointer][1] == "Not Equals") {
            this.match("Not Equals");
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Equals To") {
            this.match("Equals To");
        }
        this.SyntaxTree.moveUp();
    }
    parseId() {
        this.match("ID");
    }
    //Statement is one of the most important productions because it has everything in it. 
    //It has print statements, Booleans, strings, ints, IDs, blocks and while statements.
    //Each of them have their own paths. parseStatement and parseStatementList functions look identical because statementlist has to check parseStatement to see the right path.
    parseStatement() {
        if (this.tokenStream[this.tokenPointer][1] == "Print Statement") {
            this.parsePrint();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "varDecl") {
            this.parseVarDecl();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "ID") {
            this.parseAssignmentStatement();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "While statement") {
            this.parseWhileStatement();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "If Statement") {
            this.parseIfStatement();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "Left Curly") {
            this.parseBlock();
        }
    }
    //Match is where we match our tokens and consume tokens. This moves the pointer one to the right once a token has been consumed.  
    match(test) {
        if (test == this.tokenStream[this.tokenPointer][1]) {
            output("DEBUG PARSER - SUCCESS - Expected: " + test + ", Received: " + this.tokenStream[this.tokenPointer][0]);
            this.SyntaxTree.addNode("leaf", this.tokenStream[this.tokenPointer][0]);
            this.tokenPointer += 1;
        }
    }
}
//# sourceMappingURL=AstParser.js.map