$(document).ready(function(){
	
	if ($("#highlight_post").length){
		$('html, body').animate({scrollTop: $("#highlight_post").offset().top - 50}, 0);
	}
	   
	if ($('#reply-text-input').length) {
		CKEDITOR.replace( 'reply-text-input' );
	}
	
	var gmail_quotes = $(".gmail_quote");
    var check = "---------- Forwarded message ----------";
	
    gmail_quotes.each(function () {
    	var text = $(this).text();
    	
    	if (text.substring(0, check.length) !== check) {
    		$(this).wrap( "<div class='accordian'></div>" );
    	}
    });
    
    
 //   var block = $( ".moz-cite-prefix" ).next();
 //   block.addClass("moz-blockquote");
 //   $(".moz-cite-prefix, .moz-blockquote").wrapAll( "<div class='accordian'><div></div></div>" );
    
    $(".accordian").prepend("<h3>...</h3>");
    
	$(".accordian").accordion({collapsible: true, 
							   active: false,
							   heightStyle: "content"});
							   

	var requester_email = $("#user_email").text();
	var params = {'requester_email': requester_email, 
				  'thread_id': getParameterByName('tid'),
				  'msg_id': $("#post_info").val(),
				  'from': $("#post-from").text(),
				  'subject': $("#post-subject").text(),
			};
	   
	$("#btn-reply").unbind("click");
	$("#btn-follow").unbind("click");
	$("#btn-unfollow").unbind("click");
	$("#btn-mute").unbind("click");
	$("#btn-unmute").unbind("click");
	$("#btn-reply").bind("click");
	$("#btn-follow").bind("click");
	$("#btn-unfollow").bind("click");
	$("#btn-mute").bind("click");
	$("#btn-unmute").bind("click");


	upvote = 
		function(post_id, thread_id){
			$.post('upvote', {'post_id': post_id}, 
				function(res){
					if(res.status){
						var upvotes = parseInt($('#post-' + post_id).children('.label2').text().substring(1)) + 1;
						$('#post-' + post_id).children('.label2').text('+' + upvotes);
						$('#post-' + post_id).children('.label2').css({'background-color': 'lightyellow'});
						$('#post-' + post_id).children('small').children().eq(0).replaceWith('<a style="cursor: pointer" onclick="unupvote(\'' + post_id + '\', \'' + thread_id + '\'); return false;">Undo +1 Post</a>');
                    }
					notify(res, true);
				}
			);	
			
		};
		
	unupvote = 
		function(post_id, thread_id){
			$.post('unupvote', {'post_id': post_id}, 
				function(res){
					if(res.status){
						var upvotes = parseInt($('#post-' + post_id).children('.label2').text().substring(1)) - 1;
						$('#post-' + post_id).children('.label2').text('+' + upvotes);
						$('#post-' + post_id).children('.label2').css({'background-color': '#ffffff'});
						$('#post-' + post_id).children('small').children().eq(0).replaceWith('<a style="cursor: pointer" onclick="upvote(\'' + post_id + '\', \'' + thread_id + '\'); return false;">+1 Post</a>');
                    }
					notify(res, true);
				}
			);	
			
		};
	
	delete_thread = 
		function(id, thread_id){
			warningMessage = "Are you sure? This will remove all posts in this thread from the website, but users who received them will still have the original emails.";
	        var confirmation = confirm(warningMessage);
	        if (confirmation) {
				$.post('delete_post', {'id': id, 'thread_id': thread_id},
					function(res){
						if(res.status){
							window.location.href = "/";
						}
						notify(res, true);
					}
				);
			};
		};

	delete_post = 
		function(id){
			warningMessage = "Are you sure? This will remove the post and all subsequent posts in this thread from the website,but users who received them will still have the original emails.";
	        var confirmation = confirm(warningMessage);
	        if (confirmation) {
				$.post('delete_post', {'id': id, 'thread_id': 0},
					function(res){
						if(res.status){
							window.location.reload();
						}
						notify(res, true);
					}
				);
			};
		};
		
	insert_reply = 
		function(params){
			params.msg_text = CKEDITOR.instances['reply-text-input'].getData();
			params.poster_email = params.requester_email;
			$.post('insert_reply', params, 
				function(res){
					if(res.status){
						window.location.reload();
					}
					notify(res, true);
				}
			);	
		};	
	
	follow_thread = 
		function(params){
			$.post('follow_thread', {'requester_email': params.requester_email, 
						  'thread_id': params.thread_id,
						  'msg_id': params.msg_id,
					  	}, 
				function(res){
					console.log(res);
					if(res.status){
						$("#btn-follow").hide();
	            		$("#btn-unfollow").show();
					}
					if (res.redirect) {
						window.location.href = res.url;
					}
					notify(res, true);
				}
			);	
		};
	
	unfollow_thread = 
		function(params){
			$.post('unfollow_thread', {'requester_email': params.requester_email, 
						  'thread_id': params.thread_id,
						  'msg_id' : params.msg_id
					  	}, 
				function(res){
					if(res.status){
	                   $("#btn-follow").show();
	                   $("#btn-unfollow").hide();
	                }
					notify(res, true);
				}
			);	
		};	
		
	mute_thread = 
		function(params){
			$.post('mute_thread', {'requester_email': params.requester_email, 
						  'thread_id': params.thread_id,
						  'msg_id': params.msg_id
					  	}, 
				function(res){
					if(res.status){
						$("#btn-mute").hide();
                		$("#btn-unmute").show();
                	}
					notify(res, true);
				}
			);	
		};
	
	unmute_thread = 
		function(params){
			$.post('unmute_thread', {'requester_email': params.requester_email, 
						  'thread_id': params.thread_id,
						  'msg_id' : params.msg_id
					  	}, 
				function(res){
					if(res.status){
                       $("#btn-mute").show();
                       $("#btn-unmute").hide();
                    }
					notify(res, true);
				}
			);	
		};	
		
	var ins_reply = bind(insert_reply, params);
	var flw_thread = bind(follow_thread, params);
	var unflw_thread = bind(unfollow_thread, params);	
	var m_thread = bind(mute_thread, params);
	var unm_thread = bind(unmute_thread, params);	
		
	$("#btn-reply").click(ins_reply);
	
	$("#btn-follow").click(flw_thread);
	$("#btn-unfollow").click(unflw_thread);
	
	$("#btn-mute").click(m_thread);
	$("#btn-unmute").click(unm_thread);
		
	$("#btn-follow").hide();
	$("#btn-unfollow").hide();
	
	$("#btn-mute").hide();
	$("#btn-unmute").hide();
	
	
	var follow = $("#follow").val();
	var mute = $("#mute").val();
	var member = $("#member").val();
	var no_emails = $("#no_emails").val();
	var always_follow = $("#always_follow").val();
	
	if (member == "True") {
		if (no_emails == "True" || always_follow == "False") {
			if (follow == "True") {
				$("#btn-unfollow").show();
			} else {
				$("#btn-follow").show();
			}
		} else {
			if (mute == "True") {
				$("#btn-unmute").show();
			} else {
				$("#btn-mute").show();
			}
		}
	} else {
		if (follow == "True") {
			$("#btn-unfollow").show();
		} else {
			$("#btn-follow").show();
		}
	}  	
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/* To avoid closure */	
function bind(fnc, val ) {
	return function () {
		return fnc(val);
	};
}

function notify(res, on_success){
	if(!res.status){
		noty({text: "Error: " + res.code, dismissQueue: true, timeout:2000, force: true, type: 'error', layout: 'topRight'});
	}else{
		if(on_success){
			noty({text: "Success!", dismissQueue: true, timeout:2000, force: true, type:'success', layout: 'topRight'});
		}
	}
}
	
	
