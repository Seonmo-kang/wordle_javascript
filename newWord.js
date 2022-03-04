const axios = require("axios");
const express = require("express");
require('dotenv').config();

const getNewWord = async ()=>{
    var options = {
        method: 'GET',
        url: 'https://wordsapiv1.p.rapidapi.com/words/',
        params: {
                random: 'true',
                 lettersMin:5,
                 lettersMax:5
        },
        headers: {
          'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
          'x-rapidapi-key': `${process.env.WORDS_API_KEY}`
        }
      };
    try{
        axios.request(options)
        .then((response) => {
            return response.data;    
        }).catch((err) => {
            console.error(err);
        });
    }catch(err){
        console.error(err);
    }
};

module.exports = async (req,res)=>{
    const word = getNewWord();
    console.log(word);
    res.send(word.data);
};