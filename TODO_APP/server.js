/* global __dirname */
var express = require("express");
var url = require("url");
var http = require("http");

var port = 3000;
var app = express();
app.use(express.static(__dirname + "/client"));
http.createServer(app).listen(port);

var todos = [];
var task1 = new todoTask("Call grandma",true,false,"2015-12-02","");
todos.push(task1);

//clients requests todos
app.get("/todos", function (req, res) {
	console.log("todos requested!");
	res.json(todos);
});

//add todo to the server
app.get("/addtodo", addTask);

//delete a todo from the server
app.get("/deletetodo", deleteTask);

app.get("/updatetodo", updateTask);

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
		var tx = new todoTask(query["taskname"],query["important"] === "true",query["reminder"] === "true",new Date(query["deadline"]),query["notes"]);
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

function updateTask(res, req){
	console.log("updating a todo");
	deleteTask(res, req);
	addTask(res, req);
};

