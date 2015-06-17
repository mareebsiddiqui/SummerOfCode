var Message = function(nick, message, timestamp) {
	this.nick = nick;
	this.msg = message;
	this.timestamp = timestamp;
	this.message = {nick: this.nick, msg: this.msg, timestamp: this.timestamp};

	var network = new Network("http://datastore.asadmemon.com/"+SECRET_TOKEN);

	this.save = function() {
		var message = this.message;
		network.sendPostRequest(message, this.timestamp, function(data) {
			console.log(data);
		})
	}

	this.getMessage = function() {
		var msg = '<div class="message">';
			msg += '<p class="nick pull-left">'+this.nick+'</p>';
			msg += '<p class="time text-muted pull-right">'+new Date(this.timestamp)+'</p>';
			msg += '<div class="clearfix"></div>';
			msg += '<p class="body">'+this.msg+'</p>';
		   msg += '</div><hr/>';
		return msg;
	}
}