// var Message = function() {
// 	var network = new Network("http://datastore.asadmemon.com/"+SECRET_TOKEN);

// 	this.save = function() {
// 		var message = this.message;
// 		network.sendPostRequest(message, this.timestamp, function(data) {
// 			return this.message;
// 		});
// 	}

// 	this.getMessage = function() {
// 		var msg = '<div class="message">';
// 			msg += '<p class="nick pull-left">'+this.nick+'</p>';
// 			msg += '<p class="time text-muted pull-right">'+new Date(this.timestamp)+'</p>';
// 			msg += '<div class="clearfix"></div>';
// 			msg += '<p class="body">'+this.msg+'</p>';
// 		   msg += '</div><hr/>';
// 		return msg;
// 	}
// }

var Message = function() {
	setInterval(function() {
		Message.getNewMessages();
	}, 200);
}

Message.getInstance = function() {
	return new Message();
}

Message.timestamp = 0;
Message.network = new Network("http://datastore.asadmemon.com/"+SECRET_TOKEN);
Message.msgs_controller = new MessagesController();

Message.create = function(nick, msg, timestamp) {
	var message = {nick: nick, msg: msg, timestamp: timestamp};
	Message.network.sendPostRequest(message, '/'+message.timestamp, function(data) {
		Message.timestamp = message.timestamp;
		Message.msgs_controller.notifyUpdate(message);
		return true;
	});
};

Message.getNewMessages = function() {
	new_messages = [];
	Message.network.sendGetRequest(function(data) {
		var msg;
		for(msgIndex in data) {
			msg = data[msgIndex];
			
			if(msgIndex > Message.timestamp) {
				console.log(msgIndex, Message.timestamp);
				Message.msgs_controller.notifyUpdate(msg);
			}
		}
		Message.timestamp = msg.timestamp;
	});
	
	
}