$(function() {
	$.get('http://datastore.asadmemon.com/'+SECRET_TOKEN,function(data) {
		var todos = $.isEmptyObject(data) ? [] : data;
		for(var i  = 0; i < todos.length; i++) {
			var todo = new Todo(i, todos[i].name, todos[i].state);
			$("#loading-text").remove();
			$("#pending-todos").append(todo.get("html"));
		}

		$("#btnAddTodo").click(function(e) {
			var value = $("#txtTodo").val();
			if(value !== "") {
				var todo = new Todo(todos.length, value);
				$("#pending-todos").append(todo.get("html"));
				todos.push(todo.get("json"));
				todo.save();
				$("#txtTodo").val("");
			}
		});

		$("#txtTodo").keyup(function(e) {
			if(e.keyCode == 13) { //enter pressed
				$("#btnAddTodo").click(); //same cheez hoti hai click mein.
			}
		});

		$(document.body).on('click', ".todo-checkbox", function() {
			if($(this).is(":checked")) {
				Todo.update($(this).data("tid"), false);
				$(this).next(".todo").css("text-decoration", "line-through");
			} else {
				Todo.update($(this).data("tid"), true);
				$(this).next(".todo").css("text-decoration", "none");
			}
		});
	});
});