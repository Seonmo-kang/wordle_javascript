
var secretWord = "SIMON";
var wordLength = 5;
var maxAttempt = 6;
var gameOver = false;

var row = 0;
var col = 0;

window.onload = function(){
    initialize();
    game();
}

function initialize() {
    // create Tile
    //<span id="0-0" class="tile"> p </span>
    for(let r=0;r<maxAttempt;r++){
        for(let c=0;c<wordLength;c++){
            let tile = document.createElement("span")
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = '';
            document.getElementById("attempt").appendChild(tile);
        }
    }
}
function game() {
    document.addEventListener("keyup",(e)=>{
        
        if(gameOver){
            alert('you win!');
            return ;
        }
        console.log(e.code);
        // alert(e.code+" key :"+e.key);
        //e.g. e.code = keyA, e.key = A or a.
        if("KeyA" <= e.code && e.code <= "KeyZ"){
            if(col < wordLength){
                let currentTile = document.getElementById( row.toString() +'-'+ col.toString() );
                if(currentTile.innerText == ""){
                    currentTile.innerText = e.code[3];
                    col += 1;
                }
            }
            
        }
        else if( e.code == "Backspace" ){
            if( 0 < col && col <= wordLength){
                col -= 1;
            }
            let currentTile = document.getElementById( row.toString() +'-'+ col.toString() );
            currentTile.innerText = '';
        }
        else if( e.code == "Enter"){
            let correct=0;
            if(col == 5){
                for(let i=0; i< wordLength; i++){
                    
                    let currentTile = document.getElementById( row.toString() +'-'+ i.toString() );
                    let letter = currentTile.innerText;
                    console.log(letter);
                    if( secretWord[i] == letter){
                        currentTile.classList.add("correct");
                        correct+=1;
                    }else if(secretWord.includes(letter)){
                        currentTile.classList.add("present");
                    }else{
                        currentTile.classList.add("absent");
                    }
                }
                if(correct==5){
                    gameOver=true
                }
                row += 1;
                col =0;
                correct =0;
            }
            
        }

        if(!gameOver && row == maxAttempt){
            document.getElementById('word').innerText = secretWord;
            alert(`Real word was ${secretWord}`);
        }
    })
}