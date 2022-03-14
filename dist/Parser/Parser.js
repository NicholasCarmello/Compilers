class Parser {
    constructor(tokenStream) {
        this.tokenPointer = 0;
        this.tokenStream = [];
        this.matchAlreadyFailed = false;
        this.returnStringForError = "";
        this.tokenStream = tokenStream;
        this.SyntaxTree = new ConcreteSyntaxTree();
    }
    checkMatch(test) {
        if (test == this.tokenStream[this.tokenPointer][1]) {
            output("DEBUG PARSER - SUCCESS - Expected: " + test + ", Recieved: " + this.tokenStream[this.tokenPointer][0]);
            return true;
        }
        else {
            this.returnStringForError = "DEBUG PARSER - ERROR - Expected: " + test + ", Recieved: " + this.tokenStream[this.tokenPointer][0];
            return false;
        }
    }
    parseStart() {
        this.SyntaxTree.addNode("root", "Program");
        this.parseBlock();
        if (!this.checkMatch("EOP")) {
            return false;
        }
        this.match("EOP");
        this.SyntaxTree.moveUp();
    }
    parseBlock() {
        this.SyntaxTree.addNode("branch", "Block");
        if (!this.checkMatch("Left Curly")) {
            return false;
        }
        this.match("Left Curly");
        if (this.tokenStream[this.tokenPointer][1] == "Right Curly") {
            this.SyntaxTree.addNode("branch", "Statement List");
            this.SyntaxTree.moveUp();
        }
        this.parseStatementList();
        if (!this.checkMatch("Right Curly")) {
            return false;
        }
        this.match("Right Curly");
        this.SyntaxTree.moveUp();
    }
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
        }
    }
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
    parseVarDecl() {
        this.SyntaxTree.addNode("branch", "VarDecl");
        this.parseType();
        this.parseId();
        this.SyntaxTree.moveUp();
    }
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
    parseIfStatement() {
        this.SyntaxTree.addNode("branch", "If Statement");
        if (!this.checkMatch("If Statement")) {
            return false;
        }
        this.match("If Statement");
        console.log("hello world ");
        this.parseBooleanExpression();
        this.parseBlock();
        this.SyntaxTree.moveUp();
    }
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
    parseIntOp() {
        if (!this.checkMatch("Addition Op")) {
            return false;
        }
        this.match('Addition Op');
        this.SyntaxTree.moveUp();
    }
    parseDigit() {
        this.SyntaxTree.addNode("branch", "Digit");
        if (!this.checkMatch("Type Num")) {
            return false;
        }
        this.match('Type Num');
        this.SyntaxTree.moveUp();
    }
    parseStringExpression() {
        this.SyntaxTree.addNode("branch", "String");
        if (!this.checkMatch("Type String")) {
            return false;
        }
        this.match("Type String");
        this.SyntaxTree.moveUp();
    }
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
    parseStatement() {
        this.SyntaxTree.addNode("branch", "statement");
        if (this.tokenStream[this.tokenPointer][1] == "Print Statement") {
            this.parsePrint();
            this.SyntaxTree.moveUp();
        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "Type Int" || this.tokenStream[this.tokenPointer][1]
            == "Type boolean" || this.tokenStream[this.tokenPointer][1]
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