$(document).ready(function(){
	
	var members_table = $('#members-table').dataTable();
	
	var user_name = $.trim($('#user_email').text());
	var group_name = $.trim($("#group-name").text());
	
	var member = $.trim($(".member").text()) == "Member";
	var admin = $.trim($(".admin").text()) == "Admin";
	var mod = $.trim($(".mod").text()) == "Mod";
	var group_active = $.trim($(".group_active").text()) == "True";
	
	var btn_edit_group_info = $("#btn-edit-group-info");
	var btn_edit_settings = $("#btn-edit-settings");
	var btn_activate_group = $("#btn-activate-group");
	var btn_deactivate_group = $("#btn-deactivate-group");
	var btn_add_members = $("#btn-add-members");
	var btn_subscribe_group = $("#btn-subscribe-group");
	var btn_unsubscribe_group = $("#btn-unsubscribe-group");
	var btn_delete_members = $("#btn-del-members");
	var btn_set_admin = $("#btn-set-admin");
	var btn_set_mod = $("#btn-set-mod");
		
	subscribe_group = 
		function(params){
			$.post('/subscribe_group', params, 
				function(res){
					if (res.status) {
						member = true;
						fix_visibility();
						$(".member").text('Member');
						$(".member").show();
						var row_info = members_table.fnAddData( [
					        user_name,
					        new Date().toLocaleString(),
					        admin,
					        mod,
					        ] );
						var row = members_table.fnSettings().aoData[ row_info[0] ].nTr;
						row.className = "my_row";
					}
					if (res.redirect) {
						window.location.href = res.url;
					}
					notify(res, true);
				}
			);	
		};
		
		
	unsubscribe_group = 
		function(params){
			$.post('/unsubscribe_group', params, 
				function(res){
					if (res.status) {
						member = false;
						fix_visibility();
						$(".member").hide();
						var aPos = members_table.fnGetPosition($(".my_row").get(0)); 
						members_table.fnDeleteRow(aPos);
					}
					notify(res, true);
				}
			);	
		};
		
	activate_group = 
		function(params){
			$.post('/activate_group', params, 
				function(res){
					if (res.status) {
						$(".group_active").text('True');
						group_active = true;
						fix_visibility();
					}
					notify(res, true);
				}
			);	
		};
		
	
	deactivate_group = 
		function(params){
			$.post('/deactivate_group', params, 
				function(res){
					if (res.status) {
						$(".group_active").text('False');
						group_active = false;
						fix_visibility();
					}
					notify(res, true);
				}
			);	
		};	

	var toDelete = ""
	var toAdmin = ""
	var	toMod = ""

	edit_members_table_del=
		function(params){
			$('.checkbox').each(function() {
			if (this.checked==true)
				toDelete= toDelete + (this.id) + ",";
			});
			params.toAdmin = toAdmin
			params.toMod = toMod
			params.toDelete = toDelete
			$.post('/edit_members', params,
					function(res){
						notify(res,true);
					}
				);
			};
	edit_members_table_makeADMIN =
		function(params){
			$('.checkbox').each(function() {
			if (this.checked==true)
				toAdmin= toAdmin + (this.id) + ",";
			});
			params.toAdmin = toAdmin
			params.toMod = toMod
			params.toDelete = toDelete
			$.post('/edit_members', params,
					function(res){
						notify(res,true);
					}
				);
			};
	edit_members_table_makeMOD =
		function(params){
			$('.checkbox').each(function() {
				if (this.checked==true)
					toMod = toMod + (this.id) + ",";
			});
			params.toAdmin = toAdmin
			params.toMod = toMod
			params.toDelete = toDelete
			$.post('/edit_members', params,
					function(res){
						notify(res,true);
					}
				);
			};

		
	bind_buttons();
	fix_visibility();
			
	function bind_buttons() {
		btn_edit_group_info.unbind("click");
		btn_edit_settings.unbind("click");
 		btn_activate_group.unbind("click");
 		btn_deactivate_group.unbind("click");
 		btn_subscribe_group.unbind("click");
 		btn_unsubscribe_group.unbind("click");
 		btn_add_members.unbind("click");
 		btn_delete_members.unbind("click");
 		btn_set_mod.unbind("click");
 		btn_set_admin.unbind("click");
 		
 		btn_edit_group_info.bind("click");
 		btn_edit_settings.bind("click");
 		btn_activate_group.bind("click");
 		btn_deactivate_group.bind("click");
 		btn_subscribe_group.bind("click");
 		btn_unsubscribe_group.bind("click");
 		btn_add_members.bind("click");
 		btn_delete_members.bind("click");
 		btn_set_mod.bind("click");
 		btn_set_admin.bind("click");
 		
		var params = {'group_name': group_name};

 		var act_group = bind(activate_group, params);
		var deact_group = bind(deactivate_group, params);
		var sub_group = bind(subscribe_group, params);
		var unsub_group = bind(unsubscribe_group, params);
		var delete_members = bind(edit_members_table_del, params);
		var make_admin = bind(edit_members_table_makeADMIN, params);
		var make_mod = bind(edit_members_table_makeMOD, params);
		
		btn_activate_group.click(act_group);
		btn_deactivate_group.click(deact_group);
		btn_subscribe_group.click(sub_group);
		btn_unsubscribe_group.click(unsub_group);
		btn_delete_members.click(delete_members);
		btn_set_mod.click(make_mod);
		btn_set_admin.click(make_admin);

		btn_add_members.click(function() {
			window.location = '/groups/' + group_name + '/add_members';
		});
		
		btn_edit_settings.click(function() {
			window.location = '/groups/' + group_name + '/edit_my_settings';
		});

		btn_edit_group_info.click(function() {
			window.location = '/groups/' + group_name + '/edit_group_info';
		});
	}
	
		
	function fix_visibility() {
		if (admin) {
			if (group_active) {
				btn_deactivate_group.show();
				btn_activate_group.hide();
			} else {
				btn_deactivate_group.hide();
				btn_activate_group.show();
			}
			btn_add_members.show();
			btn_edit_group_info.show();
			btn_set_admin.show();
			btn_set_mod.show();
			btn_delete_members.show();
			
		} else {
			btn_add_members.hide();
			btn_deactivate_group.hide();
			btn_activate_group.hide();
			btn_set_mod.hide();
			btn_set_admin.hide();
			btn_delete_members.hide();
		}
		
		if (member) {
			btn_unsubscribe_group.show();
			btn_subscribe_group.hide();
		} else {
			btn_unsubscribe_group.hide();
			btn_subscribe_group.show();
		}
	}
});


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
	
	
