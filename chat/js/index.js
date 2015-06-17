$(function() {
	setInterval(function() {
		loadAllTo("#chat");
	}, 200);
	$("#btnSendMessage").click(function() {
		var message_body = $("#txtMessage").val();
		var nick = $("#txtNick").val();
		if(message_body != "" && nick != "") {
			var message = new Message(nick, message_body, new Date().getTime());
			message.save();
			$("#loading-div").show();
			console.log($("#chat")[0].scrollHeight);
			$("#txtMessage").val("");
		}
	});

	$("#txtMessage").keyup(function(e) {
		if(e.keyCode == 13) { //enter daba dia. :O
			$("#btnSendMessage").click();
			$("#txtMessage").val("");
		}
	});

	function loadAllTo(msgs_holder) {
		var network = new Network("http://datastore.asadmemon.com/"+SECRET_TOKEN);
		network.sendGetRequest(function(data) {
			$(msgs_holder).empty();
			for (var message in data) {
		       var obj = data[message];
		       var msg_obj = new Message(obj.nick, obj.msg, obj.timestamp);
		       $(msgs_holder).append(msg_obj.getMessage());
			}
			$(msgs_holder).scrollTop($(msgs_holder)[0].scrollHeight);
			$("#loading-div").hide();
		});
	}
});