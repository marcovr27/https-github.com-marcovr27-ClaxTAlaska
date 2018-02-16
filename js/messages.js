var utolist_array = new Array();
var utolist_arrayNames = new Array();
var tofullname="";
var replytofullname="";
var draftmessage="0";
var readto="0";
var DarftID="0";
var Toback="";
var IsSyncMessages=false;
var IntervalMessagesP="";


//Fill Filters

function FillUsersTF()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryFillUsersTF, errorCB);
	
}

function QueryFillUsersTF(tx)
{
	tx.executeSql("SELECT USERS.FirstName, USERS.LastName, Users.Username FROM USERS ORDER BY LastName,FirstName", [], FillUsersTFSuccess, errorCB);
	//SELECT USERS.FirstName, USERS.LastName, Users.Username FROM USERS
}
function FillUsersTFSuccess(tx,results)
{
	
	 var len = results.rows.length;
	 //alert("totalusers="+len);
	 var selecthtml='<option value="0">[ALL]</option>';
	 var namze="";
	 for (var i=0; i<len; i++){
		     namze=results.rows.item(i).LastName+", "+results.rows.item(i).FirstName;
			 selecthtml+='<option value="'+results.rows.item(i).Username +'">'+namze+'</option>';
             }
			 $("#select_mfrom").html(selecthtml);
			 $("#select_mto").html(selecthtml);
			 $('#select_mfrom').selectmenu('refresh');
		   $('#select_mfrom').selectmenu('refresh', true);
			$('#select_mto').selectmenu('refresh');
		   $('#select_mto').selectmenu('refresh', true);
	
}

function FillCategoryF()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryCategoryF, errorCB);
}

function QueryCategoryF(tx)
{
	tx.executeSql("SELECT * FROM CATEGORIES", [], FillCategoryFSuccess, errorCB);
}

function FillCategoryFSuccess(tx,results)
{
	 var len = results.rows.length;
	 var selecthtml='<option value="0">[ALL]</option><option value="General">General</option>';
	 var sselecthtml='<option value="General">General</option>';
	 for (var i=0; i<len; i++){
			 selecthtml+='<option value="'+results.rows.item(i).Name+'">'+results.rows.item(i).Name+'</option>';
			 sselecthtml+='<option value="'+results.rows.item(i).Name+'">'+results.rows.item(i).Name+'</option>';
             }
			 $("#select_mCategory").html(selecthtml);
			 $('#select_mCategory').selectmenu('refresh');
		   	 $('#select_mCategory').selectmenu('refresh', true);
			  $("#select_SendmCategory").html(sselecthtml);
			 $('#select_SendmCategory').selectmenu('refresh');
		   	 $('#select_SendmCategory').selectmenu('refresh', true);
	
}
//Get Messages

function GetMUserMessages(filterm)
{
	   if(filterm!="")
	   {
         FilterMessages=filterm;
	   }

		//alert(FilterMessages);
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(QueryMUserMessages, errorCB);	
}
function QueryMUserMessages(tx)
{
	showModal();
	var query="";
	var type="0";
	var UseraID=sessionStorage.userid;
	//Filters
	var texto=$("#Smessagetext").val();
	var fromuser=$("#select_mfrom").val();
	var touser=$("#select_mto").val();
	var mcategory=$("#select_mCategory").val();
	var mprioritys=$("#select_mPriors").val();
	var mdatefrom=$("#datesubmitM").val();
	var mdateto=$("#datesubmitMF").val();
	var filterquery="";
	if(texto!="")
	{
		filterquery=' AND Message LIKE "%'+texto+'%"';
	}
	if(fromuser!="0")
	{
		filterquery=' AND UserIDFrom="'+fromuser+'"';
	}
	if(touser!="0")
	{
		filterquery=' AND UserIDTo="'+touser+'"';
	}
	if(mcategory!="0")
	{//Category
		filterquery=' AND Category="'+mcategory+'"';
	}
	if(mprioritys!="0")
	{//Priority
		filterquery=' AND Priority="'+mprioritys+'"';
	}
	if(mdatefrom!="" && mdateto!="" )
	{
		filterquery=' AND Date BETWEEN "'+mdatefrom+'" AND "'+mdateto+'"';
	}
	
	// end Filters
	if(FilterMessages=="inbox" || FilterMessages=="")
	{
		draftmessage="0";
		readto="0";
		query='SELECT * FROM MESSAGES WHERE Deleted="0" AND UserIDTO="'+UseraID+'"'+filterquery+' ORDER BY Date DESC';
		$("#hmstring").html("Inbox");
		
	}
	else if (FilterMessages=="read")
	{
		draftmessage="0";
		readto="0";
		query='SELECT * FROM MESSAGES WHERE Deleted="0"  AND  UserIDTo="'+UseraID+'" AND Status="Read"'+filterquery+' ORDER BY Date DESC';
		$("#hmstring").html("Read");
		
	}
	else if (FilterMessages=="unread")
	{
		draftmessage="0";
		readto="0";
		query='SELECT * FROM MESSAGES WHERE Deleted="0" AND UserIDTo="'+UseraID+'" AND Status="Unread"'+filterquery+' ORDER BY Date DESC';
		$("#hmstring").html("Unread");
	}
	else if (FilterMessages=="sent")
	{
		draftmessage="0";
		readto="1";
		query='SELECT * FROM MESSAGES WHERE Deleted="0" AND UserIDFrom="'+UseraID+'" AND Sync="yes"'+filterquery+' ORDER BY Date DESC';
		//alert(query);
		$("#hmstring").html("Sent");
		type="1";
	}
	else if (FilterMessages=="drafts")
	{
		draftmessage="1";
		readto="0";
		query='SELECT * FROM MESSAGES WHERE Deleted="0"  AND Sync="nn" AND SentFT="yes"'+filterquery+' ORDER BY Date DESC';
		type="1";
		//query="SELECT * FROM MESSAGES";
		$("#hmstring").html("Drafts");
	}
	else if (FilterMessages=="needsync")
	{
		draftmessage="0";
		readto="1";
			query='SELECT * FROM MESSAGES WHERE Deleted="0"  AND SentFT="no" AND UserIDFrom="'+UseraID+'" AND Sync="no"'+filterquery+' ORDER BY Date DESC';
			type="1";
		//query="SELECT * FROM MESSAGES";
		$("#hmstring").html("Need Sync");
	}
	//alert(query);
	//tx.executeSql(query, [], QueryMMessagesSuccess, errorCB);
	tx.executeSql(query, [],function(tx,results){ QueryMMessagesSuccess(tx,results,type) }, errorCB);
	
}

function QueryMMessagesSuccess(tx, results,type)
{ 
//alert(type);
	if(type=="0")
{	
$("#htableMTo").html("From &nbsp;");
}
else
{
$("#htableMTo").html("To &nbsp;");
}

	var len = results.rows.length;
	//alert("Messages: "+len);
	 var tb = $('#MessagesBodyTable');
	 var tablehtml="";
	for (var i=0; i<len; i++){
	      var IDEmail=results.rows.item(i).ID;
          	if(type=="0")
{
	if(results.rows.item(i).Status=="Read")
	{
		 tablehtml+='<tr data-name="'+results.rows.item(i).ID+'"><td>'+ShowFormatDateTime(results.rows.item(i).Date)+'</td><td>'+results.rows.item(i).UserIDFromName+'</td><td>'+results.rows.item(i).Title+'</td></tr>';		
	}
	else
	{
		 tablehtml+='<tr data-name="'+results.rows.item(i).ID+'"><td><strong>'+ShowFormatDateTime(results.rows.item(i).Date)+'</strong></td><td><strong>'+results.rows.item(i).UserIDFromName+'</strong></td><td><strong>'+results.rows.item(i).Title+'</strong></td></tr>';
	}
		
}
else
{
	tablehtml+='<tr data-name="'+results.rows.item(i).ID+'"><td>'+ShowFormatDateTime(results.rows.item(i).Date)+'</td><td>'+results.rows.item(i).UserIDToName+'</td><td>'+results.rows.item(i).Title+'</td></tr>';
	
}

	}
	 tb.empty().append(tablehtml);
	 $("#table-inboxmessages").table("refresh");
	 $("#table-inboxmessages").trigger('create');
	 hideModal();
}

function OpenMessage(Type)
{
	//alert("Open Message="+Type);
	$("#TypeMail").val(Type);
	var IDRow=$("#IdMessageop").val();
	//alert(IDRow);
	if(Type=="0")
	{
		  //$(':mobile-pagecontainer').pagecontainer('change', '#pageMenu', {
        			//	transition: 'flip',
        			//	changeHash: false,
        			//	reverse: true,
        			//	showLoadMsg: true
    				//	});


		
	}
	else if(Type=="1")
	{
		if(draftmessage=="0")
		{
					if(IDRow!="0")
		{
					  $(':mobile-pagecontainer').pagecontainer('change', '#pageRead', {
        				transition: 'flip',
        				changeHash: false,
        				reverse: true,
        				showLoadMsg: true
    					});

			
		}
		else
		{
			//alert("no acepto");
			navigator.notification.alert("Please Select a Message", null, 'FieldTracker', 'Accept');
		}
			
		}
		else
		{
		if(IDRow!="0")
		{
				
               
			   DraftToHidden();
			
		}
		else
		{
			//alert("no acepto");
			navigator.notification.alert("Please Select a Message", null, 'FieldTracker', 'Accept');
		}
			
		}
		//alert("entro");


		
	}
}

//Fill Read Message
function FillMessageRead()
{
	//alert("filling");
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryFillMessageRead, errorCB);
	
}

function QueryFillMessageRead(tx)
{
	//alert("aaaa");
	var IDRow=$("#IdMessageop").val();
	tx.executeSql("SELECT * FROM MESSAGES WHERE ID='"+IDRow+"'", [], FillMessageFSuccess, errorCB);
}

function FillMessageFSuccess(tx,results)
{
	var len = results.rows.length;
	//alert(len+"entro");
	if(len>0)
	{
	//var collapsible = '<h4 id="NameMla">'+results.rows.item(0).UserIDFromName+'</h4><p id="UserMla">'+results.rows.item(0).UserIDFrom+'</p><p id="DateMla">'+ShowFormatDateTime(results.rows.item(0).Date)+'</p><div class="ui-grid-c"><div class="ui-block-a"><label id="CateMla">Category: '+results.rows.item(0).Category+'</label></div><div class="ui-block-b"><label id="PrioMla">Priority: '+results.rows.item(0).Priority+'</label></div><div class="ui-block-c"></div><div class="ui-block-d"></div></div>';
   // $("[data-role=content]").append($("#readcl").collapsible());
    DarftID="0";
	//alert("readto="+readto);
	$("#IdMla").val(results.rows.item(0).ID);	
	$("#SubjectMla").html(results.rows.item(0).Title);	
	$("#SubjectH").val(results.rows.item(0).Title);
	if(readto=="0")
	{
	  $("#NameMla").html("&nbsp;&nbsp;From: "+results.rows.item(0).UserIDFromName);
	}
	else
	{
	  $("#NameMla").html("&nbsp;&nbsp;To: "+results.rows.item(0).UserIDToName);
	}
	$("#FromHName").val(results.rows.item(0).UserIDFromName);
	$("#FromH").val(results.rows.item(0).UserIDFrom);
	$("#TolistH").val(results.rows.item(0).UserToList);
	$("#ToHName").val(results.rows.item(0).UserIDToName);
	//$("#UserMla").html(results.rows.item(0).UserIDFrom);
	$("#DateMla").html(ShowFormatDateTime(results.rows.item(0).Date));
	$("#DateH").val(ShowFormatDateTime(results.rows.item(0).Date));
	$("#CateMla").html("Category: "+results.rows.item(0).Category);
	$("#CategoryH").val(results.rows.item(0).Category);
	$("#PrioMla").html("Priority: "+results.rows.item(0).Priority);
	$("#PriorityH").val(results.rows.item(0).Priority);
	$("#textarea-readmessage").val(results.rows.item(0).Message);
	$("#MessageH").val(results.rows.item(0).Message);
	if(results.rows.item(0).Status=="Unread")
	{
	  MarkAsRead();
		
	}
	$('#readcl').attr('data-theme', 'c');
	
	//$('[data-role=collapsible-set]').collapsibleset().trigger('create');
		
	}
	else
	{
		navigator.notification.alert("Message not found", null, 'FieldTracker', 'Accept');
		
	}
	
}

//Open Send Message
function OpenSendMessage(Type)
{
	//alert("Open PageSEnd ="+Type);
	$("#typenew").val(Type);
    $(':mobile-pagecontainer').pagecontainer('change', '#pageSMessage', {
        				transition: 'flip',
        				changeHash: false,
        				reverse: true,
        				showLoadMsg: true
    					});
		

	

}
// Mark as unread
function MarkAsUnread()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QueryMarkAsUnread(tx) }, errorCB);
	
}

function QueryMarkAsUnread(tx)
{
	var IDMessage=$("#IdMla").val();
	if(readto=="0")
	{
		var query='UPDATE MESSAGES SET Status="Unread", Sync="no" WHERE ID="'+IDMessage+'"';
	    tx.executeSql(query); 
		StartSyncSendMessage();
		
	}
	
	
}

// Mark as unread
function MarkAsRead()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QueryMarkAsRead(tx) }, errorCB);
	
}

function QueryMarkAsRead(tx)
{
	var IDMessage=$("#IdMla").val();
	if(readto=="0")
	{
	var query='UPDATE MESSAGES SET Status="Read",Sync="no" WHERE ID="'+IDMessage+'"';
	tx.executeSql(query); 
	StartSyncSendMessage();
	}
	//SilenceStartSync();
}
	



//Delete Message
function DeleteMessageLocal()
{
	
	var IDMessage=$("#IdMla").val();
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryDeleteMessageLocal, errorCB);
	
}

function QueryDeleteMessageLocal(tx)
{
	var IDMessage=$("#IdMla").val();
	if(readto=="0")
	{
			var query='UPDATE MESSAGES SET Deleted="1", Sync="no" WHERE ID="'+IDMessage+'"';
	tx.executeSql(query); 
	StartSyncSendMessage();
	$(':mobile-pagecontainer').pagecontainer('change', '#pageMessages', {
        				transition: 'flip',
        				changeHash: false,
        				reverse: true,
        				showLoadMsg: true
    					});

	}
	else
	{
			var query='DELETE FROM MESSAGES WHERE ID="'+IDMessage+'"';
	tx.executeSql(query); 
	//SilenceStartSync();
	$(':mobile-pagecontainer').pagecontainer('change', '#pageMessages', {
        				transition: 'flip',
        				changeHash: false,
        				reverse: true,
        				showLoadMsg: true
    					});
		
	}


	
}

//Open Mondal
function OpenDeleteModal()
{
	$("#popupDeleteMessage").popup("open");
}

//fill message new
function GetSendMessage()
{
	$('#table-recipients').find('input[type="checkbox"]:checked').each(function () {
	$(this).prop('checked', false).checkboxradio('refresh');
	});
		var xType=$("#typenew").val();
	//alert("Tipo "+xType);
	var oldmessage="";
	var xtolist=$("#TolistH").val();
	var xmessage=$("#MessageH").val();
	var xsubject=$("#SubjectH").val();
	var xdatem=$("#DateH").val();
    var xfromm=$("#FromH").val();
	var xcategory=$("#CategoryH").val();
	var xpriority=$("#PriorityH").val();
	var xToName=$("#ToHName").val();
	var xFromName=$("#FromHName").val();
	

	if(xType=="1")
	{
		DarftID="0"
		oldmessage="\n\n\n";
		oldmessage+="-------Original Message------ "+"\n";
		oldmessage+="From: "+xFromName+"\n";
		oldmessage+="To: "+xToName+"\n";
		oldmessage+="Subject: "+xsubject+"\n";
		oldmessage+="Date: "+xdatem+"\n";
		oldmessage+=xmessage;
		$("#textarea-sendmessage").val(oldmessage);
		FillUserTolist("0");
		
	}
	else if(xType=="2")
	{
		DarftID="0"
		oldmessage="\n\n\n";
		oldmessage+="-------Original Message------ "+"\n";
		oldmessage+="From: "+xFromName+"\n";
		oldmessage+="To: "+xToName+"\n";
		oldmessage+="Subject: "+xsubject+"\n";
		oldmessage+="Date: "+xdatem+"\n";
		oldmessage+=xmessage;
		$("#textarea-sendmessage").val(oldmessage);
		FillUserTolist("1");
		
	}
	else if(xType=="3")
	{
		DarftID="0"
		oldmessage="\n\n\n";
		oldmessage+="-------Original Message------ "+"\n";
		oldmessage+="From: "+xFromName+"\n";
		oldmessage+="To: "+xToName+"\n";
		oldmessage+="Subject: "+xsubject+"\n";
		oldmessage+="Date: "+xdatem+"\n";
		oldmessage+=xmessage;
		$("#textarea-sendmessage").val(oldmessage);
		$("#inmessageSubject").val("FW: "+xsubject);
		utolist_arrayNames = new Array();
		$("#inmessageto").val("");	
		utolist_array = new Array();
		$("#lblquanttousers").html("0 selected");
		
	}
	else if(xType=="4")
	{

		oldmessage+=xmessage;
		$("#textarea-sendmessage").val(oldmessage);
		FillUserTolist("1");
		
	}
	else if(xType=="5")
	{
		FillUserTolist("1");

	}

	
}

function OpenToModal()
{
	$("#popupToUser").popup("open");
}

//Fill Recipients
function fillrecipients()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Queryfillrecipients, errorCB);
	
}

function Queryfillrecipients(tx)
{
	tx.executeSql("SELECT USERS.FirstName, USERS.LastName, Users.Username FROM USERS ORDER BY LastName,FirstName", [], fillrecipientsSuccess, errorCB);
	//SELECT USERS.FirstName, USERS.LastName, Users.Username FROM USERS
}

function fillrecipientsSuccess(tx,results)
{
	 var len = results.rows.length;
	 var tb = $('#recipientsbody');
	 var tablehtml="";
	 for (var i=0; i<len; i++){
		    tablehtml+='<tr><td><label id="lbl'+results.rows.item(i).Username+'" class="ui-icon-delete ui-shadow-icon" ><input type="checkbox" onchange='+"FillToList('"+results.rows.item(i).Username+"') "+'  name="chklt'+results.rows.item(i).Username+'" id="chklt'+results.rows.item(i).Username+'">'+results.rows.item(i).LastName+', &nbsp;'+results.rows.item(i).FirstName+'</label></td></tr>';
	  }
	 tb.empty().append(tablehtml);
	 $("#table-recipients").table("refresh");
	 $("#table-recipients").trigger('create');
	 GetSendMessage();
	
}

function FillToList(iduser)
{
	//utolist_array = new Array();
	var jointolist=$("#chklt"+iduser).is(':checked') ;
	var sabra=$("#chklt"+iduser).text();
	//alert(sabra); 
 // var nameofsel=document.getElementById("#chklt"+iduser).innerHTML;
	//alert(iduser+ "status="+jointolist+" name"+nameofsel);
	if(jointolist)
	{
		//alert("add");
		if(iduser!="")
		{
		 utolist_array.push(iduser);
		}

	}
	else
	{
		//alert("remove");
		// Find and remove item from an array
		var i = utolist_array.indexOf(iduser);
		if(i != -1) {
		utolist_array.splice(i, 1);
		}
		
	}
	 var quantusersids= utolist_array.length;
	 $("#lblquanttousers").html(quantusersids+" selected");
	GetNamesListTo();
}

function GetNamesListTo()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryGetNamesListTo, errorCB);
}

function QueryGetNamesListTo(tx)
{
  tx.executeSql("SELECT USERS.FirstName, USERS.LastName, Users.Username FROM USERS ORDER BY LastName,FirstName", [], QueryGetNamesListToSuccess, errorCB);
}

function QueryGetNamesListToSuccess(tx,results)
{
	//alert("voy por nombres");
	 var len = results.rows.length;
	 var names="";
	 var ids="";
	 var TxtTo="";
	 utolist_arrayNames = new Array();
	 
	
	
		 utolist_array.forEach( function(valor, indice, array) {
		
			  for (var i=0; i<len; i++)
	 			{
						 	 names=results.rows.item(i).LastName+', '+results.rows.item(i).FirstName;
		 						ids=results.rows.item(i).Username;
							 if(valor==ids)
			 				{
				// alert("igual");
				            utolist_arrayNames.push(names);
				 			TxtTo+=names+"; "
			 				}
					
	 			}
	
    		//console.log("En el índice " + indice + " hay este valor: " + valor);
		 });
	 
	 //alert(TxtTo);
	 $("#inmessageto").val(TxtTo);	
}

function CheckAllusers()
{

	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryCheckAllusers, errorCB);
}

function QueryCheckAllusers(tx)
{
	tx.executeSql("SELECT USERS.FirstName, USERS.LastName, Users.Username FROM USERS ORDER BY LastName,FirstName", [], QueryCheckAllusersSuccess, errorCB);
}

function QueryCheckAllusersSuccess(tx,results)
{
	 var len = results.rows.length;
	 var names="";
	 var ids="";
	 var TxtTo="";
	 utolist_array = new Array();
	 utolist_arrayNames = new Array();
	 for (var i=0; i<len; i++)
	 {
		 names=results.rows.item(i).LastName+', '+results.rows.item(i).FirstName;
		 ids=results.rows.item(i).Username;
		 $("#chklt"+ids).prop('checked', true).checkboxradio('refresh');
		 if(ids!="")
		 {
			  utolist_array.push(ids);
		 utolist_arrayNames.push(names);
		 TxtTo+=names+"; "
			 
		 }
		

	 }
	 //alert(TxtTo);
	 var quantusersids= utolist_array.length;
	 $("#lblquanttousers").html(quantusersids+" selected");
	 $("#inmessageto").val(TxtTo);
	
}

function UncheckAllusers()
{
	//alert("uncheck");
	
	$('#table-recipients').find('input[type="checkbox"]:checked').each(function () {
	$(this).prop('checked', false).checkboxradio('refresh');
	});
	$("#inmessageto").val("");
	utolist_array = new Array();
	 utolist_arrayNames = new Array();
	 var quantusersids= utolist_array.length;
	 $("#lblquanttousers").html(quantusersids+" selected");
	 //$('#table-recipients').find('input:checkbox').prop('checked', false);
	 $("#table-recipients").table("refresh");
}

function FillUserTolist(option)
{
	//alert("entertousertolistfilloption"+option);
	var usersList=$("#TolistH").val();
	var fromh=$("#FromH").val();
	var fromhname=$("#FromHName").val();
	//var toh=$("#FromH").val();
	var UseraID=sessionStorage.userid;
	var Subject=$("#SubjectH").val();
	if(usersList.length>0)
	{
		//alert("entro");
	 var res = usersList.split(";");
	   //alert(res.length);
		if(option=="0")
		{
			//solo emisor
			//alert(fromh);
			//alert(readto+" readto");
				if(readto=="0")
			{
			utolist_array.push(fromh);
			 $("#inmessageto").val(fromhname+";");
			 utolist_arrayNames.push(fromhname);
			var quantusersids= utolist_array.length;
		   $("#lblquanttousers").html(quantusersids+" selected");
		   if(Subject!="0")
		   {
			$("#inmessageSubject").val("RE: "+Subject);

		   }
		   
		   //GetReplyUserFullName(fromh);
		   $("#chklt"+fromh).prop('checked', true).checkboxradio('refresh');
			$("#table-recipients").table("refresh");
			}
			else
			{
				for (var i=0; i<res.length; i++)
	 		{
				//alert(res[i]);
				if(UseraID!=res[i])
				{
								//otros
					utolist_array.push(res[i]);
					$("#chklt"+res[i]).prop('checked',true).checkboxradio('refresh');
					$("#table-recipients").table("refresh");
				}
				
			}
			var quantusersids= utolist_array.length;
	        $("#lblquanttousers").html(quantusersids+" selected");
			 $("#inmessageSubject").val("RE: "+Subject);
			GetNamesListTo();
				
			}
		 
		
		}
		else
		{
			
				if(readto=="0")
			{
			$("#chklt"+fromh).prop('checked', true).checkboxradio('refresh');
			//Emisor
			if(fromh!="")
			{
				utolist_array.push(fromh);	
				
			}
			 	
			}
			
			for (var i=0; i<res.length; i++)
	 		{
				//alert(res[i]);
				if(UseraID!=res[i])
				{
						
					if(res[i]!="")
					{
							utolist_array.push(res[i]);
					$("#chklt"+res[i]).prop('checked',true).checkboxradio('refresh');
					$("#table-recipients").table("refresh");
						
					}//otros
				
				}
				
			}
			var quantusersids= utolist_array.length;
	        $("#lblquanttousers").html(quantusersids+" selected");
			var xtipo=$("#typenew").val();
			if(xtipo=="4")
			{
							 $("#inmessageSubject").val(Subject);
							 GetNamesListTo();
				
			}
			else
			{
				if(Subject!="0")
				{
				 $("#inmessageSubject").val("RE: "+Subject);
				}
				  GetNamesListTo();
			}

		
		}
		
	}

}

//Send Message
function SendMessageLocal()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QuerySendMessageLocal(tx) }, errorCBSEND);
}

function QuerySendMessageLocal(tx)
{
	var UseraID=sessionStorage.userid;
	var dt = new Date();
	var idMessage=sessionStorage.userid+new Date().getTime() + Math.random();
	var UserIDTo="";
	var UserIDFrom=UseraID;
	var Mstatus="Unread";
	var nowdate=dt.toYMDhrs();
	var nowtitle=$("#inmessageSubject").val();
	var nowcat=$("#select_SendmCategory").val();;
	var nowpriority=$("#select_SendmPriors").val();;
	var message=$("#textarea-sendmessage").val();
	var nowUserTolist="";
	
	if(nowtitle=="")
	{
		nowtitle="(No subject)";
	}
	//var nowuser=GetUserFullName(UseraID);
	//alert(nowuser);
	if(utolist_array.length>0)
	{
		utolist_array.forEach( function(valor, indice, array) {
			nowUserTolist+=valor+";"			
    		//console.log("En el índice " + indice + " hay este valor: " + valor);
		 });
	//alert(nowUserTolist);
    var query="";
	var totoname="";
   		utolist_array.forEach( function(valor, indice, array) {
		UserIDTo=valor;
		totoname=utolist_arrayNames[indice];
		//Delete if exists Draft
		
		tx.executeSql('DELETE FROM MESSAGES WHERE ID="'+DarftID+'"');
		//alert(totoname);
		idMessage=sessionStorage.userid+new Date().getTime() + Math.random();
			
		query='INSERT INTO MESSAGES (ID,UserIDTo,UserIDFrom,Status,Date,Title,Category,Message,Priority,UserToList,UserIDToName,UserIDFromName,Sync,SentFT,Deleted) VALUES ("'+idMessage+'","'+UserIDTo+'","'+UserIDFrom+'","'+Mstatus+'","'+nowdate+'","'+nowtitle+'","'+nowcat+'","'+escapeDoubleQuotes(message)+'","'+nowpriority+'","'+nowUserTolist+'","'+totoname+'","'+tofullname+'","no","no","0")';
		//alert(query);
		if(UserIDTo!=sessionStorage.userid)
		{
			tx.executeSql(query);
		}
			
    		//console.log("En el índice " + indice + " hay este valor: " + valor);
		 });	 
		  navigator.notification.confirm(
    					'Saved',      // mensaje (message)
    						onsuccessendlocal,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   							 'FieldTracker',            // titulo (title)
        				'Accept'          // botones (buttonLabels)
        				);
		
		
	}
	else
	{
		navigator.notification.alert("Please select one or more recipients", null, 'FieldTracker', 'Accept');
	}
	
	 
	
}

function onsuccessendlocal(button)
{
	   StartSyncSendMessage();
	
	   $(':mobile-pagecontainer').pagecontainer('change', '#pageMessages', {
        transition: 'pop',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	
}
function errorCBSEND(err) {
    alert("Error processing SQL: "+err.code);
}

//GetNames
function GetUserFullName(Idusera)
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	db.transaction(function(tx){ QueryGetUserFullName(tx,Idusera) }, errorCB);
}

function QueryGetUserFullName(tx,Idusera)
{
	var query="SELECT * FROM USERS WHERE Username='"+Idusera+"'";
	tx.executeSql(query, [], QueryGetUserFullNameSuccess, errorCB);
}

function QueryGetUserFullNameSuccess(tx,results)
{
	var len = results.rows.length;
	var fullnames="";
	for (var i=0; i<len; i++)
	{
		fullnames=results.rows.item(i).LastName+", "+results.rows.item(i).FirstName;
	}
            tofullname=fullnames;
}


function GetReplyUserFullName(Idusera)
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	db.transaction(function(tx){ QueryGetReplyUserFullName(tx,Idusera) }, errorCB);
}

function QueryGetReplyUserFullName(tx,Idusera)
{
	var query="SELECT * FROM USERS WHERE Username='"+Idusera+"'";
	tx.executeSql(query, [], QueryGetReplyUserFullNameSuccess, errorCB);
}

function QueryGetReplyUserFullNameSuccess(tx,results)
{
	var len = results.rows.length;
	var fullnames="";
	for (var i=0; i<len; i++)
	{
		fullnames=results.rows.item(i).LastName+", "+results.rows.item(i).FirstName;
	}
            replytofullname=fullnames;
			utolist_arrayNames.push(fullnames);
}

function SaveDraft()
{
	//alert("savedarft");
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QuerySaveDraft(tx) }, errorCBSEND);
}

function QuerySaveDraft(tx)
{
		var UseraID=sessionStorage.userid;
	var dt = new Date();
	var idMessage=sessionStorage.userid+new Date().getTime() + Math.random();
	var UserIDTo="";
	var UserIDFrom=UseraID;
	var Mstatus="Unread";
	var nowdate=dt.toYMDhrs();
	var nowtitle=$("#inmessageSubject").val();
	var nowcat=$("#select_SendmCategory").val();;
	var nowpriority=$("#select_SendmPriors").val();;
	var message=$("#textarea-sendmessage").val();
	var nowUserTolist="";
	
	//var nowuser=GetUserFullName(UseraID);
	//alert(nowuser);
	if(utolist_array.length>0)
	{
		utolist_array.forEach( function(valor, indice, array) {
			nowUserTolist+=valor+";"			
    		//console.log("En el índice " + indice + " hay este valor: " + valor);
		 });
	//alert(nowUserTolist);
    var query="";
	var totoname="";
   		utolist_array.forEach( function(valor, indice, array) {
		UserIDTo=valor;
		totoname=utolist_arrayNames[indice];
		//alert(totoname);
		idMessage=sessionStorage.userid+new Date().getTime() + Math.random();	
		query='INSERT INTO MESSAGES (ID,UserIDTo,UserIDFrom,Status,Date,Title,Category,Message,Priority,UserToList,UserIDToName,UserIDFromName,Sync,SentFT,Deleted) VALUES ("'+idMessage+'","'+UserIDTo+'","'+UserIDFrom+'","'+Mstatus+'","'+nowdate+'","'+nowtitle+'","'+nowcat+'","'+escapeDoubleQuotes(message)+'","'+nowpriority+'","'+nowUserTolist+'","'+totoname+'","'+tofullname+'","nn","yes","0")';
		//alert(query);
		tx.executeSql(query);		
    		//console.log("En el índice " + indice + " hay este valor: " + valor);
		 });	 
	 $(':mobile-pagecontainer').pagecontainer('change', '#pageMessages', {
        				transition: 'flip',
        				changeHash: false,
        				reverse: true,
        				showLoadMsg: true
    					});
		
	}
	else
	{
		 $(':mobile-pagecontainer').pagecontainer('change', '#pageMessages', {
        				transition: 'flip',
        				changeHash: false,
        				reverse: true,
        				showLoadMsg: true
    					});
	}

	
}

function DraftToHidden()
{
	//alert("openDraft");
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryDraftToHidden, errorCB);
}

function QueryDraftToHidden(tx)
{
	var IDRow=$("#IdMessageop").val();
	tx.executeSql("SELECT * FROM MESSAGES WHERE ID='"+IDRow+"'", [],QueryDraftToHiddenSuccess, errorCB);
	
}

function QueryDraftToHiddenSuccess(tx,results)
{
	var len = results.rows.length;
	//alert(len+"entro");
	if(len>0)
	{
	$("#IdMla").val(results.rows.item(0).ID);	
	DarftID=results.rows.item(0).ID;
	$("#SubjectMla").html(results.rows.item(0).Title);	
	$("#SubjectH").val(results.rows.item(0).Title);
	$("#NameMla").html("&nbsp;&nbsp;To: "+results.rows.item(0).UserIDToName);
	$("#FromHName").val(results.rows.item(0).UserIDFromName);
	$("#FromH").val(results.rows.item(0).UserIDFrom);
	$("#TolistH").val(results.rows.item(0).UserToList);
	$("#ToHName").val(results.rows.item(0).UserIDToName);
	$("#DateMla").html(ShowFormatDateTime(results.rows.item(0).Date));
	$("#DateH").val(ShowFormatDateTime(results.rows.item(0).Date));
	$("#CateMla").html("Category: "+results.rows.item(0).Category);
	$("#CategoryH").val(results.rows.item(0).Category);
	$("#PrioMla").html("Priority: "+results.rows.item(0).Priority);
	$("#PriorityH").val(results.rows.item(0).Priority);
	$("#textarea-readmessage").val(results.rows.item(0).Message);
	$("#MessageH").val(results.rows.item(0).Message);
	readto=1;
	OpenSendMessage("4");
	
	//$('[data-role=collapsible-set]').collapsibleset().trigger('create');
		
	}
	else
	{
		navigator.notification.alert("Message not found", null, 'FieldTracker', 'Accept');
		
	}
	
}

//Sync Messages Modal 

function StartSync()
{
var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
db.transaction(GetStartSync, errorCB);
}

function GetStartSync(tx)
{
	var querytosend="SELECT * FROM SETTINGS";
	tx.executeSql(querytosend, [], function(tx,results){ GetStartSyncSuccess(tx,results) }, errorCB);
	
}

function GetStartSyncSuccess(tx,results)
{
	var len = results.rows.length;
	if(len>0)
	{
		$("#ipsync").val(results.rows.item(0).IP);
		SyncModalMessages();
	}
	else
	{
		 $(':mobile-pagecontainer').pagecontainer('change', '#pageSettingsInit', {
        transition: 'flip',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		
	}
}

function SyncModalMessages()
{
	if(!IsSyncMessages)
	{
	IsSyncMessages=true;
	var ipserver=$("#ipsync").val();
	//alert("syncmodal");
	 showUpModal();
	 	$("#progressheader").html("Connecting...");
		$("#progressMessage").html("Waiting for server connection");
		pbar.setValue(0);
		sendmessages="";
		 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      	db.transaction(QuerytosendMessaModal, errorCB);
	}
}
function QuerytosendMessaModal(tx)
{
	var querytosend="SELECT * FROM MESSAGES WHERE Sync='no' AND SentFT='no'";
	tx.executeSql(querytosend, [], QuerytosendMessaModalSuccess, errorCB);
}

function QuerytosendMessaModalSuccess(tx,results)
{
	var len = results.rows.length;
	//alert("messages="+len);
	var array = [];
	//alert(len);
for (var i=0; i<results.rows.length; i++){
 row = results.rows.item(i);
 // alert(row.Title);
 array.push(JSON.stringify(row));



}
//alert(array);
sendmessages=array;
	$("#progressMessage").html("Messages ready to send");
	pbar.setValue(20);	
	SendMessageToServer();
}

function SendMessageToServer()
{
	//alert("syncmodalConectando a insertar");
		var ipserver=$("#ipsync").val();
		$("#progressheader").html("Uploading Data...");
		$("#progressMessage").html("Preparing data to send");
		pbar.setValue(30);
	var obj = {};
	 obj['Messages'] =JSON.stringify(sendmessages); 
	   $.ajax({
                    type: 'POST',
				    url: ipserver+'//SetMessages',
                    data: JSON.stringify(obj),
                    dataType: 'json',
					async:false,
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						pbar.setValue(100);
					//alert("insertar exito");
						DownloadMesagesModal();
           
                      
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
					IsSyncMessages=false;
                    $("#progressMessage").html("Error sending data:" +xmlHttpRequest.responseXML+" Status: "+textStatus+"==>"+xmlHttpRequest.statusText+" thrown: "+errorThrown);
                     setTimeout(function () { $(':mobile-pagecontainer').pagecontainer('change', '#pageMessages', {
        											transition: 'slidedown',
        											changeHash: false,
       												reverse: true,
       												showLoadMsg: true
    												}); }, 12000);
                    console.log(xmlHttpRequest.responseXML);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
                });
	
}

function DownloadMesagesModal()
{
	var ipserver=$("#ipsync").val();
	$("#progressheader").html("Connecting...");
		$("#progressMessage").html("Waiting for server connection");
		pbar.setValue(0);
		var obj = {};
		 if(!!sessionStorage.userid)
		 {
			 obj['UserID'] =sessionStorage.userid;
		 }
		 else
		 {
			 obj['UserID'] ="";
			 
		 }
	//alert("Conectar a descargar archivos");
	//progressheader
	$("#progressheader").html("Downloading data...");
		$("#progressMessage").html("Post To GetMessages");
		pbar.setValue(0);
		//alert("listo para el post: "+ipserver+'//GetStructureData');
	                $.ajax({
                    type: 'POST',
                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
				    url:ipserver+'//GetMessages',
					data: JSON.stringify(obj),
                    dataType: 'json',
					async:false,
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						//alert(response.d);
						//alert("WEb service works");
						//alert("Exito descargando archivos");
						InsertDatabaseMessaModal(response.d);
                        //alert(response.d.users);
                       // var obj = jQuery.parseJSON(response.d.users);
                       // $.each(obj, function (key, value) {
                         //   alert(value.Username);//inserts users
                        //});
                       // $('#lblData').html(JSON.stringify());
                    },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
				             IsSyncMessages=false;
							$("#progressheader").html("Can not connect to server");
							$("#progressMessage").html("Error sending data:" +xmlHttpRequest.responseXML+" Status: "+textStatus+"==>"+xmlHttpRequest.statusText+" thrown: "+errorThrown);
							 setTimeout(function () { $(':mobile-pagecontainer').pagecontainer('change', '#pageMessages', {
        											transition: 'slidedown',
        											changeHash: false,
       												reverse: true,
       												showLoadMsg: true
    												}); }, 12000);
                    console.log(xmlHttpRequest.responseXML);
                    console.log(textStatus);
                    console.log(errorThrown);
                   // alert("Error");
                }
                });
	
}

function InsertDatabaseMessaModal(newdatabase)
{
	$("#progressheader").html("Connected");
	$("#progressMessage").html("Successful connection");
	pbar.setValue(70);
	newmessagesdatatoinsert=newdatabase;
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoinsertMModal, errorCB);
}

function QuerytoinsertMModal(tx)
{
	$("#progressMessage").html("Deleting old records");
	$("#progressheader").html("Insert New data");
	var idusera=sessionStorage.userid;		
	if(!!sessionStorage.userid)
	{
		//alert("Deleting "+idusera);
		tx.executeSql("DELETE FROM MESSAGES WHERE UserIDTO='"+idusera+"' AND SentFT='no'");
		tx.executeSql("DELETE FROM MESSAGES WHERE UserIDFrom='"+idusera+"' AND SentFT='no'");
	}
	//ready to insert new records
	//alert("Insert new data MESSAGES");
	$("#progressMessage").html("Ready to insert new records");
	var query;
	var obj = jQuery.parseJSON(newmessagesdatatoinsert.Messages);
	//alert("Items "+obj.length);
	var itemcount=0;
	//alert("Insertar nuevos mensajes");
	 try
	 {
    $.each(obj, function (key, value) {
	//alert('INSERT INTO MESSAGES (ID,UserIDTo,UserIDFrom,Status,Date,Title,Category,Message,Priority,UserToList,Sync) VALUES ("'+escapeDoubleQuotes(value.ID)+'", "'+escapeDoubleQuotes(value.UserIDTo)+'", "'+escapeDoubleQuotes(value.UserIDFrom)+'", "'+escapeDoubleQuotes(value.Status)+'", "'+value.Date+'", "'+escapeDoubleQuotes(value.Title)+'", "'+escapeDoubleQuotes(value.Category)+'", "'+escapeDoubleQuotes(value.Message)+'", "'+escapeDoubleQuotes(value.Priority)+'", "'+escapeDoubleQuotes(value.UserToList)+'","yes")');
		query='INSERT INTO MESSAGES (ID,UserIDTo,UserIDFrom,Status,Date,Title,Category,Message,Priority,UserToList,UserIDToName,UserIDFromName,Sync,SentFT) VALUES ("'+escapeDoubleQuotes(value.ID)+'", "'+escapeDoubleQuotes(value.UserIDTo)+'", "'+escapeDoubleQuotes(value.UserIDFrom)+'", "'+escapeDoubleQuotes(value.Status)+'", "'+value.Date+'", "'+escapeDoubleQuotes(value.Title)+'", "'+escapeDoubleQuotes(value.Category)+'", "'+escapeDoubleQuotes(value.Message)+'", "'+escapeDoubleQuotes(value.Priority)+'", "'+escapeDoubleQuotes(value.UserToList)+'","'+escapeDoubleQuotes(value.UserIDToName)+'","'+escapeDoubleQuotes(value.UserIDFromName)+'","yes","no")';
		//alert(query);
		tx.executeSql(query);
		itemcount++;
     });
	// alert("Messages: "+itemcount);
	 
	 	$("#progressMessage").html("Messages updated");
	
	 }
	 catch(error)
	 {
		 alert(error);
		 $("#progressMessage").html("Error updating Messages "+error);
			pbar.setValue(30);
		 
	 }
	 
	
		 
	 $("#progressMessage").html("Messages updated");
		pbar.setValue(100);

	$("#progressMessage").html("");
		pbar.setValue(100);
		$("#progressheader").html("Sync completed");
		//updatelocaldatabaseMessages();
		finishMModal();

}

function finishMModal()
{
	//alert("termina sincronizacion");
	IsSyncMessages=false;
	pbar.setValue(100);
	setTimeout( function(){ 
	 	$(':mobile-pagecontainer').pagecontainer('change', '#pageMessages', {
 	 	transition: 'flip',
		changeHash: false,
		reverse: true,
		showLoadMsg: true
		});
	}, 3000 );
}
	

//SILENCE SYNC
function SilenceStartSync()
{
//alert("empieza silencio");	
var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
db.transaction(GetSilenceStartSync, errorCB);
}

function GetSilenceStartSync(tx)
{
	//alert("Query Settings");	
	var querytosend="SELECT * FROM SETTINGS";
	tx.executeSql(querytosend, [], function(tx,results){ GetSilenceStartSyncSuccess(tx,results) }, errorCB);
	
}

function GetSilenceStartSyncSuccess(tx,results)
{
	var len = results.rows.length;
	if(len>0)
	{
		$("#ipsync").val(results.rows.item(0).IP);
		//alert("ip obtenido");	
		SyncSilenceMessages();
	}
}

function SyncSilenceMessages()
{
	//alert("mensajes a enviar");
	var ipserver=$("#ipsync").val();
		sendmessages="";
		 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      	db.transaction(QuerytoSilenceMessages, errorCB);
}
function QuerytoSilenceMessages(tx)
{
	
	//alert(IsSyncMessages+" valor IsSyncMessages");
	if(!IsSyncMessages)
	{
		//alert("empieza silence sync");
		IsSyncMessages=true;
		//alert("ejecutar query revisando mensajes");
	var querytosend="SELECT * FROM MESSAGES WHERE Sync='no' AND SentFT='no'";
	tx.executeSql(querytosend, [], QuerytoSilenceMessagesSuccess, errorCB);
	}
	else
	{
		//alert("se cancela el silence sync");
	}
}

function QuerytoSilenceMessagesSuccess(tx,results)
{
	var len = results.rows.length;
	//alert("messages="+len);
	var array = [];
	//alert(len);
for (var i=0; i<results.rows.length; i++){
 row = results.rows.item(i);
 // alert(row.Title);
 array.push(JSON.stringify(row));



}
//alert(array);
sendmessages=array;
//alert("se guardan en el array");
SilenceMessageToServer();
}

function SilenceMessageToServer()
{
		var ipserver=$("#ipsync").val();
//alert("hacer post a obter mensajes");
	var obj = {};
	 obj['Messages'] =JSON.stringify(sendmessages); 
	   $.ajax({
                    type: 'POST',
				    url: ipserver+'//SetMessages',
                    data: JSON.stringify(obj),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
					async:false,
                    success: function (response) {
					    //alert("Exito insertando mensajes");
						//alert("funciono post");
						DownloadMesagesSilence();
           
                      
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
					//alert("no funciono post");
                    IsSyncMessages=false;
                    console.log(xmlHttpRequest.responseXML);
                    console.log(textStatus);
                    console.log(errorThrown);
					//alert(xmlHttpRequest.responseXML+" "+textStatus+" "+errorThrown);
                }
                });
	
}

function DownloadMesagesSilence()
{
	var ipserver=$("#ipsync").val();
		var obj = {};
		 if(!!sessionStorage.userid)
		 {
			 obj['UserID'] =sessionStorage.userid;
		 }
		 else
		 {
			 obj['UserID'] ="";
			 
		 }
		  //alert("conectar a obtener mensajes");
	                $.ajax({
                    type: 'POST',
                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
				    url:ipserver+'//GetMessages',
					data: JSON.stringify(obj),
                    dataType: 'json',
					async:false,
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						//alert(response.d);
						//alert("Exito obteniendo mensajes");
						//alert("WEb service works GET MESSAGES");
						InsertDatabaseMessaSil(response.d);
                        //alert(response.d.users);
                       // var obj = jQuery.parseJSON(response.d.users);
                       // $.each(obj, function (key, value) {
                         //   alert(value.Username);//inserts users
                        //});
                       // $('#lblData').html(JSON.stringify());
                    },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                     IsSyncMessages=false;
                    console.log(xmlHttpRequest.responseXML);
                    console.log(textStatus);
                    console.log(errorThrown);
                   // alert("Error");
                }
                });
	
}

function InsertDatabaseMessaSil(newdatabase)
{

	newmessagesdatatoinsert=newdatabase;
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoinsertMSil, errorCB);
	//alert("se insertaran nuevos mensajes");
}

function QuerytoinsertMSil(tx)
{

	var idusera=sessionStorage.userid;		
	if(!!sessionStorage.userid)
	{
		//alert("Deleting "+idusera);
		tx.executeSql("DELETE FROM MESSAGES WHERE UserIDTO='"+idusera+"' AND SentFT='no'");
		tx.executeSql("DELETE FROM MESSAGES WHERE UserIDFrom='"+idusera+"' AND SentFT='no'");
	}
	//alert("borrados antiguos mensajes");
	var query;
	var obj = jQuery.parseJSON(newmessagesdatatoinsert.Messages);
	//alert("Items "+obj.length);
	//alert("insertar nuevos mensajes");
	var itemcount=0;
	 try
	 {
    $.each(obj, function (key, value) {
	//alert('INSERT INTO MESSAGES (ID,UserIDTo,UserIDFrom,Status,Date,Title,Category,Message,Priority,UserToList,Sync) VALUES ("'+escapeDoubleQuotes(value.ID)+'", "'+escapeDoubleQuotes(value.UserIDTo)+'", "'+escapeDoubleQuotes(value.UserIDFrom)+'", "'+escapeDoubleQuotes(value.Status)+'", "'+value.Date+'", "'+escapeDoubleQuotes(value.Title)+'", "'+escapeDoubleQuotes(value.Category)+'", "'+escapeDoubleQuotes(value.Message)+'", "'+escapeDoubleQuotes(value.Priority)+'", "'+escapeDoubleQuotes(value.UserToList)+'","yes")');
		query='INSERT INTO MESSAGES (ID,UserIDTo,UserIDFrom,Status,Date,Title,Category,Message,Priority,UserToList,UserIDToName,UserIDFromName,Sync,SentFT) VALUES ("'+escapeDoubleQuotes(value.ID)+'", "'+escapeDoubleQuotes(value.UserIDTo)+'", "'+escapeDoubleQuotes(value.UserIDFrom)+'", "'+escapeDoubleQuotes(value.Status)+'", "'+value.Date+'", "'+escapeDoubleQuotes(value.Title)+'", "'+escapeDoubleQuotes(value.Category)+'", "'+escapeDoubleQuotes(value.Message)+'", "'+escapeDoubleQuotes(value.Priority)+'", "'+escapeDoubleQuotes(value.UserToList)+'","'+escapeDoubleQuotes(value.UserIDToName)+'","'+escapeDoubleQuotes(value.UserIDFromName)+'","yes","no")';
		//alert(query);
		tx.executeSql(query);
		itemcount++;
     });
     //alert("Se insertaron los nuevos");
	 }
	 catch(error)
	 {
		 //alert(error);
		 
	 }
	if(inPageMes==1)
	{
			 if(FilterMessages=="inbox")
	{
		GetMUserMessages("inbox");
	}
	else
	{
		GetMUserMessages(FilterMessages);
	}
		
	}

	//alert("mensajes sincronizados");
	 IsSyncMessages=false;
    //updatelocaldatabaseMessages();

}

function updatelocaldatabaseMessages()
{
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerytoupdatelocalMessages, errorCB);
}

function QuerytoupdatelocalMessages(tx)
{
	//alert("Actualizamos mensajes");
	tx.executeSql("UPDATE MESSAGES SET sync='yes' WHERE SentFT='0'");
	 IsSyncMessages=false;

}

function StartSyncSendMessage()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	db.transaction(GetStartSyncSendMessage, errorCB);
}

function GetStartSyncSendMessage(tx)
{
	var querytosend="SELECT * FROM SETTINGS";
	tx.executeSql(querytosend, [], function(tx,results){ GetStartSyncSendMessageSuccess(tx,results) }, errorCB);
	
}

function GetStartSyncSendMessageSuccess(tx,results)
{
	var len = results.rows.length;
	if(len>0)
	{
		$("#ipsync").val(results.rows.item(0).IP);
		StartSyncSendMessageExe();
	}
	
}

function StartSyncSendMessageExe()
{
	var ipserver=$("#ipsync").val();
	sendMessagealone="";
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerySendMessageExe, errorCB);
	
}

function QuerySendMessageExe(tx)
{
	//alert("enviar mensaje solo");
	if(!IsSyncMessages)
	{
		IsSyncMessages=true;
		var querytosend="SELECT * FROM MESSAGES WHERE Sync='no' AND SentFT='no'";
		tx.executeSql(querytosend, [], QuerySendMessageExeSuccess, errorCB);
	}
	
	
}

function QuerySendMessageExeSuccess(tx,results)
{
	var len = results.rows.length;
	var array = [];
	for (var i=0; i<results.rows.length; i++){
 	row = results.rows.item(i);
 	array.push(JSON.stringify(row));
	}	
sendMessagealone=array;
ExecutePostMessageAlone();
}

function ExecutePostMessageAlone()
{
	//alert("intento enviar mensaje");
	var ipserver=$("#ipsync").val();
	var obj = {};
	 obj['Messages'] =JSON.stringify(sendMessagealone); 
	 var xhr= $.ajax({
                    type: 'POST',
				    url: ipserver+'//SetMessages',
                    data: JSON.stringify(obj),
                    dataType: 'json',
					async:false,
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
					
						if(response.d=="success")
						{
							//alert("Mensaje enviado success");
							 	//alert("sincronizo")
								UpdateMessagesSend();
						}
					
					
           
                      
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
						//alert("Error al enviar mensaje");
						 IsSyncMessages=false;
                    console.log(xmlHttpRequest.responseXML);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
                });
		xhr.abort();
	
}

function UpdateMessagesSend()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QueryUpdateMessagesSend(tx) }, errorCB);	
}

function QueryUpdateMessagesSend(tx)
{
	//alert("Actualizo mensaje");
	var query='UPDATE MESSAGES SET Sync="yes" WHERE Deleted="0"  AND SentFT="no" AND Sync="no"';
	tx.executeSql(query); 
	var query='DELETE FROM MESSAGES WHERE Deleted="1"';
	tx.executeSql(query); 
	IsSyncMessages=false;
}

function SilenceupdateInbox()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	db.transaction(GetSilenceupdateInbox, errorCB);
}

function GetSilenceupdateInbox(tx)
{
	var querytosend="SELECT * FROM SETTINGS";
	tx.executeSql(querytosend, [], function(tx,results){ GetSilenceupdateInboxSuccess(tx,results) }, errorCB);
}

function GetSilenceupdateInboxSuccess(tx,results)
{
	
}

//CHECK NEW MESSAGES

function GetQuantNewMessages()
{
	//alert("principio mensajes");
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	db.transaction(QuantNewMessages, errorCB);
}

function QuantNewMessages(tx)
{
	//alert("Query Mensajes");
	var UseraID=sessionStorage.userid;
	var querytosend='SELECT * FROM MESSAGES WHERE Deleted="0" AND UserIDTo="'+UseraID+'" AND Status="Unread"';
	tx.executeSql(querytosend, [], function(tx,results){ QuantNewMessagesSuccess(tx,results) }, errorCB);
}

function QuantNewMessagesSuccess(tx,results)
{
	var len = results.rows.length;
	$("#UnreadH").val(len);
	//alert("Resultado Mensajes");
	//alert("messages "+len);
	if(len>0)
	{
		$("#mbtnmessages").html('<img src="img/messagesnew.png" height="36" width="36"/><br>Messages ('+len+')');
	}
	else
	{
		$("#mbtnmessages").html('<img src="img/messages.png" height="36" width="36"/><br>Messages');
	}
	//alert("Final mensajese3");
	
}