// Sync Functions

///////<<<<<<<<<<<<============================= WEB SERVICES =========================================>>>>>>>>>>>///////
function newsettingstodb()
{
	//alert("newsettings function");
	var ipaddress=$("#ipsettinginit").val();
	var val_ip=/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
	//if(!val_ip.test(ipaddress)) {
	//	navigator.notification.alert("Invalid IP Address", null, 'FieldTracker', 'Accept');
//	}
	//else
	//{
		var todo="0";
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
         db.transaction(function(tx){ Querynewsavesettings(tx,todo) }, errorCB,SuccesnewS);
	//}
	
	
	
}

function Querynewsavesettings(tx,todo)
{
	var ipaddress=$("#ipsettinginit").val();
	var language=$("#select-langinit").val();
	var query="";
	
		query='INSERT INTO SETTINGS (Language,IP) VALUES ("'+language+'","'+ipaddress+'")';
	

	tx.executeSql(query);
	query='UPDATE SETTINGS SET IP="'+ipaddress+'"';
	tx.executeSql(query);
	
}

function SuccesnewS()
{
	//alert("success settings saved");
	checkifexistdbreg("1");
	
}


function checkifexistdbreg(typeofsync)
{
	//alert("start type of sync: "+typeofsync);
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(function(tx){ Querytocheckifdb(tx,typeofsync) }, errorCB);
	// $(':mobile-pagecontainer').pagecontainer('change', '#pageSettingsInit', {
      //  transition: 'flip',
        //changeHash: false,
        //reverse: true,
        //showLoadMsg: true
    //});
	
}

function Querytocheckifdb(tx,typeofsync)
{
   // alert("GET URL");
	var querytosend="SELECT * FROM SETTINGS";
	tx.executeSql(querytosend, [], function(tx,results){ QuerytocheckifdbSuccess(tx,results,typeofsync) }, errorCB);
	
}

function QuerytocheckifdbSuccess(tx,results,typeofsync)
{
	var len = results.rows.length;
	if(len>0)
	{
		$("#ipsync").val(results.rows.item(0).IP);
		//startSync(sendprocedures,sendDataToServer,Getservicedata);//sendprocedures();
		if(typeofsync==1)
		{
			//alert("Call Sync function");
			sendprocedures();
		}
		else
		{
			silencesync();
		}
		
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
//GET DATA FROM SERVER
function GetservicedataMessages(typesinc)
{
	var ipserver=$("#ipsync").val();
	synchours=typesinc;
	var obj = {};
    obj['UserID'] =sessionStorage.userid;
	if(typesinc=="0")
	{
		$("#progressheader").html(" ");
	//progressheader
	$("#progressheader").html("Downloading data...");
		$("#progressMessage").html("Waiting for server connection");
		pbar.setValue(0);
		//alert("listo para el post: "+ipserver+'//GetStructureData');
	                $.ajax({
                    type: 'POST',
                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
				    url:ipserver+'//GetMessages',
					data: JSON.stringify(obj),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						//alert(response.d);
						//alert("WEb service works");
						InsertDatabaseMessages(response.d);
                        //alert(response.d.users);
                       // var obj = jQuery.parseJSON(response.d.users);
                       // $.each(obj, function (key, value) {
                         //   alert(value.Username);//inserts users
                        //});
                       // $('#lblData').html(JSON.stringify());
                    },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
							$("#progressheader").html("Can not connect to server");
							$("#progressMessage").html("ERROR Downloading Data:"+xmlHttpRequest.responseText+" Status: "+textStatus+" thrown: "+errorThrown);
							setTimeout( function(){ $("#generic-dialog").dialog("close"); }, 6000 );
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                   // alert("Error");
                }
                });
		
	}
	else
	{
		
	}	
	
}

function InsertDatabaseMessages(newdatabase)
{

	$("#progressMessage").html("Successful connection");
		pbar.setValue(1);
	newmessagesdatatoinsert=newdatabase;
	//alert(newdatabase);
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerytoinsertCourses, errorCB);
	
}

function QuerytoinsertCourses(tx)
{
	//alert("deleteoldrecords");
	$("#progressMessage").html("Deleting old records");
		pbar.setValue(2);
	var idusera=sessionStorage.userid;		
	
	//ready to insert new records
	alert("Insert new data MESSAGES");
	$("#progressMessage").html("Ready to insert new records");
	var query;
	var obj = jQuery.parseJSON(newmessagesdatatoinsert.Messages);
	//alert("Items "+obj.length);
	var itemcount=0;
	 try
	 {
    $.each(obj, function (key, value) {
		//alert('INSERT INTO USERS (Username,Password,FirstName,LastName,LevelNum) VALUES ("'+value.Username+'", "'+value.Password+'","'+value.FirstName+'","'+value.LastName+'","'+value.LevelNum+'")');
		query='INSERT INTO MESSAGES (ID,UserIDTo,UserIDFrom,Status,Date,Title,Category,Message,Priority,UserToList,Sync) VALUES ("'+escapeDoubleQuotes(value.ID)+'", "'+escapeDoubleQuotes(value.UserIDTo)+'", "'+escapeDoubleQuotes(value.UserIDFrom)+'", "'+value.Status+'", "'+value.Date+'", "'+value.Title+'", "'+value.Category+'", "'+value.Message+'", "'+value.Priority+'", "'+value.UserToList+'","yes")';
		//alert(query);
		tx.executeSql(query);
		itemcount++;
     });
	// alert("totalGroups2content: "+itemcount);
	 
	 	$("#progressMessage").html("Messages updated");
	pbar.setValue(10);
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
	if(synchours=="0")
	{
	  Getservicedata();		
	}
	else
	{
		
	}
		

   //sendprocedures();	
}

//GET DATA FROM SERVER
function GetservicedataSubmitHours(typesinc)
{
	var ipserver=$("#ipsync").val();
	synchours=typesinc;
	if(typesinc=="0")
	{
		$("#progressheader").html(" ");
	//progressheader
	$("#progressheader").html("Downloading data...");
		$("#progressMessage").html("Waiting for server connection");
		pbar.setValue(0);
		 var obj = {};
         obj['UserID'] =sessionStorage.userid;
		//alert("listo para el post: "+ipserver+'//GetStructureData');
	                $.ajax({
                    type: 'POST',
                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
				    url:ipserver+'//GetSubmittedHours',
					data: JSON.stringify(obj),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						//alert(response.d);
						//alert("WEb service works");
						InsertDatabaseSubmitHours(response.d);
                        //alert(response.d.users);
                       // var obj = jQuery.parseJSON(response.d.users);
                       // $.each(obj, function (key, value) {
                         //   alert(value.Username);//inserts users
                        //});
                       // $('#lblData').html(JSON.stringify());
                    },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
							$("#progressheader").html("Can not connect to server");
							$("#progressMessage").html("ERROR Downloading Data:"+xmlHttpRequest.responseText+" Status: "+textStatus+" thrown: "+errorThrown);
							setTimeout( function(){ $("#generic-dialog").dialog("close"); }, 6000 );
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                   // alert("Error");
                }
                });
		
	}
	else
	{
		
	}	
	
}

function InsertDatabaseSubmitHours(newdatabase)
{

	$("#progressMessage").html("Successful connection");
		pbar.setValue(1);
	newhoursdatatoinsert=newdatabase;
	//alert(newdatabase);
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerytoinsertCourses, errorCB);
	
}

function QuerytoinsertCourses(tx)
{
	//alert("deleteoldrecords");
	$("#progressMessage").html("Deleting old records");
		pbar.setValue(2);
	var idusera=sessionStorage.userid;	
	if(idusera!="")
	{
		alert("Deleting "+idusera);
		tx.executeSql("DELETE FROM SUBMITTEDHOURS WHERE UserID='"+idusera+"'");
	}	
	
	//ready to insert new records
	alert("Insert new data SubmittedHours");
	$("#progressMessage").html("Ready to insert new records");
	var query;
	var obj = jQuery.parseJSON(newhoursdatatoinsert.Courses);
	//alert("Items "+obj.length);
	var itemcount=0;
	 try
	 {
    $.each(obj, function (key, value) {
		//alert('INSERT INTO USERS (Username,Password,FirstName,LastName,LevelNum) VALUES ("'+value.Username+'", "'+value.Password+'","'+value.FirstName+'","'+value.LastName+'","'+value.LevelNum+'")');
		query='INSERT INTO SUBMITTEDHOURS (SubmitID,UserID,Type,Status,SubmitDate,EntryDate,Task,LevelNum,Item,Hours,Mins,PersonnelID,SupervisorID,RejectReason,ReviewDate,Sync) VALUES ("'+escapeDoubleQuotes(value.SubmitID)+'", "'+escapeDoubleQuotes(value.UserID)+'", "'+escapeDoubleQuotes(value.Type)+'", "'+value.Status+'", "'+value.SubmitDate+'", "'+value.EntryDate+'", "'+value.Task+'", "'+value.LevelNum+'", "'+value.Item+'", "'+value.Hours+'", "'+value.Mins+'", "'+value.PersonnelID+'", "'+value.SupervisorID+'", "'+value.RejectReason+'", "'+value.ReviewDate+'","yes")';
		//alert(query);
		tx.executeSql(query);
		itemcount++;
     });
	// alert("totalGroups2content: "+itemcount);
	 
	 	$("#progressMessage").html("SubmittedHours updated");
	pbar.setValue(10);
	 }
	 catch(error)
	 {
		 alert(error);
		 $("#progressMessage").html("Error updating SubmittedHours "+error);
			pbar.setValue(30);
		 
	 }
	 
	
		 
	 $("#progressMessage").html("SubmittedHours updated");
		pbar.setValue(100);

	$("#progressMessage").html("");
		pbar.setValue(100);
	if(synchours=="0")
	{
	  GetservicedataMessages(0);		
	}
	else
	{
		
	}
		

   //sendprocedures();	
}

//GET DATA FROM SERVER
function GetservicedataCourses()
{	
	var ipserver=$("#ipsync").val();
	//alert("Get Courses");
    //alert("Get Data from:"+ipserver);
	
$("#progressheader").html(" ");
	//progressheader
	$("#progressheader").html("Downloading data...");
		$("#progressMessage").html("Waiting for server connection");
		pbar.setValue(0);
		//alert("listo para el post: "+ipserver+'//GetStructureData');
	                $.ajax({
                    type: 'POST',
                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
				    url:ipserver+'//GetCoursesdata',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						//alert(response.d);
						//alert("WEb service works");
						InsertDatabaseCourses(response.d);
                        //alert(response.d.users);
                       // var obj = jQuery.parseJSON(response.d.users);
                       // $.each(obj, function (key, value) {
                         //   alert(value.Username);//inserts users
                        //});
                       // $('#lblData').html(JSON.stringify());
                    },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
							$("#progressheader").html("Can not connect to server");
							$("#progressMessage").html("ERROR Downloading Data:"+xmlHttpRequest.responseText+" Status: "+textStatus+" thrown: "+errorThrown);
							setTimeout( function(){ $("#generic-dialog").dialog("close"); }, 6000 );
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                   // alert("Error");
                }
                });
				//alert("primer post ejecutado");
}

function InsertDatabaseCourses(newdatabase)
{

	$("#progressMessage").html("Successful connection");
		pbar.setValue(1);
	newcoursesdatatoinsert=newdatabase;
	//alert(newdatabase);
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerytoinsertCourses, errorCB);
	
}

function QuerytoinsertCourses(tx)
{
	//alert("deleteoldrecords");
	$("#progressMessage").html("Deleting old records");
		pbar.setValue(2);
	tx.executeSql("DELETE FROM COURSES");
	//ready to insert new records
	//alert("Insert new data COURSES");
	$("#progressMessage").html("Ready to insert new records");
	var query;
	var obj = jQuery.parseJSON(newcoursesdatatoinsert.Courses);
	//alert("Items "+obj.length);
	var itemcount=0;
	 try
	 {
    $.each(obj, function (key, value) {
		//alert('INSERT INTO USERS (Username,Password,FirstName,LastName,LevelNum) VALUES ("'+value.Username+'", "'+value.Password+'","'+value.FirstName+'","'+value.LastName+'","'+value.LevelNum+'")');
		query='INSERT INTO COURSES (ID,Description,DescriptionLang2,ContentType,DurationHours,DurationMins,Scope,Instructor,FileName) VALUES ("'+escapeDoubleQuotes(value.ID)+'", "'+escapeDoubleQuotes(value.Description)+'", "'+escapeDoubleQuotes(value.DescriptionLang2)+'", "'+value.ContentType+'", "'+value.DurationHours+'", "'+value.DurationMins+'", "'+value.Scope+'", "'+escapeDoubleQuotes(value.Instructor)+'","'+escapeDoubleQuotes(value.FileName)+'")';
		//alert(query);
		tx.executeSql(query);
		itemcount++;
     });
	// alert("totalGroups2content: "+itemcount);
	 
	 	$("#progressMessage").html("Courses updated");
	pbar.setValue(10);
	 }
	 catch(error)
	 {
		 alert(error);
		 $("#progressMessage").html("Error updating Courses "+error);
			pbar.setValue(30);
		 
	 }
	 
	
		 
	 $("#progressMessage").html("Courses updated");
		pbar.setValue(100);

	$("#progressMessage").html("");
		pbar.setValue(100);
    GetservicedataSubmitHours(0);
   //sendprocedures();	
}
//GET DATA FROM SERVER

function GetservicedataGroups()
{	
	var ipserver=$("#ipsync").val();
    //alert("Get Data from:"+ipserver);
	
$("#progressheader").html(" ");
	//progressheader
	$("#progressheader").html("Downloading data...");
		$("#progressMessage").html("Waiting for server connection");
		pbar.setValue(0);
		//alert("listo para el post: "+ipserver+'//GetStructureData');
	                $.ajax({
                    type: 'POST',
                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
				    url:ipserver+'//GetGroupsData',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						//alert(response.d);
						//alert("WEb service works");
						InsertDatabaseGroups(response.d);
                        //alert(response.d.users);
                       // var obj = jQuery.parseJSON(response.d.users);
                       // $.each(obj, function (key, value) {
                         //   alert(value.Username);//inserts users
                        //});
                       // $('#lblData').html(JSON.stringify());
                    },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
							$("#progressheader").html("Can not connect to server");
							$("#progressMessage").html("ERROR Downloading Data:"+xmlHttpRequest.responseText+" Status: "+textStatus+" thrown: "+errorThrown);
							setTimeout( function(){ $("#generic-dialog").dialog("close"); }, 6000 );
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                   // alert("Error");
                }
                });
				//alert("primer post ejecutado");
}

function InsertDatabaseGroups(newdatabase)
{

	$("#progressMessage").html("Successful connection");
		pbar.setValue(1);
	newgroupsdatatoinsert=newdatabase;
	//alert(newdatabase);
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerytoinsertGroups, errorCB);
	
}

function QuerytoinsertGroups(tx)
{
	//alert("deleteoldrecords");
	$("#progressMessage").html("Deleting old records");
		pbar.setValue(2);
	tx.executeSql("DELETE FROM GROUP2SUPS");
	tx.executeSql("DELETE FROM GROUP2SUPSRTI");
	tx.executeSql("DELETE FROM GROUPS2CONTENT");
	//ready to insert new records
	//alert("Insert new data GROUPS");
	$("#progressMessage").html("Ready to insert new records");
	var query;
	var obj = jQuery.parseJSON(newgroupsdatatoinsert.Groups2Content);
	//alert("Items "+obj.length);
	var itemcount=0;
	 try
	 {
    $.each(obj, function (key, value) {
		//alert('INSERT INTO USERS (Username,Password,FirstName,LastName,LevelNum) VALUES ("'+value.Username+'", "'+value.Password+'","'+value.FirstName+'","'+value.LastName+'","'+value.LevelNum+'")');
		query='INSERT INTO GROUPS2CONTENT (GroupID,ID,Ord) VALUES ("'+value.GroupID+'", "'+value.ID+'","'+value.Ord+'")';
		tx.executeSql(query);
		itemcount++;
     });
	// alert("totalGroups2content: "+itemcount);
	 
	 	$("#progressMessage").html("Groups2Content updated");
	pbar.setValue(10);
	 }
	 catch(error)
	 {
		 alert(error);
		 $("#progressMessage").html("Error updating Groups2Content "+error);
			pbar.setValue(30);
		 
	 }
	 
	 try
	 {
		 	 obj=jQuery.parseJSON(newgroupsdatatoinsert.Groups2Sups);
			 //alert("Groups:"+obj.length);
	     $.each(obj, function (key, value) {
		query='INSERT INTO GROUP2SUPS (GroupID,ID) VALUES ("'+value.GroupID+'","'+value.ID+'")';
		tx.executeSql(query);
		 $("#progressMessage").html("Group2Sups updated");
	pbar.setValue(20);
     });
		 
	 }
	 catch(error)
	 {
		  $("#progressMessage").html("Error updating Group2Sups"+error);
			pbar.setValue(20);
		 
	 }
	   
	  
	  try
	 {
	  obj=jQuery.parseJSON(newgroupsdatatoinsert.Groups2SupsRTI);
	  	 //alert("User2Groups:"+obj.length);
	     $.each(obj, function (key, value) {
		
		query='INSERT INTO GROUP2SUPSRTI (GroupID,ID) VALUES ("'+value.UserID+'","'+value.ID+'")';
		tx.executeSql(query);
     });
	 
	$("#progressMessage").html("Group2supsRTI updated");
	pbar.setValue(60);
	 }
	 	 catch(error)
	 {
		 
		  $("#progressMessage").html("Error updating Group2supsRTI"+error);
			pbar.setValue(60);
		 
	 }
    // alert("Groups UPDATED");
		 
	 $("#progressMessage").html("Groups updated");
		pbar.setValue(100);

	$("#progressMessage").html("");
		pbar.setValue(100);
    GetservicedataCourses();
   //sendprocedures();	
}




//GET DATA FROM SERVER TASKS
function GetservicedataTasks()
{
	
	
	var ipserver=$("#ipsync").val();
    //alert("Get Data from:"+ipserver);
	
$("#progressheader").html(" ");
	//progressheader
	$("#progressheader").html("Downloading data...");
		$("#progressMessage").html("Waiting for server connection");
		pbar.setValue(0);
		//alert("listo para el post: "+ipserver+'//GetStructureData');
	                $.ajax({
                    type: 'POST',
                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
				    url:ipserver+'//GetTasksData',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						//alert(response.d);
						//alert("WEb service works");
						InsertDatabaseTasks(response.d);
                        //alert(response.d.users);
                       // var obj = jQuery.parseJSON(response.d.users);
                       // $.each(obj, function (key, value) {
                         //   alert(value.Username);//inserts users
                        //});
                       // $('#lblData').html(JSON.stringify());
                    },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
							$("#progressheader").html("Can not connect to server");
							$("#progressMessage").html("ERROR Downloading Data:"+xmlHttpRequest.responseText+" Status: "+textStatus+" thrown: "+errorThrown);
							setTimeout( function(){ $("#generic-dialog").dialog("close"); }, 6000 );
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                   // alert("Error");
                }
                });
				//alert("primer post ejecutado");
}

function InsertDatabaseTasks(newdatabase)
{

	$("#progressMessage").html("Successful connection");
		pbar.setValue(1);
	newtasksdatatoinsert=newdatabase;
	//alert(newdatabase);
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerytoinsertTasks, errorCB);
	
}

function QuerytoinsertTasks(tx)
{
	//alert("deleteoldrecords");
	$("#progressMessage").html("Deleting old records");
		pbar.setValue(2);
	tx.executeSql("DELETE FROM ITEMS");
	tx.executeSql("DELETE FROM LEVELS2ITEMS");
	tx.executeSql("DELETE FROM DUTIES2TASKS");
	//ready to insert new records
	//alert("Insert new data TASKS");
	$("#progressMessage").html("Ready to insert new records");
	var query;
	var obj = jQuery.parseJSON(newtasksdatatoinsert.Items);
	//alert("Items "+obj.length);
	var itemcount=0;
	 try
	 {
    $.each(obj, function (key, value) {
		//alert('INSERT INTO USERS (Username,Password,FirstName,LastName,LevelNum) VALUES ("'+value.Username+'", "'+value.Password+'","'+value.FirstName+'","'+value.LastName+'","'+value.LevelNum+'")');
		query='INSERT INTO ITEMS (ID,Item,CourseID) VALUES ("'+escapeDoubleQuotes(value.ID)+'", "'+escapeDoubleQuotes(value.Item)+'","'+escapeDoubleQuotes(value.CourseID)+'")';
		tx.executeSql(query);
		itemcount++;
     });
	 //alert("totalusers:"+usercount);
	 
	 	$("#progressMessage").html("Items updated");
	pbar.setValue(10);
	 }
	 catch(error)
	 {
		 alert(error);
		 $("#progressMessage").html("Error updating Items "+error);
			pbar.setValue(30);
		 
	 }
	 
	 try
	 {
		 	 obj=jQuery.parseJSON(newtasksdatatoinsert.Levels2Items);
			 //alert("Groups:"+obj.length);
	     $.each(obj, function (key, value) {
		query='INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES ("'+value.LevelNum+'","'+escapeDoubleQuotes(value.ID)+'")';
		tx.executeSql(query);
		 $("#progressMessage").html("Levels2Items updated");
	pbar.setValue(20);
     });
		 
	 }
	 catch(error)
	 {
		  $("#progressMessage").html("Error updating Levels2Items "+error);
			pbar.setValue(20);
		 
	 }
	   
	  
	  try
	 {
	  obj=jQuery.parseJSON(newtasksdatatoinsert.Duties2Tasks);
	  	 //alert("User2Groups:"+obj.length);
	     $.each(obj, function (key, value) {
		
		query='INSERT INTO DUTIES2TASKS(UserID,ID) VALUES ("'+value.UserID+'","'+escapeDoubleQuotes(value.ID)+'")';
		tx.executeSql(query);
     });
	 
	$("#progressMessage").html("Duties2Tasks updated");
	pbar.setValue(60);
	 }
	 	 catch(error)
	 {
		 
		  $("#progressMessage").html("Error updating Duties2Tasks "+error);
			pbar.setValue(60);
		 
	 }

		 
	 $("#progressMessage").html("Tasks updated");
		pbar.setValue(100);

	$("#progressMessage").html("");
		pbar.setValue(100);
    GetservicedataGroups();
   //sendprocedures();	
}

//Get DATA FROM FIRST SYNC
function Getservicedata()
{
	alert("old Sync");
	
	var ipserver=$("#ipsync").val();
    //alert("Get Data from:"+ipserver);
	
$("#progressheader").html(" ");
	//progressheader
	$("#progressheader").html("Downloading data...");
		$("#progressMessage").html("Waiting for server connection");
		pbar.setValue(0);
		//alert("listo para el post: "+ipserver+'//GetStructureData');
	                $.ajax({
                    type: 'POST',
                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
				    url:ipserver+'//GetStructureData',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						//alert(response.d);
						//alert("WEb service works");
						InsertDatabase(response.d);
                        //alert(response.d.users);
                       // var obj = jQuery.parseJSON(response.d.users);
                       // $.each(obj, function (key, value) {
                         //   alert(value.Username);//inserts users
                        //});
                       // $('#lblData').html(JSON.stringify());
                    },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
							$("#progressheader").html("Can not connect to server");
							$("#progressMessage").html("ERROR Downloading Data:"+xmlHttpRequest.responseText+" Status: "+textStatus+" thrown: "+errorThrown);
							setTimeout( function(){ $("#generic-dialog").dialog("close"); }, 6000 );
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                   // alert("Error");
                }
                });
				//alert("primer post ejecutado");
}

function InsertDatabase(newdatabase)
{

	$("#progressMessage").html("Successful connection");
		pbar.setValue(1);
	newdatabasetoinsert=newdatabase;
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(Querytoinsertusers, errorCB);
	
}

function Querytoinsertusers(tx)
{
	//alert("deleteoldrecords");
	$("#progressMessage").html("Deleting old records");
		pbar.setValue(2);
	tx.executeSql("DELETE FROM USERS");
	tx.executeSql("DELETE FROM GROUPS");
	tx.executeSql("DELETE FROM USERS2GROUPS");
	tx.executeSql("DELETE FROM CHECKLISTS");
	tx.executeSql("DELETE FROM MODULES2CHECKLISTS");
	tx.executeSql("DELETE FROM GROUPS2PROCEDURES");
	tx.executeSql("DELETE FROM PROCEDURES");
	tx.executeSql("DELETE FROM PROCEDURESTEPS");
	tx.executeSql("DELETE FROM COMPONENTS");
	tx.executeSql("DELETE FROM COMPS2FAULTS");
	tx.executeSql("DELETE FROM FAULTS");
	tx.executeSql("DELETE FROM REJECTED");
	tx.executeSql("DELETE FROM UserSettings");
	//ready to insert new records
	//alert("Insert new data");
	$("#progressMessage").html("Ready to insert new records");
	var query;
	var obj = jQuery.parseJSON(newdatabasetoinsert.users);
	//alert("users:"+obj.length);
	var usercount=0;
	 try
	 {
    $.each(obj, function (key, value) {
		//alert('INSERT INTO USERS (Username,Password,FirstName,LastName,LevelNum) VALUES ("'+value.Username+'", "'+value.Password+'","'+value.FirstName+'","'+value.LastName+'","'+value.LevelNum+'")');
		query='INSERT INTO USERS (Username,Password,FirstName,LastName,LevelNum) VALUES ("'+value.Username+'", "'+value.Password+'","'+value.FirstName+'","'+value.LastName+'","'+value.LevelNum+'")';
		tx.executeSql(query);
		usercount++;
     });
	 //alert("totalusers:"+usercount);
	 
	 	$("#progressMessage").html("Users updated");
	pbar.setValue(10);
	 }
	 catch(error)
	 {
		 alert(error);
		 $("#progressMessage").html("Error updating Users "+error);
			pbar.setValue(10);
		 
	 }
	 
	 try
	 {
		 	 obj=jQuery.parseJSON(newdatabasetoinsert.groups);
			 //alert("Groups:"+obj.length);
	     $.each(obj, function (key, value) {
		query='INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("'+value.AreaID+'","'+value.GroupID+'","'+escapeDoubleQuotes(value.Description)+'")';
		tx.executeSql(query);
		 $("#progressMessage").html("Groups updated");
	pbar.setValue(20);
     });
		 
	 }
	 catch(error)
	 {
		  $("#progressMessage").html("Error updating Groups "+error);
			pbar.setValue(20);
		 
	 }
	 
	 
	 
	
	  
	  
	  
	  try
	 {
	  obj=jQuery.parseJSON(newdatabasetoinsert.users2groups);
	  	 //alert("User2Groups:"+obj.length);
	     $.each(obj, function (key, value) {
		
		query='INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("'+value.UserID+'","'+value.ID+'")';
		tx.executeSql(query);
     });
	 
	$("#progressMessage").html("Users2groups updated");
	pbar.setValue(30);
	 }
	 	 catch(error)
	 {
		 
		  $("#progressMessage").html("Error updating Users2groups "+error);
			pbar.setValue(30);
		 
	 }
	  
	 
	   try
	 {
	 	  obj=jQuery.parseJSON(newdatabasetoinsert.checklists);
		   //alert("CHECKLISTS:"+obj.length);
	     $.each(obj, function (key, value) {
			
		query='INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("'+value.ID+'","'+escapeDoubleQuotes(value.Description)+'","'+value.Type+'")';
		tx.executeSql(query);
     });
	 
	  $("#progressMessage").html("Checklists updated");
	pbar.setValue(40);
	 }
	  	 catch(error)
	 {
		 
		  $("#progressMessage").html("Error updating Checklists "+error);
			pbar.setValue(40);
		 
	 }
	 
	 
	 
   //modules2checklists
   
    try
	 {
   obj=jQuery.parseJSON(newdatabasetoinsert.modules2checklists);
    //alert("MODULES2CHECKLISTS:"+obj.length);
	     $.each(obj, function (key, value) {
		query='INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("'+value.ModuleID+'","'+value.ID+'")';
		tx.executeSql(query);
     });
	 
	 $("#progressMessage").html("Modules2checklists updated");
	pbar.setValue(50);
	 }
	   	 catch(error)
	 {
		 $("#progressMessage").html("Error updating Modules2checklists "+error);
			pbar.setValue(50);
		 
		 
	 }
	 

   
   //groups2procedures
   try
	 {
        obj=jQuery.parseJSON(newdatabasetoinsert.groups2procedures);
		//alert("GROUPS2PROCEDURES:"+obj.length);
	     $.each(obj, function (key, value) {
		query='INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("'+value.GroupID+'","'+value.ID+'","'+value.Ord+'")';
		tx.executeSql(query);
     });
	 $("#progressMessage").html("Groups2procedures updated");
	pbar.setValue(60);
	 }
	   	 catch(error)
	 {
		  $("#progressMessage").html("Error updating Groups2procedures "+error);
			pbar.setValue(60);
		 
	 }
   //procedures
   
   try
	 {
           obj=jQuery.parseJSON(newdatabasetoinsert.procedures);
		   //alert("PROCEDURES:"+obj.length);
	     $.each(obj, function (key, value) {
		query='INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("'+value.ProcID+'", "'+escapeDoubleQuotes(value.Name)+'", "'+value.Type+'", "'+value.Freq+'")';
		//alert(query);
		tx.executeSql(query);
     });
	 
	 $("#progressMessage").html("Procedures updated");
	 pbar.setValue(70);
	 }
	    	 catch(error)
	 {
		  $("#progressMessage").html("Error updating Procedures "+error);
			pbar.setValue(70);
		 
		 
	 }
	  
   
   
   //proceduresteps
   try
	 {
    obj=jQuery.parseJSON(newdatabasetoinsert.proceduresteps);
	//alert("PROCEDURESTEPS:"+obj.length);
	//alert("insert proceduresteps");
	// tt=0;
	     $.each(obj, function (key, value) { 
		// tt=tt+1;
		
		query='INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("'+value.ProcID+'", "'+value.StepID+'", "'+value.OrdNum+'", "'+escapeDoubleQuotes(value.Text)+'", "'+value.Type+'", "'+value.Num+'", "'+value.SelAllComps+'", "'+value.SelAllFaults+'")';
		//alert(query);
		tx.executeSql(query);
		
     });
	 
	 $("#progressMessage").html("Procedures Steps updated");
	pbar.setValue(80);
	 }
	     	 catch(error)
	 {
		  $("#progressMessage").html("Error updating Procedures Steps "+error);
			pbar.setValue(80);
		 
	 }
	  
   
   //components
   
   try
   {
      obj=jQuery.parseJSON(newdatabasetoinsert.components);
	     $.each(obj, function (key, value) {
		query='INSERT INTO COMPONENTS (ID,Component,CompType) VALUES ("'+value.ID+'", "'+value.Component+'", "'+value.CompType+'")';
		tx.executeSql(query);
     });
	 
	 $("#progressMessage").html("Components updated");
		pbar.setValue(85);
   }
   catch(error)
   {
	   $("#progressMessage").html("Error updating Components "+error);
			pbar.setValue(85);
	   
	 }
	  
   
   //comps2faults
   try
   {
         obj=jQuery.parseJSON(newdatabasetoinsert.comps2faults);
	     $.each(obj, function (key, value) {
		query='INSERT INTO COMPS2FAULTS (ID,FaultID) VALUES ("'+value.ID+'","'+value.FaultID+'")';
		tx.executeSql(query);
     });
	 
	 $("#progressMessage").html("Components2faults updated");
		pbar.setValue(90);
   }
      catch(error)
   {
	   $("#progressMessage").html("Error updating Components2faults "+error);
			pbar.setValue(90);
	   
	 }
   
   //faults
   
     try
   {
         obj=jQuery.parseJSON(newdatabasetoinsert.faults);
	     $.each(obj, function (key, value) {
		query='INSERT INTO FAULTS (ID,Description,Priority) VALUES ("'+value.ID+'","'+escapeDoubleQuotes(value.Description)+'","'+value.Priority+'")';
		tx.executeSql(query);
     });
	 
	  $("#progressMessage").html("Faults updated");
		pbar.setValue(90);
   }
        catch(error)
   {
	   $("#progressMessage").html("Error updating Faults "+error);
			pbar.setValue(90);
	   
	 }
	    //Lang2Label
     try
   {
         obj=jQuery.parseJSON(newdatabasetoinsert.lang2label);
	     $.each(obj, function (key, value) {
		query='INSERT INTO LANG2LABEL (LabelID,Type,Lang1,Lang3) VALUES ("'+value.LabelID+'","'+value.Type+'","'+value.Lang1+'","'+value.Lang3+'")';
		tx.executeSql(query);
     });
	 
	   $("#progressMessage").html("Lang2Label updated");
		pbar.setValue(90);
   }
        catch(error)
   {
	   $("#progressMessage").html("Error updating Lang2Label "+error);
			pbar.setValue(90);
	   
   }
	 
	     //Step2comps
   
         
		// alert(newdatabasetoinsert.steps2comps);
		// if(obj.length>0)
		// {
			  try
   {
	   obj=jQuery.parseJSON(newdatabasetoinsert.steps2comps);
			 	     $.each(obj, function (key, value) {
		query='INSERT INTO STEPS2COMPS (StepID,CompID) VALUES ("'+value.StepID+'","'+value.CompID+'")';
		tx.executeSql(query);
     });
   }
        catch(error)
   {
	   $("#progressMessage").html("Error updating STEPS2COMPS "+error);
			pbar.setValue(90);
	   
   }
   
   
			  try
   {
	   obj=jQuery.parseJSON(newdatabasetoinsert.rejectedprocedures);
			 	     $.each(obj, function (key, value) {
		query='INSERT INTO REJECTED (SubmitID,ProcID,Name,UserID,Status,SubmitDate,RejectReason) VALUES ("'+value.SubmitID+'","'+value.ProcID+'","'+escapeDoubleQuotes(value.Name)+'","'+value.UserID+'","'+value.Status+'","'+value.SubmitDate+'","'+value.RejectReason+'")';
		tx.executeSql(query);
     });
   }
        catch(error)
   {
	   $("#progressMessage").html("Error updating REJECTED "+error);
			pbar.setValue(90);
	   
   }
   
   			  try
   {
	   obj=jQuery.parseJSON(newdatabasetoinsert.Appsettings);
			 	     $.each(obj, function (key, value) {
		query='UPDATE SETTINGS SET Language="'+value.InterfaceLang+'",DateFormat="'+value.DateFormat+'"';
		tx.executeSql(query);
     });
   }
        catch(error)
   {
	   $("#progressMessage").html("Error updating SETTINGS "+error);
			pbar.setValue(90);
	   
   }
   
      			  try
   {
	   obj=jQuery.parseJSON(newdatabasetoinsert.Usersettings);
			 	     $.each(obj, function (key, value) {
		query='INSERT INTO UserSettings (UserID,ClientName,DateFormat,InterfaceLang,ShowCertAlerts) VALUES ("'+value.UserID+'","'+value.ClientName+'","'+value.DateFormat+'","'+value.InterfaceLang+'","'+value.ShowCertAlerts+'")';
		tx.executeSql(query);
     });
   }
        catch(error)
   {
	   $("#progressMessage").html("Error updating SETTINGS "+error);
			pbar.setValue(90);
	   
   }
			 
		//  }

	 
	 $("#progressMessage").html("Step2comp updated");
		pbar.setValue(95);
	 
	 
	 
	 $("#progressMessage").html("Faults updated");
		pbar.setValue(100);
	
	$("#progressMessage").html("Updated device database");
		$("#progressheader").html("Sync completed");
	$("#progressMessage").html("");
		pbar.setValue(100);
		if(tt==0)
		{
					setTimeout( function(){ 
				  $(':mobile-pagecontainer').pagecontainer('change', '#pageMenu', {
        transition: 'flip',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		$("#generic-dialog").dialog("close"); 
	//	navbyapp("menu");
		}, 3000 );
			
		}
		else
		{
					setTimeout( function(){ 
				  $(':mobile-pagecontainer').pagecontainer('change', '#pageLogin', {
        transition: 'flip',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		$("#generic-dialog").dialog("close"); 
	//	navbyapp("menu");
		}, 3000 );
			
		}
		

		
		//alert("finishsssssss");	
		//alert("termino de subir archivos el tablet");
		//translatehtml();
	    updatelocaldatabase();
   
   //sendprocedures();


	
}

//function call submitted procedures


//SEND DATA TO SERVER
function sendprocedures()
{
	
	    showUpModal();
	 	$("#progressheader").html("Collecting data...");
		$("#progressMessage").html("Preparing data to send");
		pbar.setValue(0);
	 sendproceduresarray="";
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(Querytosendprocedures, errorCB);
	
}

function Querytosendprocedures(tx)
{
	var querytosend="SELECT * FROM SUBMITTEDPROCS WHERE Sync='no' AND Status='0'";
	tx.executeSql(querytosend, [], QuerytosendproceduresSuccess, errorCB);
	
}

function QuerytosendproceduresSuccess(tx,results)
{
	var len = results.rows.length;
	var array = [];
	//alert(len);
for (var i=0; i<results.rows.length; i++){
 row = results.rows.item(i);

  array.push(JSON.stringify(row));

}

sendproceduresarray=array;
	$("#progressMessage").html("Procedures ready to send");
		pbar.setValue(10);
sendsteps();
	
}

function sendsteps()
{
	 sendstepsarray="";
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(Querytosendsteps, errorCB);
	
}

function Querytosendsteps(tx)
{
	var querytosend="SELECT submittedsteps.* FROM submittedprocs INNER JOIN submittedsteps ON submittedprocs.SubmitID = submittedsteps.SubmitID WHERE submittedprocs.Status='0' AND submittedsteps.Sync='no'";
	tx.executeSql(querytosend, [], QuerytosendstepsSuccess, errorCB);
	
}

function QuerytosendstepsSuccess(tx,results)
{
	var len = results.rows.length;
	var array = [];
	//alert(len);
for (var i=0; i<results.rows.length; i++){
 row = results.rows.item(i);
 // alert(row.FaultID);
 array.push(JSON.stringify(row));



}

sendstepsarray=array;
	$("#progressMessage").html("Steps ready to send");
		pbar.setValue(20);
sendchecklists();

	
}

function sendchecklists()
{
	 sendchecklistarray="";
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(Querytosendchecklists, errorCB);
	
}

function Querytosendchecklists(tx)
{
	var querytosend="SELECT * FROM USERS2CHECKLISTS WHERE Sync='no'";
	tx.executeSql(querytosend, [], QuerytosendchecklistsSuccess, errorCB);
	
}

function QuerytosendchecklistsSuccess(tx,results)
{
	var len = results.rows.length;
	var array = [];
	//alert(len);
for (var i=0; i<results.rows.length; i++){
 row = results.rows.item(i);
array.push(JSON.stringify(row));



}
sendchecklistarray=array;
$("#progressMessage").html("Checklist ready to send");
pbar.setValue(30);
sendMessages();

	
}

function sendMessages()
{
	 sendmessages="";
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerytosendMessages, errorCB);
	
}

function QuerytosendMessages(tx)
{
	var querytosend="SELECT * FROM MESSAGES WHERE Sync='no'";
	tx.executeSql(querytosend, [], QuerytosendMessagesSuccess, errorCB);
}

function QuerytosendMessagesSuccess(tx,results)
{
	var len = results.rows.length;
	var array = [];
	//alert(len);
for (var i=0; i<results.rows.length; i++){
 row = results.rows.item(i);
 // alert(row.FaultID);
 array.push(JSON.stringify(row));



}

sendmessages=array;
	$("#progressMessage").html("Messages ready to send");
	pbar.setValue(40);
	sendSubmittedHours();

	
}

function sendSubmittedHours()
{
	 sendmessages="";
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerytosendSubmittedHours(), errorCB);
	
}

function QuerytosendSubmittedHours(tx)
{
	var querytosend="SELECT * FROM SUBMITTEDHOURS WHERE Sync='no'";
	tx.executeSql(querytosend, [], QuerytosendMessagesSuccess, errorCB);
}

function QuerytosendMessagesSuccess(tx,results)
{
	var len = results.rows.length;
	var array = [];
	//alert(len);
for (var i=0; i<results.rows.length; i++){
 row = results.rows.item(i);
 // alert(row.FaultID);
 array.push(JSON.stringify(row));



}

sendsubmittedhours=array;
	$("#progressMessage").html("Submitted Hours ready to send");
		pbar.setValue(50);
sendDataToServer();

	
}


function sendDataToServer()
{
	//alert("entro a enviar datos");
	var ipserver=$("#ipsync").val();
		$("#progressheader").html("Uploading Data...");
		$("#progressMessage").html("Preparing data to send");
		pbar.setValue(70);
	var obj = {};
 obj['procedures'] = JSON.stringify(sendproceduresarray);  //string
 obj['steps'] = JSON.stringify(sendstepsarray); 
 obj['checklists'] =JSON.stringify(sendchecklistarray); 
 obj['submittedcustomvalues'] ="[]";
 obj['Messages'] =JSON.stringify(sendmessages); 
 obj['SubmittedHours'] =JSON.stringify(sendsubmittedhours); 
 //var kaka=obj['procedures'];
 //alert("enviar datos"+ipserver+'//SetDeviceDataarray');
 //alert(kaka);
  $.ajax({
                    type: 'POST',
                   // url: 'http://192.168.1.129/test/serviceFt.asmx//SetDeviceDataarray',
				    url: ipserver+'//SetDeviceDataarray',
                    data: JSON.stringify(obj),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						pbar.setValue(100);
						sendmediaobj();// calling upload media
                       // alert(response.d);
           
                      
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
                    alert("Error sending data:" +xmlHttpRequest.responseText+" Status: "+textStatus+" thrown: "+errorThrown);
                    //setTimeout(function () { $("#generic-dialog").dialog("close"); }, 2000);
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
                });
				
					$("#progressMessage").html("successful sending data");
		
		//setTimeout( function(){ 
		//
		// }, 1000 );
		
 
	
}



 function sendmediaobj()
{
	    
		$("#progressheader").html("Uploading Media...");
		$("#progressMessage").html("Preparing data to send");
		pbar.setValue(0);
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(Querytosendmediaobj, errorCB);
	
}

function Querytosendmediaobj(tx)
{
	
	var querytosend="SELECT media.* FROM submittedprocs INNER JOIN media ON submittedprocs.SubmitID = media.SubmitID WHERE submittedprocs.Status='0' AND media.Sync='no'";
	//alert(querytosend);
	tx.executeSql(querytosend, [], QuerytosendmediaobjSuccess, errorCB);
	
	
}

function QuerytosendmediaobjSuccess(tx,results)
{
		var  len = results.rows.length;
	//var array = [];
	//alert("media "+len);
	if(len>0)
	{
pptoshow=100/parseFloat(len, 10);
ppinitial=0;
var tosend=0;
//alert(pptoshow+ppinitial);
for (var i=0; i<results.rows.length; i++){
tosend++;


 if(results.rows.item(i).FileType=="image")
 {
	 uploadPhotoServer(results.rows.item(i).Path,results.rows.item(i).SubmitID,results.rows.item(i).StepID,results.rows.item(i).FileType);
  }
  else
  {
	 uploadVideoServer(results.rows.item(i).Path,results.rows.item(i).SubmitID,results.rows.item(i).StepID,results.rows.item(i).FileType);
   }
   
   //if(tosend==len)
   //{
	   //alert("termino archivos");

	//}
 //array.push(JSON.stringify(row));


}


		
	}
	else
	{
		$("#progressMessage").html("No Media found");
		pbar.setValue(100);
		GetservicedataTasks();
		
		
	}


		

	
}


//Upload Videos
function uploadVideoServer(VideoURI,SubmitID,StepID,FileType) {
	//alert("akavideo"+VideoURI+"---->"+SubmitID+"---->"+StepID+"---->"+FileType);
	var ipserver=$("#ipsync").val();
            var options = new FileUploadOptions();
			options.chunkedMode = true;
            options.fileKey="recFile";
            var imagefilename = Number(new Date())+".mp4";
            options.fileName=imagefilename;
            options.mimeType="video/mp4";

            var params = new Object();
            params.submitid = SubmitID;
            params.stepid = StepID;
			params.filetype = FileType;

            options.params = params;

            var ft = new FileTransfer();
			//
            //ft.upload(VideoURI, "http://"+ipserver+"/ftservice/service1.asmx/UploadFile", winftp, failftp, options);
			//alert("http://'+ipserver+'/service1.asmx/UploadFile");
			ft.upload(VideoURI, ipserver+"/UploadFile", winftp, failftp, options);
        }

//Upload Images
function uploadPhotoServer(imageURI,SubmitID,StepID,FileType) {
	//alert("akaimage"+imageURI+"---->"+SubmitID+"---->"+StepID+"---->"+FileType);
	var ipserver=$("#ipsync").val();
            var options = new FileUploadOptions();
			options.chunkedMode = true;
            options.fileKey="recFile";
            var imagefilename = Number(new Date())+".jpg";
            options.fileName=imagefilename;
            options.mimeType="image/jpeg";

            var params = new Object();
            params.submitid = SubmitID;
            params.stepid = StepID;
			params.filetype = FileType;

            options.params = params;
			

            var ft = new FileTransfer();
           // ft.upload(imageURI, "http://"+ipserver+"/ftservice/service1.asmx/UploadFile", winftp, failftp, options);
		   
		   ft.upload(imageURI, ipserver+"/UploadFile", winftp, failftp, options);
        }

function winftp(r) {
	        // alert(r.response);
			ppinitial= parseFloat(ppinitial, 10)+parseFloat(pptoshow, 10);
            //console.log("Code = " + r.responseCode);
            //console.log("Response = " + r.response);
		//alert(pptoshow);
			//pptoshow= pptshow + ppinitial;
			//alert(r.response);
			$("#progressMessage").html("Sent = " + r.bytesSent+" Response ="+r.response);
			pbar.setValue(parseInt(ppinitial, 10));
			if(parseInt(ppinitial, 10)==100)
			{
				//alert("termino");
				GetservicedataTasks();
			}
			//pbar.setValue(pptoshow);
			//alert(pptoshow);
            //alert("Sent = " + r.bytesSent);
        }

        function failftp(error) {
            alert("An error has occurred uploading file: Code = " + error.code);
        }


//function to update local database

function updatelocaldatabase()
{
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(Querytoupdatelocal, errorCB);
}

function Querytoupdatelocal(tx)
{
	tx.executeSql("UPDATE USERS2CHECKLISTS SET sync='yes'");
	tx.executeSql("UPDATE MEDIA SET sync='yes'");
	tx.executeSql("UPDATE SUBMITTEDPROCS SET sync='yes'");
	tx.executeSql("UPDATE SUBMITTEDSTEPS SET sync='yes'");
	//alert("All updated");
}

///////=============================<<<<<<<<<<<< END WEB SERVICES >>>>>>>>>>>=========================================///////