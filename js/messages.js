//Get Messages
var FilterMessages="inbox";
function GetMUserMessages(filterm)
{
	    FilterMessages=filterm;
		//alert(FilterMessages);
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(QueryMUserMessages, errorCB);	
}
function QueryMUserMessages(tx)
{
	showModal();
	var query="";
	var UseraID=sessionStorage.userid;
	if(FilterMessages=="inbox")
	{
		query='SELECT * FROM MESSAGES WHERE UserIDTO="'+UseraID+'"' ;
		
	}
	else if (FilterMessages=="read")
	{
		query='SELECT * FROM MESSAGES WHERE UserIDTo="'+UseraID+'" AND Status="Read"';
		
	}
	else if (FilterMessages=="unread")
	{
		query='SELECT * FROM MESSAGES WHERE UserIDTo="'+UseraID+'" AND Status="Unread"';
	}
	else if (FilterMessages=="sent")
	{
		query='SELECT * FROM MESSAGES WHERE UserIDFrom="'+UseraID+'" AND Sync="yes"';
	}
	else if (FilterMessages=="draft")
	{
		query='SELECT * FROM MESSAGES WHERE UserIDFrom="'+UseraID+'" AND Sync="no" AND SentFT="no"';
	}
	//alert(query);
	tx.executeSql(query, [], QueryMMessagesSuccess, errorCB);
	
}

function QueryMMessagesSuccess(tx, results)
{ 

	var len = results.rows.length;
	//alert("Messages: "+len);
	 var tb = $('#MessagesBodyTable');
	 var tablehtml="";
	for (var i=0; i<len; i++){
	      var IDEmail=results.rows.item(i).ID;
		 tablehtml+='<tr data-name="'+results.rows.item(i).ID+'"><td>'+results.rows.item(i).Date+'</td><td>'+results.rows.item(i).UserIDFrom+'</td><td>'+results.rows.item(i).Title+'</td></tr>';
		  // var DteEmail=results.rows.item(i).Date;
		 // alert(IDEmail+"DAte: ");
	}
	 tb.empty().append(tablehtml);
	 $("#table-inboxmessages").table("refresh");
	 $("#table-inboxmessages").trigger('create');
	 hideModal();
}

//Automatic Refresh Messages


//Sync All Messages



//Send Message



//Send Offline Messages


//Delete Message


//Delete WebService

//Reset Filters


//Update Drafts

//Get Categories

//Get Users



