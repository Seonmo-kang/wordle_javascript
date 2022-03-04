var secretWord = "";
var hint = "";
var wordLength = 5;
var maxAttempt = 6;
var gameOver = false;

var isWordBoolean;

var arr = new Array();  // correct, absent, present array


var row = 0;
var col = 0;

window.onload = function(){
    initialize();
    typeKeyboard();
    game();
    clickXmark();
    clickHint();
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
    axios.get("http://localhost:8000/newWord")
        .then(response=>{
            if(response.data.word.match("^[aA-zZ]{5}$")==null){
                location.reload();
            }else{
            console.log(response);
            console.log(response.data.results[0]["definition"]);
            secretWord = response.data.word;
            hint = response.data.results[0]["definition"].toString();
            }
        }).catch( err =>{
            console.error(err);
        });
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
            typeBacksapce();
        }
        else if( e.code == "Enter"){
            if(col==5){
                isWord();
            }else{
                return;
            }
        }
    })
}

function typeKeyboard(){
    const keys = document.querySelectorAll(".row button");
    for(let key of keys){
        key.onclick = ({target}) =>{

            let currentTile = document.getElementById( row.toString() +'-'+ col.toString() );
            const data = target.getAttribute("data-key");
            console.log("data"+data);

            if(col<wordLength && data!="Enter" && data!="Backspace"){
                    currentTile.innerText = data;
                    console.log(data);
                    col+=1;
            }else if(data=="Enter"){
                isWord();
            }else if(data=="Backspace"){
                typeBacksapce();
            }
        }
    }
}
/* Enter function */
function typeEnter(){
    let correct=0;
    let present =0;
    let absent =0;
    //Compare words with secret word
    for(let i=0; i< wordLength; i++){

        let currentTile = document.getElementById( row.toString() +'-'+ i.toString() );
        let letter = currentTile.innerText;
        console.log(letter);
        const keyButtons = document.querySelector(`[data-key=${letter}]`);
        let letter_lowercase = letter.toLowerCase();
        

        if( secretWord[i] == letter_lowercase){
            currentTile.classList.add("correct");
            keyButtons.style = "background-color: green";
            correct+=1;
            
        }else if(secretWord.includes(letter_lowercase)){
            currentTile.classList.add("present");
            keyButtons.style = "background-color: orange";
            present+=1;
        }else{
            currentTile.classList.add("absent");
            keyButtons.style = "background-color: brown";
            absent+=1;
        }
        
        let dict = { "correct": correct, "present": present, "absent": absent };
        arr[row] = dict;
    }
        if(correct==5){
            gameOver=true
            result();
        }

        row += 1;
        col = 0;
        if(!gameOver&& (row==maxAttempt)){
            result();
        }
}
/* Backspace function */
function typeBacksapce() {
    if( 0 < col && col <= wordLength){
        col -= 1;
    }
    let currentTile = document.getElementById( row.toString() +'-'+ col.toString() );
    currentTile.innerText = '';
}

function result(){
    let row_num=0;
    let dataTable = document.getElementById("data-row");
    let answer = secretWord;
    let resultDiv = document.getElementById("result");
    resultDiv.innerText = `Answer is ${answer}`;
    for(let data of arr){
        row_num+=1;
        let table_row = document.createElement("tr");
        table_row.id = row_num;
        table_row.innerHTML = `<td>${row_num}</td> 
                        <td>${data["absent"]}</td>
                        <td>${data["present"]}</td>
                        <td>${data["correct"]}</td>`;
        dataTable.appendChild(table_row);
    }
    if(row_num!=6){
        for(let i=row_num; i<6; i++){
            row_num+=1;
            let table_row = document.createElement("tr");
            table_row.id = row_num;
            table_row.innerHTML = `<td>${row_num}</td> 
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>`;
            dataTable.appendChild(table_row);
        }
    }
    var overlay = document.getElementById("overlay");
    overlay.style.display = "flex";

}

// prevent same API request in client side
var isDuplicated="";
// get word existed from api.
function isWord(){
    var word='';
    for(let i=0;i<wordLength; i++){
        let currentTile= document.getElementById(row.toString()+'-'+i.toString());
        word+= currentTile.innerText.toLowerCase();
    }
    if(isDuplicated==word){
        return popupAlert("same request");
    }else{
        isDuplicated = word;
        axios.get(`http://localhost:8000/isWord/?word=${word}`)
            .then(response=>{
                if(response.data){
                    typeEnter();
                }else{
                    popupAlert("That word does not exist");
                }
            }).catch( error =>{
                console.error(error);
            });
    }
}

var count=0;
// Alert word does not exist 
function popupAlert(word) {
    count++;
    let gametoster = document.getElementById("game-toster");
    let alert = document.createElement("div");
    alert.id =`toster-${count}`;
    alert.classList.add("toster");
    alert.innerHTML = `<h2>${word}</h2>`;
    gametoster.appendChild(alert);
    wait(1500,count);
}
const wait = (timeToDelay,number) => 
    new Promise(() => 
        setTimeout( ()=>{
            let gametoster = document.getElementById("game-toster");
            let toster = document.getElementById(`toster-${number}`);
            gametoster.removeChild(toster);
        }, timeToDelay));

function clickXmark(){
    let icon = document.getElementById("xmark");
    icon.onclick = () =>{
        window.location.reload();
    }
}
var isClickHint = false;
function clickHint(){
    let question = document.getElementById("question");
    question.onclick = () =>{
        isClickHint = !isClickHint;
        let hintContainer = document.getElementById("hint");
        let createHintElement = document.createElement("span");
        createHintElement.id = "hintSentence"
        let hintElement = document.getElementById("hintSentence");
        if(isClickHint){
            createHintElement.innerText = hint;
            hintContainer.appendChild(createHintElement);
        }else{
            hintContainer.removeChild(hintElement);
        }
    }
}