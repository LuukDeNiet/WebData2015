function todoTask(taskname,important,reminder,deadline,notes){
	this.taskname = taskname;//string
	this.important = important; // boolean
	this.reminder = reminder; // boolean
	this.deadline = deadline; 
	this.notes = notes; //string
	this.done = false; // boolean
	
		
}

function readNewTask(){

	var form = document.getElementById("frm1");
	var taskname = form.elements[0].value;
	var important = document.getElementsByName("Important")[0].checked;
	var reminder = document.getElementsByName("Reminder")[0].checked;
	var deadline = new Date(form.elements[5].value);
	var notes = form.elements[6].value;
	
	

	var task = new todoTask(taskname,important,reminder,deadline,notes);
	todoTaskList.addTask(task);
	todoTaskList.update();
	form.reset();
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
			todoTaskList.writeTable();								
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

		sortImportance: function(){
			var high = [];
			var normal = [];

			for(var i = 0; i < tasks.length; i++){
				if(tasks[i].important == true){
					high.push(tasks[i]);
				} else{
					normal.push(tasks[i]);
				}
			}

			tasks = [];
			tasks = high.concat(normal);

			todoTaskList.update();


		},

		sortDate: function(){
			var sorted = [];
			var totaal = tasks.length;
			var index;

			for (var i = 0; i<totaal; i++){
				index = 0;
				for(var j = 0;j<tasks.length;j++){
					if(tasks[index].deadline>tasks[j].deadline){
						index = clone(j);
					}
				}
				sorted.push(tasks[index]);
				tasks.splice(index,1);
			}
			tasks = clone(sorted);
			
			todoTaskList.update();

		},

		toggleDone: function(i){
			tasks[i].done = !tasks[i].done;
			todoTaskList.update();

		},

		writeTable: function(){
			var tasklist = document.getElementById("Task");
			var body = document.body,
			tbl  = document.createElement('table');
			tbl.style.width  = '100%';
			tbl.style.border = '1px solid black';

			for(var i = 0; i < tasks.length; i++){
				var tr = tbl.insertRow();
        

            
                var td = tr.insertCell();
                
                td.style.border = '1px solid black';
                var node = document.createElement("a");
				node.href = "javascript:popupFunctie(" + i+ ");";
				var textnode = document.createTextNode(tasks[i].taskname);
				td.appendChild(node);
				node.appendChild(textnode);



               
               var td = tr.insertCell();
                td.appendChild(document.createTextNode(tasks[i].important));
                td.style.border = '1px solid black';
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(tasks[i].reminder));
                td.style.border = '1px solid black';
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(tasks[i].deadline.toDateString()));
                td.style.border = '1px solid black';
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(tasks[i].notes));
                td.style.border = '1px solid black';
                var td = tr.insertCell();
                td.style.border = '1px solid black';
                var node = document.createElement("a");
				node.href = "javascript:todoTaskList.toggleDone(" + i+ ");";
				var textnode = document.createTextNode(tasks[i].done);
				td.appendChild(node);
				node.appendChild(textnode);
				}


			var header = tbl.createTHead();
			var row = header.insertRow(0);
			var cell = row.insertCell(0);
			cell.innerHTML = "<b>Taskname</b>";

			var cell = row.insertCell(1);
			var node = document.createElement("a");
			node.href = "javascript:todoTaskList.sortImportance();";
			var textnode = document.createTextNode("Important");
			cell.appendChild(node);
			node.appendChild(textnode);
			var cell = row.insertCell(2);
			cell.innerHTML = "<b>Reminder</b>";
			var cell = row.insertCell(3);
			var node = document.createElement("a");
			node.href = "javascript:todoTaskList.sortDate();";
			var textnode = document.createTextNode("Deadline");
			cell.appendChild(node);
			node.appendChild(textnode);
			var cell = row.insertCell(4);
			cell.innerHTML = "<b>Notes</b>";
			var cell = row.insertCell(5);
			cell.innerHTML = "<b>Done</b>";

			tasklist.appendChild(tbl);
			}

	}
})();


function popupFunctie(i){
	var task = todoTaskList.returnTask(i);
	var reminder1;
	var reminder2;
	if(task.reminder){
		reminder1  = "checked";
		reminder2 = "";
	}
	else{
		reminder1 = "";
		reminder2 = "checked";
	}
	
	var popup = document.getElementById("popup");
	popup.style = "popupON";
	popup.innerHTML =  '<form id="editfrm">Task<input type="text" name="Task" value="'+ task.taskname +'"><br>Important <input type="radio" name="Importantedit">Yes<input type="radio" name="Importantedit">No<br>Remind me <input type="radio" name="Reminderedit" value="Yes">Yes<input type="radio" name="Reminderedit" value="No">No<br>Deadline<br><input type="date" name="Deadline" value="' + task.deadline +'"><br>Notes<br><input type="text" name="Notes" value="' + task.notes + '"><br></form> <button type="button" onclick="editTask(' + i + ');emptyPopup()">Save changes</button><button type="button" onclick="todoTaskList.deleteTask(' + i + ');emptyPopup();">Delete task</button><button type="button" onclick="emptyPopup();">Discard changes</button>';
	if(task.important){
		document.getElementsByName("Importantedit")[0].checked = true;
	}
	else{
		document.getElementsByName("Importantedit")[1].checked = true;
	}
	if(task.reminder){
		document.getElementsByName("Reminderedit")[0].checked = true;
	}
	else{
		document.getElementsByName("Reminderedit")[1].checked = true;
	}
}

window.onload = todoTaskList.update

function emptyPopup(){
	var popup = document.getElementById("popup");
	popup.style = "popupOFF";
	popup.innerHTML = "";
}

function editTask(i){
	var form = document.getElementById("editfrm");
	var taskname = form.elements[0].value;
	var important = document.getElementsByName("Importantedit")[0].checked;
	var reminder = document.getElementsByName("Reminderedit")[0].checked;
	var deadline = form.elements[5].value;
	var notes = form.elements[6].value;
	
	var task = new todoTask(taskname,important,reminder,deadline,notes);
	
	todoTaskList.editTask(task,i);
	todoTaskList.update();
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
