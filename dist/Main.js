//Test function
function getData() {
    let input = document.getElementById("Input").value;
    let splittedInput = input.split("$");
    /* for(var i = 0; i < splittedInput.length - 1; i ++){
       this.lexGreedyApproach(splittedInput[i] + "$")
     }*/
    this.lexGreedyApproach(input);
}
function tests() {
    document.getElementById("Input").value = '{intaintba=0b=0while(a!=3){print(a)while(b!=3){print(b)b=1+bif(b==2){print("there isno spoon")}}b=0a=1+a}}$';
}
function clearOutput() {
    document.getElementById("Output").value = "";
}
function clearInput() {
    document.getElementById("Input").value = "";
}
function output(output) {
    document.getElementById("Output").value += output + '\n';
}
//# sourceMappingURL=Main.js.map