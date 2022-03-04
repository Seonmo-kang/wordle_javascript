

// var axios = require("axios").default;
// require('dotenv').config();

// var options = {
//   method: 'GET',
//   url: `https://wordsapiv1.p.rapidapi.com/words/${word}`,
//   headers: {
//     'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
//     'x-rapidapi-key': `${process.env.WORDS_API_KEY}`
//   }
// };

//     const isWord = ()=>{
//         try{
//             axios.request(options)
//             .then(res =>{
//                 return res.data;
//             }).catch(err =>{
//                 console.log(err);
//             })
//         }catch(error) {
//             console.log(error);
//         }
//     } 
// module.exports = async (req,res)=>{
//     var word = req.query.word;
//     options.word = word;
//     const result = isWord();
//     res.send(result);

// }
