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
    let keyword = ['$','}',"{","undefined"]
    let currentWord: string = ""
    while (input[currentCursor] != "$") {
        currentWord += input[secondCursor];
        secondCursor += 1;
        if (keyword.includes(input[secondCursor])){
            currentCursor += 1;
            secondCursor = currentCursor + 1
        }
        console.log(currentWord)
    }
}
