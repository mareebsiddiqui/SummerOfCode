var MessagesView = function() {
	this.renderMessage = function(new_message) {
		$("#chat").append(new_message.nick + " @ " + new Date(new_message.timestamp) + " said,\"" + new_message.msg + "\"<br/>");
	}
}