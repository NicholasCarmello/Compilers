//Test function

function getData(){
  let input: string = (<HTMLInputElement>document.getElementById("Input")).value;
  this.lexGreedyApproach(input)
}
function tests(): void {
  (<HTMLInputElement>document.getElementById("Input")).value = "{intaintba=0b=0while(a!=3){print(a)while(b!=3){print(b)b=1+bif(b==2){print('there isno spoon')}}b=0a=1+a}}$";
}

function output(output:string): void {
  (<HTMLInputElement>document.getElementById("Output")).value += '\n' + output;
}
