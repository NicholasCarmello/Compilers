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
  if (value == "Alans Progam"){
    (<HTMLInputElement>document.getElementById("Input")).value = '{intaintba=0b=0while(a!=3){print(a)while(b!=3){print(b)b=1+bif(b==2){print("there isno spoon")}}b=0a=1+a}}$';
  }
  if (value == "JuiceC If Statement"){
    (<HTMLInputElement>document.getElementById("Input")).value = '{\nint a\na = 1\nif(1 == 1){\nprint("nums")\n}\nif(a == a){\nprint("ids")\n}\nif("hey" == "hey"){\nprint("strings")\n}\nif(true == true){\nprint("booleans")\n}\n} $'
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
  if (value == "No Input Test case"){
    (<HTMLInputElement>document.getElementById("Input")).value = '';
  }
  if (value == "Unterminated String"){
    (<HTMLInputElement>document.getElementById("Input")).value = '"';
  }
  if (value == "Unterminated Comment"){
    (<HTMLInputElement>document.getElementById("Input")).value = '/* hello world';
  }
  if (value == "Unterminated String with invalid grammar"){
    (<HTMLInputElement>document.getElementById("Input")).value = '" THIS IS ALL UPPERCASE WHICH IS INVALID. ALSO its unterminated';
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
