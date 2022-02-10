function lexGreedyApproach() {
    let input = document.getElementById("Input").value;
    if (input == "" || input == " ") {
        output("nothing in the input");
    }
    let inComment = false;
    let inString = false;
    let lexicalOrder = { "keyword": 1, 'id': 2, 'symbol': 3, 'digit': 4, 'char': 5, "": 6 };
    let grammar = { 'print': 'keyword', "int": "keyword", "boolean": "keyword", "}": "symbol", "{": "symbol", 'string': 'keyword', '$': "symbol", '=': 'symbol', "": "", 'a': 'id', 'b': 'id' };
    let currentCursor = 0;
    let secondCursor = 0;
    //Sliding window techniqu
    let stopSearchingSymbols = ['$', '}', "{", "=", "!", " "];
    let currentWord = "";
    let longestMatch = "";
    /*while (input[currentCursor] != "$") {
        if (input[currentCursor] == "/" && input[currentCursor + 1] == "*") {
            inComment = true
            currentCursor+=1
            continue
        }
        if (input[currentCursor] == "*" && input[currentCursor + 1] == "/") {
            inComment = false
            continue
        }
        if (inComment) {
            currentCursor += 1;
            continue
        }
        if (input[secondCursor] != " "){
            currentWord += input[secondCursor];
        }
        
        secondCursor += 1;

        if (currentWord in grammar) {
            if (lexicalOrder[grammar[currentWord]] < lexicalOrder[grammar[longestMatch]]) {
                longestMatch = currentWord;
                console.log(longestMatch)
            }
        }

        //Second cursor checks to see if the current value is a value we can stop searching the current window
        if (stopSearchingSymbols.includes(input[secondCursor]) || input[secondCursor] === undefined) {

            currentCursor += longestMatch.length;
            console.log(currentCursor)
            secondCursor = currentCursor
            if (longestMatch != " " && longestMatch != '') {
                if (regex(longestMatch, grammar[longestMatch])) {
                    console.log(longestMatch)
                    output("LEXER - " + grammar[longestMatch] + " [ " + longestMatch + " ]")
                    currentWord = ""
                    longestMatch = ""
                    continue
                }
                output("LEXER - Value not in the grammar: " + longestMatch)

            }
            currentWord = ""
            longestMatch = ""

        }
    }
}*/
    while (input[currentCursor] != "$") {
        currentWord += input[secondCursor];
        if (currentWord[0] == " ") {
            currentWord = "";
            currentCursor += 1;
            secondCursor = currentCursor;
        }
        if (input[currentCursor] == '!' && input[currentCursor + 1] == '=') {
            output("!=");
            currentCursor += 2;
            secondCursor = currentCursor;
            longestMatch = "";
            currentWord = "";
            continue;
        }
        if (regex(currentWord)) {
            console.log("current " + currentWord);
            longestMatch = currentWord;
        }
        secondCursor += 1;
        //Second cursor stops searching when it hits a symbol or a space.
        if (stopSearchingSymbols.includes(input[secondCursor])) {
            currentCursor += longestMatch.length;
            secondCursor = currentCursor;
            output(longestMatch);
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