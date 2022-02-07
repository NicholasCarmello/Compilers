//Test function
import { lexGreedyApproach } from "./lexer/lexer";
function GetDataFromInput(): void {
  let input: HTMLInputElement = <HTMLInputElement>(
    document.getElementById("Input")
  );
  lexGreedyApproach(input.value);
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
function Output(): void {}
