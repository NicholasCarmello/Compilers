
function lexGreedyApproach(): void {
    let programCounter: number = 1;
    let lineCounter: number = 1;
    let charCounter: number = 1;
    let input: string = (<HTMLInputElement>document.getElementById("Input")).value;
    if (input == "" || input == " " || input === undefined) {
        output("nothing in the input")

    }
    if (input[-1]!= "$"){
        output("No $ at the end of the program. Adding One.")
        input = input + "$"
    }
    
    let inString: boolean = false;
    let grammar = {'print': ['keyword', 'Print Statement'], "int": ["keyword",'Type Int'], "boolean": ["keyword",'Type Bool'], "}": ["symbol", "Right Curly"], "{":  ["symbol", "Left Curly"], 'string': ["symbol", "Type String"], '$': ['Symbol', 'EOP'],
     "!=": ["Symbol","Not Equals"],"(":["Symbol","Left Paren"],")":["Symbol","Right Paren"],"while":["keyword","While statement"],"if":["keyword","If Statement"], "+":["symbol","Addition Op"],
     "==":["Symbol","Equals to"], "true":["","Bool Type"],"false":["","Bool Type"],
     0:["Digit","Type Num"],1:["Digit","Type Num"],2:["Digit","Type Num"], 3:["Digit","Type Num"],4:["Digit","Type Num"],5:["Digit","Type Num"],6:["Digit","Type Num"],7:["Digit","Type Num"],8:["Digit","Type Num"],
    9:["Digit","Type Num"], "=":["symbol","Assignment Op"],"a":["ID","ID"],"b":["ID","ID"],"c": ["ID","ID"], "d":["ID","ID"],"e":["ID","ID"],"f":["ID","ID"],"g":["ID","ID"],"h":["ID","ID"],
    "i":["ID","ID"],"j":["ID","ID"],"k":["ID","ID"],"l":["ID","ID"],"m":["ID","ID"],"n":["ID","ID"],"o":["ID","ID"],"p":["ID","ID"],"q":["ID","ID"],"r":["ID","ID"],"s":["ID","ID"],"t":["ID","ID"],"u":["ID","ID"],"v":["ID","ID"],"w":["ID","ID"],
    "x":["ID","ID"],"y":["ID","ID"],"z":["ID","ID"]}
    let currentCursor: number = 0;
    let secondCursor: number = 0;
    let stopSearchingSymbols = ['$', '}', "{", "=", "!", " ", "/"]
    let currentWord: string = ""
    let longestMatch: string = ""
    
    while (input[currentCursor] != "$") {
       
        if (input[currentCursor] == " ") {
            if (!inString) {
                currentCursor += 1;
                continue;
            }
        }
        if (input[currentCursor] == '\n') {
            charCounter = 1;
            lineCounter += 1;
            currentCursor += 1;
            continue

        }
        if (input[currentCursor] == "/" && input[currentCursor + 1] == "*") {
            currentCursor += 2
            charCounter +=2
            while (input[currentCursor] != "*" && input[currentCursor + 1] != "/") {
                if(input[currentCursor] == '\n'){
                    charCounter = 0
                    lineCounter +=1;
                }
                
                currentCursor += 1
                charCounter +=1
            }
            currentCursor += 2
            charCounter +=2
            secondCursor = currentCursor
            continue
        }



        if (inString) {
            if (input[currentCursor] == '"') {
                inString = false
                output("DEBUG LEXER - " + "[ " + currentWord + " ] found at line: " + lineCounter + ", character: " + charCounter)
                currentWord = ""
                currentCursor += 1
                secondCursor = currentCursor
                charCounter +=1
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
        if ((input[currentCursor] == '!' && input[currentCursor + 1] == '=') || (input[currentCursor] == '=' && input[currentCursor + 1] == '=')) {
            if (input[currentCursor] == '!') {
                output("DEBUG LEXER - " + grammar["!="]  + " [ != ] found at line: " + lineCounter + ", character: " + charCounter)
            }
            else {
                output("DEBUG LEXER - " + grammar["=="] + " [ == ] found at line: " + lineCounter + ", character: " + charCounter)
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
        else{
            //This checks for Characters that aren;t in the grammar and will continue to the next character if one is found
            if(currentWord.length == 1 && regex(currentWord) == false && currentWord != " " && currentWord != "" && currentWord != '\n'){
                output("Unexpected character in the Grammar - " + currentWord)
                currentCursor +=1;
                currentWord ="";
                longestMatch=""
                secondCursor =currentCursor
                continue
            }
        }
        
        
        secondCursor += 1;
        //Second cursor stops searching when it hits a symbol or a space.
        if (stopSearchingSymbols.includes(input[secondCursor])) {
            currentCursor += longestMatch.length
            
            secondCursor = currentCursor
            if (longestMatch != " " && longestMatch != '') {
                output("DEBUG LEXER - " + grammar[longestMatch][1] + " [ " + longestMatch + " ] found at line: " + lineCounter + ", position: " + charCounter)
            }
            charCounter += longestMatch.length
            longestMatch = ""
            currentWord = ""
        }

    }
    function checkForUnwantedCharacters(): boolean{
        return true
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