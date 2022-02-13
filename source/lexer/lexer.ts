
function lexGreedyApproach(): void {
    let programCounter: number = 1;
    let lineCounter: number = 1;
    let input: string = (<HTMLInputElement>document.getElementById("Input")).value;
    if (input == "" || input == " ") {
        output("nothing in the input")
    }
    let inComment: boolean = false;
    let inString: boolean = false;
    //let lexicalOrder = { "keyword": 1, 'id': 2, 'symbol': 3, 'digit': 4, 'char': 5, "": 6 }
    //let grammar = {'print': 'keyword', "int": "keyword", "boolean": "keyword", "}": "symbol", "{": "symbol", 'string': 'keyword', '$': "symbol", '=': 'symbol', "": "", 'a': 'id', 'b': 'id' }
    //grammar for 
    let characterSaying = {"print": "prntStatement"}
    let currentCursor: number = 0;
    let secondCursor: number = 0;
    //Sliding window techniqu
    let stopSearchingSymbols = ['$', '}', "{", "=", "!", " "]
    let currentWord: string = ""
    let longestMatch: string = ""
    while (input[currentCursor] != "$") {

        if (input[currentCursor] == " ") {
            if(!inString){
                currentCursor += 1;
                continue;
            }
        }
        if (input[currentCursor] == '\n') {
            lineCounter+=1;
            currentCursor+=1;
            console.log(lineCounter)
        }
        if (input[currentCursor] == "/" && input[currentCursor + 1] == "*") {
            inComment = true
            currentCursor += 2
            continue
        }
        if (inComment) {
            currentCursor += 1;
            if (input[currentCursor] == "*" && input[currentCursor + 1] == "/") {
                inComment = false;
                currentCursor += 2;
                secondCursor = currentCursor;
                console.log("helloWorld")

            }
            continue
        }


        if (inString) {
            if (input[currentCursor] == '"') {
                inString = false
                output("DEBUG LEXER - " + "[ "+ currentWord +" ] found at line: " + lineCounter + ", character: ")
                currentWord = ""
                currentCursor += 1
                secondCursor = currentCursor
                continue
            }

            currentWord += input[currentCursor]
            currentCursor += 1
            secondCursor = currentCursor
            continue
        }
        if (input[currentCursor] == '"') {
            inString = true
            currentCursor += 1;
            continue;
        }

        currentWord += input[secondCursor]
        if ((input[currentCursor] == '!' && input[currentCursor + 1] == '=') ||(input[currentCursor] == '=' && input[currentCursor + 1] == '=')) {
            if(input[currentCursor] == '!'){
            output("DEBUG LEXER - " + "[ != ] found at line: " + lineCounter + ", character: ")}
            else{
                output("DEBUG LEXER - " + "[ == ] found at line: " + lineCounter + ", character: ")
            }
            currentCursor += 2
            secondCursor = currentCursor
            longestMatch = ""
            currentWord = ""
            continue
        }
        if (regex(currentWord)) {
            longestMatch = currentWord
        }



        secondCursor += 1;
        //Second cursor stops searching when it hits a symbol or a space.
        if (stopSearchingSymbols.includes(input[secondCursor])) {
            currentCursor += longestMatch.length
            secondCursor = currentCursor
            if (longestMatch != " " && longestMatch != '') {
                output("DEBUG LEXER - " + "[ " + longestMatch + " ] found at line: " + lineCounter +  ", character: ")
            }
            longestMatch = ""
            currentWord = ""
        }

    }
    function mightBeInGrammar(currentWord: string) {
        let completeGrammar = []
        for (var j = 0; j < completeGrammar.length; j++) {
            if (completeGrammar[j].startsWith(currentWord)) {
                return true
            }
        }
        return false
    }
    function regex(test: any): boolean {
        let num = /^[0-9]$/;
        let char = /^[a-z]$/;
        let symbol = /^}$|^{$|^==$|^=$|^!=$|^[(]$|^[)]$|^[+]$/
        let keyword = /^string$|^int$|^boolean$|^char$|^while$|^print$|^if$|^true$|^false$/

        if (char.test(test)) {
            return true
        }

        if (num.test(test)) {
            return true
        }

        if (symbol.test(test)) {
            return true
        }

        if (keyword.test(test)) {
            return true
        }
        return false
    }
}