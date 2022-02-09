function lexGreedyApproach() {
    let input = document.getElementById("Input").value;
    let inString = false;
    let lexicalOrder = { "keyword": 1, 'id': 2, 'symbol': 3, 'digit': 4, 'char': 5, "": 6 };
    let grammar = { "int": "keyword", "boolean": "keyword", "}": "symbol", "{": "symbol", 'string': 'keyword', '$': "symbol", '=': 'symbol', "": "", 'a': 'id', 'b': 'id' };
    let currentCursor = 0;
    let secondCursor = 0;
    //Sliding window technique
    let stopSearchingSymbols = ['$', '}', "{", " ", "="];
    let currentWord = "";
    let longestMatch = "";
    while (input[currentCursor] != "$") {
        currentWord += input[secondCursor];
        secondCursor += 1;
        if (currentWord in grammar) {
            if (lexicalOrder[grammar[currentWord]] < lexicalOrder[grammar[longestMatch]]) {
                longestMatch = currentWord;
            }
        }
        //Second cursor checks to see if the current value is a value we can stop searching at
        if (stopSearchingSymbols.includes(input[secondCursor]) || input[secondCursor] === undefined || currentWord.length > 5) {
            currentCursor += 1;
            secondCursor = currentCursor;
            if (longestMatch != " " && longestMatch != '') {
                output("LEXER - " + grammar[longestMatch] + " [ " + longestMatch + " ]");
            }
            currentWord = "";
            longestMatch = "";
        }
    }
}
function regex() {
    let char = /a-z/;
    let num = /0-9/;
}
//# sourceMappingURL=lexer.js.map