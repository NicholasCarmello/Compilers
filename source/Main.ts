//Test function

function getData(){
  let input: string = (<HTMLInputElement>document.getElementById("Input")).value;
  let splittedInput = input.split("$")
 /* for(var i = 0; i < splittedInput.length - 1; i ++){
    this.lexGreedyApproach(splittedInput[i] + "$")
  }*/
  this.lexGreedyApproach(input)
}
function tests(): void {
  (<HTMLInputElement>document.getElementById("Input")).value = '{intaintba=0b=0while(a!=3){print(a)while(b!=3){print(b)b=1+bif(b==2){print("there isno spoon")}}b=0a=1+a}}$';
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
