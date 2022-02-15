let programCounter = 1;
function lexGreedyApproach(input) {
    let lineCounter = 1;
    let charCounter = 1;
    let inStringInvalidGrammar = false;
    let errorCounter = 0;
    let tokenStream = [];
    let inString = false;
    let currentCursor = 0;
    let secondCursor = 0;
    let stopSearchingSymbols = ['$', '}', "{", "=", "!", " ", "/"];
    let currentWord = "";
    let longestMatch = "";
    //This is the whole grammar in our language
    //I Implented this to make the tokens. 
    let grammar = {
        'print': ['keyword', 'Print Statement'], "int": ["keyword", 'Type Int'],
        "boolean": ["keyword", 'Type Bool'], "}": ["symbol", "Right Curly"], "{": ["symbol", "Left Curly"], 'string': ["symbol", "Type String"], '$': ['Symbol', 'EOP'],
        "!=": ["Symbol", "Not Equals"], "(": ["Symbol", "Left Paren"], ")": ["Symbol", "Right Paren"],
        "while": ["keyword", "While statement"], "if": ["keyword", "If Statement"], "+": ["symbol", "Addition Op"],
        "==": ["Symbol", "Equals to"], "true": ["", "Bool Type"], "false": ["", "Bool Type"],
        0: ["Digit", "Type Num"], 1: ["Digit", "Type Num"], 2: ["Digit", "Type Num"], 3: ["Digit", "Type Num"], 4: ["Digit", "Type Num"], 5: ["Digit", "Type Num"], 6: ["Digit", "Type Num"], 7: ["Digit", "Type Num"], 8: ["Digit", "Type Num"],
        9: ["Digit", "Type Num"], "=": ["symbol", "Assignment Op"], "a": ["ID", "ID"], "b": ["ID", "ID"], "c": ["ID", "ID"], "d": ["ID", "ID"], "e": ["ID", "ID"], "f": ["ID", "ID"], "g": ["ID", "ID"], "h": ["ID", "ID"],
        "i": ["ID", "ID"], "j": ["ID", "ID"], "k": ["ID", "ID"], "l": ["ID", "ID"], "m": ["ID", "ID"], "n": ["ID", "ID"], "o": ["ID", "ID"], "p": ["ID", "ID"], "q": ["ID", "ID"], "r": ["ID", "ID"], "s": ["ID", "ID"], "t": ["ID", "ID"], "u": ["ID", "ID"], "v": ["ID", "ID"], "w": ["ID", "ID"],
        "x": ["ID", "ID"], "y": ["ID", "ID"], "z": ["ID", "ID"]
    };
    output("INFO LEXER - Lexing program " + programCounter++);
    if (input.slice(-1) != "$") {
        output("INFO LEXER - No $ at the end of the program. Adding One.");
        input = input + "$";
    }
    //The currentCursor increases everytime that the program finds the next longest word. 
    //Once it hits the $ or EOP, it will end the current program. At the end of the file, because there can be multiple programs, I self call this program 
    //with the next program by slicing the input from the last program ending to the end of the file
    while (input[currentCursor] != "$") {
        if (input[currentCursor] == " ") {
            if (!inString) {
                charCounter += 1;
                currentCursor += 1;
                continue;
            }
        }
        if (input[currentCursor] == '\n') {
            charCounter = 1;
            lineCounter += 1;
            currentCursor += 1;
            continue;
        }
        if (input[currentCursor] == "/" && input[currentCursor + 1] == "*") {
            currentCursor += 2;
            charCounter += 2;
            while (input[currentCursor] != "*" && input[currentCursor + 1] != "/") {
                if (input[currentCursor] == '\n') {
                    charCounter = 1;
                    lineCounter += 1;
                }
                if (input[currentCursor] == "$") {
                    output("ERROR LEXER - The Comment was never terminated or '$' was in the comment at line " + lineCounter + ", position: " + charCounter);
                    errorCounter += 1;
                    output("ERROR LEXER - Lex failed with " + errorCounter + " error(s)");
                    return;
                }
                currentCursor += 1;
                charCounter += 1;
            }
            currentCursor += 2;
            charCounter += 2;
            secondCursor = currentCursor;
            continue;
        }
        if (inString) {
            if (input[currentCursor] == '"') {
                inString = false;
                if (!inStringInvalidGrammar) {
                    output("DEBUG LEXER - String " + "[ " + currentWord + " ] found at line: " + lineCounter + ", position: " + (charCounter - currentWord.length));
                }
                inStringInvalidGrammar = false;
                tokenStream.push(["string", currentWord]);
                currentWord = "";
                currentCursor += 1;
                secondCursor = currentCursor;
                charCounter += 1;
                continue;
            }
            //This checks for Characters that aren;t in the grammar and will continue to the next character if one is found
            if (input[currentCursor].length == 1 && regex(input[currentCursor]) == false && input[currentCursor] != " " && input[currentCursor] != "" && input[currentCursor] != '\n') {
                output("ERROR LEXER - Unexpected character in the String - " + input[currentCursor] + " at line: " + lineCounter + ", position:" + charCounter);
                currentCursor += 1;
                inStringInvalidGrammar = true;
                currentWord = "";
                longestMatch = "";
                secondCursor = currentCursor;
                errorCounter += 1;
                charCounter += 1;
                continue;
            }
            charCounter += 1;
            currentWord += input[currentCursor];
            currentCursor += 1;
            secondCursor = currentCursor;
            continue;
        }
        if (input[currentCursor] == '"') {
            inString = true;
            currentCursor += 1;
            charCounter += 1;
            continue;
        }
        currentWord += input[secondCursor];
        if ((input[currentCursor] == '!' && input[currentCursor + 1] == '=') || (input[currentCursor] == '=' && input[currentCursor + 1] == '=')) {
            if (input[currentCursor] == '!') {
                output("DEBUG LEXER - " + grammar["!="][1] + " [ != ] found at line: " + lineCounter + ", character: " + charCounter);
                tokenStream.push(grammar["!="]);
            }
            else {
                output("DEBUG LEXER - " + grammar["=="][1] + " [ == ] found at line: " + lineCounter + ", character: " + charCounter);
                tokenStream.push(grammar["=="]);
            }
            currentCursor += 2;
            secondCursor = currentCursor;
            longestMatch = "";
            currentWord = "";
            charCounter += 2;
            continue;
        }
        if (regex(currentWord)) {
            longestMatch = currentWord;
        }
        else {
            //This checks for Characters that aren;t in the grammar and will continue to the next character if one is found
            if (currentWord.length == 1 && regex(currentWord) == false && currentWord != " " && currentWord != "" && currentWord != '\n') {
                output("ERROR LEXER - Unexpected character:  " + currentWord);
                currentCursor += 1;
                currentWord = "";
                longestMatch = "";
                secondCursor = currentCursor;
                errorCounter += 1;
                charCounter += 1;
                continue;
            }
        }
        secondCursor += 1;
        //Second cursor stops searching when it hits a symbol or a space.
        if (stopSearchingSymbols.includes(input[secondCursor])) {
            currentCursor += longestMatch.length;
            secondCursor = currentCursor;
            if (longestMatch != " " && longestMatch != '') {
                output("DEBUG LEXER - " + grammar[longestMatch][1] + " [ " + longestMatch + " ] found at line: " + lineCounter + ", position: " + charCounter);
                tokenStream.push(grammar[longestMatch]);
            }
            charCounter += longestMatch.length;
            longestMatch = "";
            currentWord = "";
        }
    }
    output("DEBUG LEXER - " + grammar[input[currentCursor]][1] + " [ " + input[currentCursor] + " ] found at line: " + lineCounter + ", position: " + charCounter);
    if (errorCounter > 0) {
        //This variable tells us there was an unterminated string 
        if (inString) {
            errorCounter += 1;
            output("ERROR LEXER - Unterminated String or '$' in String at line: " + lineCounter + ", position: " + charCounter);
        }
        output("ERROR LEXER - Lex failed with " + errorCounter + " error(s)");
    }
    else {
        output("INFO LEXER - Lex Passed with 0 errors!!!");
    }
    //This checks to see if there is more to the input after each program is lexed
    //If there isn't anymore programs, the lexer is done lexing
    //If there is, It will self call from the last index to the input.length of the input
    if (currentCursor < input.length - 1) {
        this.lexGreedyApproach(input.slice(currentCursor + 1, input.length));
    }
    else {
        output("INFO LEXER - Done lexing every program");
    }
    programCounter = 0;
}
//The regex is used to check if characters and or words are valid in the language
function regex(test) {
    //The reasoning for the ^ and the $ is it checks the whole string to see if it matches.
    let num = /^[0-9]$/;
    let char = /^[a-z]$/;
    let symbol = /^}$|^{$|^==$|^=$|^!=$|^[(]$|^[)]$|^[+]$/;
    let keyword = /^string$|^int$|^boolean$|^char$|^while$|^print$|^if$|^true$|^false$/;
    //the regex test function checks if the pattern matches and returns true if it does
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
//# sourceMappingURL=lexer.js.map