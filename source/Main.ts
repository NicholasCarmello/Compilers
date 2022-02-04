//Test function 
function GetDataFromInput(): void {
    const Input = document.getElementById("Input");
    alert((<HTMLInputElement>Input).value)
}
function tests(): void{
   (<HTMLInputElement>document.getElementById("Output")).value = "{}";
}
function regex():string{
//Identifier [a-z][a-z0-9]*
//Integer 0|([1-9][0-9]*)
//Decimal (0|([1-9][0-9]*)) ‘.’ (0|([1-9][0-9]*))+
return ""
}
function Output():void{

}
