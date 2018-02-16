// Library
var GroupsList_array = new Array();
var resultsonfile;
var CountDownloads=0;
var CountNow=0;
var CountReady=0;
var FileNameD="";
var RemoteUR="";
var jandlet;


function OpenLibrary()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryOpenLibrary, errorCB);
}

function QueryOpenLibrary(tx)
{
	var UseraID=sessionStorage.userid;
	tx.executeSql('SELECT GROUPS.Description,GROUPS.GroupID FROM USERS2GROUPS INNER JOIN Groups ON Users2Groups.ID = GROUPS.GroupID WHERE UserID="'+UseraID+'"', [], QueryOpenLibraryFSuccess, errorCB);
	
}

function QueryOpenLibraryFSuccess(tx,results)
{
	var dbtwo = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    dbtwo.transaction(function(tx){ QueryLibraryGetFiles(tx,results) }, errorCB);
}

function QueryLibraryGetFiles(txtwo,resultstwo)
{
    GroupsList_array = new Array();
	var lentwo=resultstwo.rows.length;
	//alert("USERS2GRoups="+lentwo);
	var querytwo="SELECT  GROUPS2CONTENT.GroupID,COURSES.ID,COURSES.Description,COURSES.FileName,COURSES.FileSize  FROM GROUPS2CONTENT INNER JOIN COURSES ON GROUPS2CONTENT.ID = COURSES.ID WHERE COURSES.ContentType='F' ";
	for (var i=0; i<lentwo; i++){
		if(i==0)
		{
		  querytwo+='AND (GroupID="'+resultstwo.rows.item(i).GroupID+'"';	
		}
		else
		{
			querytwo+=' OR GroupID="'+resultstwo.rows.item(i).GroupID+'"';
		}
		//GroupsList_array.push(resultstwo.rows.item(i).GroupID);
	}
	if(lentwo>0)
	{
		querytwo+=")";
	}
	querytwo+=" ORDER BY Ord";
	//alert(querytwo);
	//querytwo="SELECT * FROM Courses WHERE ContentType='F'";
	//alert(querytwo);
	//querytwo="SELECT * FROM GROUPS2CONTENT";
	txtwo.executeSql(querytwo, [],function(tx,results){ QueryLibraryGetFilesTwo(tx,results,resultstwo) }, errorCB);
}

function QueryLibraryGetFilesTwo(tx,results,resultstwo)
{
	//alert("resultsworks");
	var htmltowrite="";
	var htmlfiles="";
	var descfiles=""
	var countfiles=0;
	var lenGroups=resultstwo.rows.length;
	var len=results.rows.length;
	//alert("lentwo="+len);
	for (var i=0; i<lenGroups; i++){
		htmltowrite+='<div data-role="collapsible" data-filtertext="'+resultstwo.rows.item(i).Description;
		htmlfiles="";
		descfiles="";
		countfiles=0;
		for (var y=0; y<len; y++){
			if(results.rows.item(y).GroupID==resultstwo.rows.item(i).GroupID)
			{
				countfiles=countfiles+1;
			htmlfiles+='<li><a href="javascript:OpenFile('+"'"+results.rows.item(y).FileName+"'"+');">'+results.rows.item(y).Description+'</a></li>';
		descfiles+=','+results.rows.item(y).Description;
				
			}
			
			
		}
		//alert(i);
		htmltowrite+=descfiles+'"><h3>'+resultstwo.rows.item(i).Description+'</h3><ul data-role="listview" id="listv'+i+'" data-inset="false" data-mini="true">';
		htmltowrite+=htmlfiles;
		htmltowrite+='</ul></div>';
		//Animals,cats,dogs,lizards,snakes"><h3>'+resultstwo.rows.item(i).Description+'</h3>';
		
	}
	//alert(htmltowrite);
	$("#collapsiblesetForFilter").html(htmltowrite);
	for (var i=0; i<lenGroups; i++){
		//alert("resf="+'#listv'+i);
		$('#listv'+i).listview().listview('refresh');
	}
	$("#pageLibrary").trigger("create");
	
	 //alert("refres");
	
}



//OpenFile

var onSuccessYa = function(data) {
   //alert('message: ' + data.message);
   //return true;
};

function onErrorYa(error) {
    //alert('message: ' + error.message);
	 navigator.notification.alert("Please Check file on app folder or download", null, 'FieldTracker', 'Accept');
}

function ifCheckFile(FileNames)
{
			// What directory should we place this in?
if (cordova.file.documentsDirectory !== null) {
    // iOS, OSX
    DownloadDirectory = cordova.file.documentsDirectory;
} else if (cordova.file.sharedDirectory !== null) {
    // BB10
   DownloadDirectory = cordova.file.sharedDirectory;
} else if (cordova.file.externalRootDirectory !== null) {
    // Android, BB10
    DownloadDirectory = cordova.file.externalRootDirectory;
} else {
    // iOS, Android, BlackBerry 10, windows
    DownloadDirectory = cordova.file.DataDirectory;
} 
DownloadDirectory+="FieldTracker/"+FileNames;
	window.cordova.plugins.FileOpener.canOpenFile(DownloadDirectory, onSuccessYa, onErrorYa);
	//alert(onSuccessYa+"mira si abrio");
	//window.cordova.plugins.FileOpener.openFile(DownloadDirectory, onSuccessOpen, onErrorOpen);

	
}

var onSuccessOpen = function(data) {
    alert('extension: ' + data.extension + '\n' +
         'canBeOpen: ' + data.canBeOpen);
		  
};

// onError Callback receives a json object
//
function onErrorOpen(error) {
    alert('message: '  + error.message);
	
}


function OpenFile(FileNames)
{
			// What directory should we place this in?
if (cordova.file.documentsDirectory !== null) {
    // iOS, OSX
    DownloadDirectory = cordova.file.documentsDirectory;
} else if (cordova.file.sharedDirectory !== null) {
    // BB10
   DownloadDirectory = cordova.file.sharedDirectory;
} else if (cordova.file.externalRootDirectory !== null) {
    // Android, BB10
    DownloadDirectory = cordova.file.externalRootDirectory;
} else {
    // iOS, Android, BlackBerry 10, windows
    DownloadDirectory = cordova.file.DataDirectory;
} 
DownloadDirectory+="FieldTracker/"+FileNames;
//alert(DownloadDirectory);
//window.cordova.plugins.FileOpener.canOpenFile(DownloadDirectory, onSuccessOpen, onErrorOpen);
window.cordova.plugins.FileOpener.openFile(DownloadDirectory, onSuccessYa, onErrorYa);
}


//Download File
function downloadFile(fileName,RemoteURL){
		// What directory should we place this in?
if (cordova.file.documentsDirectory !== null) {
    // iOS, OSX
    DownloadDirectory = cordova.file.documentsDirectory;
} else if (cordova.file.sharedDirectory !== null) {
    // BB10
   DownloadDirectory = cordova.file.sharedDirectory;
} else if (cordova.file.externalRootDirectory !== null) {
    // Android, BB10
    DownloadDirectory = cordova.file.externalRootDirectory;
} else {
    // iOS, Android, BlackBerry 10, windows
    DownloadDirectory = cordova.file.DataDirectory;
} 
DownloadDirectory+="FieldTracker"
downloadFileN(DownloadDirectory,fileName,RemoteURL);


}

function downloadFileN(savePath, fileName, remoteURL) {
    window.resolveLocalFileSystemURL(savePath, function (dirEntry) {
        console.log('file system open: ' + dirEntry.name);
        createFile(dirEntry, fileName, function (fileEntry) {
            download(remoteURL, fileEntry);
        });
    }, function (err) { alert(err) });
}

function createFile(dirEntry, fileName, callback) {
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
        callback(fileEntry);
    }, function (err) { alert(err) });

}
function download(remoteURL, fileEntry) {
    var fileURL = fileEntry.toURL();
    var fileTransfer = new FileTransfer();
    fileTransfer.download(
        remoteURL,
        fileURL,
        function (entry) {
			CountDownloads++;
			pbar.setValue(100);
           // alert("download complete: " + entry.fullPath);
        },
        function (error) {
			CountDownloads++;
			pbar.setValue(10);
            alert("download error source " + error.source+" download error target " + error.target+ "upload error code" + error.code);
        });
}

//Sync 

function opensynclib()
{
	CountDownloads=0;
	CountNow=0;
	CountReady=0;
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(GetLibrarySync, errorCB);
}

function GetLibrarySync(tx)
{
	var querytosend="SELECT * FROM SETTINGS";
	//alert(querytosend);
	tx.executeSql(querytosend, [], function(tx,results){ GetLibrarySyncSuccess(tx,results) }, errorCB);
}

function GetLibrarySyncSuccess(tx,results)
{
	//alert(len);
	var len = results.rows.length;
	if(len>0)
	{
		$("#ipsync").val(results.rows.item(0).IP);
		RemoteUR=results.rows.item(0).IP;
		SyncLibrary();
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

function SyncLibrary()
{
	var ipserver=$("#ipsync").val();
	//alert("sync");
	 showUpModal();
	 	$("#progressheader").html("Connecting...");
		$("#progressMessage").html("Waiting for server connection");
		pbar.setValue(0);
			                $.ajax({
                    type: 'POST',
                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
				    url:ipserver+'//GetLibrary',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						//alert(response.d);
						//alert("WEb service works");
						InsertDatabaseLib(response.d);
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

function InsertDatabaseLib(newdatabase)
{
	$("#progressheader").html("Connected");
	$("#progressMessage").html("Successful connection");
	pbar.setValue(10);
	newlibrarydatatoinsert=newdatabase;
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoinsertLibrary, errorCB);
}

function QuerytoinsertLibrary(tx)
{
	$("#progressMessage").html("Deleting old records");
	pbar.setValue(2);
	tx.executeSql("DELETE FROM COURSES");
	tx.executeSql("DELETE FROM GROUPS2CONTENT");
	tx.executeSql("DELETE FROM USERS2GROUPS");
	tx.executeSql("DELETE FROM GROUPS");
	var obj = jQuery.parseJSON(newlibrarydatatoinsert.Courses);
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
	// alert("1");
	 	$("#progressMessage").html("Courses updated");
	pbar.setValue(40);
	 }
	 catch(error)
	 {
		 alert(error);
		 $("#progressMessage").html("Error updating Courses "+error);
			pbar.setValue(40);
		 
	 }
	 	 itemcount=0;
	 try
	 {
	obj=jQuery.parseJSON(newlibrarydatatoinsert.Groups2Content);
    $.each(obj, function (key, value) {
		//alert('INSERT INTO USERS (Username,Password,FirstName,LastName,LevelNum) VALUES ("'+value.Username+'", "'+value.Password+'","'+value.FirstName+'","'+value.LastName+'","'+value.LevelNum+'")');
		query='INSERT INTO GROUPS2CONTENT (GroupID,ID,Ord) VALUES ("'+escapeDoubleQuotes(value.GroupID)+'", "'+escapeDoubleQuotes(value.ID)+'","'+escapeDoubleQuotes(value.Ord)+'")';
		//alert(query);
		tx.executeSql(query);
		itemcount++;
     });
	// alert("totalGroups2content: "+itemcount);
	// alert("2");
	 	$("#progressMessage").html("Groups2Content updated");
	pbar.setValue(50);
	 }
	 catch(error)
	 {
		 alert(error);
		 $("#progressMessage").html("Error updating Groups2Content "+error);
			pbar.setValue(50);
		 
	 }
	 
	 	  try
	 {
	  obj=jQuery.parseJSON(newlibrarydatatoinsert.Users2groups);
	  	 //alert("User2Groups:"+obj.length);
	     $.each(obj, function (key, value) {
		
		query='INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("'+value.UserID+'","'+value.ID+'")';
		tx.executeSql(query);
     });
	// alert("3");
	$("#progressMessage").html("Users2groups updated");
	pbar.setValue(60);
	 }
	 	 catch(error)
	 {
		 alert(error);
		  $("#progressMessage").html("Error updating Users2groups "+error);
			pbar.setValue(60);
		 
	 }
	 
	 	 try
	 {
		 	 obj=jQuery.parseJSON(newlibrarydatatoinsert.Groups);
			 //alert("Groups:"+obj.length);
	     $.each(obj, function (key, value) {
		query='INSERT INTO GROUPS (AreaID,GroupID,Description,Location) VALUES ("'+escapeDoubleQuotes(value.AreaID)+'","'+escapeDoubleQuotes(value.GroupID)+'","'+escapeDoubleQuotes(value.Description)+'","'+escapeDoubleQuotes(value.Location)+'")';
		tx.executeSql(query);
	
     });
	 	 $("#progressMessage").html("Groups updated");
	pbar.setValue(100);
		 //alert("4");
	 }
	 catch(error)
	 {
		 alert(error);
		  $("#progressMessage").html("Error updating Groups "+error);
			pbar.setValue(20);
		 
	 }
	 //GetTableFiles();
	 FtpDownFiles();
	 
}

function FtpDownFiles()
{
	$("#progressMessage").html("Downloading Files");
	pbar.setValue(0);
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryFtpDownFiles, errorCB);
	
}

function QueryFtpDownFiles(tx)
{
	//alert("primer query");
	var UseraID=sessionStorage.userid;
	tx.executeSql('SELECT GROUPS.Description,GROUPS.GroupID FROM USERS2GROUPS INNER JOIN Groups ON Users2Groups.ID = GROUPS.GroupID WHERE UserID="'+UseraID+'"', [], QueryFtpDownFilesSuccess, errorCB);
	
}

function QueryFtpDownFilesSuccess(txtwo,resultstwo)
{
	//alert("Query2");
	GroupsList_array = new Array();
	var lentwo=resultstwo.rows.length;
	//alert("USERS2GRoups="+lentwo);
	var querytwo="SELECT  GROUPS2CONTENT.GroupID,COURSES.ID,COURSES.Description,COURSES.FileName,COURSES.FileSize  FROM GROUPS2CONTENT INNER JOIN COURSES ON GROUPS2CONTENT.ID = COURSES.ID WHERE COURSES.ContentType='F' ";
	for (var i=0; i<lentwo; i++){
		if(i==0)
		{
		  querytwo+='AND (GroupID="'+resultstwo.rows.item(i).GroupID+'"';	
		}
		else
		{
			querytwo+=' OR GroupID="'+resultstwo.rows.item(i).GroupID+'"';
		}
		//GroupsList_array.push(resultstwo.rows.item(i).GroupID);
	}
	if(lentwo>0)
	{
		querytwo+=")";
	}
	querytwo+=" ORDER BY Ord";
	txtwo.executeSql(querytwo, [],function(tx,results){ QueryFtpDownFilesSuccessTwo(tx,results,resultstwo) }, errorCB);

}

function QueryFtpDownFilesSuccessTwo(tx,results,resultstwo)
{
	//alert("bajar");
	if (cordova.file.documentsDirectory !== null) {
    // iOS, OSX
    DownloadDirectory = cordova.file.documentsDirectory;
} else if (cordova.file.sharedDirectory !== null) {
    // BB10
   DownloadDirectory = cordova.file.sharedDirectory;
} else if (cordova.file.externalRootDirectory !== null) {
    // Android, BB10
    DownloadDirectory = cordova.file.externalRootDirectory;
} else {
    // iOS, Android, BlackBerry 10, windows
    DownloadDirectory = cordova.file.DataDirectory;
} 
DownloadDirectory+="FieldTracker/";
var downloadfile="";	
var len=results.rows.length;
CountReady=len;
	for (var i=0; i<len; i++){
		downloadfile=DownloadDirectory+results.rows.item(i).FileName;
		FileNameD=results.rows.item(i).FileName;
		var resfilema = FileNameD.split(' ').join('%20');
		pbar.setValue(0);
		var fileID=results.rows.item(i).ID;
		var resfileid = fileID.split(' ').join('%20');
		$("#progressMessage").html("Downloading File:"+resfilema);
		var resUR = RemoteUR+"/GetFile?IdFile="+resfileid
		//alert(resUR);
		downloadFile(FileNameD,resUR);				
	}
	
	jandlet=setInterval(function(){ 
	var sumsss=CountDownloads+CountNow;
	//alert("suma="+sumsss);
	if(CountReady==sumsss)
	{
		//alert("finalizar");
		finishsynclib();
	}
	//{
		//alert("clear");
		//clearInterval(handle);
	//}
	 }, 3000);
	
}

//function GetTableFiles()
//{
//	$("#progressheader").html("Download Files...");
//	$("#progressMessage").html("Waiting for server connection");
//	pbar.setValue(0);
//	var ipserver=$("#ipsync").val();
//	var obj = {};
//		 if(!!sessionStorage.userid)
//		 {
//			 obj['UserID'] =sessionStorage.userid;
//		 }
//		 else
//		 {
//			 obj['UserID'] ="";
//			 
//		 }
//	 $.ajax({
//                    type: 'POST',
//                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
//				    url:ipserver+'//GetUrls',
//					data: JSON.stringify(obj),
//                    dataType: 'json',
//                    contentType: 'application/json; charset=utf-8',
//                    success: function (response) {
//						//alert(response.d);
//						//alert("WEb service works");
//						InsertDatabaseurls(response.d);
//                        //alert(response.d.users);
//                       // var obj = jQuery.parseJSON(response.d.users);
//                       // $.each(obj, function (key, value) {
//                         //   alert(value.Username);//inserts users
//                        //});
//                       // $('#lblData').html(JSON.stringify());
//                    },
//            error: function (xmlHttpRequest, textStatus, errorThrown) {
//							$("#progressheader").html("Can not connect to server");
//							$("#progressMessage").html("ERROR Downloading Data:"+xmlHttpRequest.responseText+" Status: "+textStatus+" thrown: "+errorThrown);
//							setTimeout( function(){ $("#generic-dialog").dialog("close"); }, 6000 );
//                    console.log(xmlHttpRequest.responseText);
//                    console.log(textStatus);
//                    console.log(errorThrown);
//                   // alert("Error");
//                }
//                });
//}
//
//function InsertDatabaseurls(newdatabase)
//{
//	$("#progressMessage").html("Successful connection");
//	pbar.setValue(15);
//	newfilesdatatoinsert=newdatabase;
//	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
//    db.transaction(Querytoinsertfilesinfo, errorCB);
//	
//}
//
//function Querytoinsertfilesinfo(tx)
//{
//	tx.executeSql("DELETE FROM FILESDATA");
//	$("#progressMessage").html("Updating Media Data");
//	var obj = jQuery.parseJSON(newfilesdatatoinsert.MediaFiles);
//	var itemcount=0;
//	 try
//	 {
//    $.each(obj, function (key, value) {
//		//alert('INSERT INTO USERS (Username,Password,FirstName,LastName,LevelNum) VALUES ("'+value.Username+'", "'+value.Password+'","'+value.FirstName+'","'+value.LastName+'","'+value.LevelNum+'")');
//		query='INSERT INTO FILESDATA (FileID,FileUrl,FileName) VALUES ("'+escapeDoubleQuotes(value.FileID)+'","'+escapeDoubleQuotes(value.FileUrl)+'","'+escapeDoubleQuotes(value.FileName)+'")';
//		//alert(query);
//		tx.executeSql(query);
//		var filenamesc=escapeDoubleQuotes(value.FileName);
//		//alert(filenamesc+"==>"+filenamesc);
//		//downloadFile(filenamesc,value.FileUrl);
//     });
//	// alert("totalGroups2content: "+itemcount);
//	// alert("1");
//	 	$("#progressMessage").html("Media Data updated");
//	pbar.setValue(100);
//	 }
//	 catch(error)
//	 {
//		 alert(error);
//		 $("#progressMessage").html("Error Media Files "+error);
//			pbar.setValue(70);
//		 
//	 }
//	 	 itemcount=0;
//	//newlibrarydatatoinsert
//	FtpDownFiles();
//}
//
//function FtpDownFiles()
//{
//	$("#progressMessage").html("Downloading Files");
//	pbar.setValue(0);
//	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
//    db.transaction(QueryFtpDownFiles, errorCB);
//}
//
//function QueryFtpDownFiles(tx)
//{
//	var UseraID=sessionStorage.userid;
//	tx.executeSql('SELECT * FROM FILESDATA', [], QueryFtpDownFilesSuccess, errorCB);
//	
//}
//
//function QueryFtpDownFilesSuccess(tx,results)
//{
//	if (cordova.file.documentsDirectory !== null) {
//    // iOS, OSX
//    DownloadDirectory = cordova.file.documentsDirectory;
//} else if (cordova.file.sharedDirectory !== null) {
//    // BB10
//   DownloadDirectory = cordova.file.sharedDirectory;
//} else if (cordova.file.externalRootDirectory !== null) {
//    // Android, BB10
//    DownloadDirectory = cordova.file.externalRootDirectory;
//} else {
//    // iOS, Android, BlackBerry 10, windows
//    DownloadDirectory = cordova.file.DataDirectory;
//} 
//DownloadDirectory+="FieldTracker/";
//var downloadfile="";	
//var len=results.rows.length;
//CountReady=len;
//	for (var i=0; i<len; i++){
//		downloadfile=DownloadDirectory+results.rows.item(i).FileName;
//		FileNameD=results.rows.item(i).FileName;
//		var resfilema = FileNameD.replace(" ","%20");
//		pbar.setValue(0);
//		$("#progressMessage").html("Downloading File:"+resfilema);
//		var resUR = RemoteUR.replace("/ServiceFt.asmx", "/library/"+resfilema);
//		//alert(resUR);
//		downloadFile(FileNameD,resUR);
//		//window.cordova.plugins.FileOpener.canOpenFile(downloadfile, function(data){
//          //         alert('extension: ' + data.extension + '\n' +
//         //'canBeOpen: ' + data.canBeOpen);
//	         
//			//}, function(error){
//			//	 alert('message: '  + error.message);
//				
//			//	});				
//	}
//	
//	jandlet=setInterval(function(){ 
//	var sumsss=CountDownloads+CountNow;
//	//alert("suma="+sumsss);
//	if(CountReady==sumsss)
//	{
//		//alert("finalizar");
//		finishsynclib();
//	}
//	//{
//		//alert("clear");
//		//clearInterval(handle);
//	//}
//	 }, 3000);
//}


function finishsynclib()
{
	//alert("finish");
    clearInterval(jandlet);
	pbar.setValue(100);
	$("#progressheader").html("Sync completed");
	setTimeout( function(){ 
	 	$(':mobile-pagecontainer').pagecontainer('change', '#pageLibrary', {
 	 	transition: 'flip',
		changeHash: false,
		reverse: true,
		showLoadMsg: true
		});
	}, 3000 );
	
}

function SyncOnlyData()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	db.transaction(SyncOnlyDataQuery, errorCB);
	
}

function SyncOnlyDataQuery(tx)
{
	var querytosend="SELECT * FROM SETTINGS";
	tx.executeSql(querytosend, [], function(tx,results){ SyncOnlyDataSuccess(tx,results) }, errorCB);
}

function SyncOnlyDataSuccess(tx,results)
{
	var len = results.rows.length;
	if(len>0)
	{
		$("#ipsync").val(results.rows.item(0).IP);
		var ipserver=$("#ipsync").val();
		sendLibraryalone="";
    	PostToinsertLibrary();
	}
	
}

function PostToinsertLibrary()
{
	var ipserver=$("#ipsync").val();
			                $.ajax({
                    type: 'POST',
                    //url: 'http://dc4life78-001-site6.dtempurl.com/ServiceFt.asmx//GetStructureData',
				    url:ipserver+'//GetLibrary',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
						//alert(response.d);
						//alert("WEb service works Library");
						InsertDatabaseLibSilence(response.d);
                        //alert(response.d.users);
                       // var obj = jQuery.parseJSON(response.d.users);
                       // $.each(obj, function (key, value) {
                         //   alert(value.Username);//inserts users
                        //});
                       // $('#lblData').html(JSON.stringify());
                    },
            error: function (xmlHttpRequest, textStatus, errorThrown) {
				    OpenLibrary();
				    //alert("no sincronizo");
                    console.log(xmlHttpRequest.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                   // alert("Error");
                }
                });
	
}

function InsertDatabaseLibSilence(newdatabase)
{
	sendLibraryalone=newdatabase;
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerySLibrary, errorCB);
}

function QuerySLibrary(tx)
{
  tx.executeSql("DELETE FROM COURSES");
  tx.executeSql("DELETE FROM GROUPS2CONTENT");
  tx.executeSql("DELETE FROM USERS2GROUPS");
  tx.executeSql("DELETE FROM GROUPS");
  var obj = jQuery.parseJSON(sendLibraryalone.Courses);
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
	 }
	 catch(error)
	 {
		 
	 }
	 	 itemcount=0;
	 try
	 {
	obj=jQuery.parseJSON(sendLibraryalone.Groups2Content);
    $.each(obj, function (key, value) {
		//alert('INSERT INTO USERS (Username,Password,FirstName,LastName,LevelNum) VALUES ("'+value.Username+'", "'+value.Password+'","'+value.FirstName+'","'+value.LastName+'","'+value.LevelNum+'")');
		query='INSERT INTO GROUPS2CONTENT (GroupID,ID,Ord) VALUES ("'+escapeDoubleQuotes(value.GroupID)+'", "'+escapeDoubleQuotes(value.ID)+'","'+escapeDoubleQuotes(value.Ord)+'")';
		//alert(query);
		tx.executeSql(query);
		itemcount++;
     });
	 }
	 catch(error)
	 {
		 alert(error);

		 
	 }
	 
	 	  try
	 {
	  obj=jQuery.parseJSON(sendLibraryalone.Users2groups);
	  	 //alert("User2Groups:"+obj.length);
	     $.each(obj, function (key, value) {
		
		query='INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("'+value.UserID+'","'+value.ID+'")';
		tx.executeSql(query);
     });
	// alert("3");
	$("#progressMessage").html("Users2groups updated");

	 }
	 	 catch(error)
	 {
		 alert(error);

		 
	 }
	 
	 	 try
	 {
		 	 obj=jQuery.parseJSON(sendLibraryalone.Groups);
			 //alert("Groups:"+obj.length);
	     $.each(obj, function (key, value) {
		query='INSERT INTO GROUPS (AreaID,GroupID,Description,Location) VALUES ("'+escapeDoubleQuotes(value.AreaID)+'","'+escapeDoubleQuotes(value.GroupID)+'","'+escapeDoubleQuotes(value.Description)+'","'+escapeDoubleQuotes(value.Location)+'")';
		tx.executeSql(query);
	
     });
	 	 $("#progressMessage").html("Groups updated");

		 //alert("4");
	 }
	 catch(error)
	 {
		 alert(error);

		 
	 }
	 OpenLibrary();
	
}


function postToBase64()
{
	         var url = "http://192.168.1.131/FieldTrackerService/ServiceFT.asmx/GetFile?IdFile=123";
			 downloadFile("prueba.pdf",url);
    
}

//Helper function that converts base64 to blob
function b64toBlob(b64Data, contentType, sliceSize) {
    var input = b64Data.replace(/\s/g, ''),
        byteCharacters = atob(input),
        byteArrays = [],
        offset, slice, byteNumbers, i, byteArray, blob;

    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        slice = byteCharacters.slice(offset, offset + sliceSize);

        byteNumbers = new Array(slice.length);
        for (i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    //Convert to blob. 
    try {
        blob = new Blob(byteArrays, { type: contentType });
    }
    catch (e) {
        // TypeError old chrome, FF and Android browser
        window.BlobBuilder = window.BlobBuilder ||
                             window.WebKitBlobBuilder ||
                             window.MozBlobBuilder ||
                             window.MSBlobBuilder;
        if (e.name == 'TypeError' && window.BlobBuilder) {
            var bb = new BlobBuilder();
            for (offset = 0; offset < byteArrays.length; offset += 1) {
                bb.append(byteArrays[offset].buffer);
            }                    
            blob = bb.getBlob(contentType);
        }
        else if (e.name == "InvalidStateError") {
            blob = new Blob(byteArrays, {
                type: contentType
            });
        }
        else {
            return null;
        }
    }

    return blob;
};

/**
 * Create a PDF file according to its database64 content only.
 * 
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
 */
function savebase64AsPDF(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);
    
    console.log("Starting to write the file :3");
    
    window.resolveLocalFileSystemURL(folderpath, function(dir) {
        console.log("Access to the directory granted succesfully");
		dir.getFile(filename, {create:true}, function(file) {
            console.log("File created succesfully.");
            file.createWriter(function(fileWriter) {
                console.log("Writing content to file");
                fileWriter.write(DataBlob);
            }, function(){
                alert('Unable to save file in path '+ folderpath);
            });
		});
    });
}



/////TEST SYNC
function TestSync()
{
	var url = $("#ipsettinginit").val();
		 $.ajax({
                type: 'POST',
                url: url + '//HelloTest',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
				crossDomain: true,
                success: function (response) {
                    if(response.d=="Hello World")
					{
						 navigator.notification.alert("Connected to "+url);
						
					}
					else
					{
						alert(response.d);
					}
                    


                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    navigator.notification.alert("Error sending data:" + xmlHttpRequest.responseXML + " Status: " + textStatus + "==>" + xmlHttpRequest.statusText + " thrown: " + errorThrown);
                    //setTimeout(function () { $("#generic-dialog").dialog("close"); }, 2000);
                    console.log(xmlHttpRequest.responseXML);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
}


