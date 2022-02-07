"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lexGreedyApproach = void 0;
function lexGreedyApproach(pgm) {
    let inString = false;
    let lexicalOrder = { 'keyword': 1, 'id': 2, 'symbol': 3, 'digit': 4, 'char': 5 };
    let currentCursor = pgm[0];
    let secondCursor = pgm[0];
    //Sliding window technique
    let currentWord = "";
    while (currentCursor != "$") {
        currentWord += secondCursor;
        if (currentWord === ) {
        }
    }
}
exports.lexGreedyApproach = lexGreedyApproach;
//# sourceMappingURL=lexer.js.map