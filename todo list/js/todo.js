var SECRET_TOKEN = "oausdf";

var Todo = function(id, name, state) {
	this.id = id;
	this.name = name;
	this.state = state;
	this.todo = {name: this.name, state: this.state};

	this.save = function() {
		$.ajax({
		    url: 'http://datastore.asadmemon.com/'+SECRET_TOKEN+'/'+this.id, 
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(this.todo)
		});
	};

	this.get = function(type) {
		if(type=="html") {
			if(this.state == true) {
				return '<div class="todo-holder"><label><input type="checkbox" class="todo-checkbox" data-tid="'+this.id+'" /> <span class="todo">'+this.name+'</label></div>';
			} else {
				return '<div class="todo-holder"><label><input type="checkbox" class="todo-checkbox" checked="checked" data-tid="'+this.id+'" /> <span class="todo" style="text-decoration: line-through;">'+this.name+'</label></div>';
			}
		} else if(type == "json") {
			return {"name":this.name,"state":this.state};
		}
	};

};

Todo.update = function(id, state) {
	$("#loading-div").show();
	$.get('http://datastore.asadmemon.com/'+SECRET_TOKEN+'/'+id, function(data) {
		todo = data;
		todo.state = state;
		$.ajax({
		    url: 'http://datastore.asadmemon.com/'+SECRET_TOKEN+'/'+id, 
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(todo),
		    success: function(data) {$("#loading-div").hide();}
		});
	});
};