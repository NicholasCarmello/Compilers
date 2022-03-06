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
        if (this.tokenStream[this.tokenPointer][1] == 'Print Statement') {
            this.parseStatement();
            this.parseStatementList();
        }
        else {
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
        this.SyntaxTree.addNode("branch", "term");
        this.parseId();
        this.match("=");
        this.parseExpr();
    }
    parseVarDecl() {
        this.SyntaxTree.addNode("branch", "term");
        this.parseType();
        this.parseId();
    }
    parseType() { this.match(this.tokenStream[this.tokenPointer]); }
    parseWhileStatement() {
        this.SyntaxTree.addNode("branch", "term");
    }
    parseIfStatement() {
        this.SyntaxTree.addNode("branch", "term");
    }
    parseExpr() {
        //this.SyntaxTree.addNode("branch", "term")
        console.log(this.tokenStream[this.tokenPointer]);
        if (this.tokenStream[this.tokenPointer][1] == "Type Int") {
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type String") {
            console.log("hello WOrld ");
            this.match("Type String");
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Bool") { }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Id") { }
    }
    parseIntExpr() {
        this.SyntaxTree.addNode("branch", "term");
    }
    parseStringExpression() {
        this.SyntaxTree.addNode("branch", "term");
    }
    parseBooleanExpression() {
        this.SyntaxTree.addNode("branch", "term");
    }
    parseId() {
        this.SyntaxTree.addNode("branch", "term");
    }
    parseStatement() {
        //this.SyntaxTree.addNode("branch", this.tokenStream[this.tokenPointer++])
        if (this.tokenStream[this.tokenPointer][1] == "Print Statement") {
            this.parsePrint();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "AssignMentStatement") {
            this.parseAssignmentStatement();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "VarDecl") {
            this.parseVarDecl();
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
            return;
        }
        else {
            console.log("parse failed");
        }
    }
}
//# sourceMappingURL=Parser.js.map