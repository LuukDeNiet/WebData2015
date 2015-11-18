function todoTask(taskname,important,reminder,deadline,notes,done){
	this.taskname = taskname;
	this.important = important;
	this.reminder = reminder;
	this.deadline = deadline;
	this.notes = notes;
	this.done = done;
	
	this.toTable = function(){
		var tableLine = document.createElement("tr");
		var tableBlock = document.createElement("td");
		tableBlock.appendChild(taskname);
		var tableBlock2 = document.createElement("td");
		tableBlock.appendChild(deadline);
		tableLine.appendChild(tableBlock);
		tableLine.appendChild(tableBlock2);
		return tableLine;
	}
}

function readNewTask(){

	var form = document.getElementById("frm1");
	var taskname = form.elements[1].value;
	var important = form.elements[2].vale;
	var reminder = form.elements[3].vale;
	var deadline = form.elements[4].vale;
	var notes = form.elements[5].vale;
	var done = form.elements[6].vale;
	
	var task = todoTask(taskname,important,reminder,deadline,notes,done);
	todoTaskList.addTask(task);
	todoTaskList.update();
}


var todoTaskList = (function(){
	
	var tasks = [];
	
	return{
		addTask: function(task){
			tasks.push(task);
		},
		
		update: function(){
			
			var tasktable = document.getElementById("Task");
			
			while(tasktable.firstChild){
				tasktable.removeChild(tasktable.firstChild);
			}
			
			for(i = 0; i < tasks.length(); i++){
				tasktable.appendChild(tasks[i].toTable);
			}
			
		}
	}
})();


