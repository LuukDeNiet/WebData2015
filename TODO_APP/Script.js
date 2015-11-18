function todoTask(taskname,important,reminder,deadline,notes,done){
	this.taskname = taskname;
	this.important = important;
	this.reminder = reminder;
	this.deadline = deadline;
	this.notes = notes;
	this.done = done;
	
	this.toTable = function(){
		return tableLine;
	}
	
}

function readNewTask(){

	var form = document.getElementById("frm1");
	var taskname = form.elements[0].value;
	var important = form.elements[1].value;
	var reminder = form.elements[2].value;
	var deadline = form.elements[3].value;
	var notes = form.elements[4].value;
	var done = form.elements[5].value;
	

	var task = new todoTask(taskname,important,reminder,deadline,notes,done);
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
			
			var tasklist = document.getElementById("Task");
			
			while(tasklist.firstChild){
				tasklist.removeChild(tasklist.firstChild);
			}
			
			for(var i = 0; i < tasks.length; i++){
				var p = document.createElement("p");
				var node = document.createElement("a");
				node.href = "javascript:popupFunctie(" + i+ ");";
				var textnode = document.createTextNode(tasks[i].taskname);
				p.appendChild(node);
				node.appendChild(textnode);
				tasklist.appendChild(p);
			}
			
		}
	}
})();


function popupFunctie(i){
 alert(i);

}