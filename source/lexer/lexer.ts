function lexGreedyApproach():void{
    let input: string = (<HTMLInputElement>document.getElementById("Input")).value;
    let inString: boolean = false
    let lexicalOrder =  {'keyword': 1,'id':2,'symbol':3,'digit':4, 'char':5}
    let types = {'int' : 'keyword', 'float':'keyword','boolean': 'keyword'}
    let char = /a-z/;
    let num = /0-9/;
    let newInput = input.toString()
    let currentCursor: number = 0;
    let secondCursor: number = 0;
    //Sliding window technique
    let stopSearchingSymbols = ['$','}',"{", " "]
    let currentWord: string = ""
    let highestKind: string = ""
    while (input[currentCursor] != "$") {
        currentWord += input[secondCursor];
        secondCursor += 1;

        
        //Second cursor checks to see if the current value is a value we can stop searching at
        if (stopSearchingSymbols.includes(input[secondCursor]) ||  input[secondCursor] === undefined || currentWord.length > 5){
            
            currentCursor += 1;
            secondCursor = currentCursor
            console.log(currentWord)
            currentWord = ""
        }
        
        
    }
}
function regex(){

}
