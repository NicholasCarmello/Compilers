
class Parser {
    tokenPointer = 0
    tokenStream: any = [];
    SyntaxTree: any;
    matchAlreadyFailed: boolean = false;
    constructor(tokenStream: []) {
        this.tokenStream = tokenStream
        this.SyntaxTree = new ConcreteSyntaxTree();
    }
    parseStart() {
        this.SyntaxTree.addNode("root", "Program")
        this.parseBlock();
        this.match("EOP")
        this.SyntaxTree.moveUp()
    }

    parseBlock() {

        this.SyntaxTree.addNode("branch", "Block");
        this.match("Left Curly");
        if (this.tokenStream[this.tokenPointer][1] == "Right Curly") {
            this.SyntaxTree.addNode("branch", "Statement List");
            this.SyntaxTree.moveUp();
        }
        this.parseStatementList();
        this.match("Right Curly");
        this.SyntaxTree.moveUp();
        
    }
    parseStatementList() {
    
        if (
            this.tokenStream[this.tokenPointer][1] == 'Print Statement' ||
            this.tokenStream[this.tokenPointer][1] == 'Type String' ||
            this.tokenStream[this.tokenPointer][1] == 'Type Int' ||
            this.tokenStream[this.tokenPointer][1] == 'Type Bool' ||
            this.tokenStream[this.tokenPointer][1] == 'If Statement' ||
            // '{' means block statement
            this.tokenStream[this.tokenPointer][1] == 'Left Curly' ||
            this.tokenStream[this.tokenPointer][1] == 'While statement' ||
            this.tokenStream[this.tokenPointer][1] == 'ID') {
            
            this.SyntaxTree.addNode("branch", "Statement List")
            this.parseStatement()
            this.parseStatementList()
            this.SyntaxTree.moveUp()
        }
        else if(this.tokenStream[this.tokenPointer][1] == "Right Curly"){
            
        }
        
        

    }
    parsePrint() {
        this.SyntaxTree.addNode("branch", "Print")
        this.match("Print Statement")
        this.match("Left Paren")
        this.parseExpr()
        this.match("Right Paren")
        this.SyntaxTree.moveUp()

    }
    parseAssignmentStatement() {
        this.SyntaxTree.addNode("branch", "Assignment Statement")
        this.parseId()
        this.match("Assignment Op")
        this.parseExpr()
        this.SyntaxTree.moveUp()

    }
    parseVarDecl() {
        this.SyntaxTree.addNode("branch", "VarDecl")
        this.parseType()
        this.parseId()
        this.SyntaxTree.moveUp()

    }
    parseType() {
        if (this.tokenStream[this.tokenPointer][1] == "Type Int") {
            this.SyntaxTree.addNode("branch","Type Int")
            this.match("Type Int")
            this.SyntaxTree.moveUp()
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Bool") {
            this.match("Type Bool")
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type String") {
            this.match("Type String")
        }


    }
    parseWhileStatement() {
        this.SyntaxTree.addNode("branch", "While Statement")
        this.match("While statement")
        this.parseBooleanExpression()
        
        this.parseBlock()
        this.SyntaxTree.moveUp()
    }
    parseIfStatement() {
        this.SyntaxTree.addNode("branch", "If Statement")
        this.match("If Statement")
        console.log("hello world ")
        this.parseBooleanExpression()
        
        this.parseBlock()
        
        this.SyntaxTree.moveUp()

    }
    parseExpr() {
        this.SyntaxTree.addNode("branch", "Expression")
        if (this.tokenStream[this.tokenPointer][1] == "Type Int") {
            this.parseIntExpr()
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type String") {
            this.parseStringExpression()
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Bool") { this.parseBooleanExpression() }
        else if (this.tokenStream[this.tokenPointer][1] == "ID") { this.parseId() }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Num") {
            this.parseIntExpr()
        }
        this.SyntaxTree.moveUp()
    }
    parseIntExpr() {
        this.SyntaxTree.addNode("branch", "Int Expr")
        if (this.tokenStream[this.tokenPointer][1] == "Type Num" && this.tokenStream[this.tokenPointer + 1][1] == "Addition Op") {
            this.parseDigit()
            this.parseIntOp()
            this.parseExpr()
            this.SyntaxTree.moveUp()
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Type Num") {
            this.parseDigit()
            this.SyntaxTree.moveUp()
        }

    }
    parseIntOp(){
    this.match('Addition Op')
    }
    parseDigit(){
        this.SyntaxTree.addNode("branch","Digit")
        this.match('Type Num')
        this.SyntaxTree.moveUp()
    }
    parseStringExpression() {
        this.SyntaxTree.addNode("branch", "String")
        this.match("Type String")
        this.SyntaxTree.moveUp()

    }
    parseBooleanExpression() {
        console.log("efh")
        this.SyntaxTree.addNode("branch", "Bool Expr")
        if (this.tokenStream[this.tokenPointer][1] == "Type Bool") {
            console.log("hiihih")
            this.match("Type Bool")
            this.SyntaxTree.moveUp()
        }
        else if (this.tokenStream[this.tokenPointer][1] == "Left Paren") {
            this.match("Left Paren")
            this.parseExpr()
            this.parseBoolOp()
            this.parseExpr()
            this.match("Right Paren")
            this.SyntaxTree.moveUp()
        }

    }
    parseBoolOp() {
        this.SyntaxTree.addNode("branch","Bool Op")
        if (this.tokenStream[this.tokenPointer][1] == "Not Equals") {
            this.match("Not Equals")

        }
        else if (this.tokenStream[this.tokenPointer][1] == "Equals To") {
            this.match("Equals To")
        }
        this.SyntaxTree.moveUp()
    }
    parseId() {
        this.SyntaxTree.addNode("branch", "ID")
        if (this.tokenStream[this.tokenPointer][1] == "ID") {
            this.match("ID")
            this.SyntaxTree.moveUp()
        }

    }

    parseStatement() {

        this.SyntaxTree.addNode("branch", "statement")

        if (this.tokenStream[this.tokenPointer][1] == "Print Statement") {
            this.parsePrint()
            this.SyntaxTree.moveUp()

        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "Type Int" ||this.tokenStream[this.tokenPointer][1]
            == "Type boolean" ||this.tokenStream[this.tokenPointer][1]
            == "Type String" ) {
            this.parseVarDecl()
            this.SyntaxTree.moveUp()

        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "ID") {
            this.parseAssignmentStatement()
            this.SyntaxTree.moveUp()

        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "While statement") {
            console.log('h')
            this.parseWhileStatement()
            this.SyntaxTree.moveUp()

        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "If Statement") {
            this.parseIfStatement()
            this.SyntaxTree.moveUp()

        }
        else if (this.tokenStream[this.tokenPointer][1]
            == "Left Curly") {
            this.parseBlock()
            this.SyntaxTree.moveUp()
        }
        //this.SyntaxTree.moveUp()

    }

    match(test: any) {
        if (test == this.tokenStream[this.tokenPointer][1]) {
            

            this.SyntaxTree.addNode("leaf", this.tokenStream[this.tokenPointer][1])
            this.tokenPointer += 1;
            
        } else {
            console.log('broken')
        }
    }
}