//Test function
import * as testFunctions from "./lexer/lexer";
function GetDataFromInput() {
    let input = (document.getElementById("Input"));
    testFunctions.lexGreedyApproach(input.value);
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
function output(output) {
    document.getElementById("Output").value = output;
}
//# sourceMappingURL=Main.js.map