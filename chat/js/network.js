var Network = function(uri) {
	this.uri = uri;

	this.sendGetRequest = function(callback) {
		$.get(this.uri, callback);
	}

	this.sendPostRequest = function(postData, extraParams, callback) {
		$.ajax({
		    url: this.uri+extraParams,
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(postData),
		    success: callback
		});
	}
}