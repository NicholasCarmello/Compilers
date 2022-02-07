export function lexGreedyApproach(pgm) {
    let inString = false;
    let lexicalOrder = { 'keyword': 1, 'id': 2, 'symbol': 3, 'digit': 4, 'char': 5 };
    let types = { 'int': 'keyword', 'float': 'keyword', 'boolean': 'keyword' };
    let char = /a-z/;
    let num = /0-9/;
    let currentCursor = pgm[0];
    let secondCursor = pgm[0];
    //Sliding window technique
    let currentWord = "";
    while (currentCursor != "$") {
        currentWord += secondCursor;
        console.log(currentWord);
    }
}
//# sourceMappingURL=lexer.js.map