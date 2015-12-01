/* global __dirname */
var express = require("express");
var url = require("url");
var http = require("http");
var fs = require("fs");

var port = 3000;
var app = express();
app.use(express.static(__dirname + "/Client"));
http.createServer(app).listen(port);

//clients requests todos
app.get("/todos", function (req, res) {
	console.log("todos requested!");
	res.json(todos);
});

//return homepage html
app.get("/", function (req,res) {
	res.sendFile("/Client/splashscreen.html", {root: __dirname})
});
//add todo to the server
app.get("/addtodo", addTask);

//delete a todo from the server
app.get("/deletetodo", deleteTask);

app.get("/updatetodo", updateTask);

app.get("/toggleDone", toggleDone);

app.get("/sortImportance", sortImportance);


var todos = [];
var task1 = new todoTask("Call grandma",true,false,"02/12/2015","");
todos.push(task1);

function todoTask(taskname,important,reminder,deadline,notes){
	this.taskname = taskname;//string
	this.important = important; // boolean
	this.reminder = reminder; // boolean
	this.deadline = deadline; 
	this.notes = notes; //string
	this.done = false; // boolean
	
	this.setDone = function(){
		this.done = true;
	}
	
};

function addTask(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	
	if(query["taskname"]!==undefined) {
		var tx = new todoTask(query["taskname"],query["important"] === "true",query["reminder"] === "true",query["deadline"],query["notes"]);
		todos.push(tx);
		console.log("Added " + tx.taskname);
		res.end("Todo added successfully");
	}
	else {
		res.end("Error: missing taskname parameter");
	}
};

function deleteTask(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	if(query["number"]!==undefined){
		todos.splice(query["number"],1);
		res.end("Todo deleted successfully");
		console.log("Deleted a todo");
	}
	else{
		res.end("Error: missing number of todo");
	}


};

function toggleDone(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var index;
	if(query["number"]!==undefined){
		index = query["number"];
		todos[index].done = !todos[index].done;
		
		console.log("Toggled done of a todo");
	}
	else{
		console.log("Error: missing number of todo while toggling done");
	}


};

function updateTask(res, req){
	console.log("updating a todo");
	addTask(res, req);
	deleteTask(res, req);
};

function sortImportance(res, req){
	console.log("sorting by importance")
	var high = [];
	var normal = [];
	for(var i = 0; i < todos.length; i++){
		if(todos[i].important == true){
			high.push(todos[i]);
		} else{
			normal.push(todos[i]);
		}
	}

	todos = [];
	todos = high.concat(normal);
};

