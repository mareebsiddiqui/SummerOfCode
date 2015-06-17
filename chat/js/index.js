$(function() {
	var msgs_controller = new MessagesController();
	$("#btnSendMessage").click(function() {
		var message_body = $("#txtMessage").val();
		var nick = $("#txtNick").val();
		if(message_body != "" && nick != "") {
			if(msgs_controller.createNewMessage(nick, message_body, new Date().getTime())) {
				$("#loading-div").show();
				$("#txtMessage").val("");
			}
		}
	});

	$("#txtMessage").keyup(function(e) {
		if(e.keyCode == 13) { //enter daba dia. :O
			$("#btnSendMessage").click();
			$("#txtMessage").val("");
		}
	});
});