class Parser {
    tokenPointer = 0;
    tokenStream = [];
    SyntaxTree;
    constructor(tokenStream) {
        this.tokenStream = tokenStream;
        this.SyntaxTree = new ConcreteSyntaxTree();
    }
    parseStart() {
        //this.SyntaxTree.addNode("root", "start")
        this.parseBlock();
        this.match("EOP");
    }
    parseBlock() {
        //this.SyntaxTree.addNode("branch", "term")
        this.match("Left Curly");
        this.parseStatementList();
        this.match("Right Curly");
    }
    parseStatementList() {
        //this.SyntaxTree.addNode("branch", "term")
        if (this.tokenStream[this.tokenPointer][1] == 'Print Statement' ||
            this.tokenStream[this.tokenPointer][1] == 'Type String' ||
            this.tokenStream[this.tokenPointer][1] == 'Type Int' ||
            this.tokenStream[this.tokenPointer][1] == 'Type Bool' ||
            this.tokenStream[this.tokenPointer][1] == 'If Statement' ||
            // '{' means block statement
            this.tokenStream[this.tokenPointer][1] == '{' ||
            this.tokenStream[this.tokenPointer][1] == 'While statement' ||
            this.tokenStream[this.tokenPointer][1] == 'ID') {
            this.parseStatement();
            this.parseStatementList();
        }
    }
    parsePrint() {
        //this.SyntaxTree.addNode("branch", "term")
        this.match("Print Statement");
        this.match("Left Paren");
        this.parseExpr();
        this.match("Right Paren");
    }
    parseAssignmentStatement() {
        //this.SyntaxTree.addNode("branch", "term")
        this.parseId();
        this.match("Assignment Op");
        this.parseExpr();
    }
    parseVarDecl() {
        //this.SyntaxTree.addNode("branch", "term")
        this.parseType();
        this.parseId();
    }
    parseType() {
        if (this.tokenStream[this.tokenPointer][1] == "Type Int") {
            this.match("Type Int");
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Bool") {
            this.match("Type Bool");
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type String") {
            this.match("Type String");
        }
    }
    parseWhileStatement() {
        this.SyntaxTree.addNode("branch", "term");
    }
    parseIfStatement() {
        this.SyntaxTree.addNode("branch", "term");
    }
    parseExpr() {
        //this.SyntaxTree.addNode("branch", "term")
        if (this.tokenStream[this.tokenPointer][1] == "Type Int") {
            this.parseIntExpr();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type String") {
            this.match("Type String");
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Bool") { }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Id") { }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Num") {
            this.parseIntExpr();
        }
    }
    parseIntExpr() {
        //this.SyntaxTree.addNode("branch", "term")
        if (this.tokenStream[this.tokenPointer][1] == "Type Num" && this.tokenStream[this.tokenPointer + 1][1] == "Addition Op") {
            this.match("Type Num");
            this.match("Addition Op");
            this.parseExpr();
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Num") {
            this.match("Type Num");
        }
    }
    parseStringExpression() {
        this.SyntaxTree.addNode("branch", "term");
    }
    parseBooleanExpression() {
        this.SyntaxTree.addNode("branch", "term");
    }
    parseId() {
        //this.SyntaxTree.addNode("branch", "term")
        console.log(this.tokenStream[this.tokenPointer]);
        if (this.tokenStream[this.tokenPointer][1] == "ID") {
            this.match("ID");
        }
    }
    parseStatement() {
        //this.SyntaxTree.addNode("branch", this.tokenStream[this.tokenPointer++])
        if (this.tokenStream[this.tokenPointer][1] == "Print Statement") {
            this.parsePrint();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "Type Int") {
            this.parseVarDecl();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "ID") {
            this.parseAssignmentStatement();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "WhileStatement") {
            this.parseWhileStatement();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "IfStatement") {
            this.parseIfStatement();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "Block") {
            this.parseBlock();
        }
    }
    parseSpace() {
    }
    match(test) {
        if (test == this.tokenStream[this.tokenPointer][1]) {
            this.tokenPointer += 1;
        }
        else {
            console.log("parse failed");
        }
    }
}
//# sourceMappingURL=Parser.js.map