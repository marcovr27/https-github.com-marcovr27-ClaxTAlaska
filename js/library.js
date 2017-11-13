// Library
var GroupsList_array = new Array();

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
			htmlfiles+='<li>'+results.rows.item(y).Description+'</li>';
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

//Download File
function downloadFile(){
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
alert(DownloadDirectory);
downloadFileN(DownloadDirectory,"pavimentacion_nogales_son.pdf","http://www.becc.org/uploads/files/pavimentacion_nogales_son.pdf");


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
            alert("download complete: " + entry.fullPath);
        },
        function (error) {
            alert("download error source " + error.source);
            alert("download error target " + error.target);
            alert("upload error code" + error.code);
        });
}