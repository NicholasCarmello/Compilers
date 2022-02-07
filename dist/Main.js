"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer/lexer");
function GetDataFromInput() {
    let input = (document.getElementById("Input"));
    lexer_1.lexGreedyApproach(input.value);
}
function tests() {
    document.getElementById("Input").value = "{}";
}
function regex() {
    //Identifier [a-z][a-z0-9]*
    //Integer 0|([1-9][0-9]*)
    //Decimal (0|([1-9][0-9]*)) ‘.’ (0|([1-9][0-9]*))+
    return "";
}
function Output() { }
//# sourceMappingURL=Main.js.map