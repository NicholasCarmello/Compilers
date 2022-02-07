//Test function

function getData(){
  let input: string = (<HTMLInputElement>document.getElementById("Input")).value;
  this.lexGreedyApproach(input)
}
function tests(): void {
  (<HTMLInputElement>document.getElementById("Input")).value = "{}$";
}

function output(output:string): void {
  (<HTMLInputElement>document.getElementById("Output")).value = output;
}
