///////<<<<<<<<<<<<============================= LOGBOOK PAGE =========================================>>>>>>>>>>>///////
var taskSelectedlog;
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
	alert(len);
	var selecthtml='<option value="0">Choose a task</option>';
	if(len>0)
	{
		for (var i=0; i<len; i++){
			 selecthtml+='<option value="'+results.rows.item(i).Duty+'">'+results.rows.item(i).TaskID+'</option>';
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
	var Duty=$("#select_taskworked").val();
	var taskID=$("#select_taskworked").text();
	alert(taskID+" Duty: "+Duty);
}


///////<<<<<<<<<<<<=============================END FUNCTION LOGBOOK PAGE  =========================================>>>>>>>>>>>///////