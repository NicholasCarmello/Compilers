//Test function
import * as testFunctions from "./lexer/lexer";
function GetDataFromInput(): void {
  let input: HTMLInputElement = <HTMLInputElement>(
    document.getElementById("Input")
  )
  testFunctions.lexGreedyApproach(input.value)
}
function tests(): void {
  (<HTMLInputElement>document.getElementById("Input")).value = "{}";
}
function regex(): string {
  //Identifier [a-z][a-z0-9]*
  //Integer 0|([1-9][0-9]*)
  //Decimal (0|([1-9][0-9]*)) ‘.’ (0|([1-9][0-9]*))+
  return "";
}
function output(output:string): void {
  (<HTMLInputElement>document.getElementById("Output")).value = output;
}
