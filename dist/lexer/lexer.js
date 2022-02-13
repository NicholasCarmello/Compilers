function lexGreedyApproach() {
    let programCounter = 1;
    let lineCounter = 1;
    let input = document.getElementById("Input").value;
    if (input == "" || input == " " || input === undefined) {
        output("nothing in the input");
    }
    if (input[-1] != "$") {
        output("No $ at the end of the program. Adding One.");
        input = input + "$";
    }
    let inString = false;
    let grammar = { 'print': 'keyword', "int": "keyword", "boolean": "keyword", "}": "symbol", "{": "symbol", 'string': 'keyword', '$': "symbol", '=': 'symbol', "": "", 'a': 'id', 'b': 'id' };
    let currentCursor = 0;
    let secondCursor = 0;
    let stopSearchingSymbols = ['$', '}', "{", "=", "!", " ", "/"];
    let currentWord = "";
    let longestMatch = "";
    while (input[currentCursor] != "$") {
        if (input[currentCursor] == " ") {
            if (!inString) {
                currentCursor += 1;
                continue;
            }
        }
        if (input[currentCursor] == '\n') {
            lineCounter += 1;
            currentCursor += 1;
            continue;
        }
        if (input[currentCursor] == "/" && input[currentCursor + 1] == "*") {
            currentCursor += 2;
            while (input[currentCursor] != "*" && input[currentCursor + 1] != "/") {
                if (input[currentCursor] == '\n') {
                    lineCounter += 1;
                }
                currentCursor += 1;
            }
            console.log("h");
            currentCursor += 2;
            secondCursor = currentCursor;
            continue;
        }
        if (inString) {
            if (input[currentCursor] == '"') {
                inString = false;
                output("DEBUG LEXER - " + "[ " + currentWord + " ] found at line: " + lineCounter + ", character: ");
                currentWord = "";
                currentCursor += 1;
                secondCursor = currentCursor;
                continue;
            }
            currentWord += input[currentCursor];
            currentCursor += 1;
            secondCursor = currentCursor;
            continue;
        }
        if (input[currentCursor] == '"') {
            inString = true;
            currentCursor += 1;
            continue;
        }
        currentWord += input[secondCursor];
        if ((input[currentCursor] == '!' && input[currentCursor + 1] == '=') || (input[currentCursor] == '=' && input[currentCursor + 1] == '=')) {
            if (input[currentCursor] == '!') {
                output("DEBUG LEXER - " + "[ != ] found at line: " + lineCounter + ", character: ");
            }
            else {
                output("DEBUG LEXER - " + "[ == ] found at line: " + lineCounter + ", character: ");
            }
            currentCursor += 2;
            secondCursor = currentCursor;
            longestMatch = "";
            currentWord = "";
            continue;
        }
        if (regex(currentWord)) {
            longestMatch = currentWord;
        }
        /*else{
            if (currentWord.length == 1){
                output("not in in language " + currentWord)
                currentCursor +=1;
                continue
            }
        }*/
        secondCursor += 1;
        //Second cursor stops searching when it hits a symbol or a space.
        if (stopSearchingSymbols.includes(input[secondCursor])) {
            currentCursor += longestMatch.length;
            secondCursor = currentCursor;
            if (longestMatch != " " && longestMatch != '') {
                output("DEBUG LEXER - " + "[ " + longestMatch + " ] found at line: " + lineCounter + ", character: ");
            }
            longestMatch = "";
            currentWord = "";
        }
    }
    function regex(test) {
        let num = /^[0-9]$/;
        let char = /^[a-z]$/;
        let symbol = /^}$|^{$|^==$|^=$|^!=$|^[(]$|^[)]$|^[+]$/;
        let keyword = /^string$|^int$|^boolean$|^char$|^while$|^print$|^if$|^true$|^false$/;
        if (char.test(test)) {
            return true;
        }
        if (num.test(test)) {
            return true;
        }
        if (symbol.test(test)) {
            return true;
        }
        if (keyword.test(test)) {
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=lexer.js.map