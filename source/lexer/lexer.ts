function lexGreedyApproach(): void {
    let input: string = (<HTMLInputElement>document.getElementById("Input")).value;
    if (input == "" || input == " ") {
        output("nothing in the input")
    }
    let inComment: boolean = false;
    let inString: boolean = false;
    //let lexicalOrder = { "keyword": 1, 'id': 2, 'symbol': 3, 'digit': 4, 'char': 5, "": 6 }
    //let grammar = {'print': 'keyword', "int": "keyword", "boolean": "keyword", "}": "symbol", "{": "symbol", 'string': 'keyword', '$': "symbol", '=': 'symbol', "": "", 'a': 'id', 'b': 'id' }
    let currentCursor: number = 0;
    let secondCursor: number = 0;
    //Sliding window techniqu
    let stopSearchingSymbols = ['$','}',"{","=","!"," "]
    let currentWord: string = ""
    let longestMatch: string = ""
    while (input[currentCursor] != "$") {

        
        currentWord += input[secondCursor]
        
        if(input[currentCursor] == '!' && input[currentCursor + 1] =='='){
            output("!=")
            currentCursor +=2
            secondCursor = currentCursor
            longestMatch = ""
            currentWord = ""
            continue
        }
        if (regex(currentWord)){
            console.log("current "  + currentWord)
            longestMatch = currentWord
        }
        else{
            if(!trie(currentWord)){
                console.log("helloWorld")
            }
        }
        secondCursor+=1;
        
        //Second cursor stops searching when it hits a symbol or a space.
        if (stopSearchingSymbols.includes(input[secondCursor])){
            currentCursor += longestMatch.length
            secondCursor = currentCursor
            output(longestMatch)
            longestMatch = ""
            currentWord = ""
        }

    }
    function trie(word:string):boolean{
        return true
    }
    function regex(test: any): boolean {
        let num = /^[0-9]$/;
        let char = /^[a-z]$/;
        let symbol = /^}$|^{$|^==$|^=$|^!=$|^[(]$|^[)]$|^[+]$/
        let keyword = /^string$|^int$|^boolean$|^char$|^while$|^print$|^if$|^true$|^false$/
        
        if (char.test(test)) {
            return true
        }

        if (num.test(test)) {
            return true
        }

        if (symbol.test(test)) {
            return true
        }

        if (keyword.test(test)) {
            return true
        }
        return false
    }
}