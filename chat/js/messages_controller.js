var MessagesController = function() {
	var msgs_view = new MessagesView();
	var msg = Message.getInstance();
	this.createNewMessage = function(nick, msg, timestamp) {
		if(Message.create(nick, msg, timestamp)) {
			return true;
		}
	}

	this.renderNewMessages = function() {
		Message.getNewMessages();
	}

	this.notifyUpdate = function(new_message) {
		msgs_view.renderMessage(new_message);
	}
}