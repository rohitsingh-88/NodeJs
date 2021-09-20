const express = require('express');
const lib = require("./functions");


const app = express();


app.get('/', async (req, res) => { 
	var qry = req.query;
	var head = req.headers;
		if(qry.url){
			const data = await lib.getDataFromPuppeteer(qry.url);
			res.send(data)
		}else{
			res.send('Welcome')
		}
});


app.listen(3000, () => console.log('Started server at http://localhost:3000!'));
