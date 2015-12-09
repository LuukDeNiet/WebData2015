/* global __dirname */
var express = require("express");
var url = require("url");
var http = require("http");
var fs = require("fs");
var mysql = require('mysql');

/*Connect to MySQL database */
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'webdata',
  database : 'TODO_APP'
});

connection.connect();

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

app.get("/sortDate",sortDate);


var todos = [];
var task1 = todoTask();
task1.readDatabase(1);
todos.push(task1);

function todoTask(taskname,important,reminder,deadline,notes){
	var ToDoItemId;
	this.taskname = taskname;//string
	this.important = important; // boolean
	this.reminder = reminder; // boolean
	this.deadline = deadline; 
	this.notes = notes; //string
	this.done = false; // boolean
	
	this.setDone = function(){
		this.done = true;
	}
	
	this.readDatabase = function(ToDoItemId){
		connection.query('SELECT Title, Notes, DueDate, Completed, Priority, Reminder FROM ToDoItem WHERE ToDoItemId =' + ToDoItemId, function(err, rows, fields) {
			if (!err){
				console.log("solution found");
				this.deadline = rows[0].DueDate; 
				this.notes = rows[0].Notes;
				if(rows[0].Priority !== 0){
					this.important = true;
				}
				else{
					this.important = false;
				}
				if(rows[0].Reminder !== 0){
					 this.reminder = true;
				}
				else{
					this.reminder = false;
				}
				if(rows[0].Completed !== 0){
					 this.done = true;
				}
				else{
					this.done = false;
				}
				this.ToDoItemId = ToDoItemId;
				return res;
			}
			else
				console.log('Error while performing Query.');
		});
	}
};

function readTask(ToDoItemId,res){
	connection.query('SELECT Title, Notes, DueDate, Completed, Priority, Reminder FROM ToDoItem WHERE ToDoItemId =' + ToDoItemId, function(err, rows, fields) {
			if (!err){
				console.log("solution found");
				var deadline = rows[0].DueDate; 
				var notes = rows[0].Notes;
				var important;
				var reminder;
				var done;
				if(rows[0].Priority !== 0){
					important = true;
				}
				else{
					important = false;
				}
				if(rows[0].Reminder !== 0){
					 reminder = true;
				}
				else{
					reminder = false;
				}
				if(rows[0].Completed !== 0){
					 done = true;
				}
				else{
					done = false;
				}
				res = new todoTask(rows[0].Title, important, reminder, deadline, notes);
				res.ToDoItemId = ToDoItemId;
				return res;
			}
			else
				console.log('Error while performing Query.');
		});
}

function addTask(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	
	if(query["taskname"]!==undefined) {
		var tx = new todoTask(query["taskname"],query["important"] === "true",query["reminder"] === "true",query["deadline"],query["notes"]);
		todos.push(tx);
		console.log("Added " + tx.taskname);
		//res.end("Todo added successfully");
	}
	else {
		//res.end("Error: missing taskname parameter");
	}
};

function deleteTask(req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	if(query["number"]!==undefined){
		todos.splice(query["number"],1);
		//res.end("Todo deleted successfully");
		console.log("Deleted a todo");
	}
	else{
		//res.end("Error: missing number of todo");
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

function updateTask(req, res){
	console.log("updating a todo");
	addTask(req, res);
	deleteTask(req, res);
};

function sortImportance(req, res){
	console.log("sorting by importance");
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

function sortDate(req, res){
	console.log("sorting by date");
	var sorted = [];
    var totaal = todos.length;
    var index;

    for (var i = 0; i<totaal; i++){
        index = 0;
        for(var j = 0;j<todos.length;j++){
            if(todos[index].deadline>todos[j].deadline){
                index = clone(j);
            }
        }
        sorted.push(todos[index]);
        todos.splice(index,1);
    }
	todos = clone(sorted);
	console.log("sorting by date finished");
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

