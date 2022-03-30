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
    startParse() {
        this.parseBlock();
        this.match('EOP');
    }
    parseBlock() {
        this.match('{');
        this.startStatement();
        this.match('}');
    }
    parsePrint() {
        this.match("print");
        this.match("(");
    }
    startStatement() {
        this.SyntaxTree.addNode("branch", "statement");
        if (this.tokenStream[this.tokenPointer][1] == "Print Statement") {
            this.parsePrint();
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "varDecl") {
            this.SyntaxTree.addNode("branch", "varDecl");
            this.SyntaxTree.moveUp();
            this.SyntaxTree.addNode("branch", "ID");
            this.match("ID");
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "ID") {
            this.SyntaxTree.moveUp();
        }
        /*else if (this.tokenStream[this.tokenPointer][1]
            == "While statement") {
            this.parseWhileStatement()
            this.SyntaxTree.moveUp()

        }*/ /*
        else if (this.tokenStream[this.tokenPointer][1]
            == "If Statement") {
            this.parseIfStatement()
            this.SyntaxTree.moveUp()

        }*/
        else if (this.tokenStream[this.tokenPointer][1]
            == "Left Curly") {
            this.parseBlock();
            this.SyntaxTree.moveUp();
        }
    }
    match(test) {
        if (test == this.tokenStream[this.tokenPointer][1]) {
            output("DEBUG PARSER - SUCCESS - Expected: " + test + ", Received: " + this.tokenStream[this.tokenPointer][0]);
            this.SyntaxTree.addNode("leaf", this.tokenStream[this.tokenPointer][0]);
            this.tokenPointer += 1;
        }
    }
}
//# sourceMappingURL=AstParser.js.map