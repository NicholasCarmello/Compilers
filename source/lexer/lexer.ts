export function lexGreedyApproach(pgm: string):void{
    let inString: boolean = false
    let lexicalOrder =  {'keyword': 1,'id':2,'symbol':3,'digit':4, 'char':5}
    let currentCursor:string = pgm[0];
    let secondCursor:string =pgm[0];
    //Sliding window technique
    let currentWord: string = ""
    while (currentCursor != "$"){

        currentWord += secondCursor
        
    
    }
}