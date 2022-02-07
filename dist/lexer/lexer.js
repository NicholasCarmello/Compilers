function lexGreedyApproach() {
    let input = document.getElementById("Input").value;
    let inString = false;
    let lexicalOrder = { 'keyword': 1, 'id': 2, 'symbol': 3, 'digit': 4, 'char': 5 };
    let types = { 'int': 'keyword', 'float': 'keyword', 'boolean': 'keyword' };
    let char = /a-z/;
    let num = /0-9/;
    let newInput = input.toString();
    let currentCursor = input[0];
    let secondCursor = input[0];
    //Sliding window technique
    let currentWord = "";
    while (currentCursor != "$") {
        currentWord += secondCursor;
        console.log(currentWord);
    }
}

//# sourceMappingURL=lexer.js.map