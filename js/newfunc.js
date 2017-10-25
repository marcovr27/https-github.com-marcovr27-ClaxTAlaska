///////<<<<<<<<<<<<============================= LOGBOOK PAGE =========================================>>>>>>>>>>>///////
var taskSelectedlog;
var hoursReqLog;
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
	alert("SELECT * FROM TASKS WHERE TaskID='"+taskSelectedlog+"'");
	tx.executeSql("SELECT * FROM TASKS WHERE TaskID='"+taskSelectedlog+"'", [], QueryInfoTaskSuccess, errorCB);
	
}

function QueryInfoTaskSuccess(tx, results)
{
	var len = results.rows.length;
	//alert(len);
	if(len>0)
	{
		hoursReqLog=results.rows.item(0).ReqHrsOJT;
	    alert(hoursReqLog);
		 
	}
	else
	{
	  navigator.notification.alert("Task not found", null, 'FieldTracker', 'Accept'); 
	}
	
	
}


///////<<<<<<<<<<<<=============================END FUNCTION LOGBOOK PAGE  =========================================>>>>>>>>>>>///////