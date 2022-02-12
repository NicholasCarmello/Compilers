function lexGreedyApproach() {
    let input = document.getElementById("Input").value;
    if (input == "" || input == " ") {
        output("nothing in the input");
    }
    let inComment = false;
    let inString = false;
    //let lexicalOrder = { "keyword": 1, 'id': 2, 'symbol': 3, 'digit': 4, 'char': 5, "": 6 }
    //let grammar = {'print': 'keyword', "int": "keyword", "boolean": "keyword", "}": "symbol", "{": "symbol", 'string': 'keyword', '$': "symbol", '=': 'symbol', "": "", 'a': 'id', 'b': 'id' }
    //grammar for 
    let currentCursor = 0;
    let secondCursor = 0;
    //Sliding window techniqu
    let stopSearchingSymbols = ['$', '}', "{", "=", "!", " "];
    let currentWord = "";
    let longestMatch = "";
    while (input[currentCursor] != "$") {
        /*if(input[currentCursor] == "/" && input[currentCursor + 1] == "*"){
            inComment = true
            currentCursor +=2
            continue
        }
        if (inComment){
            currentCursor+=1;
            if(input[currentCursor] == "*" && input[currentCursor + 1] == "/"){
                inComment = false;
                currentCursor+=2;
                secondCursor = currentCursor;
                console.log("helloWorld")
                
            }
            console.log("diagnose")
            continue
        }*/
        if (inString) {
            if (input[currentCursor] == '"') {
                inString = false;
                output(currentWord);
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
        if (input[currentCursor] == '!' && input[currentCursor + 1] == '=') {
            output("!=");
            currentCursor += 2;
            secondCursor = currentCursor;
            longestMatch = "";
            currentWord = "";
            continue;
        }
        if (regex(currentWord)) {
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
    function mightBeInGrammar(currentWord) {
        let completeGrammar = [];
        for (var j = 0; j < completeGrammar.length; j++) {
            if (completeGrammar[j].startsWith(currentWord)) {
                return true;
            }
        }
        return false;
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