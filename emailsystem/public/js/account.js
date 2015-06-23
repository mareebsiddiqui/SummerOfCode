$(function() {
	var client = new Faye.Client('/faye', {timeout: 120});
	
	$(".email-textbox").tinymce();

	$.get("/account", function(user) {
		$("#user-username").text(user.username);
		$.get("templates/email.mst", function(template) {
			client.subscribe('/inbox', function(data) {
				var email = $.parseJSON(data.email);
				if(email.user_to == user.email) {
					email.email = email.user_to;
					var rendered = Mustache.render(template, email);
					$("#emails-holder").prepend(rendered);
				}
			});
		});
	});

	$("#check-inbox-button").click(function() {
		loadEmails("inbox");
		$("#newEmailModal").modal('hide');
	});

	$("#new-email-form").ajaxForm(function(data) {
		$("#composeEmailModal").modal('hide');
	});

	$("#reply-form").ajaxForm(function(data) {
		
	});

	$("#check-inbox-button").click(function() {
		loadEmails("inbox");
	});

	loadEmails("inbox");
	
	$("#inbox-folder-link").click(function() {
		loadEmails("inbox");
	});

	$("#sent-emails-folder-link").click(function() {
		loadEmails("sentemails");
	});
	
	$(document.body).on('click', ".email", function() {
		$(".email.selected").removeClass("selected");
		$(this).addClass("selected");	
		loadEmail($(this).data("id"));
	});

	function loadEmails(folder_name) {
		$("#folder-name").text((folder_name === "inbox") ? "Inbox" : "Sent Emails");
		$("#emails-holder").html("");
		clearEmail();
		$(".active").removeClass("active");
		$((folder_name === "inbox") ? "#inbox-folder-link" : "#sent-emails-folder-link").addClass("active");
		$.get('/templates/email.mst', function(template) {
			$.get("/"+folder_name, function(emails) {
				var emails = $.parseJSON(emails);
				if(emails.length > 0) {
					for(var i = 0; i < emails.length; i++) {
						if(folder_name == "sentemails") {
							emails[i].email = emails[i].user_to;
						} else {
							emails[i].email = emails[i].user_from;
						}
						emails[i].date = new Date(emails[i].created_at);
						var email = JSON.stringify(emails[i]);
						var rendered = Mustache.render(template, emails[i]);
						$("#emails-holder").append(rendered);
					}
					var first_email = $(".email").first();
					var first_email_id = first_email.data("id");
					first_email.addClass("selected");
					loadEmail(first_email_id);
				} else {
					$("#emails-holder").append("<h3>No emails.</h3>");
				}
			});
		});
	}

	function addEmail() {
		if(folder_name == "sentemails") {
			emails[i].email = emails[i].user_to;
		} else {
			emails[i].email = emails[i].user_from;
		}
		var email = JSON.stringify(emails[i]);
		var rendered = Mustache.render(template, emails[i]);
		$("#emails-holder").append(rendered);
	}

	function loadEmail(email_id) {
		$.get("/email/"+email_id, function(email) {
			var email = $.parseJSON(email);
			$("#email-holder hr").show();
			$("#reply-form-holder").show();
			$("#user-from-username").text(email.user_from.split('@')[0]);
			$("#user-from-email").text(email.user_from);
			$("#email-subject").text(email.subject);
			$("#email-body").show();
			$("#email-body").text(email.body);
			$("#reply-form").attr("action", "/email/"+email_id+"/reply");
		});
		$.get("/email/"+email_id+"/replies", function(replies) {
			var replies = $.parseJSON(replies);
			$("#replies-holder").html("");
			for(var i = 0; i < replies.length; i++) {
				$("#replies-holder").append("<h3>"+replies[i].user_email+"</h3><p>"+replies[i].reply+"</p>");
			}
			client.subscribe("/email/"+email_id+"/replies", function(data) {
				var reply = $.parseJSON(data.reply);
				$("#replies-holder").append("<h3>"+reply.user_email+"</h3><p>"+reply.reply+"</p>");	
			});
		});
	}

	function clearEmail() {
		$("#reply-form-holder").hide();
		$("#email-holder hr").hide();
		$("#user-from-username").text("No email selected.");
		$("#user-from-email").text("");
		$("#email-subject").text("");
		$("#email-body").hide();
	}
});