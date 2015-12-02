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
	var deadline = form.elements[5].value;
	var notes = document.getElementById("NoteInput").value;
	

	if (correctform() ){
		jQuery.ajax("../../addtodo?taskname="+taskname+"&important="+important+"&reminder="+reminder+"&deadline="+deadline+"&notes="+notes);
	
		form.reset();
		todoTaskList.update();
	}else{
		alert("Form not filled in correctly");
	}
	
}

function correctform(){
	var form = document.getElementById("frm1");
	var correct;

	var taskname = form.elements[0].value;
	var important = document.getElementsByName("Important")[0].checked;
	var notimportant = document.getElementsByName("Important")[1].checked;
	var reminder = document.getElementsByName("Reminder")[0].checked;
	var notreminder = document.getElementsByName("Reminder")[1].checked;
	var deadline = form.elements[5].value;
	var notes = document.getElementById("NoteInput").value;

	var checkboxes = (important || notimportant) && (reminder || notreminder);

	var strings = (taskname !== "");

	correct = checkboxes && strings;

	return correct;
}


var todoTaskList = (function(){
	
	var tasks = [];
	
	return{
		addTask: function(task){
			tasks.push(task);
		},
		
		update: function(){
			
		jQuery.getJSON("/todos",function(data){tasks=data}).done(function(){todoTaskList.clearScreen();todoTaskList.writeTable();});
						
		},

		deleteTask: function(i){
			
			jQuery.ajax("../../deletetodo?number="+i).done(function(){todoTaskList.update();});
			
		},

		returnTask: function(i){
			return tasks[i];
		},

		returnAll: function(){
			return tasks;
		},

		writeAll: function(data){
			tasks = data;
		},

		clearScreen: function(){

			var tasklist = document.getElementById("Task");
			
			while(tasklist.firstChild){
				tasklist.removeChild(tasklist.firstChild);
			}          
		},

		sortImportance: function(){
			jQuery.ajax("../../sortImportance").done(function(){todoTaskList.update();});
			
		},

		sortDate: function(){
			jQuery.ajax("../../sortDate").done(function(){todoTaskList.update();});
				/*
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
				todoTaskList.clearScreen();
				todoTaskList.writeTable();
			});
			*/
        },

		toggleDone: function(i){
			jQuery.ajax("../../toggleDone?number="+i);
			todoTaskList.update();

		},

		writeTable: function(){
			var tasklist = document.getElementById("Task");
			var body = document.body,
			tbl  = document.createElement('table');
			tbl.classList.add("tasktable")

			for(var i = 0; i < tasks.length; i++){
				//new row
				var tr = tbl.insertRow();
				if(tasks[i].done == true){
					tr.classList.add("taskrowdone");
				}
				else if(tasks[i].important == true){
					if( i%2 == 1){
						tr.classList.add("taskrowimportant2");
					}
					else{
						tr.classList.add("taskrowimportant1");
					}
				}else if( i%2 == 1){
					tr.classList.add("taskrow2");
				}else{
					tr.classList.add("taskrow1");
				}

				//Name with link
                var td = tr.insertCell();
                
                td.classList.add("taskcell");
                var node = document.createElement("a");
				node.href = "javascript:popupFunctie(" + i+ ");";
				var textnode = document.createTextNode(tasks[i].taskname);
				td.appendChild(node);
				node.appendChild(textnode);
				
				//Important cell
				var td = tr.insertCell();
                td.appendChild(document.createTextNode(tasks[i].important));
                td.classList.add("taskcell");
				td.classList.add("thincell");
				
				//Reminder cell
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(tasks[i].reminder));
                td.classList.add("taskcell");
				td.classList.add("thincell");
				
				//Deadline cell
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(tasks[i].deadline));
                td.classList.add("taskcell");
				td.classList.add("widecell");
				
				//Done cell
                var td = tr.insertCell();
                td.classList.add("taskcell");
				td.classList.add("thincell");
                var node = document.createElement("a");
				node.href = "javascript:todoTaskList.toggleDone(" + i+ ");";
				var textnode = document.createTextNode(tasks[i].done);
				td.appendChild(node);
				node.appendChild(textnode);
				}


			var header = tbl.createTHead();
			var row = header.insertRow(0);
			
			//Taskname header
			var cell = row.insertCell(0);
			cell.innerHTML = "<b>Taskname</b>";
			cell.classList.add("taskcell");
			
			//Importance header
			var cell = row.insertCell(1);
			var node = document.createElement("a");
			node.href = "javascript:todoTaskList.sortImportance();";
			var textnode = document.createTextNode("Important");
			cell.appendChild(node);
			node.appendChild(textnode);
			cell.classList.add("taskcell");
			cell.classList.add("thincell");
			
			//Reminder header
			var cell = row.insertCell(2);
			cell.innerHTML = "<b>Reminder</b>";
			cell.classList.add("taskcell");
			cell.classList.add("thincell");
			
			//Deadline header
			var cell = row.insertCell(3);
			var node = document.createElement("a");
			node.href = "javascript:todoTaskList.sortDate();";
			var textnode = document.createTextNode("Deadline");
			cell.appendChild(node);
			node.appendChild(textnode);
			cell.classList.add("taskcell");
			cell.classList.add("widecell");
			
			//Done header
			var cell = row.insertCell(4);
			cell.innerHTML = "<b>Done</b>";
			cell.classList.add("taskcell");
			cell.classList.add("thincell");

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
	popup.classList.add("popup");
	popup.innerHTML =  '<form id="editfrm">Task<input type="text" name="Task" value="'+ task.taskname +'"><br>Important <input type="radio" name="Importantedit">Yes<input type="radio" name="Importantedit">No<br>Remind me <input type="radio" name="Reminderedit" value="Yes">Yes<input type="radio" name="Reminderedit" value="No">No<br>Deadline<br><input type="text" name="Deadline" value="' + task.deadline +'"><br>Notes<br><textarea name="Noteedit" id="NoteEdit" class="Notearea"></textarea><br></form> <button type="button" onclick="editTask(' + i + ');emptyPopup()">Save changes</button><button type="button" onclick="todoTaskList.deleteTask(' + i + ');emptyPopup();">Delete task</button><button type="button" onclick="emptyPopup();">Discard changes</button>';
	document.getElementById("NoteEdit").value = task.notes;
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
	popup.classList.remove("popup");
	popup.innerHTML = "";
}

function editTask(i){
	var form = document.getElementById("editfrm");
	var taskname = form.elements[0].value;
	var important = document.getElementsByName("Importantedit")[0].checked;
	var reminder = document.getElementsByName("Reminderedit")[0].checked;
	var deadline = form.elements[5].value;
	var notes = document.getElementById("NoteEdit").value;
	
	jQuery.ajax("../../updatetodo?number="+i+"&taskname="+taskname+"&important="+important+"&reminder="+reminder+"&deadline="+deadline+"&notes="+notes);
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

setInterval(function () {
 console.log("Fetching the todo list from the server.");
 $.getJSON("/todos", function(data){
 	if(data !== todoTaskList.returnAll()){
 		todoTaskList.update();
 	}
 });
 }, 2000);


