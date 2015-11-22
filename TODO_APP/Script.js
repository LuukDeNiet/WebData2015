function todoTask(taskname,important,reminder,deadline,notes){
	this.taskname = taskname;
	this.important = important; // boolean
	this.reminder = reminder; // boolean
	this.deadline = deadline; 
	this.notes = notes;
	this.done = false; // boolean
	
	this.toTable = function(){
		return tableLine;
	}
	
}

function readNewTask(){

	var form = document.getElementById("frm1");
	var taskname = form.elements[0].value;
	var important = form.elements[1].value;
	var reminder = form.elements[2].value;
	var deadline = form.elements[5].value;
	var notes = form.elements[6].value;
	
	

	var task = new todoTask(taskname,important,reminder,deadline,notes);
	todoTaskList.addTask(task);
	todoTaskList.update();
}


var todoTaskList = (function(){
	
	var tasks = [];
	
	return{
		addTask: function(task){
			tasks.push(task);
		},
		
		editTask: function(task,i){
			tasks[i] = task;
		},
		
		update: function(){

			todoTaskList.clearScreen();
			todoTaskList.writeAll();								
		},

		deleteTask: function(i){
			tasks.splice(i,1);
			todoTaskList.update();
		},

		returnTask: function(i){
			return tasks[i];
		},

		clearScreen: function(){

			var tasklist = document.getElementById("Task");
			
			while(tasklist.firstChild){
				tasklist.removeChild(tasklist.firstChild);
			}          
		},

		writeAll: function(){

			var tasklist = document.getElementById("Task");
			
			for(var i = 0; i < tasks.length; i++){
				var p = document.createElement("p");
				var node = document.createElement("a");
				node.href = "javascript:popupFunctie(" + i+ ");";
				var textnode = document.createTextNode(tasks[i].taskname);
				p.appendChild(node);
				node.appendChild(textnode);
				tasklist.appendChild(p);
			}
		},

		setDone: function(i){
			tasks[i].done = true;
			todoTaskList.update();
		},

		sortImportance: function(){
			var high = [];
			var normal = [];

			for(var i = 0; i < tasks.length; i++){
				if(tasks[i].priority == true){
					high.push(tasks[i]);
				} else{
					normal.push(tasks[i]);
				}
			}

			tasks = [];
			tasks = high.concat(normal);

			todoTaskList.update();


		}

	}
})();


function popupFunctie(i){
	var task = todoTaskList.returnTask(i);
	var important1;
	var imporant2;
	if(task.important = true){
		important1  = "checked";
		important2 = "";
	}
	else{
		important1 = "";
		important2 = "checked";
	}
	var reminder1;
	var reminder2;
	if(task.reminder = true){
		reminder1  = "checked";
		reminder2 = "";
	}
	else{
		reminder1 = "";
		reminder2 = "checked";
	}
	
	var popup = document.getElementById("popup");
	popup.style = "popupON";
	popup.innerHTML =  '<form id="editfrm">Task<input type="text" name="Task" value="'+ task.taskname +'"><br>Important <input type="radio" name="Important" ' + important1 + '>Yes<input type="radio" name="Important" ' + important2 + '>No<br>Remind me <input type="radio" name="Reminder" value="Yes" ' + reminder1 + '>Yes<input type="radio" name="Reminder" value="No" ' + reminder2 + '>No<br>Deadline<br><input type="date" name="Deadline" value="' + task.deadline +'"><br>Notes<br><input type="text" name="Notes" value="' + task.notes + '"><br></form> <button type="button" onclick="editTask(' + i + ');emptyPopup()">Save changes</button><button type="button" onclick="todoTaskList.deleteTask(' + i + ');emptyPopup();">Delete task</button><button type="button" onclick="emptyPopup();">Discard changes</button>';
}

function emptyPopup(){
	var popup = document.getElementById("popup");
	popup.style = "popupOFF";
	popup.innerHTML = "";
}

function editTask(i){
	var form = document.getElementById("editfrm");
	var taskname = form.elements[0].value;
	var important = form.elements[1].value;
	var reminder = form.elements[2].value;
	var deadline = form.elements[5].value;
	var notes = form.elements[6].value;
	var task = new todoTask(taskname,important,reminder,deadline,notes);
	todoTaskList.editTask(task,i);
	todoTaskList.update();
}