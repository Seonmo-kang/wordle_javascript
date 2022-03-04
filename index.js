const express = require("express");
const axios = require("axios").default;

const newWord = require("./newWord");
const isWord = require("./isWord");


const router = express.Router();

//env file
require('dotenv').config();
// const api_key = process.env.WORDS_API_KEY; 
// this is how get the api key from env file

const app = express();

app.use(express.static(__dirname+'/src'));

app.get("/",(req, res)=>{
    res.render('index.html'); 
    
});
app.get("/test",(req,res)=>{
    res.send("test");
})


// app.get("/newWord",newWord);

// success get newWord
app.get("/newWord", async (req,res)=>{

    const word = await requestNewWord();
    res.json(word);
})
const requestNewWord = async () =>{
    var options = {
        method: 'GET',
        url: 'https://wordsapiv1.p.rapidapi.com/words/',
        params: {
                random: 'true',
                hasDetails: 'typeOf',
                letters:5
        },
        headers: {
          'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
          'x-rapidapi-key': `${process.env.WORDS_API_KEY}`
        }
      };
    return axios.request(options)
    .then(response =>{
        console.log(response.data.word);
        // if(response.data.word.includes(' ')||response.data.word.match("^[aA-zZ]{5}$")==null){
        //     requestNewWord();
        // }else{
            return response.data;   // including config, data, header, request, status...
        // }
    }).catch(err=>{
        console.log(err);
    });
}

// Verify word existing
app.get("/isWord",(req,res)=>{
    let word = req.query.word;

    var options = {
        method: 'GET',
        url: `https://wordsapiv1.p.rapidapi.com/words/${word}`,
        headers: {
          'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
          'x-rapidapi-key': `${process.env.WORDS_API_KEY}`
        }
      };
    try {
        axios.request(options)
            .then(response =>{
                res.send("true");
            }).catch(err =>{
                res.send("false");
                console.log(err);
            })
    } catch (err) {
        console.log(err);
    }
});


app.listen(8000, () =>{
    console.log("server on");
});