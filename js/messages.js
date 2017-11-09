var utolist_array = new Array();
var utolist_arrayNames = new Array();
var tofullname="";

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
var FilterMessages="inbox";
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
		query='SELECT * FROM MESSAGES WHERE Deleted="0" AND UserIDTO="'+UseraID+'"'+filterquery;
		$("#hmstring").html("Inbox");
		
	}
	else if (FilterMessages=="read")
	{
		query='SELECT * FROM MESSAGES WHERE Deleted="0" AND  UserIDTo="'+UseraID+'" AND Status="Read"'+filterquery;;
		$("#hmstring").html("Read");
		
	}
	else if (FilterMessages=="unread")
	{
		query='SELECT * FROM MESSAGES WHERE Deleted="0" AND  UserIDTo="'+UseraID+'" AND Status="Unread"'+filterquery;
		$("#hmstring").html("Unread");
	}
	else if (FilterMessages=="sent")
	{
		query='SELECT * FROM MESSAGES WHERE Deleted="0" AND  UserIDFrom="'+UseraID+'" AND Sync="yes"'+filterquery;
		$("#hmstring").html("Sent");
		type="1";
	}
	else if (FilterMessages=="drafts")
	{
		query='SELECT * FROM MESSAGES WHERE Deleted="0" AND  UserIDTo="'+UseraID+'" AND Sync="no" AND SentFT="no"'+filterquery;
		$("#hmstring").html("Drafts");
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
		//alert("entro");
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
	$("#IdMla").val(results.rows.item(0).ID);	
	$("#SubjectMla").html(results.rows.item(0).Title);	
	$("#SubjectH").val(results.rows.item(0).Title);
	$("#NameMla").html("&nbsp;&nbsp;From: "+results.rows.item(0).UserIDFromName);
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
	MarkAsRead();
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
	var query='UPDATE MESSAGES SET Status="Unread" WHERE ID="'+IDMessage+'"';
	tx.executeSql(query); 
	
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
	var query='UPDATE MESSAGES SET Status="Read" WHERE ID="'+IDMessage+'"';
	tx.executeSql(query); 
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
	var query='UPDATE MESSAGES SET Deleted="1" WHERE ID="'+IDMessage+'"';
	tx.executeSql(query); 
	$(':mobile-pagecontainer').pagecontainer('change', '#pageMessages', {
        				transition: 'flip',
        				changeHash: false,
        				reverse: true,
        				showLoadMsg: true
    					});

	
}

//Open Mondal
function OpenDeleteModal()
{
	$("#popupDeleteMessage").popup("open");
}

//fill message new
function GetSendMessage()
{
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
		oldmessage="\n\n\n";
		oldmessage+="-------Original Message------ "+"\n";
		oldmessage+="From: "+xFromName+"\n";
		oldmessage+="To: "+xToName+"\n";
		oldmessage+="Subject: "+xsubject+"\n";
		oldmessage+="Date: "+xdatem+"\n";
		oldmessage+=xmessage;
		$("#textarea-sendmessage").val(oldmessage);
		$("#inmessageSubject").val("FW: "+xsubject);
		
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
		utolist_array.push(iduser);
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
	 
	 for (var i=0; i<len; i++)
	 {
		 names=results.rows.item(i).LastName+', '+results.rows.item(i).FirstName;
		// alert(names);
		 ids=results.rows.item(i).Username;
		 utolist_array.forEach( function(valor, indice, array) {
			 if(valor==ids)
			 {
				// alert("igual");
				
				 TxtTo+=names+"; "
			 }
    		//console.log("En el índice " + indice + " hay este valor: " + valor);
		 });
	 }
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
	 for (var i=0; i<len; i++)
	 {
		 names=results.rows.item(i).LastName+', '+results.rows.item(i).FirstName;
		 ids=results.rows.item(i).Username;
		 $("#chklt"+ids).prop('checked', true).checkboxradio('refresh');
		 utolist_array.push(ids);
		 TxtTo+=names+"; "

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
			utolist_array.push(fromh);
			$("#chklt"+fromh).prop('checked', true).checkboxradio('refresh');
			$("#table-recipients").table("refresh");
			 $("#inmessageto").val(fromhname+";");
			var quantusersids= utolist_array.length;
	       $("#lblquanttousers").html(quantusersids+" selected");
		   $("#inmessageSubject").val("RE: "+Subject);
		
		}
		else
		{
			$("#chklt"+fromh).prop('checked', true).checkboxradio('refresh');
			//Emisor
			utolist_array.push(fromh);

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

}

//Send Message
function SendMessageLocal()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QuerySendMessageLocal(tx) }, errorCB);
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
	//var nowuser=GetUserFullName(UseraID);
	//alert(nowuser);
	utolist_array.forEach( function(valor, indice, array) {
			nowUserTolist+=valor+";"			
    		//console.log("En el índice " + indice + " hay este valor: " + valor);
		 });
	alert(nowUserTolist);
    var query="";
	var totoname="";
   		utolist_array.forEach( function(valor, indice, array) {
		UserIDTo=valor;
		totoname=utolist_arrayNames[indice];
		alert(totoname);
		idMessage=sessionStorage.userid+new Date().getTime() + Math.random();	
		query='INSERT INTO (ID,UserIDTo,UserIDFrom,Status,Date,Title,Category,Message,Priority,UserToList,UserIDToName,UserIDFromName,Sync) VALUES ("'+idMessage+'","'+UserIDTo+'","'+UserIDFrom+'","'+Mstatus+'","'+nowdate+'","'+nowtitle+'","'+nowcat+'","'+message+'","'+nowpriority+'","'+nowUserTolist+'","'+totoname+'","'+tofullname+'","no")'
		alert(query);			
    		//console.log("En el índice " + indice + " hay este valor: " + valor);
		 });	 
	 
	
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

//Automatic Refresh Messages


//Sync All Messages







//Send Offline Messages





//Delete WebService


//Update Drafts



