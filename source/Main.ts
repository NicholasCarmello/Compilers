//Test function

function getData(){
  let input: string = (<HTMLInputElement>document.getElementById("Input")).value;
  let splittedInput = input.split("$")
 /* for(var i = 0; i < splittedInput.length - 1; i ++){
    this.lexGreedyApproach(splittedInput[i] + "$")
  }*/
  this.lexGreedyApproach(input)
}
function tests(event:any): void {
  //(<HTMLInputElement>document.getElementById("Input")).value = '{intaintba=0b=0while(a!=3){print(a)while(b!=3){print(b)b=1+bif(b==2){print("there isno spoon")}}b=0a=1+a}}$';
  var selectedElement = event.target;
  var value = selectedElement.text;
  if (value == "Alans Progam 1"){
    (<HTMLInputElement>document.getElementById("Input")).value = '{intaintba=0b=0while(a!=3){print(a)while(b!=3){print(b)b=1+bif(b==2){print("there isno spoon")}}b=0a=1+a}}$';
  }
  if (value == "Alans Progam 2"){
    (<HTMLInputElement>document.getElementById("Input")).value = '{/* Int Declaration */int aint ba = 0b=0/* While Loop */while (a != 3) {print(a) while (b != 3) {print(b) = 1 + bif (b == 2) {/* Print Statement */print("there is no spoon" /* This will do nothing */ )}}b = 0a = 1+a}';

  }
  if (value == "Alans Progam 3"){
    (<HTMLInputElement>document.getElementById("Input")).value = '{intaintba=0b=0while(a!=3){print(a)while(b!=3){print(b)b=1+bif(b==2){print("there isno spoon")}}b=0a=1+a}}$';

  }
  if (value == "String declaration"){
    (<HTMLInputElement>document.getElementById("Input")).value = '{string f = "hello world"}$';

  }
  if (value == "Int declaration"){
    (<HTMLInputElement>document.getElementById("Input")).value = '{int a = 3}$';
  }
  if (value == "Bool declaration"){
    (<HTMLInputElement>document.getElementById("Input")).value = '{boolean b = false}$';
  }
  if (value == "Multiple Programs"){
    (<HTMLInputElement>document.getElementById("Input")).value = '{}$ \n {{{{{{}}}}}}$ \n {{{{{{}}} /* comments are ignored */ }}}}$ \n{ /* comments are still ignored */ int @}$';
  }



}
function clearOutput(){
  (<HTMLInputElement>document.getElementById("Output")).value = "";

}
function clearInput(){
  (<HTMLInputElement>document.getElementById("Input")).value = "";

}
function output(output:string): void {
  (<HTMLInputElement>document.getElementById("Output")).value +=   output + '\n';
}
