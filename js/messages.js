

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
		query='SELECT * FROM MESSAGES WHERE UserIDTO="'+UseraID+'"'+filterquery;
		$("#hmstring").html("inbox");
		
	}
	else if (FilterMessages=="read")
	{
		query='SELECT * FROM MESSAGES WHERE UserIDTo="'+UseraID+'" AND Status="Read"'+filterquery;;
		$("#hmstring").html("Read");
		
	}
	else if (FilterMessages=="unread")
	{
		query='SELECT * FROM MESSAGES WHERE UserIDTo="'+UseraID+'" AND Status="Unread"'+filterquery;
		$("#hmstring").html("Unread");
	}
	else if (FilterMessages=="sent")
	{
		query='SELECT * FROM MESSAGES WHERE UserIDFrom="'+UseraID+'" AND Sync="yes"'+filterquery;
		$("#hmstring").html("Sent");
		type="1";
	}
	else if (FilterMessages=="drafts")
	{
		query='SELECT * FROM MESSAGES WHERE UserIDTo="'+UseraID+'" AND Sync="no" AND SentFT="no"'+filterquery;
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
	$("#NameMla").html("From: "+results.rows.item(0).UserIDFromName);
	$("#UserMla").html(results.rows.item(0).UserIDFrom);
	$("#DateMla").html(ShowFormatDateTime(results.rows.item(0).Date));
	$("#CateMla").html("Category: "+results.rows.item(0).Category);
	$("#PrioMla").html("Priority: "+results.rows.item(0).Priority);
	$("#textarea-readmessage").val(results.rows.item(0).Message);
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
	$(':mobile-pagecontainer').pagecontainer('change', '#pageSendM', {
        				transition: 'flip',
        				changeHash: false,
        				reverse: true,
        				showLoadMsg: true
    					});
}

//Automatic Refresh Messages


//Sync All Messages



//Send Message



//Send Offline Messages


//Delete Message


//Delete WebService


//Update Drafts



