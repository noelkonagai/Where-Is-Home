//Set up requirements
var express = require("express");
var Request = require('request'); //package letting us make HTTP requests for other servers
var bodyParser = require('body-parser'); //automatically parses a JSON file
var _ = require('underscore');

//Create an 'express' object
var app = express();
var port = process.env.PORT || 3000

//Set up the views directory
app.set("views", __dirname + '/views');
//Set EJS as templating language WITH html as an extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to the public folder for css & js files
app.use(function(req, res, next) {   res.header("Access-Control-Allow-Origin", "*");   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");   next(); });

app.use(express.static(__dirname + '/public'));

// Enable json body parsing of application/json
app.use(bodyParser.json());

/*---------------
//DATABASE CONFIG
----------------*/
var cloudant_USER = 'noelkonagai';
var cloudant_DB = 'where-is-home';
var cloudant_KEY = 'ainterentseamedsoldstsem';
var cloudant_PASSWORD = '5101b02d7e3ada6c4315f4d0a60be1bde5d2d887';

var cloudant_URL = "https://" + cloudant_USER + ".cloudant.com/" + cloudant_DB;

/*-----
ROUTES
-----*/

//Main Page Route - Show ALL data via Clientside Request
app.get("/", function(req, res){
	res.render('index', {page: 'get all data'}); //render is the way you send a view
});

//Main Page Route - Show the results of data input
app.get("/results", function (request, response){
	response.render('results');
});

//Main Page Route - Show the results of data input
app.get("/about", function (request, response){
	response.render('about');
});



//SAVE an object to the db
app.post("/save", function(req,res){
	console.log("A POST!!!!");
	//Get the data from the body
	var data = req.body; //anything that's attached to the AJAX call is in the body
	console.log(data);
	//Send the data to the db
	Request.post({
		url: cloudant_URL,
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true,
		body: data,
		message: "success"
	},
	function (error, response, body){
		if (response.statusCode == 201){
			console.log("Saved!");
			res.json(body);
			//res.send(message)
			//res.redirect('/results');

		}
		else{
			console.log("Uh oh...");
			console.log("Error: " + res.statusCode);
			res.send("Something went wrong...");
		}
	});
});


//JSON Serving route - ALL Data
app.get("/api/all", function(req,res){
	console.log('Making a db request for all entries');
	//Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: cloudant_URL+"/_all_docs?include_docs=true",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true
	},
	function (error, response, body){
		var theRows = body.rows;
		//Send the data
		res.json(theRows);
	});
});


//JSON Serving route - ALL Data
app.get("/api/jsonData", function(req,res){
	console.log('Making a db request for all entries');
	//Use the Request lib to GET the data in the CouchDB on Cloudant
	Request.get({
		url: cloudant_URL+"/_all_docs?include_docs=true",
		auth: {
			user: cloudant_KEY,
			pass: cloudant_PASSWORD
		},
		json: true
	},
	function (error, response, body){
		var theRows = body.rows;
		//Send the data
		//res.json(theRows);

		var array_all = ["All",[]]
		var array_default = ["Default",[]]
		var array_second = ["Second",[]]
		var array_third = ["Third",[]]
		for (i = 0; i < theRows.length; i++){
			//pushes to ALL
			array_all[1].push(Math.round(theRows[i].doc.default.lat));
			array_all[1].push(Math.round(theRows[i].doc.default.lng));
			array_all[1].push(0.01);
			array_all[1].push(Math.round(theRows[i].doc.second.lat));
			array_all[1].push(Math.round(theRows[i].doc.second.lng));
			array_all[1].push(0.01);
			array_all[1].push(Math.round(theRows[i].doc.third.lat));
			array_all[1].push(Math.round(theRows[i].doc.third.lng));
			array_all[1].push(0.01);
			//pushes to Default
			array_default[1].push(Math.round(theRows[i].doc.default.lat));
			array_default[1].push(Math.round(theRows[i].doc.default.lng));
			array_default[1].push(0.01);
			for (j = 0; j < 6; j++){
				array_default[1].push(0)
			};
			//pushes to Second
			// for (k = 0; k < 3; k++){
			// 	array_second[1].push(0)
			// };

			array_second[1].push(Math.round(theRows[i].doc.second.lat));
			array_second[1].push(Math.round(theRows[i].doc.second.lng));
			array_second[1].push(0.01)
			array_second[1].push(Math.round(theRows[i].doc.second.lat));
			array_second[1].push(Math.round(theRows[i].doc.second.lng));
			array_second[1].push(0);
			array_second[1].push(Math.round(theRows[i].doc.second.lat));
			array_second[1].push(Math.round(theRows[i].doc.second.lng));
			array_second[1].push(0);

			//pushes to third
			array_third[1].push(Math.round(theRows[i].doc.third.lat));
			array_third[1].push(Math.round(theRows[i].doc.third.lng));
			array_third[1].push(0.01);
			array_third[1].push(Math.round(theRows[i].doc.third.lat));
			array_third[1].push(Math.round(theRows[i].doc.third.lng));
			array_third[1].push(0);
			array_third[1].push(Math.round(theRows[i].doc.third.lat));
			array_third[1].push(Math.round(theRows[i].doc.third.lng));
			array_third[1].push(0);
		};

		var globeGLFile = []
		globeGLFile.push(array_all)
		globeGLFile.push(array_default)
		globeGLFile.push(array_second)
		globeGLFile.push(array_third)

		console.log(globeGLFile)

		res.json(globeGLFile)

	});
});

//Catch All Route
app.get("*", function(req, res){
	res.send('Sorry, nothing doing here.');
});

// Start the server
app.listen(port);
console.log('Express started on port' + port);