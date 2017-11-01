///////<<<<<<<<<<<<============================= LOGBOOK PAGE =========================================>>>>>>>>>>>///////
var taskSelectedlog="";
var hoursReqLog;
var personnelOJT="";
var LevelReqHRSRTI="";
var itemsonlevel=0;
function FillPersonnel()
{
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryPersonnel, errorCB);
	
}
function QueryPersonnel(tx)
{

	tx.executeSql("SELECT * FROM Users ORDER BY LastName,FirstName", [], QueryPersonneSuccess, errorCB);
}
function QueryPersonneSuccess(tx,results)
{
	var len = results.rows.length;
	var selecthtml='<option value="0">Choose a user</option>';
	for (var i=0; i<len; i++){
	      var nameuser=results.rows.item(i).Username;
		  var fname=results.rows.item(i).FirstName;
		  var lname=results.rows.item(i).LastName;
		  var fullname=lname+' '+fname;
		 selecthtml+='<option value="'+nameuser+'">'+fullname+'</option>';
	}
	$("#select_personnelworked").html(selecthtml);		
}

function filltaskworked()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Querytaskworked, errorCB);
	
}

function Querytaskworked(tx)
{
  tx.executeSql("SELECT * FROM DUTIES2TASKS ORDER BY Duty,OrdNum", [], QuerytaskworkedSuccess, errorCB);
}

function QuerytaskworkedSuccess(tx, results)
{
	var len = results.rows.length;
	//alert(len);
	var selecthtml='<option value="0">Choose a task</option>';
	if(len>0)
	{
		for (var i=0; i<len; i++){
			 selecthtml+='<option value="'+results.rows.item(i).TaskID+'">'+results.rows.item(i).TaskID+'</option>';
             }
		 $("#select_taskworked").html(selecthtml);	 
	}
	else
	{
	  navigator.notification.alert("No registered tasks", null, 'FieldTracker', 'Accept'); 
	}
	
	
}

function TaskSelected()
{
	var taskID=$("#select_taskworked").val();
	taskSelectedlog=taskID;
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryInfoTask, errorCB);
}

function QueryInfoTask(tx)
{
	//alert("SELECT * FROM TASKS WHERE TaskID='"+taskSelectedlog+"'");
	//alert("SELECT * FROM TASKS");
	tx.executeSql("SELECT * FROM TASKS WHERE ID='"+taskSelectedlog+"'", [], QueryInfoTaskSuccess, errorCB);
	
}

function QueryInfoTaskSuccess(tx, results)
{
	var len = results.rows.length;
	//alert("task worked"+len);
	if(len>0)
	{
		//alert(results.rows.item(5).ReqHrsOJT);
		hoursReqLog=results.rows.item(0).ReqHrsOJT;
		//alert(hoursReqLog);
		$("#revaluetd").html(hoursReqLog);
		$("#table-logbook").table("refresh");
	 	$("#table-logbook").trigger('create');
		CalculateOJTHours();
		 
	}
	else
	{
	  navigator.notification.alert("Task not found", null, 'FieldTracker', 'Accept'); 
	}
	
	
}

function CalculateOJTHours()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryCalculateOJTHours, errorCB);	
}

function QueryCalculateOJTHours(tx)
{
	var iduser=sessionStorage.userid;	
	//alert("SELECT * FROM SUBMITTEDHOURS WHERE UserID='"+iduser+"' AND Task='"+taskSelectedlog+"'");
	tx.executeSql("SELECT * FROM SUBMITTEDHOURS WHERE UserID='"+iduser+"' AND Task='"+taskSelectedlog+"' AND Status='Approved'", [], QueryCalculateOJTHoursSuccess, errorCB);
}

function QueryCalculateOJTHoursSuccess(tx,results)
{
	var len = results.rows.length;
	var totalhours=0;
	var totalmins=0;
	//alert("registers"+len);
	if(len>0)
	{
		var totalminsh=0;
		for (var i=0; i<len; i++){
		//alert(results.rows.item(i).Hours);	
		totalhours+= parseFloat(results.rows.item(i).Hours);
		totalmins+= parseFloat(results.rows.item(i).Mins);
		}
		//alert("hours="+totalhours+ "mins="+totalmins);
		if(totalmins>0)
		{
		  totalminsh=parseFloat(totalmins)*(1/60);
			
		}
		//alert("hours on minutes="+totalminsh);
		
		var totalfix=parseFloat(totalhours)+parseFloat(totalminsh);
		totalfix=totalfix.toFixed(2)
		//alert("total hours completed"+totalfix);
		var completedH=totalfix;
		var requiredText=parseFloat(hoursReqLog)-parseFloat(completedH);
		var Done=parseFloat(completedH)/parseFloat(hoursReqLog)*100;
		//alert("done percent="+Done);
		var DoneF=parseFloat(Done).toFixed(0);
		$("#completedvaluetd").html(completedH);//hours completed
		$("#hourstogovaluetd").html(requiredText);//hourtogo
		$("#donevaluetd").html(DoneF+"%"); //percent
		
	}
	else
	{
		$("#completedvaluetd").html("0");//hours completed
		$("#hourstogovaluetd").html("0");//hourtogo
		$("#donevaluetd").html("0%"); //percent
		
	}
	
}

function SubmitOJT()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QuerySubmitOJT(tx) }, errorCB);
	
}
function QuerySubmitOJT(tx)
{
	var EntryDates=$("#entryonevalue").val();
	//alert("task="+taskSelectedlog+" Personnel="+personnelOJT);
	
	if(taskSelectedlog!="")
	{	  
		  if(EntryDates!="")
		  {
			var dt = new Date();
			var submitID = sessionStorage.userid+new Date().getTime() + Math.random();
			var UseraID=sessionStorage.userid;
			var hourstime=$("#hourentryone").val();
			var minstime=$("#minutesentryone").val();
			var leveluser=sessionStorage.lvlname;
			var SubmitTime=dt.toYMDhrs()
			//var SubDate=dt.toYMD();
    		var TaskID=taskSelectedlog;
			var query='INSERT INTO SUBMITTEDHOURS (SubmitID,UserID,Type,Status,SubmitDate,EntryDate,Task,LevelNum,Hours,Mins,PersonnelID,Sync) VALUES("'+submitID+'","'+UseraID+'","O","Submitted","'+SubmitTime+'","'+InsertFormatDate(EntryDates)+'","'+taskSelectedlog+'","'+leveluser+'","'+hourstime+'","'+minstime+'","'+personnelOJT+'","no")';
			//alert(query);
			tx.executeSql(query);  
			 navigator.notification.confirm(
    					'Saved',      // mensaje (message)
    						onsuccessojt,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   							 'FieldTracker',            // titulo (title)
        				'Accept'          // botones (buttonLabels)
        				);
			
		  }
		  else
		  {
			 navigator.notification.alert("Please Enter Entry Date", null, 'FieldTracker', 'Accept');  
		  }
		
	}
	else
	{
		  navigator.notification.alert("Please Select Task", null, 'FieldTracker', 'Accept'); 
		
		 
	}

}

 function onsuccessojt(button) {
$("#entryonevalue").val("");	 
$("#hourentryone").val("");
$("#minutesentryone").val("");
TaskSelected();
 }

function PersonnelO()
{
	var IDuserpersonnel=$("#select_personnelworked").val();
	personnelOJT=IDuserpersonnel;
}

function CheckHoursOJT()
{
	var hourstime=$("#hourentryone").val();
	var minstime=$("#minutesentryone").val();
	if(hourstime=="")
	{
		hourstime=0;
	}
	if(minstime=="")
	{
		minstime=0;
	}
	if(hourstime>0 || minstime>0)
	{
			if(hourstime>=10)
	{
		//alert("primer if ="+hourstime );
		
		if(hourstime>10)
		{
			$("#popupmuchtime").popup("open");
		}
		else if(hourstime=10 && minstime>=30)
		{
			$("#popupmuchtime").popup("open");
			
		}
		else
		{
			SubmitOJT();
			
		}
		
	}
	else
	{
		SubmitOJT();
	}
		
	}
	else
	{
		navigator.notification.alert("Please Enter Hours for this entry", null, 'FieldTracker', 'Accept'); 
	}
	//alert("hours"+hourstime+" mins"+minstime);

	
	
	
}

function fillitemworked()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Queryitemworked, errorCB);
	
}

function Queryitemworked(tx)
{
	var leveluser=sessionStorage.lvlname;
  tx.executeSql('SELECT * FROM LEVELS2ITEMS WHERE LevelNum="'+leveluser+'" ORDER BY ID', [], QueryitemworkedSuccess, errorCB);
}

function QueryitemworkedSuccess(tx, results)
{
	var len = results.rows.length;
	//alert(len);
	var selecthtml='<option value="0">Choose a Item</option>';
	if(len>0)
	{
		for (var i=0; i<len; i++){
			 selecthtml+='<option value="'+results.rows.item(i).ID+'">'+results.rows.item(i).ID+'</option>';
             }
		 $("#select_itemsworkedon").html(selecthtml);	 
	}
	else
	{
	  navigator.notification.alert("No registered Items", null, 'FieldTracker', 'Accept'); 
	}
	
	
}

function InfoLevel()
{
	//LevelReqHRSRTI
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryInfoLevel, errorCB);
}

function QueryInfoLevel(tx)
{
	var leveluser=sessionStorage.lvlname;
	tx.executeSql("SELECT * FROM LEVELS WHERE LevelNum='"+leveluser+"'", [], QueryInfoLevelSuccess, errorCB);
}

function QueryInfoLevelSuccess(tx,results)
{
	var len = results.rows.length;
	if(len>0)
	{
		LevelReqHRSRTI=results.rows.item(0).ReqHrsRTI;
	}
	else
	{
		 navigator.notification.alert("User Level not found", null, 'FieldTracker', 'Accept'); 
	}
	
}

function ItemSelected()
{
	var taskID=$("#select_taskworked").val();
	taskSelectedlog=taskID;
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryInfoItem, errorCB);
}

function QueryInfoItem(tx)
{
	//alert("SELECT * FROM TASKS WHERE TaskID='"+taskSelectedlog+"'");
	//alert("SELECT * FROM TASKS");
	var ItemSelected=$("#select_itemsworkedon").val();
	var iduser=sessionStorage.userid;
	var leveluser=sessionStorage.lvlname;
	tx.executeSql("SELECT * FROM SUBMITTEDHOURS WHERE UserID='"+iduser+"' AND Item='"+ItemSelected+"' AND LevelNum='"+leveluser+"' AND Status='Approved'", [], QueryInfoItemSuccess, errorCB);
	
}

function QueryInfoItemSuccess(tx, results)
{
	var len = results.rows.length;
	var completedHoursClass=0;
	var Doneclasshours=0;
	var hoursTogoClass=0;
	var totalhours=0;
	var totalmins=0;
	//LevelReqHRSRTI Hours To complete
	$("#revalueitemtd").html(LevelReqHRSRTI);
	//alert("task worked"+len);
	if(len>0)
	{
			for (var i=0; i<len; i++){
		//alert(results.rows.item(i).Hours);	
		totalhours+= parseFloat(results.rows.item(i).Hours);
		totalmins+= parseFloat(results.rows.item(i).Mins);
		}
				if(totalmins>0)
		{
		  totalminsh=parseFloat(totalmins)*(1/60);
			
		}
		//alert("hours on minutes="+totalminsh);
		
		var totalfix=parseFloat(totalhours)+parseFloat(totalminsh);
		totalfix=totalfix.toFixed(2)
		//alert("total hours completed"+totalfix);
		completedHoursClass=totalfix;
		hoursTogoClass=parseFloat(LevelReqHRSRTI)-parseFloat(completedHoursClass);
		var Done=parseFloat(completedHoursClass)/parseFloat(LevelReqHRSRTI)*100;
		Doneclasshours=parseFloat(Done).toFixed(0);
		//alert(results.rows.item(5).ReqHrsOJT);
		//alert(hoursReqLog);
		

		 
	}
	$("#completedvalueitemtd").html(completedHoursClass);
	$("#hourstogovalueitemtd").html(hoursTogoClass);
	$("#donevalueitemtd").html(Doneclasshours+"%");
	$("#table-logbookItems").table("refresh");
	$("#table-logbookItems").trigger('create');
	CalculateItems(tx)
	
	
}


function CalculateItems(tx)
{
	itemsonlevel=0;
	var ItemSelected=$("#select_itemsworkedon").val();
	if(ItemSelected!="0")
	{
	var leveluser=sessionStorage.lvlname;
	//alert("SELECT * FROM SUBMITTEDHOURS WHERE UserID='"+iduser+"' AND LevelNum='"+taskSelectedlog+"' AND Item='"+ItemSelected+"'");
	tx.executeSql("SELECT * FROM LEVELS2ITEMS WHERE LevelNum='"+leveluser+"'", [], QueryCalculateItemsSuccess, errorCB);
		
		
	}
	
}


function QueryCalculateItemsSuccess(tx,results)
{
	var len = results.rows.length;
	itemsonlevel=len;
    var leveluser=sessionStorage.lvlname;
	//alert("Leves2items level"+len);
	tx.executeSql("SELECT DISTINCT(Item) FROM SubmittedHours WHERE LevelNum='"+leveluser+"'  AND Type='C'", [], QueryCalSubSuccess, errorCB);
	

}

function QueryCalSubSuccess(tx,results)
{
	var len = results.rows.length;
	//alert("COMPLETED ITEMS SUBMIITED= "+len);
	var ItemsToGo=parseFloat(itemsonlevel)-parseFloat(len);
	//alert("ItemsTogo"+ItemsToGo);
	var DoneToGo=parseFloat(len)/parseFloat(itemsonlevel)*100;
	DoneToGo=DoneToGo.toFixed(0);
	//alert("DoneItemsper="+DoneToGo);
	$("#revalueitemtwotd").html(itemsonlevel);
	$("#completedvalueitetwomtd").html(len);
	$("#hourstogovalueitemtwotd").html(ItemsToGo);
	$("#donevalueitemtwotd").html(DoneToGo+"%");
	$("#table-logbookItems").table("refresh");
	$("#table-logbookItems").trigger('create');
}

function CheckitemsValues()
{
	//alert("checkitems");
		var hourstime=$("#hourentryitemonec").val();
	var minstime=$("#minutesentryitemonec").val();
	//alert
	if(hourstime=="")
	{
		hourstime=0;
	}
	if(minstime=="")
	{
		minstime=0;
	}
	if(hourstime>0 || minstime>0)
	{
			if(hourstime>=10)
	{
		//alert("primer if ="+hourstime );
		
		if(hourstime>10)
		{
			$("#popupmuchtimeC").popup("open");
		}
		else if(hourstime=10 && minstime>=30)
		{
			$("#popupmuchtimeC").popup("open");
			
		}
		else
		{
			SubmitItem();
			
		}
		
	}
	else
	{
		SubmitItem();
	}
		
	}
	else
	{
		navigator.notification.alert("Please Enter Hours for this entry", null, 'FieldTracker', 'Accept'); 
	}
	//alert("hours"+hourstime+" mins"+minstime);
	
}

function SubmitItem()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QuerySubmitItem(tx) }, errorCB);
}
function QuerySubmitItem(tx)
{
		var EntryDates=$("#entryoneitemvalue").val();
			var ItemSelected=$("#select_itemsworkedon").val();
	//alert("task="+taskSelectedlog+" Personnel="+personnelOJT);
	
	if(ItemSelected!="0")
	{

		  
		  if(EntryDates!="")
		  {
			var dt = new Date();
			var submitID = sessionStorage.userid+new Date().getTime() + Math.random();
			var UseraID=sessionStorage.userid;
			var hourstime=$("#hourentryitemonec").val();
			var minstime=$("#minutesentryitemonec").val();
			var leveluser=sessionStorage.lvlname;
			var SubmitTime=dt.toYMDhrs()
		
			//var SubDate=dt.toYMD();
    		var TaskID=taskSelectedlog;
			var query='INSERT INTO SUBMITTEDHOURS (SubmitID,UserID,Type,Status,SubmitDate,EntryDate,Item,LevelNum,Hours,Mins,Sync) VALUES("'+submitID+'","'+UseraID+'","C","Submitted","'+SubmitTime+'","'+InsertFormatDate(EntryDates)+'","'+ItemSelected+'","'+leveluser+'","'+hourstime+'","'+minstime+'","no")';
			alert(query);
			tx.executeSql(query);  
			 navigator.notification.confirm(
    					'Saved',      // mensaje (message)
    						onsuccessojtclass,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   							 'FieldTracker',            // titulo (title)
        				'Accept'          // botones (buttonLabels)
        				);
			
		  }
		  else
		  {
			 navigator.notification.alert("Please Enter Entry Date", null, 'FieldTracker', 'Accept');  
		  }

		  
	

		
	}
	else
	{
		  navigator.notification.alert("Please Select Item", null, 'FieldTracker', 'Accept'); 
		
		 
	}
}

 function onsuccessojtclass(button) {
$("#entryoneitemvalue").val("");	 
$("#hourentryitemonec").val("");
$("#minutesentryitemonec").val("");
ItemSelected();
 }


///////<<<<<<<<<<<<=============================END FUNCTION LOGBOOK PAGE  =========================================>>>>>>>>>>>///////