
class Parser {
    tokenStream:any = [];
    SyntaxTree:any;
    constructor(tokenStream:[]) {
        this.tokenStream = tokenStream
        this.SyntaxTree = new ConcreteSyntaxTree();
    }
    parseStart() {

    }
    parseStatementList() {

    }
    parseBlock() {

    }
    parsePrint() {

    }
    parseAssignmentStatement() { }
    parseVarDecl() {

    }
    parseWhileStatement() { }
    parseIfStatement() {

    }
    parseExpr() {

    }
    parseIntExpr() {

    }
    parseStringExpression() {

    }
    parseBooleanExpression() {

    }
    parseId() { }
    parseCharList() {

    }
    parseType() {

    }
    parseSpace() {

    }
    match() {

    }

}