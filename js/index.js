//CLAXTRACK SOLUTIONS 2014 --- (Developer:Marco Velarde) ---- DATE:10/7/2014 


///////<<<<<<<<<<<<============================= GLOBAL VARIABLES =========================================>>>>>>>>>>>///////
var newdatabasetoinsert;//Variable to get all tables from web service and insert on device db;
var newtasksdatatoinsert;
var newgroupsdatatoinsert;
var newcoursesdatatoinsert;
var newhoursdatatoinsert;
var newmessagesdatatoinsert;
var newlibrarydatatoinsert;
var newfilesdatatoinsert;
var sendproceduresarray; //Sync Variables
var sendstepsarray; //Sync Variables
var sendchecklistarray;//Sync Variables
var sendmessages;//Sync Variables
var sendsubmittedhours;//Sync Variables
var synchours;
var syncmessages;
var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var capture; // The global capture object
var SyncDB=false; //Show if the database is updated
var texportDirectory = "";
var DownloadDirectory = "";
var tsubdir = "EvalArcs";
var FilterMessages="inbox";
var arrayresponses = [];
var tt=0;
var pbar = jQMProgressBar('progressbar')
   					.setOuterTheme('b')
                    .setInnerTheme('e')
                    .isMini(true)
                    .showCounter(true)
					.setMax(100)
					.setStartFrom(0);
                    
var pptoshow=0;
var ppinitial=0;
              


///////<<<<<<<<<<<<============================= FUNCTION TO CHANGE BUTTON TEXT =========================================>>>>>>>>>>>///////
                  
(function($) {
    
//     * Changes the displayed text for a jquery mobile button.
//     * Encapsulates the idiosyncracies of how jquery re-arranges the DOM
//     * to display a button for either an <a> link or <input type="button">
     
    $.fn.changeButtonText = function(newText) {
        return this.each(function() {
            $this = $(this);
            if( $this.is('a') ) {
                $('span.ui-btn-text',$this).text(newText);
                return;
            }
            if( $this.is('input') ) {
                $this.val(newText);
                // go up the tree
                var ctx = $this.closest('.ui-btn');
                $('span.ui-btn-text',ctx).text(newText);
                return;
            }
        });
    };
})(jQuery);

///////<<<<<<<<<<<<=============================LOADING MODAL FUNCTIONS =========================================>>>>>>>>>>>///////
function showUpModal()
{
	
	$.mobile.changePage("#generic-dialog", { role: "dialog" });
	try {
	pbar.build();
	}
	catch(err)
	{
		//alert(err.message);
	}
}

function showModal(){

 setTimeout(function(){
    $.mobile.loading('show');
},1);

}

function hideModal(){
setTimeout(function(){
    $.mobile.loading('hide');
},1);

}


///////=============================<<<<<<<<<<<< END LOADING MODAL FUNCTIONS >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<=============================START CORDOVA PHONEGAP =========================================>>>>>>>>>>>///////

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		//alert("device ready");
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		document.addEventListener("backbutton", function(e){
       if($.mobile.activePage.is('#pageSMessage')){
           e.preventDefault();
		   SaveDraft();
       }
       else {
           navigator.app.backHistory()
       }
    }, false);
      
		//request the persistent file system
		//alert("requestfilesystem");
		 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemFail);
		 backupfolder();
		// SET CAMERA GLOBAL VARIABLES
		//alert("getcameras");
		pictureSource=navigator.camera.PictureSourceType;
    	destinationType=navigator.camera.DestinationType;
	 	// capture=navigator.device.capture;
		 //CHECK IF EXISTS DATABASE IF NOT CREATE DATABASE
		// alert("go to dabase");
		 checkdatabase();
	     // alert("checkconnection function");
		// alert(SubmitDate);
		 setInterval(function(){checkConnection()}, 45000);
		 app.receivedEvent('deviceready');
		// alert("all is ready");
		 
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      
      // console.log('Received Event: ' + id);
	  //alert(id);
	

    }
	
	
	
};
///////=============================<<<<<<<<<<<< END START CORDOVA PHONEGAP >>>>>>>>>>>=========================================///////



///////<<<<<<<<<<<<=============================SILENCE SYNC =========================================>>>>>>>>>>>///////

//function checkifexistdbregh()
//{
//	alert("empieza invisible");
//		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
//      db.transaction(Querytocheckifdbh, errorCB);
//	// $(':mobile-pagecontainer').pagecontainer('change', '#pageSettingsInit', {
//      //  transition: 'flip',
//        //changeHash: false,
//        //reverse: true,
//        //showLoadMsg: true
//    //});
//	
//}
//
//function Querytocheckifdbh(tx)
//{
//	
//	var querytosend="SELECT * FROM SETTINGS";
//	tx.executeSql(querytosend, [], QuerytocheckifdbSuccessh, errorCB);
//	
//}
//
//function QuerytocheckifdbSuccessh(tx,results)
//{
//	var len = results.rows.length;
//	if(len>0)
//	{
//		$("#ipsync").val(results.rows.item(0).IP);
//		sendproceduresh();
//	}
//
//	
//}
//
////SEND DATA TO SERVER
//function sendproceduresh()
//{
//	
//	 sendproceduresarray="";
//	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
//      db.transaction(Querytosendproceduresh, errorCB);
//	
//}
//
//function Querytosendproceduresh(tx)
//{
//	var querytosend="SELECT * FROM SUBMITTEDPROCS WHERE Sync='no' AND Status='0'";
//	tx.executeSql(querytosend, [], QuerytosendproceduresSuccessh, errorCB);
//	
//}
//
//function QuerytosendproceduresSuccessh(tx,results)
//{
//	var len = results.rows.length;
//	var array = [];
//	//alert(len);
//for (var i=0; i<results.rows.length; i++){
// row = results.rows.item(i);
//
//  array.push(JSON.stringify(row));
//
//}
//
//sendproceduresarray=array;
//sendstepsh();
//	
//}
//
//function sendstepsh()
//{
//	 sendstepsarray="";
//	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
//      db.transaction(Querytosendstepsh, errorCB);
//	
//}
//
//function Querytosendstepsh(tx)
//{
//	var querytosend="SELECT submittedsteps.* FROM submittedprocs INNER JOIN submittedsteps ON submittedprocs.SubmitID = submittedsteps.SubmitID WHERE submittedprocs.Status='0' AND submittedsteps.Sync='no'";
//	tx.executeSql(querytosend, [], QuerytosendstepsSuccessh, errorCB);
//	
//}
//
//function QuerytosendstepsSuccessh(tx,results)
//{
//	var len = results.rows.length;
//	var array = [];
//	//alert(len);
//for (var i=0; i<results.rows.length; i++){
// row = results.rows.item(i);
// // alert(row.FaultID);
// array.push(JSON.stringify(row));
//
//
//
//}
//
//sendstepsarray=array;
//sendchecklistsh();
//
//	
//}
//
//function sendchecklistsh()
//{
//	 sendchecklistarray="";
//	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
//      db.transaction(Querytosendchecklistsh, errorCB);
//	
//}
//
//function Querytosendchecklistsh(tx)
//{
//	var querytosend="SELECT * FROM USERS2CHECKLISTS WHERE Sync='no'";
//	tx.executeSql(querytosend, [], QuerytosendchecklistsSuccessh, errorCB);
//	
//}
//
//function QuerytosendchecklistsSuccessh(tx,results)
//{
//	var len = results.rows.length;
//	var array = [];
//	//alert(len);
//for (var i=0; i<results.rows.length; i++){
// row = results.rows.item(i);
//array.push(JSON.stringify(row));
//
//
//
//}
//sendchecklistarray=array;
//sendDataToServerh();
//
//	
//}
//
//function sendDataToServerh()
//{
//	//alert("entro");
//	var ipserver=$("#ipsync").val();
//	var obj = {};
// obj['procedures'] = JSON.stringify(sendproceduresarray);  //string
// obj['steps'] = JSON.stringify(sendstepsarray); 
// obj['checklists'] =JSON.stringify(sendchecklistarray); 
//  $.ajax({
//                    type: 'POST',
//                   // url: 'http://'+ipserver+'/ftservice/service1.asmx//SetDeviceDataarray',
//				    url: 'http://'+ipserver+'/service1.asmx//SetDeviceDataarray',
//                    data: JSON.stringify(obj),
//                    dataType: 'json',
//                    contentType: 'application/json; charset=utf-8',
//                    success: function (response) {
//                        alert(response.d);
//           
//                      
//                    },
//                    error: function (error) {
//                        alert(error);
//                    }
//                });
//				
//					
//		sendmediaobjh();
// 
//	
//}
//
//
//
// function sendmediaobjh()
//{
//		
//	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
//      db.transaction(Querytosendmediaobjh, errorCB);
//	
//}
//
//function Querytosendmediaobjh(tx)
//{
//	
//	var querytosend="SELECT media.* FROM submittedprocs INNER JOIN media ON submittedprocs.SubmitID = media.SubmitID WHERE submittedprocs.Status='0' AND media.Sync='no'";
//	//alert(querytosend);
//	tx.executeSql(querytosend, [], QuerytosendmediaobjSuccessh, errorCB);
//	
//	
//}
//
//function QuerytosendmediaobjSuccessh(tx,results)
//{
//		var  len = results.rows.length;
//	//var array = [];
//	//alert("media "+len);
//	if(len>0)
//	{
//
////alert(pptoshow+ppinitial);
//for (var i=0; i<results.rows.length; i++){
//
//
//
// if(results.rows.item(i).FileType=="image")
// {
//	 uploadPhotoServer(results.rows.item(i).Path,results.rows.item(i).SubmitID,results.rows.item(i).StepID,results.rows.item(i).FileType);
//  }
//  else
//  {
//	 uploadVideoServer(results.rows.item(i).Path,results.rows.item(i).SubmitID,results.rows.item(i).StepID,results.rows.item(i).FileType);
//   }
// //array.push(JSON.stringify(row));
//
//
//}
//
//
//		
//	}
//	else
//	{
//		
//		
//		
//	}
//       translatehtml();
//	    updatelocaldatabase();
//		alert("sincronizar");
//		
//
//	
//}



//
//function winftp(r) {
//	        // alert(r.response);
//			ppinitial= parseFloat(ppinitial, 10)+parseFloat(pptoshow, 10);
//            //console.log("Code = " + r.responseCode);
//            //console.log("Response = " + r.response);
//		//alert(pptoshow);
//			//pptoshow= pptshow + ppinitial;
//			$("#progressMessage").html("Sent = " + r.bytesSent+" Response ="+r.response);
//			pbar.setValue(parseInt(ppinitial, 10));
//			//pbar.setValue(pptoshow);
//			//alert(pptoshow);
//            //alert("Sent = " + r.bytesSent);
//        }
//
//        function failftp(error) {
//            alert("An error has occurred: Code = " + error.code);
//        }
//
//
////function to update local database
//
//function updatelocaldatabase()
//{
//		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
//      db.transaction(Querytoupdatelocal, errorCB);
//}
//
//function Querytoupdatelocal(tx)
//{
//	tx.executeSql("UPDATE USERS2CHECKLISTS SET sync='yes'");
//	tx.executeSql("UPDATE MEDIA SET sync='yes'");
//	tx.executeSql("UPDATE SUBMITTEDPROCS SET sync='yes'");
//	tx.executeSql("UPDATE SUBMITTEDSTEPS SET sync='yes'");
//	//alert("All updated");
//}


///////=============================<<<<<<<<<<<< SILENCE SYNC >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<=============================CHECK INTERNET CONNECTION =========================================>>>>>>>>>>>///////

function checkConnection() {
    var networkState = navigator.connection.type;
    
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
	checkifnotsync();
	if(networkState!="none")
	{
		var hs=setTimeout(function(){
		var has=$("#hs").val();
		if(has=="no")
		{
			//checkifexistdbregh();
			//Getservicedata();
		}
		}, 3000);
		
		
	}
	else
	{
		
		//alert("NO hay conexion");
	}

	

    //alert('Connection type: ' + states[networkState]);
}

///////=============================<<<<<<<<<<<< END CHECK INTERNET CONNECTION >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= CONTENT SIZE =========================================>>>>>>>>>>>///////

$(document).on('pagecontainertransition', function(event, ui) {
	var screen = $.mobile.getScreenHeight(),
    header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
    footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
	readnames=$("#readc1").outerHeight(),
    contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
    content = screen - header - footer - contentCurrent;
	var contenttabs=content-200;
	var contentmessage=content-77-readnames;
	var formcontentmessage=contentmessage-5;
	$("#librarycontent").height(content);
	if (window.innerHeight > window.innerWidth) {
	//alert("p portrait");
	$("#one").height(contenttabs);
	$("#two").height(contenttabs);
	$("#three").height(contenttabs);
	}
	else
	{
	$("#one").height(content);
	$("#two").height(content);
	$("#three").height(content);
		
	}
	$("#readcontent").height(contentmessage);
	$("#formreadcontent").height(formcontentmessage);
	$("#textarea-readmessage").height(formcontentmessage-2);
	var sumf=formcontentmessage-2;
	$("#textarea-readmessage").css("height: "+sumf+" !important;");
	//alert("hhh"+physicalScreenHeight);
	//alert("realcontent="+content+"tabs="+contenttabs);
});

$(window).bind( 'resize', function(e){
	var screen = $.mobile.getScreenHeight(),
    header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
    footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
	readnames=$("#readc1").outerHeight(),
    contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
    content = screen - header - footer - contentCurrent;
	var contenttabs=content-200;
	var contentmessage=content-77-readnames;
	var formcontentmessage=contentmessage-5;
	$("#librarycontent").height(content);
	if (window.innerHeight > window.innerWidth) {
	//alert("p portrait");
	$("#one").height(contenttabs);
	$("#two").height(contenttabs);
	$("#three").height(contenttabs);
	}
	else
	{
	$("#one").height(content);
	$("#two").height(content);
	$("#three").height(content);
		
	}
	$("#readcontent").height(contentmessage);
	$("#formreadcontent").height(formcontentmessage);
	$("#textarea-readmessage").height(formcontentmessage-2);
	var sumf=formcontentmessage-2;
	$("#textarea-readmessage").css("height: "+sumf+" !important;");
	//alert("hhh"+physicalScreenHeight);
	//alert("realcontent="+content+"tabs="+contenttabs);
//$(".ui-content").height(content);
	
});

///////=============================<<<<<<<<<<<< END CONTENT SIZE >>>>>>>>>>>=========================================///////



///////<<<<<<<<<<<<============================= ORIENTATION CHANGE =========================================>>>>>>>>>>>///////

function SetPortrait()
{
	//alert("PortraitFunction");
	screen.orientation.lock('portrait').then(function success() {
console.log("Successfully locked the orientation");
//alert("Successfully locked the orientation");
},function error(errMsg) {
console.log("Error locking the orientation :: "+ errMsg);
alert("Error locking the orientation :: "+ errMsg);
});
	
}

$(window).bind( 'orientationchange', function(e){
	var screen = $.mobile.getScreenHeight(),
    header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
    footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
	readnames=$("#readc1").outerHeight(),
    contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height(),
    content = screen - header - footer - contentCurrent;
	var contenttabs=content-200;
	var contentmessage=content-77-readnames;
	var formcontentmessage=contentmessage-5;
	$("#librarycontent").height(content);
	if (window.innerHeight > window.innerWidth) {
	//alert("p portrait");
	$("#one").height(contenttabs);
	$("#two").height(contenttabs);
	$("#three").height(contenttabs);
	}
	else
	{
	$("#one").height(content);
	$("#two").height(content);
	$("#three").height(content);
		
	}
	$("#readcontent").height(contentmessage);
	$("#formreadcontent").height(formcontentmessage);
	$("#textarea-readmessage").height(formcontentmessage-2);
	var sumf=formcontentmessage-2;
	$("#textarea-readmessage").css("height: "+sumf+" !important;");
	//alert("hhh"+physicalScreenHeight);
	//alert("realcontent="+content+"tabs="+contenttabs);
//$(".ui-content").height(content);
  //  if ($.event.special.orientationchange.orientation() == "portrait") {
	  verifyrejected();
	 var rejbtn=""; 
	  var lenrej=$("#hrej").val();
	  //alert(lenrej);
	  var textprocedure=$("#btpro").val();
	var textdata=$("#btdata").val();
	var textcheck=$("#btcheck").val();
	//alert(lenrej);
	  if(lenrej>0)
	  {
		  rejbtn='<input data-role="button" id="mbtndatarejected" type="button" value="Rejected Procedures" data-theme="a" onClick="navbyapp('+"'rejected'"+')">';
	   }
	//alert(textprocedure);
	if (window.innerHeight > window.innerWidth) {
		//alert("p portrait");
		//$('#logincontent').empty();
		//$('#logincontent').append('<div class="ui-grid-a"></div><div class="ui-grid-b"><form id="loginForm" style="margin-left:10%;  margin-right:10%; margin-top:85%;"><div data-role="fieldcontain" class="ui-hide-label"><label for="username">Username:</label><input type="text" name="username" id="username" value="" placeholder="Username" /></div><div data-role="fieldcontain" class="ui-hide-label"><label for="password">Password:</label><input type="password" name="password" id="password" value="" placeholder="Password" /></div><input type="button" class="ui-btn-b"  value="Login" id="LoginButton" onClick="LoginUser()"></form></div>').trigger('create');
				$('#menucontentd').append('<form  style="margin-left:10%;  margin-right:10%; margin-top:85%;"><div class="ui-grid-b ui-responsive"><div class="ui-block-a"><a href="#pageLogbook" id="mbtnlogbook" class="ui-btn ui-shadow ui-corner-all"><img src="img/logbook.png" height="36" width="36"/><br>Logbook</a></div><div class="ui-block-b"><a href="#pageProcedureLaunch" id="mbtnprocedures" class="ui-btn ui-shadow ui-corner-all"><img src="img/procedures.png" height="36" width="36"/><br>Procedures</a></div><div class="ui-block-c"><a href="javascript:navbyapp('+"'library'"+');" id="mbtnlibrary" class="ui-btn ui-shadow ui-corner-all"><img src="img/library.png" height="36" width="36"/><br>Library</a></div></div><div class="ui-grid-b ui-responsive"><div class="ui-block-a"><a href="javascript:navbyapp('+"'messages'"+');" id="mbtnmessages" class="ui-btn ui-shadow ui-corner-all"><img src="img/messages.png" height="36" width="36"/><br>Messages</a></div><div class="ui-block-b"><a href="javascript:navbyapp('+"'certifications'"+');" id="mbtncertifications" class="ui-btn ui-shadow ui-corner-all"><img src="img/certifications.png" height="36" width="36"/><br>Certifications</a></div><div class="ui-block-c"><a href="javascript:navbyapp('+"'dataqueris'"+');" id="mbtndataqueris" class="ui-btn ui-shadow ui-corner-all"><img src="img/query.png" height="36" width="36"/><br>Data Queries</a></div></div><div class="ui-grid-solo">'+rejbtn+'</div><input type="hidden" value="yes" id="hs" name="hs"><div id="Syncready" class="blink"><p class="event received">Database is not synchronized</p></div></div></form>').trigger('create');
        //Do whatever in portrait mode

    } else {
		//alert("l lasndscape");
        //Do Whatever in landscape mode
		//$('#logincontent').empty();
		//$('#logincontent').append(' <div class="ui-grid-a"><div class="ui-block-a"></div><div class="ui-block-b"><form id="loginForm" style="width:70%; margin-left:20%; margin-top:32%;"><div data-role="fieldcontain" class="ui-hide-label"><label for="username">Username:</label><input type="text" name="username" id="username" value="" placeholder="Username" /></div><div data-role="fieldcontain" class="ui-hide-label"><label for="password">Password:</label><input type="password" name="password" id="password" value="" placeholder="Password" /></div><input type="button" class="ui-btn-b"  value="Login" id="LoginButton" onClick="LoginUser()"></form></div></div>').trigger('create');
					$('#menucontentd').empty();
			$('#menucontentd').append('<div class="ui-grid-a"><div class="ui-block-a"></div><div class="ui-block-b"><form  style="width:70%; margin-left:20%; margin-top:32%;"><div class="ui-grid-b ui-responsive"><div class="ui-block-a"><a href="#pageLogbook" id="mbtnlogbook" class="ui-btn ui-shadow ui-corner-all"><img src="img/logbook.png" height="36" width="36"/><br>Logbook</a></div><div class="ui-block-b"><a href="#pageProcedureLaunch" id="mbtnprocedures" class="ui-btn ui-shadow ui-corner-all"><img src="img/procedures.png" height="36" width="36"/><br>Procedures</a></div><div class="ui-block-c"><a href="javascript:navbyapp('+"'library'"+');" id="mbtnlibrary" class="ui-btn ui-shadow ui-corner-all"><img src="img/library.png" height="36" width="36"/><br>Library</a></div></div><div class="ui-grid-b ui-responsive"><div class="ui-block-a"><a href="javascript:navbyapp('+"'messages'"+');" id="mbtnmessages" class="ui-btn ui-shadow ui-corner-all"><img src="img/messages.png" height="36" width="36"/><br>Messages</a></div><div class="ui-block-b"><a href="javascript:navbyapp('+"'certifications'"+');" id="mbtncertifications" class="ui-btn ui-shadow ui-corner-all"><img src="img/certifications.png" height="36" width="36"/><br>Certifications</a></div><div class="ui-block-c"><a href="javascript:navbyapp('+"'dataqueris'"+');" id="mbtndataqueris" class="ui-btn ui-shadow ui-corner-all"><img src="img/query.png" height="36" width="36"/><br>Data Queries</a></div></div><div class="ui-grid-solo">'+rejbtn+'</div><input type="hidden" value="yes" id="hs" name="hs"><div id="Syncready" class="blink"><p class="event received">Database is not synchronized</p></div></form></div>').trigger('create');
		
		//$('#menucontentd').empty();
		//$('#menucontentd').append('LANDSCAPE').trigger('create');


    }
	translatehtml();
	refreshverify();
	
});

///////=============================<<<<<<<<<<<< END ORIENTATION CHANGE >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<=============================FUNCTIONS TO CREATE DIRECTORY =========================================>>>>>>>>>>>///////
//Create Directory
function onFileSystemSuccess(fileSystem) {
    console.log(fileSystem.name);
    var directoryEntry = fileSystem.root;
    console.log(directoryEntry.fullPath);
	//alert(directoryEntry.fullPath);
    directoryEntry.getDirectory(".FieldTracker", {create: true, exclusive: false}, onDirectorySuccess, onDirectoryFail)
}


 function onDirectorySuccess(parent) {

          console.log(parent);
      }

      function onDirectoryFail(error) {
          alert("Unable to create new directory: " + error.code);
      }

      function onFileSystemFail(evt) {
          console.log(evt.target.error.code);
      }
///////=============================<<<<<<<<<<<< END FUNCTIONS TO CREATE DIRECTORY >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<=============================DATE FUNCTION=========================================>>>>>>>>>>>///////


(function() {
    Date.prototype.toYMD = Date_toYMD;
    function Date_toYMD() {
        var date = new Date();
var month = (date.getMonth()+1) > 9 ? (date.getMonth()+1) : "0" + (date.getMonth()+1);
var day = (date.getDate()) > 9 ? (date.getDate()) : "0" + (date.getDate());
var hours = (date.getHours()) > 9 ? (date.getHours()) : "0" + (date.getHours());
var minutes = (date.getMinutes()) > 9 ? (date.getMinutes()) : "0" + (date.getMinutes());
var seconds = (date.getSeconds()) > 9 ? (date.getSeconds()) : "0" + (date.getSeconds());

var dateString =  date.getFullYear() + "-" + 
   month  + "-" + day ;
	// + " " + 
    //hours + ":" + 
    //minutes + ":" + 
    //seconds;
	
	return dateString;
    }
})();

(function() {
    Date.prototype.toYMDhrs = Date_toYMDhrs;
    function Date_toYMDhrs() {
        var date = new Date();
var month = (date.getMonth()+1) > 9 ? (date.getMonth()+1) : "0" + (date.getMonth()+1);
var day = (date.getDate()) > 9 ? (date.getDate()) : "0" + (date.getDate());
var hours = (date.getHours()) > 9 ? (date.getHours()) : "0" + (date.getHours());
var minutes = (date.getMinutes()) > 9 ? (date.getMinutes()) : "0" + (date.getMinutes());
var seconds = (date.getSeconds()) > 9 ? (date.getSeconds()) : "0" + (date.getSeconds());

var dateString = 
   date.getFullYear() + "-" + 
   month  + "-" + day 
	 + " " + 
    hours + ":" + 
    minutes + ":" + 
    seconds;
	
	return dateString;
    }
})();

///////=============================<<<<<<<<<<<< END DATE FUNCTION >>>>>>>>>>>=========================================///////

function checkifnotsync()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Querytochecksync, errorCB);
	
}

function Querytochecksync(tx)
{
	   var query="SELECT * FROM SUBMITTEDPROCS WHERE Sync='no'";
	   tx.executeSql(query, [], QuerytochecksyncSuccess, errorCB);
	
}

function QuerytochecksyncSuccess(tx, results)
{
	 var len = results.rows.length;
	if(len>0)
	{
		$("#hs").val("no");
	}
	
	checklistsync();
}

function checklistsync()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Querychecklistsync, errorCB);
}

function Querychecklistsync(tx)
{
	
	var query="SELECT * FROM USERS2CHECKLISTS WHERE Sync='no'";
	   tx.executeSql(query, [], QuerychecklistsyncSuccess, errorCB);
}

function QuerychecklistsyncSuccess(tx,results)
{
	//alert("aki");
		 var len = results.rows.length;
	if(len>0)
	{
		$("#hs").val("no");
	}
	SyncStatus();
	
}



///////<<<<<<<<<<<<=============================EXTRA FUNCTIONS =========================================>>>>>>>>>>>///////
function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}




///////=============================<<<<<<<<<<<< END EXTRA FUNCTIONS >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<=============================FUNCTION TO TRANSLATE HTML =========================================>>>>>>>>>>>///////


function CurrentUserSettings()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Querytoverifyusersettings, errorCB);
	
}

function Querytoverifyusersettings(tx)
{
	 var userid=sessionStorage.userid;
	   var query="SELECT * FROM UserSettings WHERE UserID='"+userid+"'";
	  // alert(query);
	   tx.executeSql(query, [], QuerytoverifyusersettingsSuccess, errorCBlan);
	
}

function QuerytoverifyusersettingsSuccess(tx,results)
{
		var len = results.rows.length;
	if(len>0)
	{
		sessionStorage.dateformat=results.rows.item(0).DateFormat;
		writehtml(results.rows.item(0).InterfaceLang);
	}
	else
	{
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    	db.transaction(Querytotranslatehtml, errorCB);
	}
}

function translatehtml()
{
		   if(sessionStorage.userid)
	   {
		   CurrentUserSettings();
	   }
	   else
	   {
		   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    		db.transaction(Querytotranslatehtml, errorCB);
		   
		}
	
	
}

function Querytotranslatehtml(tx)
{
	

	   var query="SELECT * FROM SETTINGS";
	  // alert(query);
	   tx.executeSql(query, [], QuerytotranslatehtmlSuccess, errorCBlan);
	
}
function QuerytotranslatehtmlSuccess(tx,results)
{
	
		 var len = results.rows.length;
	if(len>0)
	{
		sessionStorage.dateformat=results.rows.item(0).DateFormat;
		writehtml(results.rows.item(0).Language);
	}
	
	
}

function writehtml(language)
{
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(function(tx){ Querywritehtmlt(tx,language) }, errorCBlan);
}

function Querywritehtmlt(tx,language)
{
	var query="SELECT LabelID, Type, Lang"+language+" as Lang FROM LANG2LABEL";
	//alert(query);
	   tx.executeSql(query, [],function(tx,results){ QuerywritehtmltSuccess(tx,results,language) }, errorCBlan);
}

function QuerywritehtmltSuccess(tx,results,language)
{
	var len = results.rows.length;
	if(len>0)
	{
		for (var i=0; i<results.rows.length; i++){
			
			if(results.rows.item(i).Type=="html")
			{
				$("#"+results.rows.item(i).LabelID).html(results.rows.item(i).Lang);
			}
			else if(results.rows.item(i).Type=="button")
			{
			     // alert(results.rows.item(i).LabelID+" "+results.rows.item(i).Lang);
			
				$("#"+results.rows.item(i).LabelID).val(results.rows.item(i).Lang);
				$("#"+results.rows.item(i).LabelID).button("refresh");
	
			}
				else if(results.rows.item(i).Type=="value")
			{
			     
			
				$("#"+results.rows.item(i).LabelID).val(results.rows.item(i).Lang);
			
	
			}
			else if(results.rows.item(i).Type=="placeholder")
			{
				document.getElementsByName(results.rows.item(i).LabelID)[0].placeholder=results.rows.item(i).Lang;
			}
			
		}
		SyncStatus();
		
	}
	
}


///////=============================<<<<<<<<<<<< END FUNCTION TO TRANSLATE HTML >>>>>>>>>>>=========================================///////



///////<<<<<<<<<<<<=============================FUNCTIONS TO CREATE DATABASE =========================================>>>>>>>>>>>///////

	function checkdatabase()
	{
		console.log("enter checkdatabase");
		//alert("create Data");
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 2500000000);
        db.transaction(populateDB, errorCBIN, successCBMain);
		
	}
	
	function populateDB(tx) {
		
		//Table Settings
		 //
		 //alert("checadb");
		
		 tx.executeSql('CREATE TABLE IF NOT EXISTS UserSettings (UserID,ClientName,DateFormat,InterfaceLang,ShowCertAlerts,TabletLang)');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS REJECTED (SubmitID,ProcID,Name,UserID,Status,SubmitDate,RejectReason)');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS STEPS2COMPS (StepID,CompID)');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS SETTINGS (Language,IP,SyncTime,LastSync,DateFormat)');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS LANGUAGES (Language,OrderNum)');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS FILESDATA (FileID,FileUrl,FileName)');
		// tx.executeSql('DROP TABLE IF EXISTS MEASUREMENTS');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS MEASUREMENTS (MeasID,MeasDesc,Units,FieldType,MinValue,MaxValue)');
//		 tx.executeSql('INSERT INTO MEASUREMENTS (MeasID,MeasDesc,Units,FieldType,MinValue,MaxValue) VALUES ("TEMP","Motor Temperature","F","T","50","100")');
//		 tx.executeSql('INSERT INTO MEASUREMENTS (MeasID,MeasDesc,Units,FieldType,MinValue,MaxValue) VALUES ("TEMPTWO","Other","F","T","50","100")');
//		 tx.executeSql('INSERT INTO MEASUREMENTS (MeasID,MeasDesc,Units,FieldType,MinValue,MaxValue) VALUES ("EXTRACOMP","Other CompExtra","F","T","50","100")');
//		 tx.executeSql('INSERT INTO MEASUREMENTS (MeasID,MeasDesc,Units,FieldType,MinValue,MaxValue) VALUES ("ALARM","Alarm code","","D","","")');
//		 tx.executeSql('INSERT INTO MEASUREMENTS (MeasID,MeasDesc,Units,FieldType,MinValue,MaxValue) VALUES ("ALARMS","TEST DEFAULT","","D","","")');
//		 tx.executeSql('INSERT INTO MEASUREMENTS (MeasID,MeasDesc,Units,FieldType,MinValue,MaxValue) VALUES ("EXTRASELECT","COMP SELECT","","D","","")');
		//  tx.executeSql('DROP TABLE IF EXISTS STEP2MEAS');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS STEP2MEAS (StepID,MeasID)'); 
		 //////////
		// tx.executeSql('INSERT INTO STEP2MEAS (StepID,MeasID)  VALUES ("CRUSH821.006","TEMP")');
		// tx.executeSql('INSERT INTO STEP2MEAS (StepID,MeasID)  VALUES ("CRUSH821.006","TEMPTWO")');
		// tx.executeSql('INSERT INTO STEP2MEAS (StepID,MeasID)  VALUES ("CRUSH821.006","ALARM")');
		// tx.executeSql('INSERT INTO STEP2MEAS (StepID,MeasID)  VALUES ("CRUSH821.006","ALARMS")');
        // tx.executeSql('DROP TABLE IF EXISTS COMP2MEAS');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS COMP2MEAS (CompID,MeasID)');
		// tx.executeSql('INSERT INTO COMP2MEAS (CompID,MeasID)  VALUES ("HMOTOR","TEMP")');
		// tx.executeSql('INSERT INTO COMP2MEAS (CompID,MeasID)  VALUES ("HMOTOR","EXTRACOMP")');
		// tx.executeSql('INSERT INTO COMP2MEAS (CompID,MeasID)  VALUES ("HMOTOR","EXTRASELECT")');
		  tx.executeSql('DROP TABLE IF EXISTS MEASDATA');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS MEASDATA (MeasID,DropDownData)');
		// tx.executeSql('INSERT INTO MEASDATA (MeasID,DropDownData) VALUES ("ALARM","C15")');
		// tx.executeSql('INSERT INTO MEASDATA (MeasID,DropDownData) VALUES ("ALARM","D101")');
		// tx.executeSql('INSERT INTO MEASDATA (MeasID,DropDownData) VALUES ("ALARM","F8")');
		// tx.executeSql('INSERT INTO MEASDATA (MeasID,DropDownData) VALUES ("ALARMS","Default1")');
		// tx.executeSql('INSERT INTO MEASDATA (MeasID,DropDownData) VALUES ("ALARMS","Default2")');
		// tx.executeSql('INSERT INTO MEASDATA (MeasID,DropDownData) VALUES ("EXTRASELECT","Default1comp")');
		// tx.executeSql('INSERT INTO MEASDATA (MeasID,DropDownData) VALUES ("EXTRASELECT","Default2comp")');
		   tx.executeSql('CREATE TABLE IF NOT EXISTS SUBMITTEDCUSTOMVALUES (FaultID,SubmitID,ProcID,StepID,MeasID,Value,bycomp)');
		   tx.executeSql('CREATE TABLE IF NOT EXISTS TEMPSUBMITTEDCUSTOMVALUES (FaultID,SubmitID,ProcID,StepID,MeasID,Value,bycomp)');
		// tx.executeSql('INSERT INTO SETTINGS (Language,IP) VALUES ("0","0")');
         tx.executeSql('CREATE TABLE IF NOT EXISTS LANG2LABEL (LabelID,Type,Lang1,Lang2,Lang3,Lang4,Lang5,Lang6,Lang7,Lang8,Lang9,Lang10,Lang11,Lang12,Lang13,Lang14,Lang15)');
		
		//Table Users
		//
        // tx.executeSql('DROP TABLE IF EXISTS USERS');
		
		
         tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (Username unique,Password,FirstName,LastName,LevelNum)');
		 
//         tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("dclaxton", "pai","Darien","Claxton")');
//		 tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("mpoarch", "pai","Mark","Poarch")');
//		 tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("rali", "pai","Rudy","Ali")');
//		 tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("facevedo", "pai","Francisco","Acevedo")');
//		 tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("bbrown", "pai","Billy","Brown")');
//		 tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("sbrown", "pai","Stephen","Brown")');
//		 tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("jgrinder", "pai","Johnny","Grinder")');
//		 tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("thailfax", "pai","Tom","Halifax")');
//		 tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("tkrusmark", "pai","Tim","Krusmark")');
//		 tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("rwestfall", "pai","Rion","Westfall")');
//		 tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("kslack", "pai","Ken","Slack")');
//		  tx.executeSql('INSERT INTO USERS (Username,Password,FirstName,LastName) VALUES ("chamilton", "pai","Cliff","Hamilton")');
		 //Table Groups
		 //
		 
		 tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS (AreaID,GroupID,Description)');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01005","Grinding")');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01006","Crushing")');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01008","Tailings")');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01009","Flotation")');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01010","Sampling")');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01011","Utilities")');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01012","Compressors")');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01013","Blowers")');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01014","Electricity")');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01015","Safety")');
//		 tx.executeSql('INSERT INTO GROUPS (AreaID,GroupID,Description) VALUES ("01","01016","Support Equipment")');

		 //Table User2groups
		 //
		 tx.executeSql('CREATE TABLE IF NOT EXISTS USERS2GROUPS (UserID,ID)');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("kslack","01015")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("kslack","01016")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("jgrinder","01015")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("jgrinder","01016")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("facevedo","01015")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("facevedo","01016")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("dclaxton","01015")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("dclaxton","01016")');
//		  tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("dclaxton","01006")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("bbrown","01015")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("bbrown","01016")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("rali","01005")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("jgrinder","01005")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("bbrown","01005")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("nwestfall","01006")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("kslack","01006")');		
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("sbrown","01008")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("mpoarch","01008")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("facevedo","01008")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("tkrusmark","01009")');
//		 tx.executeSql('INSERT INTO USERS2GROUPS (UserID,ID) VALUES ("thailfax","01009")');

		 //Table Checklists
		 //
		 tx.executeSql('CREATE TABLE IF NOT EXISTS CHECKLISTS (ID,DESCRIPTION,TYPE)');
		 
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("TAILC.001","Correctly describes the principle of operation for each major equipment item related to the thickening, tailings and water area of the plant.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("TAILH.001","Responds to process upset conditions and alarms in a correct and timely manner.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("TAILH.002","Determines the cause of minor problems and takes corrective action; notifies supervisors and the appropriate support personnel for more complex problems.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("TAILF.001","Understands the control loops sufficiently to correctly operate them in Automatic or Manual mode.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("TAILF.002","Identifies the equipment affected when an equipment item shuts down through the equipment interlocks.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("TAILF.003","Starts and stops equipment using the correct procedures in the correct sequence.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("TAILF.004","Understands the thickening, tailings, and water equipment and its operation sufficiently to correctly troubleshoot problems.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("TAILH.003","Isolates equipment correctly and safely while the system is in operation.","Classroom")');
//	 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("GRINDC.001","Correctly describes the principle of operation for each major equipment item related to the ore reclaim and grinding area of the plant.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("GRINDH.001","Responds to process upset conditions and alarms in a correct and timely manner.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("GRINDH.002","Determines the cause of minor problems and takes corrective action.  Notifies supervisors and the appropriate support personnel for more complex problems.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("GRINDF.001","Understands the control loops sufficiently to correctly operate them in Automatic or Manual mode.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("GRINDF.002","Identifies the equipment affected when an equipment item shuts down through the equipment interlocks.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("GRINDH.003","Starts and stops equipment using the correct procedures in the correct sequence.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("GRINDH.004","Isolates equipment correctly and safely while the system is in operation.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("CRUSHC.001","Is able to describe correctly the principle of operation for each major equipment item related to the crushing system.","Classroom")');
//		
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("CRUSHH.001","Responds to process upset conditions and alarms in a correct and timely manner.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("CRUSHF.001","Is able to determine the cause of minor problems and to take corrective action; notifies supervisors and appropriate support personnel for more complex problems.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("CRUSHF.002","Understands the control loops sufficiently to correctly operate them in Automatic and Manual modes.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("CRUSHF.003","Is able to identify the equipment affected when an equipment item shuts down through the equipment interlocks.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("CRUSHH.002","Is able to start and stop equipment using the correct procedures in the correct sequence.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("CRUSHF.004","Understands the crushing system equipment and its operation sufficiently to correctly troubleshoot problems.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("CRUSHH.003","Is able to isolate equipment correctly and safely while the system is in operation.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("FLOTC.001","Correctly describes the principle of operation for each major equipment item related to the Flotation area of the plant.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("FLOTH.001","Responds to process upset conditions and alarms in a correct and timely manner.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("FLOTH.002","Determines the cause of minor problems and takes corrective action; notifies supervisors and the appropriate support personnel for more complex problems.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("FLOTF.001","Understands the control loops sufficiently to correctly operate them in Automatic or Manual mode.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("FLOTF.003","Identifies the equipment affected when an equipment item shuts down through the equipment interlocks.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("FLOTF.004","Understands the Flotation equipment and its operation sufficiently to correctly troubleshoot problems.","Classroom")');		
//		  
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("FLOTH.004","Isolates equipment correctly and safely while the system is in operation.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.001","Demonstrates the required knowledge of safe work procedure Caustic Soda.","Hands-On")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.002","Demonstrates the required knowledge of safe work procedure Zinc Sulphate.","Hands-On")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.003","Demonstrates the required knowledge of safe work procedure Copper Sulphate.","Field")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.004","Demonstrates the required knowledge of safe work procedure Flocculant.","Field")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.005","Demonstrates the required knowledge of safe work procedure Thickeners.","Field")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.006","Demonstrates the required knowledge of safe work procedure Hydraulic Oil.","Field")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.007","Demonstrates the required knowledge of safe work procedure Safety Showers and Eyewash Stations.","Hands-On")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.008","Demonstrates the required knowledge of safe work procedure Mobile Equipment Operator Safety.","Hands-On")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.009","Demonstrates the required knowledge of safe work procedure General Safety Policies and Procedures.","Hands-On")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.010","Demonstrates the required knowledge of safe work procedure Emergency Response.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.011","Demonstrates the required knowledge of safe work procedure Lock and Tag Procedure.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.012","Demonstrates the required knowledge of safe work procedure Housekeeping.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.013","Demonstrates the required knowledge of safe work procedure Lifting.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.014","Demonstrates the required knowledge of safe work procedure Confined Spaces.","Field")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.015","Demonstrates the required knowledge of safe work procedure Working in Bins and Hoppers.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.016","Demonstrates the required knowledge of safe work procedure Using Hammers and Bars in Close Quarters.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.017","Demonstrates the required knowledge of safe work procedure Hand Tools.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.018","Demonstrates the required knowledge of safe work procedure Hearing Protection.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.019","Demonstrates the required knowledge of safe work procedure Fire Extinguishers.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.020","Demonstrates the required knowledge of safe work procedure High-Pressure Air.","Hands-On")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.021","Demonstrates the required knowledge of safe work procedure High-Pressure Slurry Pipelines.","Hands-On")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.022","Demonstrates the required knowledge of safe work procedure High-Pressure Water.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.023","Demonstrates the required knowledge of safe work procedure Radiation Devices.","Classroom")');
//		  tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.024","Demonstrates the required knowledge of safe work procedure Overhead Cranes and Rigging Practices.","Classroom")');
//         tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.025","Demonstrates the required knowledge of safe work procedure Xanthates.","Classroom")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.026","Demonstrates the required knowledge of safe work procedure Methyl Isobutyl Carbinol.","Field")');
//		 tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.027","Demonstrates the required knowledge of safe work procedure Sodium Metabisulphite.","Field")');
//         tx.executeSql('INSERT INTO CHECKLISTS (ID,DESCRIPTION,TYPE) VALUES ("SAFEC.028","Demonstrates the required knowledge of safe work procedure Aerophine 3418A Promoter.","Field")');	

        //Table Modules2checklists
		// 

	 	tx.executeSql('CREATE TABLE IF NOT EXISTS MODULES2CHECKLISTS (ModuleID,ID)');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("CRUSH","CRUSHC.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("CRUSH","CRUSHF.001")');
//         tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("CRUSH","CRUSHF.002")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("CRUSH","CRUSHF.003")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("CRUSH","CRUSHF.004")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("CRUSH","CRUSHH.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("CRUSH","CRUSHH.002")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("CRUSH","CRUSHH.003")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("FLOT","FLOTC.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("FLOT","FLOTF.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("FLOT","FLOTF.003")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("FLOT","FLOTF.004")');
//	     tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("FLOT","FLOTH.001")');
//	     tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("FLOT","FLOTH.002")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("FLOT","FLOTH.003")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("FLOT","FLOTH.004")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("GRIND","GRINDC.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("GRIND","GRINDF.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("GRIND","GRINDF.002")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("GRIND","GRINDF.003")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("GRIND","GRINDH.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("GRIND","GRINDH.002")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("GRIND","GRINDH.003")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("GRIND","GRINDH.004")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("TAIL","TAILC.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("TAIL","TAILF.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("TAIL","TAILF.002")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("TAIL","TAILF.003")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("TAIL","TAILF.004")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("TAIL","TAILH.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("TAIL","TAILH.002")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("TAIL","TAILH.003")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.001")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.002")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.003")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.004")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.005")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.006")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.007")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.008")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.009")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.010")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.011")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.012")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.013")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.014")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.015")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.016")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.017")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.018")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.019")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.020")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.021")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.022")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.023")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.024")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.025")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.026")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.027")');
//		 tx.executeSql('INSERT INTO MODULES2CHECKLISTS (ModuleID,ID) VALUES ("SAFE","SAFEC.028")');
		 
		 //Table user2checklists
		 //
		 tx.executeSql('CREATE TABLE IF NOT EXISTS USERS2CHECKLISTS (UserID,CheckID,Date,Status,Sync)');
		 //Table Media
		 //
		 tx.executeSql('CREATE TABLE IF NOT EXISTS MEDIA (SubmitID,StepID,FileType,FileName,Path,Sync)');
		 tx.executeSql('CREATE TABLE IF NOT EXISTS TEMPMEDIA (SubmitID,StepID,FileType,FileName,Path)');
		 //Table Groups2Procedures
		 //
		 tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS2PROCEDURES (GroupID,ID,Ord)');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01005","CRUSH811","1")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01005","CRUSH821","2")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01005","CRUSH823","4")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006","CRUSH811","1")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006","CRUSH821","2")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006","PRES01","3")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006","TEMP01","4")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006","SLUR01","5")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006","SOLU01","6")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006","ORE01","7")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006","RECVRY","8")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006","RETENT","9")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002","CRSHC2","1")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002","CRSHCN","2")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002","SCAL01","15")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002","SCREW","16")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01003", "DUSTB2", "1")');
//		 tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01003", "DUSTBG", "2")');	
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01003", "DUSTSP", "4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01003", "BAROMCOND","4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01003", "SCRUB", "5")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01003", "SCRUBBERS", "10")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01004", "PUMPHC", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01004", "PUMPMP", "2")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01004", "PUMPPD","4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01004", "PUMPVC", "7")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01005", "SAGMIL", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("00001", "CRUSH811", "2")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01005", "BALCHRG", "2")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01005", "BALMIL", "4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006", "CYCL01", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01006", "SCRN01", "2")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01007", "FLOTTC", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01007", "FLOTCC", "2")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01007", "VRTMIL", "3")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01008", "CLARIF", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01008", "FILT01", "2")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01008", "MEDIAFILT", "4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01008", "HIRATECLAR", "4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01008", "THCK01", "5")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "FLOC01", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "REAG01", "2")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "REAG02", "4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "FLOTRG", "4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "LIME01", "5")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "ANTISCA","6")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "BINFLOW", "7")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "FLAME", "8")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "BINACT", "9")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "VERTLIMEKILN", "10")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01009", "LIMESLAKMILL", "11")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01010", "SAMPLG", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01010", "PARTSIZ", "2")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01010", "XRAY", "3")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01011", "OSMOSIS", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01012", "AIRCMP", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01011", "WATHAMMER", "4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01013", "BLOWER", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01014", "ELEC01", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01015", "SAFE01", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01016", "CRAN01", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01017", "BURNER", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01017", "STEAMTRNSYS", "2")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01017", "WATTUBEBOILRS", "3")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("02001", "CONTRL", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("02002", "ILOCKS", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("02003", "ALRMRSPT", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("02004", "SENSOR", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("02005", "CONTRL", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("02007", "PROBLMT", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("02008", "PIDS", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04001", "CONVBELTS", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04002", "CLEANDIST", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04003", "FAILANALY", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04005", "FASTENER", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04006", "PACKING", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04007", "SHAFTALIGN", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04008", "MEASTOOLS", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04009", "SHOPTOOLS", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04010", "HYDBASIC", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04011", "LUBEROUT", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04013", "REBUILDPMP","1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04014", "SKETCHLAYOUT", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04004", "TROUBSHOOT", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "CRSHCS","4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "CRSHGY", "7")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "CRSHJW", "11")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "BRAKER", "6")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "VBRFDR", "12")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "STKPIL", "8")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "BLTFDR", "9")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "APRFDR", "10")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "CONVBELTS", "11")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("00001", "DELETETHIS", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "CRUSH823", "13")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "NUCSCL", "14")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("01002", "BELT01", "15")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04012", "PIPEFIT", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("04015", "SEALGASK", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("02006", "TRBLSHT", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("00002", "FILT01", "1")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("00002", "HYDBASIC", "2")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("00002", "LUBEROUT", "4")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("00002", "REBUILDPMP", "7")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("00002", "SHOPTOOLS", "5")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("00002", "TROUBSHOOT", "10")');
//		tx.executeSql('INSERT INTO GROUPS2PROCEDURES (GroupID,ID,Ord) VALUES ("00002", "SLUR01", "7")');
		//good
		//Table Procedures
		//
		tx.executeSql('CREATE TABLE IF NOT EXISTS PROCEDURES (ProcID,Name,Type,Freq,Version)');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH811", "Crushing Area: Preoperational Inspection", "Preoperational", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH821", "Crushing Area: Start-Up From Complete/Standby Shutdown", "Start-Up", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH822", "Crushing Area: Start-Up From Emergency Shutdown", "Start-Up", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH823", "Crushing Area: Start-Up From Power Failure", "Start-Up", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH831", "Crushing Area: Complete/Standby Shutdown", "Shutdown", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH832", "Crushing Area: Emergency Shutdown", "Shutdown", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH833", "Crushing Area: Power Failure", "Shutdown", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH841", "Crushing Area: Routine Inspection", "Routine", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH851", "Adjusting the Primary Crusher Open-Side Setting", "Operator Task", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH852", "Unblocking the Primary Crusher", "Operator Task", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH853", "Clearing the Primary Crusher", "Operator Task", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH854", "Clearing Tramp Metal From the Primary Crusher", "Operator Task", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH855", "Controlling the Dumping Rate", "Operator Task", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH856", "Removing Metal Detected by the Metal Detector", "Operator Task", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH857", "Cleaning the Belt Scale Weighbridge", "Operator Task", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH858", "Clearing the Apron Feeder Discharge Chute","Operator Task", "Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type,Freq) VALUES ("CRUSH859", "Operating the Hydraulic Rock Breaker", "Operator Task","Daily")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type) VALUES ("BOTH","Evaulation Questions: Both","Evaluation")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type) VALUES ("MTC","Evaulation Questions: Maintenance","Evaluation")');
//		tx.executeSql('INSERT INTO PROCEDURES (ProcID,Name,type) VALUES ("OPS","Evaulation Questions: Operations","Evaluation")');
		
		//good
		//Table proceduresteps
		//
		//try
//		{
		tx.executeSql('CREATE TABLE IF NOT EXISTS PROCEDURESTEPS (ProcID,StepID,OrdNum REAL,Text,Type,Num REAL,SelAllComps,SelAllFaults)');
//        tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.001","1","Are you evaluated on a periodic basis? If yes, how often are you evaluated?","M","1","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.002","2","What is the basis for evaluation?","M","2","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.003","3","What type of evaluation feedback do you receive?","M","3","FALSE","FALSE")')	
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.004","4","What problem(s), if any, do you see with the present organization structure?","M","4","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","OPS.001","5","How often is maintenance work scheduled for your area?","M","5","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","OPS.002","6","Are plant operations personnel involved in maintenance scheduling? If yes, how?","M","6","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.005","7","How would you rate the relationship between operations management and maintenance management?","S","7","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.006","8","How would you rate the relationship between the mechanical maintenance and operations disciplines?","S","8","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.007","9","How would you rate the relationship between the electrical maintenance and operations disciplines?","S","9","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.008","10","How would you rate the relationship between the instrument maintenance and operations disciplines?","S","10","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.009","11","Are scheduling meetings used for maintenance planning?","S","11","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.010","12","Who attends the daily scheduling meetings?","M","12","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.011","13","Are there any formal weekly planning and scheduling meetings? If yes, who attends the meetings?","M","13","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.012","14","What is discussed at the weekly planning and scheduling meetings?","M","14","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.013","15","Who schedules/controls servicing of the equipment?","M","15","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.014","16","Is overtime work supervised?","S","16","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.015","17","How often is overtime work supervised?","M","17","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.016","18","Is the overtime work always scheduled?","S","18","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.017","19","Is non-emergency overtime work always scheduled?","S","19","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.018","20","Who authorizes the overtime work?","M","20","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.019","21","How would you rate the relationship between maintenance/operations and warehousing?","S","21","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.020","22","How would you rate the warehouse support?","S","22","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.021","23","Is a formal failure analysis program used?","S","23","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.022","24","Who is responsible for equipment lubrication?","M","24","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.023","25","Are the personnel on other shifts knowledgeable of these same procedures and techniques?","S","25","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.024","26","How is on-the-job training validated?","M","26","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","OPS.003","27","Are standard operating procedures made available to personnel?","S","27","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","OPS.004","28","Are the operations personnel under your direct supervision well-versed in the proper procedures for response to process upsets (alarm conditions, out-of-range process variables, etc.)?","S","28","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","OPS.005","29","How is operations training conducted on the job?","M","29","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","OPS.006","30","How are new operators selected?","M","30","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.025","31","Do you believe you were adequately trained for your position?","S","31","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.026","32","What type of training did you receive?","M","32","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.027","33","Is formal training available for both supervision and hourly employees?","S","33","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.028","34","How is the content of training determined?","M","34","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.029","35","Do you ever see the statistics on equipment and maintenance performance that are reported to upper management? ","S","35","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.030","36","Do you ever see the plant operating results (throughput/recovery, etc.) that are reported to upper management?","S","36","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.031","37","Are you held accountable for meeting any statistical results? If yes, how?","M","37","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.032","38","Do you have input for the development of the maintenance/operations budget?","S","38","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.033","39","Are you held accountable for maintenance/operations costs in your area? If yes, how?","M","39","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.034","40","What is a major maintenance/operations problem that you encounter?","M","40","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","OPS.007","41","How would you rate the performance of maintenance?","S","41","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.035","42","What is the nature of any problems not directly associated with maintenance/operations that you encounter?","M","42","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("OPS","BOTH.036","43","What suggestions would you make for any recommended changes?","B","43","FALSE","FALSE")');
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.001","1","Are you evaluated on a periodic basis? If yes, how often are you evaluated?","M","1","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.002","2","What is the basis for evaluation?","M","2","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.003","3","What type of evaluation feedback do you receive?","M","3","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.004","4","What problem(s), if any, do you see with the present organization structure?","M","4","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.005","5","How would you rate the relationship between operations management and maintenance management?","S","5","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.006","6","How would you rate the relationship between the mechanical maintenance and operations disciplines?","S","6","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.007","7","How would you rate the relationship between the electrical maintenance and operations disciplines?","S","7","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.008","8","How would you rate the relationship between the instrument maintenance and operations disciplines?","S","8","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.009","9","Are scheduling meetings used for maintenance planning?","S","9","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.010","10","Who attends the daily scheduling meetings?","M","10","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.011","11","Are there any formal weekly planning and scheduling meetings? If yes, who attends the meetings?","M","11","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.001","12","Are scheduling aids (job card, project software, etc.) used for scheduling of long-term work?","S","12","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.002","13","Is there a realistic backlog of maintenance work that is maintained by the planner(s)? If yes, how is it used?","S","13","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.003","14","What information is provided by the equipment history files?","S","14","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.004","15","How often do you review the equipment history files?","S","15","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.005","16","Do you request additional information from the planners?","S","16","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.012","17","What is discussed at the weekly planning and scheduling meetings?","M","17","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.013","18","Who schedules/controls servicing of the equipment?","M","18","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.006","19","What method is used to obtain parts from the warehouse?","S","19","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.007","20","Is the warehouse manned 24 hours per day?","S","20","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.014","21","Is overtime work supervised?","S","21","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.015","22","How often is overtime work supervised?","M","22","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.016","23","Is the overtime work always scheduled?","S","23","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.017","24","Is non-emergency overtime work always scheduled?","S","24","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.018","25","Who authorizes the overtime work?","M","25","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.008","26","Is there a warranty claim policy?","S","26","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.009","27","How would you rate the shop support?","S","27","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.010","28","Has a condition monitoring program been established?","S","28","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.019","29","How would you rate the relationship between maintenance/operations and warehousing?","S","29","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.020","30","How would you rate the warehouse support?","S","30","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.021","31","Is a formal failure analysis program used?","S","31","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.022","32","Who is responsible for equipment lubrication?","M","32","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.023","33","Are the personnel on other shifts knowledgeable of these same procedures and techniques?","S","33","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.011","34","Are the maintenance personnel under your direct supervision well-versed in the proper procedures and techniques required to effectively maintain the equipment?","S","34","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.012","35","How do maintenance personnel receive the necessary specific-equipment training? ","S","35","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","MTC.013","36","How would you rate the performance of operations?","S","36","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.024","37","How is on-the-job training validated?","M","37","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.025","38","Do you believe you were adequately trained for your position?","S","38","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.026","39","What type of training did you receive?","M","39","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.027","40","Is formal training available for both supervision and hourly employees?","S","40","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.028","41","How is the content of training determined?","M","41","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.029","42","Do you ever see the statistics on equipment and maintenance performance that are reported to upper management? ","S","42","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.030","43","Do you ever see the plant operating results (throughput/recovery, etc.) that are reported to upper management?","S","43","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.031","44","Are you held accountable for meeting any statistical results? If yes, how?","M","44","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.032","45","Do you have input for the development of the maintenance/operations budget?","S","45","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.033","46","Are you held accountable for maintenance/operations costs in your area? If yes, how?","M","46","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.034","47","What is a major maintenance/operations problem that you encounter?","M","47","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.035","48","What is the nature of any problems not directly associated with maintenance/operations that you encounter?","M","48","FALSE","FALSE")');
//tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("MTC","BOTH.036","49","What suggestions would you make for any recommended changes?","B","49","FALSE","FALSE")');	 				
		//alert("se creo tabla proceduresteps");
		
//		tx.executeSql('INSERT INTO PROCEDURESTEPS(ProcID,StepID,OrdNum ,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821","CRUSH821.001","1","Perform the preoperational inspection.","Step","1","TRUE","TRUE")');
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.002", "2", "Verify that the primary crusher lube unit (3110-LUS-001) is operating 						(the lubrication system is started up during the preoperational inspection).", "Step", "2","TRUE","TRUE")');	
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.003", "3", "Verify that the crusher hydraulic adjustment system (3110-HYU-001) is operating. If it is not operating, start the system.", "Step", "3", "TRUE","TRUE")');      
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.004", "4", "Verify that the air compressor (3110-ACO-001) is operating in a stable state.", "Step", "4", "TRUE","TRUE" )');     
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.005", "5", "Ensure that the rock breaker is rotated away from the crusher dump pocket in its park position with its boom folded.", "Step", "5", "TRUE", "TRUE")');      
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.006", "6", "Start the stockpile feed conveyor (3120-CVB-002). The seven warning strobes and horns activate 10 seconds prior to the conveyor motor start. There is a 1-second delay between the start of the three motors. If the automatic start-up option is utilized, there will be a 10-second delay between each conveyor start.", "Step", "6", "TRUE","TRUE")');     
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.007", "7", "Start the coarse ore tripper (3120-TRC-001). The warning strobe and horn precede the tripper start by 10 seconds.", "Step", "7", "TRUE","TRUE")');   
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.008", "8", "Start the overland conveyor 3120-CVB-001). The warning strobe and horn precedes the conveyor start by 10 seconds, and there is a 10-second delay between the start of each of the four motors on this conveyor.", "Step", "8", "TRUE","TRUE")');     
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.009", "9", "Start the primary crusher discharge conveyor (3120-CVB-011).", "Step", "9", "TRUE","TRUE")');    		
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.010", "10", "Start the self cleaning magnet (3110-MGT-001), including both the self- cleaning conveyor and the power to the magnet.", "Step", "10", "TRUE","TRUE")');     
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.011", "11",  "Start the primary crusher discharge apron feeder (3110-FDA-001).", "Step", "11", "TRUE","TRUE")');      
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.012", "12", "Set the bin level controller to Manual with the output of 0 percent.", "Step", "12", "TRUE", "TRUE")');     
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.013", "13", "Ensure that the primary crusher traffic lights are operating and that both of the No Dump red lights are activated.", "Step", "13", "TRUE", "TRUE")');    
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.014", "14", "Remove any isolation barriers that may be set up around the dump pocket.", "Step", "14", "TRUE", "TRUE" )');  
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.015", "15", "Ensure that the primary crushing dust suppression system (3110-DCD-040) is enabled.", "Step", "15", "TRUE","TRUE")');   
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.016", "16", "If the primary crusher discharge chute is empty, dump a special load of fine ore or sand into the crusher to place a bed of at least 100 mm of protective layer on the apron feeder pans.", "Step", "16", "TRUE","TRUE" )');
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.017", "17", "Start the primary crusher (3110-CRU-001).", "Step", "17", "TRUE","TRUE" )');     
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.018", "18", "Notify the mine to start hauling ore to the crusher.", "Step", "18", "TRUE","TRUE" )');  
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.001.1", "1", "Check for alarms on the DCS display and take appropriate action using the Alarm Fault Cause Remedy Chart", "Substep", "1.1", "TRUE","TRUE")');
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821","CRUSH821.000","1","Flashlight", "Required Equipment","1","TRUE","TRUE")');
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.0000", "1", "Safety Lock", "Required Equipment", "1", "TRUE", "TRUE")');
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.00000", "1", "Operators must inspect the plant visually before start-up from a complete shutdown. This inspection determines whether activities such as maintenance tasks must be performed before the start-up begins.", "Introduction", "1", "TRUE", "TRUE")');
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES("CRUSH821", "CRUSH821.009.1", "9", "The fine ore material helps prevent damage to the surge bin and to the apron feeder by forming a bed in the bin and on the feeder", "Caution", "9", "TRUE", "TRUE")');
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.009.1", "9", "Components of the lubrication system and hydraulic adjustment system can start from a remote command without warning. DO NOT reach behind or remove safety guards during the preoperational inspection"," Warning", "9", "TRUE", "TRUE")');
//
//tx.executeSql('INSERT INTO PROCEDURESTEPS (ProcID,StepID,OrdNum,Text,Type,Num,SelAllComps,SelAllFaults) VALUES ("CRUSH821", "CRUSH821.009.1", "9", "The preoperational inspection is intended to direct personnel to the right places to look for potential and existing problems. Each inspection is purposely intended to overlap inspections from personnel from other areas. It should not be assumed that other personnel from other operating plant areas will complete any of the preoperational inspection steps.Parts of the preoperational inspection will be completed several hours in advance of start-up and other portions just prior to start-up. Properly done, the preoperational inspection is a valuable tool for safety and for maintaining equipment in good condition.The field operator checks the field equipment and stays in communication with the control room operator to validate field observations and communicate maintenance needs.", "Note", "9", "TRUE", "TRUE")');  
	//	}
//		catch(err)
//		{
//			alert("error proceduresteps "+err.message);
//		}
//		

//Table Submittedprocs
//
tx.executeSql('CREATE TABLE IF NOT EXISTS SUBMITTEDPROCS (SubmitID,ProcID,Name,UserID,SubmitDate DATE,Comments,Status,Sync,Time DATETIME,EvalUserName,Position)');

//SumittedSteps
//
tx.executeSql("CREATE TABLE IF NOT EXISTS SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments,Sync,HaveMedia DEFAULT 'no' NOT NULL,NumFiles DEFAULT '0' NOT NULL,Response,UserID)");

tx.executeSql('CREATE TABLE IF NOT EXISTS TEMPSUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments)');

//Table Components
//
tx.executeSql('CREATE TABLE IF NOT EXISTS COMPONENTS (ID,Component,CompType)');

//tx.executeSql('INSERT INTO COMPONENTS (ID,Component,CompType) VALUES ("3110-LUS-001", "Primary Crusher Lube Unit", "Equipment")');
//tx.executeSql('INSERT INTO COMPONENTS (ID,Component,CompType) VALUES ("3110-LUS-001", "Primary Crusher Lube Unit", "Equipment")');
//tx.executeSql('INSERT INTO COMPONENTS (ID,Component,CompType) VALUES ("3110-HYU-001", "Crusher hydraulic adjustment system", "Equipment")');
//tx.executeSql('INSERT INTO COMPONENTS (ID,Component,CompType) VALUES ("GEARBOX", "Gearbox", "Component")');
//tx.executeSql('INSERT INTO COMPONENTS (ID,Component,CompType) VALUES ("HMOTOR", "Hydraulic Motor", "Component")');
//tx.executeSql('INSERT INTO COMPONENTS (ID,Component,CompType) VALUES ("DCHUTE", "Discharge Chute", "Component")');
//tx.executeSql('INSERT INTO COMPONENTS (ID,Component,CompType) VALUES ("METALD", "Metal Detector", "Component")');

//Table Comps2faults
tx.executeSql('CREATE TABLE IF NOT EXISTS COMPS2FAULTS (ID,FaultID)');
//tx.executeSql('INSERT INTO COMPS2FAULTS (ID,FaultID) VALUES ("DCHUTE","LEAK")');
//tx.executeSql('INSERT INTO COMPS2FAULTS (ID,FaultID) VALUES ("DCHUTE","HTEMP")');
//tx.executeSql('INSERT INTO COMPS2FAULTS (ID,FaultID) VALUES ("DCHUTE","LOWFLOW")');

//Table Faults
tx.executeSql('CREATE TABLE IF NOT EXISTS FAULTS (ID,Description,Priority)');

//tx.executeSql('INSERT INTO FAULTS (ID,Description,Priority) VALUES ("LOWFLOW","Low oil flow","3-Low")');
//tx.executeSql('INSERT INTO FAULTS (ID,Description,Priority) VALUES ("HTEMP","High-irregular temperature","1-High")');
//tx.executeSql('INSERT INTO FAULTS (ID,Description,Priority) VALUES ("LEAK","Leak","2-Med")');
//tx.executeSql('INSERT INTO FAULTS (ID,Description,Priority) VALUES ("","","")');
//tx.executeSql('INSERT INTO FAULTS (ID,Description,Priority) VALUES ("","","")');
//tx.executeSql('INSERT INTO FAULTS (ID,Description,Priority) VALUES ("","","")');

//Table Steps2Responses
tx.executeSql('CREATE TABLE IF NOT EXISTS STEPS2RESPONSES (ID,OrdNum,Text)');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.001","1","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.001","2","Monthly")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.001","3","Quarterly")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.001","4","Semi-annually")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.001","5","Annually")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.001","6","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.002","1","Work performance")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.002","2","Cost performance")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.002","3","Both")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.002","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.003","1","Verbal")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.003","2","Written")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.003","3","Both")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.003","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.004","1","Slow/Inefficient")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.011","1","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.004","2","Not functional")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.004","3","Responsibilities not clear")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.011","2","Operations")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.004","4","None")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.005","1","1 (Poor)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.005","2","2")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.005","3","3")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.005","4","4")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.005","5","5 (Excellent)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.006","1","1 (Poor)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.006","2","2")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.006","3","3")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.006","4","4")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.006","5","5 (Excellent)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.007","1","1 (Poor)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.007","2","2")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.007","3","3")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.007","4","4")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.007","5","5 (Excellent)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.008","1","1 (Poor)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.008","2","2")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.008","3","3")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.008","4","4")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.008","5","5 (Excellent)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.009","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.009","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.010","1","Operations")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.010","2","Maintenance")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.010","3","Warehouse/Purchasing")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.011","3","Maintenance")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.010","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.011","4","Warehouse/Purchasing")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.011","5","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.012","1","Planned shutdowns")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.012","2","Emergency responses")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.012","3","Equipment outages")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.012","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.013","1","Maintenance/Operations")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.013","2","Maintenance only")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.013","3","Not controlled")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.014","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.014","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.015","1","Daily")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.015","2","Weekly")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.015","3","Monthly")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.015","4","Never")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.016","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.017","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.016","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.017","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.018","1","Shift foreman")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.018","2","General foreman")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.018","3","Manager")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.018","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.019","1","1 (Poor)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.019","2","2")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.019","3","3")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.019","4","4")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.019","5","5 (Excellent)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.020","1","1 (Poor)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.020","2","2")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.020","3","3")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.020","4","4")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.020","5","5 (Excellent)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.021","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.021","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.022","1","Mechanical and/or lubrication personnel")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.022","2","Operations personnel")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.022","3","Not sure")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.023","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.023","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.024","1","Peer")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.024","2","Supervisor")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.024","3","Contractor")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.024","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.025","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.025","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.026","1","On the job")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.026","2","In the field")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.026","3","Classroom")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.026","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.027","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.027","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.028","1","Training supervisor")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.028","2","Upper management")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.028","3","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.029","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.029","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.030","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.030","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.031","1","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.031","2","Through job performance evaluation")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.031","3","Not sure")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.031","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.032","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.032","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.033","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.033","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.034","1","Unskilled labor")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.034","2","Lack of communication")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.034","3","Lack of resources: Manpower, Parts and  material, and/or Transportation")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.034","4","Lack of support from management")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.034","5","Lack of enforced discipline")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.034","6","Lack of upward mobility (promotion)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.034","7","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.035","1","Environmental")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.035","2","Political")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.035","3","Community")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("BOTH.035","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.001","1","Daily")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.001","2","Weekly")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.001","3","Monthly")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.001","4","Never")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.002","1","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.002","2","Attend scheduled meetings")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.002","3","Prioritize work")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.002","4","Schedule shutdowns")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.002","5","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.003","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.003","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.004","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.004","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.005","1","Peer training")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.005","2","Supervised training")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.005","3","Contracted training")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.005","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.006","1","Qualification")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.006","2","Seniority")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.006","3","Vacancy")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.006","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.007","1","1 (Poor)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.007","2","2")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.007","3","3")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.007","4","4")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("OPS.007","5","5 (Excellent)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.001","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.001","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.002","1","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.002","2","Formal planning and scheduling")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.002","3","Listing only")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.002","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.003","1","Actual work performed")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.003","2","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.003","3","None")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.004","1","Weekly")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.004","2","Monthly")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.004","3","Quarterly")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.004","4","Semi-annually")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.004","5","Annually")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.004","6","Never")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.005","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.005","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.006","1","Pre-staged from standard jobs")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.006","2","Formal request")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.006","3","Picked for work order")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.006","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.007","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.007","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.008","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.008","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.009","1","1 (Poor)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.009","2","2")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.009","3","3")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.009","4","4")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.009","5","5 (Excellent)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.010","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.010","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.011","1","Yes")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.011","2","No")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.012","1","On the job")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.012","2","In the field")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.012","3","Classroom")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.012","4","Other")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.013","1","1 (Poor)")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.013","2","2")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.013","3","3")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.013","4","4")');
//tx.executeSql('INSERT INTO STEPS2RESPONSES (ID,OrdNum,Text) VALUES ("MTC.013","5","5 (Excellent)")');
//Levels
tx.executeSql('CREATE TABLE IF NOT EXISTS LEVELS (LevelNum,ReqMonths,ReqHrsRTI,ReqHrsOJT)');
//tx.executeSql('INSERT INTO LEVELS (LevelNum,ReqMonths,ReqHrsRTI,ReqHrsOJT) VALUES ("1","6","72","1000")');
//tx.executeSql('INSERT INTO LEVELS (LevelNum,ReqMonths,ReqHrsRTI,ReqHrsOJT) VALUES ("2","6","72","1000")');
//tx.executeSql('INSERT INTO LEVELS (LevelNum,ReqMonths,ReqHrsRTI,ReqHrsOJT) VALUES ("3","12","144","2000")');
//tx.executeSql('INSERT INTO LEVELS (LevelNum,ReqMonths,ReqHrsRTI,ReqHrsOJT) VALUES ("4","12","144","2000")');
//tx.executeSql('INSERT INTO LEVELS (LevelNum,ReqMonths,ReqHrsRTI,ReqHrsOJT) VALUES ("5","12","144","2000")');

tx.executeSql('CREATE TABLE IF NOT EXISTS TASKS (ID,Name,ReqHrsOJT)');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("A1- Complete new miner MSHA training","A1- Complete new miner MSHA training","30")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("A2- Review SOP for specific task(s)","A2- Review SOP for specific task(s)","120")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("A3- Complete Safety task training","A3- Complete Safety task training","250")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("A4-Complete Task training","A4-Complete Task training","250")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("A5-Complete performance plan review","A5-Complete performance plan review","50")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B1- Prepare daily PPE","B1- Prepare daily PPE","38")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B2- Participate in Safety Meetings","B2- Participate in Safety Meetings","30")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B3- Perform daily equipment inspections","B3- Perform daily equipment inspections","160")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B4- Perform daily housekeeping activities","B4- Perform daily housekeeping activities","163")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B5- Perform pipe system inspections","B5- Perform pipe system inspections","48")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B6- Complete daily MSHA workplace inspection","B6- Complete daily MSHA workplace inspection","204")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B7-  Maintain communications with support group","B7-  Maintain communications with support group","61")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B8- Respond to control room call-outs","B8- Respond to control room call-outs","105")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B9- Un-sand equipment","B9- Un-sand equipment","56")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B10- Follow established start up / shut down procedures (i.e. planned / emergency)","B10- Follow established start up / shut down procedures (i.e. planned / emergency)","92")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B11- Perform LTE/ZTE mill shutdown tasks","B11- Perform LTE/ZTE mill shutdown tasks","80")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("B12- Attend safety training refresher classes","B12- Attend safety training refresher classes","63")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C1- Complete Reagent Safety Training","C1- Complete Reagent Safety Training","59")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C2- Track mill consumption","C2- Track mill consumption","61")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C3- Measure reagent specific gravities","C3- Measure reagent specific gravities","68")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C4- Receive Chemical Inventory","C4- Receive Chemical Inventory","120")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C5- Stage Reagents in designated staging areas","C5- Stage Reagents in designated staging areas","118")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C6- Mix chemical batches","C6- Mix chemical batches","375")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C7- Clean debris strainers","C7- Clean debris strainers","58")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C8- Receive grinding media inventory","C8- Receive grinding media inventory","60")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C9- Fill ball hoppers","C9- Fill ball hoppers","98")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C10- Complete daily Reagent Report","C10- Complete daily Reagent Report","44")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("C11- Complete daily reagents and grinding media orders","C11- Complete daily reagents and grinding media orders","39")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("D1- Assess clarifier performance","D1- Assess clarifier performance","153")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("D2- Verify pH balances","D2- Verify pH balances","71")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("D3- Verify NTU reading balances","D3- Verify NTU reading balances","75")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("D4- Maintain lime slaking system","D4- Maintain lime slaking system","196")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("D5- Inspect sand filter system","D5- Inspect sand filter system","85")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("D6- Inspect single-stage air compressor  Sullairs/Blowers","D6- Inspect single-stage air compressor  Sullairs/Blowers","45")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("D7- Maintain flocculant systems","D7- Maintain flocculant systems","118")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("D8- Perform daily outside pump run inspection","D8- Perform daily outside pump run inspection","219")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("D9- Complete water treatment system PM work order(s)","D9- Complete water treatment system PM work order(s)","54")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("D10- Complete daily water treatment operator reports","D10- Complete daily water treatment operator reports","84")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E1- Perform dewatering circuit inspection","E1- Perform dewatering circuit inspection","105")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E2- Monitor filter press performance","E2- Monitor filter press performance","140")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E3- Assess thickener performance","E3- Assess thickener performance","71")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E4- Collect Dewatering density samples","E4- Collect Dewatering density samples","76")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E5- Collect moisture samples","E5- Collect moisture samples","81")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E6- Inspect Conveyor Belt System","E6- Inspect Conveyor Belt System","63")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E7- Maintain drop chute clearances","E7- Maintain drop chute clearances","45")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E8- Manage filtered water from the filter presses","E8- Manage filtered water from the filter presses","29")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E9- Monitor concentrate height in CSB","E9- Monitor concentrate height in CSB","31")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E10- Inspect CSB Baghouse (i.e. air filtration system)","E10- Inspect CSB Baghouse (i.e. air filtration system)","36")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E11- Collect daily dewatering samples","E11- Collect daily dewatering samples","67")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E12-  Measure flocculant dosage","E12-  Measure flocculant dosage","53")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E13- Inspect multi-stage air compressor","E13- Inspect multi-stage air compressor","52")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E14- Change out faulty clothes","E14- Change out faulty clothes","50")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E15- Complete scheduled filter batch change out","E15- Complete scheduled filter batch change out","78")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E16- Prepare filter cloths for change out","E16- Prepare filter cloths for change out","27")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E17- Stage filter cloths for change out","E17- Stage filter cloths for change out","17")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E18- Manage trash screen performance","E18- Manage trash screen performance","24")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E19- Complete Dewatering circuit PM work orders","E19- Complete Dewatering circuit PM work orders","29")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("E20- Complete daily dewatering operator reports","E20- Complete daily dewatering operator reports","26")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F1- Collect grinding density samples","F1- Collect grinding density samples","99")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F2- Analyze cyclone efficiency","F2- Analyze cyclone efficiency","111")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F3- Perform routine conveyor belt inspections","F3- Perform routine conveyor belt inspections","67")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F4- Measure grinding reagent","F4- Measure grinding reagent","36")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F5- Complete CRO reports","F5- Complete CRO reports","66")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F6- Inspect SAG mill feed chutes","F6- Inspect SAG mill feed chutes","39")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F7- Inspect SAG trommel screens","F7- Inspect SAG trommel screens","30")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F8- Inspect apron feeders","F8- Inspect apron feeders","48")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F10- Manage dust scrubber performance","F10- Manage dust scrubber performance","57")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F11- Complete daily mill charge (i.e. SAG, Ball)","F11- Complete daily mill charge (i.e. SAG, Ball)","75")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F12- Optimize grinding throughput","F12- Optimize grinding throughput","128")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F13- Monitor PSI reading (i.e. cyclone, air, bearing lube pressure)","F13- Monitor PSI reading (i.e. cyclone, air, bearing lube pressure)","41")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F14- Monitor pre-flot circuit performance","F14- Monitor pre-flot circuit performance","54")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F15- Confirm mill feed sample stream","F15- Confirm mill feed sample stream","33")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F16- Complete pump changeover (i.e. lube oil, slurry)","F16- Complete pump changeover (i.e. lube oil, slurry)","56")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F17- Complete grinding cyclone(s) swap","F17- Complete grinding cyclone(s) swap","28")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F18- Collect daily grinding samples","F18- Collect daily grinding samples","39")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F19- Conduct grinding pre-flot cell PM","F19- Conduct grinding pre-flot cell PM","32")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G1- Monitor reagents for circuit (i.e. SG, usage, dosage)","G1- Monitor reagents for circuit (i.e. SG, usage, dosage)","105")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G2- Monitor performance of mechanical flotation cell","G2- Monitor performance of mechanical flotation cell","77")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G3- Measure flotation circuit densities ","G3- Measure flotation circuit densities","62")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G4- Inspect flotation cell agitator","G4- Inspect flotation cell agitator","47")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G5- Collect daily silica samples","G5- Collect daily silica samples","45")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G6- Monitor zinc and lead courier streams and targets","G6- Monitor zinc and lead courier streams and targets","81")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G7-  Flush circuit sample stream lines","G7-  Flush circuit sample stream lines","42")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G8- Collect daily flotation samples","G8- Collect daily flotation samples","57")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G9- Analyze froth structure","G9- Analyze froth structure","70")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G10- Monitor column cell performance","G10- Monitor column cell performance","101")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G11- Adjust column cell air disbursement system","G11- Adjust column cell air disbursement system","72")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G12- Clean wash water headers","G12- Clean wash water headers","52")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G13- Clean column level indicators","G13- Clean column level indicators","32")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G14- Clean concentrate launders","G14- Clean concentrate launders","33")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G15- Manage regrind mill performance","G15- Manage regrind mill performance","77")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G16- Monitor flotation circuit flow (i.e. Zn, Pb)","G16- Monitor flotation circuit flow (i.e. Zn, Pb)","116")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("G17- Monitor mechanical cell air blowers","G17- Monitor mechanical cell air blowers","31")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("H1- Conduct shift change carryover meeting","H1- Conduct shift change carryover meeting","39")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("H2- Communicate task(s) with mill operators","H2- Communicate task(s) with mill operators","67")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("H3- Perform dispatch responsibilities","H3- Perform dispatch responsibilities ","50")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("H4- Provide training & technical support for mill operators (i.e. SOP’s, SDS, MWO)","H4- Provide training & technical support for mill operators (i.e. SOP’s, SDS, MWO)","118")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("H5- Monitor mill performance data","H5- Monitor mill performance data","119")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("H6- Manage production targets","H6- Manage production targets","89")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("H7- Maximize mill throughput of ore","H7- Maximize mill throughput of ore","65")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("H8- Optimize reagent usage","H8- Optimize reagent usage","64")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("H9- Complete daily control room operator reports","H9- Complete daily control room operator reports","89")');
//tx.executeSql('INSERT INTO TASKS (ID,Name,ReqHrsOJT) VALUES("F9- Manage dust suppression system","F9- Manage dust suppression system","61")');

tx.executeSql('CREATE TABLE IF NOT EXISTS ITEMS (ID,Item,CourseID)');
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("00104-15 Introduction to Power Tools","00104-15 Introduction to Power Tools"," ")');
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("00105-15 Introduction to Construction Drawings","00105-15 Introduction to Construction Drawings"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("00101-15 Basic Safety","00101-15 Basic Safety","401")');
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("00102-15 Introduction to Construction Math","00102-15 Introduction to Construction Math"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("00103-15 Introduction to Hand Tools	00103-15","Introduction to Hand Tools"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("Cross-training with S&H department","Cross-training with S&H department"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("MSHA Workplace Examinations training","MSHA Workplace Examinations training"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("Safety meetings","Safety meetings"," "	)');
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("Prepare daily","Preparerepare daily PPE"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("Proper equipment inspections","Proper equipment inspections"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("Housekeeping and 5s with Business Improvement","Housekeeping and 5s with Business Improvement"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("CBT","CBT"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("Workbook","Workbook"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("Cross training with Mill Maintenance","Cross training with Mill Maintenance"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("Cross training with CRO on Reagent ordering","Cross training with CRO on Reagent ordering"," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("00106-15 Introduction to Basic Rigging ","00106-15 Introduction to Basic Rigging"," ")'); 	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("00107-15 Basic Communication Skills ","00107-15 Basic Communication Skills "," ")');	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("00108-15 Basic Employability Skills","00108-15 Basic Employability Skills"," ")'); 	
//tx.executeSql('INSERT INTO ITEMS (ID,Item,CourseID) VALUES("00109-15 Introduction to Material Handling","00109-15 Introduction to Material Handling"," ")');	

tx.executeSql('CREATE TABLE IF NOT EXISTS LEVELS2TASKS (LevelNum,ID)');

tx.executeSql('CREATE TABLE IF NOT EXISTS LEVELS2ITEMS (LevelNum,ID)');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("1","00101-15 Basic Safety")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("1","00102-15 Introduction to Construction Math")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("1","00103-15 Introduction to Hand Tools")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("1","00104-15 Introduction to Power Tools")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("1","00105-15 Introduction to Construction Drawings")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("2","Cross-training with S&H department")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("2","Housekeeping and 5s with Business Improvement")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("2","MSHA Workplace Examinations training")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("2","Prepare daily PPE")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("2","Proper equipment inspections")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("2","Safety meetings")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("3","CBT")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("3","Cross training with CRO on Reagent ordering")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("3","Cross training with Mill Maintenance")');
//tx.executeSql('INSERT INTO LEVELS2ITEMS (LevelNum,ID) VALUES("3","Workbook")');

tx.executeSql('CREATE TABLE IF NOT EXISTS SUBMITTEDHOURS (SubmitID,UserID,Type,Status,SubmitDate,EntryDate,Task,LevelNum,Item,Hours,Mins,PersonnelID,SupervisorID,RejectReason,ReviewDate,Sync)');

tx.executeSql("CREATE TABLE IF NOT EXISTS MESSAGES (ID,UserIDTo,UserIDFrom,Status,Date DATETIME,Title,Category,Message,Priority,UserToList,UserIDToName,UserIDFromName,Sync,SentFT,Deleted DEFAULT '0' NOT NULL)");

tx.executeSql('CREATE TABLE IF NOT EXISTS CATEGORIES (Name)');

tx.executeSql('CREATE TABLE IF NOT EXISTS SUBMITOJT2USERS (SubmitID,UserID)');

tx.executeSql('CREATE TABLE IF NOT EXISTS COURSES (ID,Description,DescriptionLang2,ContentType,DurationHours,DurationMins,Scope,Instructor,FileName,FileSize)');

tx.executeSql('CREATE TABLE IF NOT EXISTS GROUP2SUPS (GroupID,ID)');
//tx.executeSql('INSERT INTO GROUP2SUPS (GroupID,ID) VALUES ("D10T1","jbaca")');
//tx.executeSql('INSERT INTO GROUP2SUPS (GroupID,ID) VALUES ("A1","jbaca")');
//tx.executeSql('INSERT INTO GROUP2SUPS (GroupID,ID) VALUES ("A3","dclaxton")');

tx.executeSql('CREATE TABLE IF NOT EXISTS GROUP2SUPSRTI (GroupID,ID)');
//tx.executeSql('INSERT INTO GROUP2SUPSRTI (GroupID,ID) VALUES ("A1","mterrazas")');
//tx.executeSql('INSERT INTO GROUP2SUPSRTI (GroupID,ID) VALUES ("A3","jbaca")');

tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS2CONTENT(GroupID,ID,Ord)');

tx.executeSql('CREATE TABLE IF NOT EXISTS  DUTIES2TASKS(Duty,TaskID,OrdNum)');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("A","A1- Complete new miner MSHA training","1")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("A","A2- Review SOP for specific task(s)","2")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("A","A3- Complete Safety task training","4")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("A","A4-Complete Task training","7")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("A","A5-Complete performance plan review","11")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B1- Prepare daily PPE","1")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B10- Follow established start up / shut down procedures (i.e. planned / emergency)","10")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B11- Perform LTE/ZTE mill shutdown tasks","11")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B12- Attend safety training refresher classes","12")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B2- Participate in Safety Meetings","2")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B3- Perform daily equipment inspections","3")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B4- Perform daily housekeeping activities","4")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B5- Perform pipe system inspections","5")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B6- Complete daily MSHA workplace inspection","6")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B7-  Maintain communications with support group","7")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B8- Respond to control room call-outs","8")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("B","B9- Un-sand equipment","9")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C1- Complete Reagent Safety Training","1")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C10- Complete daily Reagent Report","10")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C11- Complete daily reagents and grinding media orders","11")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C2- Track mill consumption","2")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C3- Measure reagent specific gravities","3")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C4- Receive Chemical Inventory","4")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C5- Stage Reagents in designated staging areas","5")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C6- Mix chemical batches","6")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C7- Clean debris strainers","7")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C8- Receive grinding media inventory","8")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("C","C9- Fill ball hoppers","9")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("D","D1- Assess clarifier performance","1")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("D","D10- Complete daily water treatment operator reports","10")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("D","D2- Verify pH balances","2")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("D","D3- Verify NTU reading balances","3")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("D","D4- Maintain lime slaking system","4")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("D","D5- Inspect sand filter system","5")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("D","D6- Inspect single-stage air compressor  Sullairs/Blowers","6")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("D","D7- Maintain flocculant systems","7")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("D","D8- Perform daily outside pump run inspection","8")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("D","D9- Complete water treatment system PM work order(s)","9")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E1- Perform dewatering circuit inspection","1")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E10- Inspect CSB Baghouse (i.e. air filtration system)","10")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E11- Collect daily dewatering samples","11")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E12-  Measure flocculant dosage","12")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E13- Inspect multi-stage air compressor","13")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E14- Change out faulty clothes","14")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E15- Complete scheduled filter batch change out","15")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E16- Prepare filter cloths for change out","16")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E17- Stage filter cloths for change out","17")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E18- Manage trash screen performance","18")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E19- Complete Dewatering circuit PM work orders","19")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E2- Monitor filter press performance","2")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E20- Complete daily dewatering operator reports","20")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E3- Assess thickener performance","3")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E4- Collect Dewatering density samples","4")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E5- Collect moisture samples","5")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E6- Inspect Conveyor Belt System","6")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E7- Maintain drop chute clearances","7")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E8- Manage filtered water from the filter presses","8")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("E","E9- Monitor concentrate height in CSB","9")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F1- Collect grinding density samples","1")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F10- Manage dust scrubber performance","10")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F11- Complete daily mill charge (i.e. SAG, Ball)","11")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F12- Optimize grinding throughput","12")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F13- Monitor PSI reading (i.e. cyclone, air, bearing lube pressure)","13")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F14- Monitor pre-flot circuit performance","14")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F15- Confirm mill feed sample stream","15")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F16- Complete pump changeover (i.e. lube oil, slurry)","16")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F17- Complete grinding cyclone(s) swap","17")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F18- Collect daily grinding samples","18")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F19- Conduct grinding pre-flot cell PM	","19")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F2- Analyze cyclone efficiency","2")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F3- Perform routine conveyor belt inspections","3")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F4- Measure grinding reagent","4")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F5- Complete CRO reports","5")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F6- Inspect SAG mill feed chutes","6")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F7- Inspect SAG trommel screens","7")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F8- Inspect apron feeders","8")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("F","F9- Manage dust suppression system","9")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G12- Clean wash water headers","12")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G13- Clean column level indicators","13")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G14- Clean concentrate launders","14")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G15- Manage regrind mill performance","15")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G16- Monitor flotation circuit flow (i.e. Zn, Pb)","16")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G17- Monitor mechanical cell air blowers","17")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G2- Monitor performance of mechanical flotation cell","2")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G3- Measure flotation circuit densities","3")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G4- Inspect flotation cell agitator","4")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G5- Collect daily silica samples","5")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G6- Monitor zinc and lead courier streams and targets","6")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G7-  Flush circuit sample stream lines","7")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G8- Collect daily flotation samples","8")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G9- Analyze froth structure","9")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("H","H1- Conduct shift change carryover meeting","1")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("H","H2- Communicate task(s) with mill operators","2")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("H","H3- Perform dispatch responsibilities","3")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("H","H4- Provide training & technical support for mill operators (i.e. SOP’s, SDS, MWO)","4")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("H","H5- Monitor mill performance data","5")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("H","H6- Manage production targets","6")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("H","H7- Maximize mill throughput of ore","7")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("H","H8- Optimize reagent usage","8")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("H","H9- Complete daily control room operator reports","9")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G1- Monitor reagents for circuit (i.e. SG, usage, dosage)","1")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G10- Monitor column cell performance","10")');
//tx.executeSql('INSERT INTO DUTIES2TASKS (Duty,TaskID,OrdNum) VALUES("G","G11- Adjust column cell air disbursement system","11")');

//temp
tx.executeSql('CREATE TABLE IF NOT EXISTS TEMPRESPONSES (SubmitID,ProcID,StepID,Text,Num,Response,Comments,UserID,QNum)');




 }
 
 // Transaction success callback
    //
    function successCBMain() {
        
    }
	 // Transaction error callback
	function errorCBIN(tx, err) {
      // alert("Error processing SQL:: "+err);
	   //alert("DB Error: "+err.message + "\nCode="+err.code);
    }
		function errorCBlan(tx, err) {
       //alert(err.code)
    }
	
	//Export Database 


	
///////=============================<<<<<<<<<<<< END FUNCTIONS TO CREATE DATABASE >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<=============================FUNCTIONS TO SYNC WITH SERVER =========================================>>>>>>>>>>>///////
	
	function Syncupdatedatabase()
	{
	
	  
	}
	
	function SyncStatus()
	{
		var SyncDB=$("#hs").val();
		//alert(SyncDB);
		if(SyncDB=="no")
		{
		var parentElement = document.getElementById("Syncready");
        var receivedElement = parentElement.querySelector('.received');
        receivedElement.setAttribute('style', 'display:block;');
			
		}
	}
	
///////=============================<<<<<<<<<<<< END FUNCTIONS TO SYNC WITH SERVER >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= GLOBAL FUNCTIONS =========================================>>>>>>>>>>>///////
//ON LOAD INDEX.HTML

$(function(){
	
	$("#username").keyup(function (e) {
	   		 if (e.keyCode == 13) {
	       // LoginUser();
		   $("#password").focus();
	    	}
		});
		$("#password").keyup(function (e) {
	   		 if (e.keyCode == 13) {
	          LoginUser();
	    	}
		});

});

// Transaction error callback
    //
    function errorCB(err) {
		 // alert("DB Error: "+err.message + "\nCode="+err.code);
		 //alert(tt);
        //alert("Error processing SQL:: "+err.code+ "::" + err.message);
    }
	    function errorCBeval(err) {
		  alert("DB Error: "+err.message + "\nCode="+err.code);
        //alert("Error processing SQL:: "+err.code+ "::" + err.message);
    }
	
//EXIT PROGRAM	
	function ExitAPP()
{
	navigator.app.exitApp();
}

function escapeDoubleQuotes(str) {
	     try {
                return str.replace(/"/gi, "''")
            }
            catch (err) {
               // alert(err.message);
			   var stringe="";
			   return stringe;
            }
}

//Desicion button back report steps history

function dbackhist()
{
	var des=$("#hgoto").val();
	//alert(des);
	if(des=="0")
	{
		navbyapp("prochis");
	}
	else if(des=="2")
	{
		navbyapp("rejected");
	}
	else
	{
		navbyapp("dataqueris");
		
	}
}

//NAVIGATE APP

function navbyapp(namewindow)
{
	
	if(namewindow=="checklist")
	{
	    $(':mobile-pagecontainer').pagecontainer('change', '#pageChecklist', {
        transition: 'pop',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		
	}
	else if (namewindow=="menu")
	{
		  $(':mobile-pagecontainer').pagecontainer('change', '#pageMenu', {
        transition: 'flip',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		
	}
	else if (namewindow=="checklistsave")
	{
		$(':mobile-pagecontainer').pagecontainer('change', '#pageChecklistSave', {
        transition: 'slidedown',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		
	}
	else if (namewindow=="procedurelaunch")
	{
			    $(':mobile-pagecontainer').pagecontainer('change', '#pageProcedureLaunch', {
        transition: 'pop',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		
	}
	else if (namewindow=="procedure")
	{
		$(':mobile-pagecontainer').pagecontainer('change', '#pageProcedure', {
        transition: 'slidedown',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		
	}
	else if (namewindow=="report")
	{
		$(':mobile-pagecontainer').pagecontainer('change', '#pageReport', {
        transition: 'slide',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		
	}
    else if (namewindow=="dataqueris")
	{
				$(':mobile-pagecontainer').pagecontainer('change', '#pageDataqueris', {
        transition: 'pop',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		
	}
	else if (namewindow=="result")
	{
		$(':mobile-pagecontainer').pagecontainer('change', '#pageResult', {
        transition: 'slidedown',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	}
		else if (namewindow=="history")
	{
		
		$(':mobile-pagecontainer').pagecontainer('change', '#pageProcedureHsteps', {
        transition: 'slidedown',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	}
			else if (namewindow=="prochis")
	{
		
		$(':mobile-pagecontainer').pagecontainer('change', '#pageHistoryProc', {
        transition: 'slidedown',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	}
	else if (namewindow=="rejected")
	{
		
		$(':mobile-pagecontainer').pagecontainer('change', '#pageRejected', {
        transition: 'slidedown',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	}
	else if (namewindow=="evaulationslaunch")
	{		
		$(':mobile-pagecontainer').pagecontainer('change', '#pageEvaluationsLaunch', {
        transition: 'slidedown',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	}
	else if (namewindow=="messages")
	{		
		$(':mobile-pagecontainer').pagecontainer('change', '#pageMessages', {
        transition: 'slidedown',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	}
	else if (namewindow=="library")
	{		
		$(':mobile-pagecontainer').pagecontainer('change', '#pageLibrary', {
        transition: 'slidedown',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	}

	

	
	
}


///////=============================<<<<<<<<<<<< END GLOBAL FUNCTIONS >>>>>>>>>>>=========================================///////

////<<<<<<<<============================= FUNCTION TO CHECK REJECTED SUBMITTED PROCS =========================================>>>>>>>>////
function verifyrejected()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Querytocheckrejected, errorCBlan);
	
}

function Querytocheckrejected(tx)
{
	
	tx.executeSql("SELECT REJECTED.*, SUBMITTEDPROCS.SubmitDate as Timex FROM REJECTED INNER JOIN SUBMITTEDPROCS ON SUBMITTEDPROCS.SubmitID=REJECTED.SubmitID", [], QuerytocheckrejectedSuccess, errorCBlan);
	
}

function QuerytocheckrejectedSuccess(tx,results)
{
	 var len = results.rows.length;
	 //alert("entro");
	 $("#hrej").val(len);
}

function refreshverify()
{
	var len=$("#hrej").val();
	$("#mbtndatarejected").val("Rejected Procedures ("+len+")");
	$("#mbtndatarejected").button("refresh");
}


///////=============================<<<<<<<<<<<< END FUNCTION TO CHECK REJECTED >>>>>>>>>>>=========================================///////



///////<<<<<<<<<<<<============================= ON LOAD PAGES =========================================>>>>>>>>>>>///////

// ON CREATE LOADING DATA

//ON CREATE CHECKLIST SAVE
$(document).on( 'pagebeforeshow', '#generic-dialog',function(event,data){
	$("#generic-dialog").dialog({ 
	position: 'center', 
	closeOnEscape: false, 
	open: function(event, ui) { 
		// Hide close button 
		$(this).parent().children().children(".ui-dialog-titlebar-close").hide(); 
	} 
});
	 
 					



});
//ON CREATE PAGE LOGIN
$(document).on( 'pageinit', '#pageLogin',function(){
	//SetPortrait();
verifyrejected();
	if(window.innerHeight > window.innerWidth){
   // alert("Portrait!");
			$('#logincontent').empty();
		$('#logincontent').append('<div class="ui-grid-a"></div><div class="ui-grid-b"><form id="loginForm" style="margin-left:10%;  margin-right:10%; margin-top:85%;"><div data-role="fieldcontain" class="ui-hide-label"><label for="username">Username:</label><input type="text" name="username" id="username" value="" placeholder="Username" /></div><div data-role="fieldcontain" class="ui-hide-label"><label for="password">Password:</label><input type="password" name="password" id="password" value="" placeholder="Password" /></div><input type="button" class="ui-btn-b"  value="Login" id="LoginButton" onClick="LoginUser()"></form></div>').trigger('create');
}
else
{
	// alert("Landscapet!");
			$('#logincontent').empty();
		$('#logincontent').append(' <div class="ui-grid-a"><div class="ui-block-a"></div><div class="ui-block-b"><form id="loginForm" style="width:70%; margin-left:20%; margin-top:32%;"><div data-role="fieldcontain" class="ui-hide-label"><label for="username">Username:</label><input type="text" name="username" id="username" value="" placeholder="Username" /></div><div data-role="fieldcontain" class="ui-hide-label"><label for="password">Password:</label><input type="password" name="password" id="password" value="" placeholder="Password" /></div><input type="button" class="ui-btn-b"  value="Login" id="LoginButton" onClick="LoginUser()"></form></div></div>').trigger('create');
}

translatehtml();


	 


});

//ON SHOW PAGE LOGIN



//ON CREATE PAGE MENU
$(document).on( 'pagebeforeshow', '#pageMenu',function(){
	
	verifyrejected();
	var rejbtn="";
	var textprocedure=$("#btpro").val();
	var textdata=$("#btdata").val();
	var textcheck=$("#btcheck").val();
    var lenrej=$("#hrej").val();
		//alert("lenrej: "+lenrej);
	  if(lenrej>0)
	  {
		  rejbtn='<input data-role="button" id="mbtndatarejected" type="button" value="Rejected Procedures('+lenrej+')" data-theme="a" onClick="navbyapp('+"'rejected'"+')">';
	   }
    		if(window.innerHeight > window.innerWidth){
    //alert("Portrffgait!");

			$('#menucontentd').empty();
				$('#menucontentd').append('<form  style="margin-left:10%;  margin-right:10%; margin-top:85%;"><div class="ui-grid-b ui-responsive"><div class="ui-block-a"><a href="#pageLogbook" id="mbtnlogbook" class="ui-btn ui-shadow ui-corner-all"><img src="img/logbook.png" height="36" width="36"/><br>Logbook</a></div><div class="ui-block-b"><a href="#pageProcedureLaunch" id="mbtnprocedures" class="ui-btn ui-shadow ui-corner-all"><img src="img/procedures.png" height="36" width="36"/><br>Procedures</a></div><div class="ui-block-c"><a href="javascript:navbyapp('+"'library'"+');" id="mbtnlibrary" class="ui-btn ui-shadow ui-corner-all"><img src="img/library.png" height="36" width="36"/><br>Library</a></div></div><div class="ui-grid-b ui-responsive"><div class="ui-block-a"><a href="javascript:navbyapp('+"'messages'"+');" id="mbtnmessages" class="ui-btn ui-shadow ui-corner-all"><img src="img/messages.png" height="36" width="36"/><br>Messages</a></div><div class="ui-block-b"><a href="javascript:navbyapp('+"'certifications'"+');" id="mbtncertifications" class="ui-btn ui-shadow ui-corner-all"><img src="img/certifications.png" height="36" width="36"/><br>Certifications</a></div><div class="ui-block-c"><a href="javascript:navbyapp('+"'dataqueris'"+');" id="mbtndataqueris" class="ui-btn ui-shadow ui-corner-all"><img src="img/query.png" height="36" width="36"/><br>Data Queries</a></div></div><div class="ui-grid-solo">'+rejbtn+'</div><input type="hidden" value="yes" id="hs" name="hs"><div id="Syncready" class="blink"><p class="event received">Database is not synchronized</p></div></div></form>').trigger('create');
	//$('#menucontentd').empty();
	//$('#menucontentd').append('Portrait').trigger('create');	
}
else
{
	// alert("Landscdfdapet!");
		$('#menucontentd').empty();
		$('#menucontentd').append('<div class="ui-grid-a"><div class="ui-block-a"></div><div class="ui-block-b"><form  style="width:70%; margin-left:20%; margin-top:32%;"><div class="ui-grid-b ui-responsive"><div class="ui-block-a"><a href="#pageLogbook" id="mbtnlogbook" class="ui-btn ui-shadow ui-corner-all"><img src="img/logbook.png" height="36" width="36"/><br>Logbook</a></div><div class="ui-block-b"><a href="#pageProcedureLaunch" id="mbtnprocedures" class="ui-btn ui-shadow ui-corner-all"><img src="img/procedures.png" height="36" width="36"/><br>Procedures</a></div><div class="ui-block-c"><a href="javascript:navbyapp('+"'library'"+');" id="mbtnlibrary" class="ui-btn ui-shadow ui-corner-all"><img src="img/library.png" height="36" width="36"/><br>Library</a></div></div><div class="ui-grid-b ui-responsive"><div class="ui-block-a"><a href="javascript:navbyapp('+"'messages'"+');" id="mbtnmessages" class="ui-btn ui-shadow ui-corner-all"><img src="img/messages.png" height="36" width="36"/><br>Messages</a></div><div class="ui-block-b"><a href="javascript:navbyapp('+"'certifications'"+');" id="mbtncertifications" class="ui-btn ui-shadow ui-corner-all"><img src="img/certifications.png" height="36" width="36"/><br>Certifications</a></div><div class="ui-block-c"><a href="javascript:navbyapp('+"'dataqueris'"+');" id="mbtndataqueris" class="ui-btn ui-shadow ui-corner-all"><img src="img/query.png" height="36" width="36"/><br>Data Queries</a></div></div><div class="ui-grid-solo">'+rejbtn+'</div><input type="hidden" value="yes" id="hs" name="hs"><div id="Syncready" class="blink"><p class="event received">Database is not synchronized</p></div></form></div>').trigger('create');
		
		
		//$('#menucontentd').empty();
		//$('#menucontentd').append('Landscape').trigger('create');
		
		
	
}

translatehtml();
	
	$("#mainusername").html(sessionStorage["fname"]);
	$("#hs").val('yes');
	checkifnotsync();
	//verifyrejected();
	refreshverify();
	
	//SyncStatus();
	 


});


<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE CHECKLIST USERS
$(document).on( 'pagecreate', '#pageChecklist',function(){

     $("#bodycheck-list").html("");
       fillUsersSelect('#userlist');
	   fillGroupsSelect();

    $('#userslist').on('click','li', function() {
		var colorcito= $(this).css('backgroundColor');
		var hh=rgb2hex(colorcito);
		//alert(hh);
		if(hh=="#0000ff")
		{
		$(this).css({background: 'white'});
		$(this).css({color: 'black'});
			
		}
		else
		{
			    $(this).css({background: 'blue'});
				$(this).css({color: 'white'});
			
		}
       // $('#userslist li').css({background: 'white'});
		//$('#userslist li').css({color: 'black'});
    
		var id=$(this).attr('id');
		var nameofuser=$(this).text();
		//$("#userch").val(id); 
		//sessionStorage.userchoose=id;
	    //sessionStorage.userchoosename=nameofuser;
		//alert(nameofuser);
    });
	

});

<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE CHECKLIST SAVE
$(document).on( 'pagebeforeshow', '#pageChecklistSave',function(){

 $("#checkuser").html("<img src='img/graphs/Logo_Small.png' style='height: 2em' /> &nbsp;&nbsp;Checklist: "+sessionStorage.userchoosename);
 
 
  var picker = $( "#dateentry", this );
    picker.mobipick({dateFormat:GetDateFormat()});
var now = new Date();
var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
$('#dateentry').val(ShowFormatDate(today));
var mult=$('#mult').val();
//alert(mult);
if(mult=="0")
{
	fillchecklist();
	
}
else
{
	
	//alert("Working on multiple users");
	fillmultiplechecklist();
}


//$('[type="checkbox"]').checkboxradio('refresh');




});

<!---------------------------------------------------------------------------------------------------------------------->
//ON CREATE Launch Procedure
$(document).on( 'pagebeforeshow', '#pageProcedureLaunch',function(){
     var tb = $('#stepsbodyh');
		 tb.html("");
    $("#chpro").val("0");
	//checkdbprocedures();
     fillprocedurestolaunch();
	 fillGroupsSelecttwo();
    $('#table-procedures').on('click','tr', function() {
        $('#proceduresbodytable tr').css({background: 'transparent'});
		$('#proceduresbodytable tr').css({color: 'black'});
        $(this).css({background: 'blue'});
		$(this).css({color: 'white'});
		var idrow=$(this).attr('data-name');
		$("#chnamep").val('');
		$("#chpro").val(idrow);
		searchnameprocedure();
		$("#headtableprocedure").addClass("ui-bar-c");
		//alert(idrow);
		var text=$(this).text();
		text=text.replace('Procedure Name','');
		text=$.trim(text);
		
		sessionStorage.loadsteps="true";
	 $("#table-procedures").table("refresh");
	 $("#table-procedures").trigger('create');
	
    });
	
});

<!---------------------------------------------------------------------------------------------------------------------->
//ON CREATE PROCEDURE STEPS
$(document).on( 'pagebeforeshow', '#pageProcedure',function(){
	$('#bodyissues').html("");
	var whattodo=sessionStorage.loadsteps;
	if(whattodo=="true")
	{
		//alert("whattodo true");
    var submitID = sessionStorage.userid+new Date().getTime() + Math.random();
	sessionStorage.submitID=submitID;
	var nameprocedure=sessionStorage.nameprocedure;
	$("#headproname").html(" <img src='img/graphs/Logo_Small.png' style='height: 2em' /> &nbsp;&nbsp;"+nameprocedure);
	fillstepsprocedure();
	}
	else
	{
		
		fillredlables();
	}
});

<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE ISSUE REPORT PAGE
$(document).on( 'pagebeforeshow', '#pageReport',function(){
	sessionStorage.loadsteps="false";
    $( '.popupParent' ).on({
        popupafterclose: function() {
            setTimeout( function(){ $( '.popupChild' ).popup( 'open' ) }, 300 );
        }
    });
	
	$("#popupAddIssue").on({
    popupbeforeposition: function () {
	var maxHeight = $(window).height() - 30;
    $('#popupAddIssue').css('max-height', maxHeight + 'px');
	$('#popupAddIssue').css('overflow-y', 'scroll');
    $('.ui-popup-screen').off();
    }
	
});



	$("#popupDelete").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});

	$("#popupEditIssue").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});

	$("#popupPhotoOptions").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});

	$("#popupVideoOptions").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});

fillComponentsSelect();

fillFaultSelect();

fillcustomfields();

getissues();

$("#textarea-addcomments").on("focus", function () {
  $("#popupAddIssue").popup("reposition", {
    y: 0 /* move it to top */
  });
});

$("#textarea-editcomments").on("focus", function () {
  $("#popupEditIssue").popup("reposition", {
    y: 0 /* move it to top */
  });
});


});

<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE Gallery Photo TEMP
$(document).on( 'pagebeforeshow', '#Gallery1',function(){
	
	fillgallerytemp();
	});

		$(document).ready(function(){
			
			$('div.gallery-page').live('pageshow', function(e){
					
				// Re-initialize with the photos for the current page
				$("div.gallery a", e.target).photoSwipe();
				return true;
				
			})
				
		});
		
<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE Gallery Video Temp
$(document).on( 'pagebeforeshow', '#pagetempvideo',function(){
	
	fillgalleryvidtemp();
	});
<!---------------------------------------------------------------------------------------------------------------------->

		//ON CREATE PAGE HISTORY
$(document).on( 'pagebeforeshow', '#pageHistoryProc',function(){
 $("#hgoto").val("0");
  var tb = $('#stepsbody');
		 tb.html("");

  var picker = $( "#datesubmith", this );
    picker.mobipick({dateFormat:GetDateFormat()});
	var pickerfrom = $( "#datesubmithfrom", this );
    pickerfrom.mobipick({dateFormat:GetDateFormat()});
var now = new Date();
var day = ("0" + now.getDate()).slice(-2);
var month = ("0" + (now.getMonth() + 1)).slice(-2);
var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
$('#stepsbodyh').html("");
$('#datesubmith').val(ShowFormatDate(today));
$('#datesubmithfrom').val(ShowFormatDate(today));
    $('#table-history').on('click','tr', function() {
        $('#bodyhistory-list tr').css({background: 'transparent'});
		$('#bodyhistory-list tr').css({color: 'black'});
        $(this).css({background: 'blue'});
		$(this).css({color: 'white'});
		var idrow=$(this).attr('data-name');
		$("#chsubmit").val(idrow);
		
		var text=$(this).find('td').eq(0).text();
		text=text.replace('Procedure','');
		text=$.trim(text);
		$("#idprohist").val(idrow);
		getprocedureidsub();
		//sessionStorage.nameprocedure=text;
		//alert(idrow);
		searchnameprocedurebysubmit();
		sessionStorage.loadsteps="true";
		//galatzia
	// alert('Selected ID=' + idrow);
    });
	
		$("#popupDeleteSubmit").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});

fillhistorylist();

//$('[type="checkbox"]').checkboxradio('refresh');




});

<!---------------------------------------------------------------------------------------------------------------------->
//ON CREATE PROCEDURE HISTORY STEPS

$(document).on( 'pagebeforeshow', '#pageProcedureHsteps',function(){
	    
		var whattodo=sessionStorage.loadsteps;
		//alert(whattodo);
		var nameprocedure=sessionStorage.nameprocedure;
		//alert(nameprocedure);
		if(nameprocedure!="0")
		{
				$("#headpronameh").html("<img src='img/graphs/Logo_Small.png' style='height: 2em' /> &nbsp;&nbsp;"+nameprocedure);
				if(whattodo=="true")
				{
					fillstepsubmit();
				}
				else
				{
					fillredlablesh();
				}
			
		}
		else
		{
			navigator.notification.alert("Submitted Procedure cannot be found", null, 'FieldTracker', 'Accept');
			
		}
		

	 $('#bodyissuesh').html("");
	
	//alert(sessionStorage.submitID);
	
	//fillredlables();
	
});
<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE ISSUE REPORT HISTORY PAGE
$(document).on( 'pagebeforeshow', '#pageReportHistory',function(){
	sessionStorage.loadsteps="false";
    $( '.popupParent' ).on({
        popupafterclose: function() {
            setTimeout( function(){ $( '.popupChild' ).popup( 'open' ) }, 300 );
        }
    });
	
	$("#popupAddIssueh").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});



	$("#popupDeleteh").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});

	$("#popupEditIssueh").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});

	$("#popupPhotoOptionsh").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});

	$("#popupVideoOptionsh").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});

$("#textarea-addcommentsh").on("focus", function () {
  $("#popupAddIssueh").popup("reposition", {
    y: 0 /* move it to top */
  });
});

$("#textarea-editcommentsh").on("focus", function () {
  $("#popupEditIssueh").popup("reposition", {
    y: 0 /* move it to top */
  });
});

fillComponentsSelecth();

fillFaultSelecth();

getissuesh();


});

<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE Gallery Photo
$(document).on( 'pagebeforeshow', '#Gallery1h',function(){
	
	fillgallerytemph();
	});

		$(document).ready(function(){
			
			$('div.gallery-pageh').live('pageshow', function(e){
					
				// Re-initialize with the photos for the current page
				$("div.galleryh a", e.target).photoSwipe();
				return true;
				
			})
				
		});
		
<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE Gallery Video
$(document).on( 'pagebeforeshow', '#pagetempvideoh',function(){
	
	fillgalleryvidtemph();
	
	});
<!---------------------------------------------------------------------------------------------------------------------->

<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE DataQueries
$(document).on( 'pagebeforeshow', '#pageDataqueris',function(){
	
	fillOperatorNameSelect();
	//fillProcedureSelect();
	fillFaultSelectdt();
	 var picker = $( "#date-from", this );
    picker.mobipick({dateFormat:GetDateFormat()});
	 var pickertwo = $( "#date-to", this );
    pickertwo.mobipick({dateFormat:GetDateFormat()});
	});


		
<!---------------------------------------------------------------------------------------------------------------------->

<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE DataQueries Results
$(document).on( 'pagecreate', '#pageResult',function(){
	    $('#table-resultq').on('click','tr', function() {
        $('#bodydataqueries tr').css({background: 'transparent'});
		$('#bodydataqueries tr').css({color: 'black'});
        $(this).css({background: 'blue'});
		$(this).css({color: 'white'});
		$("#hgoto").val("1");
		var idrow=$(this).attr('data-name');
		$("#chsubmit").val(idrow);
		var text=$(this).find('td').eq(0).text();
		text=text.replace('Procedure','');
		text=$.trim(text);
		$("#idprohist").val(idrow);
		getprocedureidsub();
		searchnameprocedurebysubmit();
		//sessionStorage.nameprocedure=text;
		sessionStorage.loadsteps="true";
		
	//alert('Selected ID=' + idrow+ 'text='+text);
    });

});


		
<!---------------------------------------------------------------------------------------------------------------------->

<!---------------------------------------------------------------------------------------------------------------------->

//ON CREATE Page Settings
$(document).on( 'pagebeforeshow', '#pageSettings',function(){
tt=0;	
showsettings();

});

//ON CREATE Page Settings
$(document).on( 'pagebeforeshow', '#pageSettingsInit',function(){
tt=1;	
showsettings();

});

		
<!---------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------------------------------------------------------------------->

		//ON CREATE PAGE REJECTED
$(document).on( 'pagebeforeshow', '#pageRejected',function(){
 $("#hgoto").val("2");
  var tb = $('#stepsbody');
  tb.html("");
 
$('#stepsbodyh').html("");
    $('#table-rejected').on('click','tr', function() {
        $('#bodyrejected-list tr').css({background: 'transparent'});
		$('#bodyrejected-list tr').css({color: 'black'});
        $(this).css({background: 'blue'});
		$(this).css({color: 'white'});
		var idrow=$(this).attr('data-name');
		$("#chnamep").val('');
		$("#chsubmit").val(idrow);
		searchnameprocedure();
		var text=$(this).find('td').eq(0).text();
		text=text.replace('Procedure','');
		text=$.trim(text);
		$("#idprorejected").val(idrow);
		//getprocedureidsub();
		//sessionStorage.nameprocedure=text;
	    searchnameprocedurebysubmit();
		sessionStorage.loadsteps="true";
		
	// alert('Selected ID=' + idrow);
    });
	
		$("#popupDeleteSubmit").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});

fillrejectedlist();

//$('[type="checkbox"]').checkboxradio('refresh');




});
<!---------------------------------------------------------------------------------------------------------------------->
//ON CREATE Launch Evaluations
$(document).on( 'pagebeforeshow', '#pageEvaluationsLaunch',function(){
	   
	    $( '.popupParent' ).on({
        popupafterclose: function() {
            setTimeout( function(){ $( '.popupChild' ).popup( 'open' ) }, 300 );
        }
    });
		$("#popupEvalName").on({
    popupbeforeposition: function () {
        $('.ui-popup-screen').off();
    }
	
});
	 //filltable
	 $("#textarea-nameeval").val("");
	 $("#textarea-positioneval").val("");
	 $("#cheval").val("0");
	 fillevaluationstolaunch();
	 checksubsteps();
    $('#table-evaluations').on('click','tr', function() {
        $('#evaluationsbodytable tr').css({background: 'transparent'});
		$('#evaluationsbodytable tr').css({color: 'black'});
        $(this).css({background: 'blue'});
		$(this).css({color: 'white'});
		var idrow=$(this).attr('data-name');
		$("#headtableevaluations").addClass("ui-bar-c");
	     $("#chnameeval").val('');
		$("#cheval").val(idrow);
		searchnameprocedureval();
		$("#headtableprocedure").addClass("ui-bar-c");
		//alert(idrow);
		var text=$(this).text();
		//alert(text);
		//text=text.replace('Procedure Name','');
		//text=$.trim(text);		
		//sessionStorage.loadsteps="true";
	 $("#table-evaluations").table("refresh");
	 $("#table-evaluations").trigger('create');	
    });	
$("#textarea-nameeval").on("focus", function () {
  $("#popupEvalName").popup("reposition", {
    y: 0 /* move it to top */
  });
});	
});

<!---------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------------------------------------------------------------------->
//ON CREATE PROCEDURE EVALUATIONS STEPS
$(document).on( 'pagebeforeshow', '#pageEvaluation',function(){
	DeleteTemporalansers();
    var EvalsubmitID = sessionStorage.userid+new Date().getTime() + Math.random();
	sessionStorage.EvalsubmitID=EvalsubmitID;	
arrayresponses = [];	
fillevaluationsteps();
    $('#table-resulteval').on('click','tr', function() {
        $('#stepsevalbody tr').css({background: 'transparent'});
		$('#stepsevalbody tr').css({color: 'black'});
        $(this).css({background: 'blue'});
		$(this).css({color: 'white'});
		var idquestion=$(this).attr('data-name');
		var rowcl=$(this).index();
		rowcl=rowcl-1;
		$("#renglon").val(rowcl);
		//alert(rowcl);
		$("#chQuestion").val(idquestion);
		fillresponsesmodal(idquestion);
		//alert(idquestion);
	 $("#table-resulteval").table("refresh");
	 $("#table-resulteval").trigger('create');	
    });

});

<!---------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------------------------------------------------------------------->
//ON CREATE 
//loogbook 
$(document).on( 'pagebeforeshow', '#pageLogbook',function(){
//fill username name,level and name
	var userfullname=sessionStorage.fname;
	var leveluser=sessionStorage.lvlname;
	var headstring=userfullname+": Level "+leveluser;
	var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
	var d = new Date();
	var monthname=monthNames[d.getMonth()];
	var daynumber=(d.getDate()) > 9 ? (d.getDate()) : "0" + (d.getDate());
	var yearnumber=d.getFullYear();
	//alert(monthname+" "+daynumber+", "+yearnumber);	
	$("#hplogusername").html(headstring);
	//var namedate=monthname+" "+daynumber+", "+yearnumber;
	$("#hplogdatez").html(monthname+" "+daynumber+", "+yearnumber);
	filltaskworked();
	FillPersonnel();
	fillitemworked();
	InfoLevel();
	$( "#onebt" ).addClass("ui-btn-active");
});


<!---------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------------------------------------------------------------------->

<!---------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------------------------------------------------------------------->
//ON CREATE 
$(document).on( 'pagebeforeshow', '#pageMessages',function(){
//fill username name,level and name
//alert("startpagemessages");
    $("#IdMessageop").val("0");
	var userfullname=sessionStorage.fname;
	var leveluser=sessionStorage.lvlname;
	var headstring=userfullname+": Level "+leveluser;
	var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
	var d = new Date();
	var monthname=monthNames[d.getMonth()];
	var daynumber=(d.getDate()) > 9 ? (d.getDate()) : "0" + (d.getDate());
	var yearnumber=d.getFullYear();
	//var pickerMs = $( "#datesubmitM", this );
    //pickerMs.mobipick({dateFormat:GetDateFormat()});
	//var pickerMfs = $( "#datesubmitMF", this );
   // pickerMfs.mobipick({dateFormat:GetDateFormat()});
	//alert(monthname+" "+daynumber+", "+yearnumber);	
	var headingName="inbox";
	$("#hmstring").html(headingName);
	FillUsersTF();
	FillCategoryF();
	if(FilterMessages=="inbox")
	{
		GetMUserMessages("inbox");
	}
	else
	{
		GetMUserMessages(FilterMessages);
	}
	
	$('#table-inboxmessages').on('click','tr', function() {
        $('#MessagesBodyTable tr').css({background: 'transparent'});
		$('#MessagesBodyTable tr').css({color: 'black'});
        $(this).css({background: 'blue'});
		$(this).css({color: 'white'});
		var idMessage=$(this).attr('data-name');
		$("#IdMessageop").val(idMessage);
		$("#headtableMessages").addClass("ui-bar-c");
	 $("#table-inboxmessages").table("refresh");
	 $("#table-inboxmessages").trigger('create');
	
    });
});


<!---------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------------------------------------------------------------------->
//ON CREATE 
$(document).on( 'pagebeforeshow', '#pageRead',function(){
	var userfullname=sessionStorage.fname;
	var leveluser=sessionStorage.lvlname;
	FillMessageRead();
});


<!---------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------------------------------------------------------------------->
//ON CREATE 
$(document).on( 'pagebeforeshow', '#pageSMessage',function(){
	//GetSendMessage();
    //alert("pagebeforeshow");
	//fillSendMessage();
	var UseraID=sessionStorage.userid;
    GetUserFullName(UseraID);
	utolist_array = new Array();
	utolist_arrayNames = new Array();
	$("#inmessageto").val("");
	$("#inmessageSubject").val("");
	$("#textarea-sendmessage").val("");
	 $("#lblquanttousers").html("0 selected");
	fillrecipients();
	
});


<!---------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------------------------------------------------------------------->
//ON CREATE 
$(document).on( 'pagebeforeshow', '#pageLibrary',function(){
	var userfullname=sessionStorage.fname;
	var leveluser=sessionStorage.lvlname;
	var headstring=userfullname+": Level "+leveluser;
	var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
	var d = new Date();
	var monthname=monthNames[d.getMonth()];
	var daynumber=(d.getDate()) > 9 ? (d.getDate()) : "0" + (d.getDate());
	var yearnumber=d.getFullYear();
	//alert(monthname+" "+daynumber+", "+yearnumber);	
	$("#hplibrarygusername").html(headstring);
     CountDownloads=0;
	 CountNow=0;
	 CountReady=0;
	//var namedate=monthname+" "+daynumber+", "+yearnumber;
	$("#hplibrarydate").html(monthname+" "+daynumber+", "+yearnumber);
	OpenLibrary();

});


<!---------------------------------------------------------------------------------------------------------------------->

///////=============================<<<<<<<<<<<< END ON LOAD PAGES >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<=============================LOGIN USER =========================================>>>>>>>>>>>///////

function LoginUser()
{
	//$('#popupInitial').popup('open');
	//return;
	//var d1 = Date.parse('2015-07-23 13:22:53');
	//alert(d1.toString('MM/dd/yyyy H:mm:ss ')+"next: "+d1.toString('dd/MM/yyyy'));
	
	var username=$("#username").val();
	username=$.trim(username);
	var password=$("#password").val();
	if(username!="" && password!="")
	{
		//navigator.notification.alert("SQL ", null, 'FieldTracker', 'Accept');
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querytologin, errorCB);
		
	}
	else
	{
		 navigator.notification.vibrate(2500);
		 navigator.notification.alert("Please enter username and password", null, 'FieldTracker', 'Accept');
	}

	
	
}

	function Querytologin(tx)
	{
		var username=$("#username").val();
		var password=$("#password").val();
		username=username.toLowerCase();
		//alert(username+" "+password);
		//alert("SELECT * FROM PROCEDURESTEPS");
		tx.executeSql("SELECT * FROM USERS WHERE Username='"+username+"' AND Password='"+password+"'", [], UserLoginSuccess, errorCB);
		//tx.executeSql("SELECT * FROM PROCEDURESTEPS", [], UserLoginSuccess, errorCB);
		
	}
	
	 function UserLoginSuccess(tx, results) {
      var len = results.rows.length;
	 // alert("query rows:"+len);
	  if(len==1)
	  {
		  var nameuser=results.rows.item(0).Username;
		  var fname=results.rows.item(0).FirstName;
		  var lname=results.rows.item(0).LastName
		  var fullname=fname+' '+lname;
		  var LevelName=results.rows.item(0).LevelNum;
		 // alert(LevelName);
		   sessionStorage.userid=nameuser;
		   sessionStorage.fname=fullname;
		   sessionStorage.lvlname=LevelName;
		  // SyncStatus();
		  
		$(':mobile-pagecontainer').pagecontainer('change', '#pageMenu', {
        transition: 'flip',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
        });		  
		  
		  
	  }
	  else
	  {
		  navigator.notification.vibrate(2500);
		
		  navigator.notification.alert("Invalid username or password", null, 'FieldTracker', 'Accept'); 
	  }
     
   }

///////=============================<<<<<<<<<<<< END LOGIN USER >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= CHECKLIST PAGE =========================================>>>>>>>>>>>///////

//DropDownUsers
function  fillUsersSelect(ElementID)
{
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(QuerytousersList, errorCB);
}

   function QuerytousersList(tx)
   {
	   showModal();
	  
		tx.executeSql("SELECT * FROM USERS ORDER BY LastName", [], UserListSuccess, errorCB);
	   
   }
    function UserListSuccess(tx, results) {
      var len = results.rows.length;
	  var listhtml='';
	  if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
            
			 listhtml+="<li id='"+results.rows.item(i).Username+"' >"+results.rows.item(i).LastName+", "+results.rows.item(i).FirstName+"</li>";
             }
			 
			 $("#userslist").html(listhtml);
			 $("#userslist").listview("refresh");
			 hideModal();

		  
	  }
	  else
	  {
		   hideModal();
		
		  navigator.notification.alert("No registered users", null, 'FieldTracker', 'Accept'); 
	  }

   }
   
   
   //DropDownGroups
   
   function fillGroupsSelect()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoGroupsSelect, errorCB);
	
}

function QuerytoGroupsSelect(tx)
   {
	   var UserID=sessionStorage.userid;
	  showModal();
		//tx.executeSql("SELECT * FROM GROUPS ORDER BY Description", [], GroupsSelectSuccess, errorCB);
		tx.executeSql("SELECT * FROM GROUPS INNER JOIN Users2Groups ON GROUPS.GroupID=Users2Groups.ID WHERE UserID='"+UserID+"' ORDER BY Description", [], GroupsSelectSuccess, errorCB);
	   
   }
   
   function GroupsSelectSuccess(tx, results)
   {
	    var len = results.rows.length;
	  var selecthtml='<option value="0">All</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
			 selecthtml+='<option value="'+results.rows.item(i).GroupID+'">'+results.rows.item(i).Description+'</option>';
             }
			 
			 $("#select_groupone").html(selecthtml);
			 hideModal();
		  
	  }
	  else
	  {
		  hideModal();
		  navigator.notification.alert("No registered groups", null, 'FieldTracker', 'Accept'); 
	  }
	   
   }
   
   
   //FILTER USERS BY GROUP
   
   function checkgroupchange()
{
	//$.mobile.pageLoading();	
	//$.mobile.showPageLoadingMsg();
	showModal();
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoFilterUsersByGroup, errorCB);
}

      function QuerytoFilterUsersByGroup(tx)
   {
	    var GroupID=$("#select_groupone").val();
		//alert(GroupID);
		if(GroupID!="0")
		{
			tx.executeSql("SELECT USERS.FirstName, USERS.LastName, Users.Username FROM USERS,USERS2GROUPS WHERE USERS.Username=USERS2GROUPS.UserID AND USERS2GROUPS.ID='"+GroupID+"' ORDER BY USERS.LastName", [], QueryFilterU2GSuccess, errorCB);
			
		}
		else
		{
			fillUsersSelect('#userlist');
		}
		
	   
   }
   
   function QueryFilterU2GSuccess(tx,results)
   {
	  var len = results.rows.length;
	  var listhtml='';
	  if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){

			 listhtml+="<li id='"+results.rows.item(i)["Username"]+"' >"+results.rows.item(i)["LastName"]+", "+results.rows.item(i)["FirstName"]+"</li>";
             }
			 
			 $("#userslist").html(listhtml);
			 $("#userslist").listview("refresh");
			 hideModal();
			

		  
	  }
	  else
	  {
		  $("#userslist").html(listhtml);
		  $("#userslist").listview("refresh");
		  hideModal();
		  navigator.notification.alert("No registered users in this group", null, 'FieldTracker', 'Accept'); 
	  }
	   
   }
   
   //NEXT SCREEN ON CHECKLIST
   
   function nextchecklist()
{
	   var listview_array = new Array();
	    
        $( "#userslist li" ).each(function(  ) {
			var colorcito=$(this).css('backgroundColor');
		var hh=rgb2hex(colorcito);
		//alert(hh);
		if(hh=="#0000ff")
		{
			 listview_el = new Object();
			    listview_el.id=$(this).attr('id');
            listview_el.name=$(this).text();
            listview_array.push(listview_el) 

			
		}
          
        
        });
        var stringifyObject = JSON.stringify(listview_array);
		if(listview_array.length==1)
		{
			
			$("#mult").val('0'); 
			$("#userch").val(listview_array[0].id); 
			sessionStorage.userchoose=listview_array[0].id;
	    	sessionStorage.userchoosename=listview_array[0].name;
			//alert("only one");
		}
		else if(listview_array.length>1)
		{
			$("#userch").val("multiple"); 
			sessionStorage.userchoose=stringifyObject;
	    	sessionStorage.userchoosename="Multiple users";
			$("#mult").val('1'); 
			//alert("multiple");
		}
		else
		{
			$("#mult").val('0'); 
			alert("Please select a user");
			
		}
        //alert(stringifyObject);
	//aki
	var idchoose= $("#userch").val();
	//alert(idchoose);
	if( idchoose!="0")
	{
		 $('#userslist li').css({background: 'white'});
		$('#userslist li').css({color: 'black'});
	    $(':mobile-pagecontainer').pagecontainer('change', '#pageChecklistSave', {
        transition: 'slide',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
		
		
	}
	else
	{
		
	}
	
	
}




///////=============================<<<<<<<<<<<< END CHECKLIST PAGE  >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<============================= CHECKLIST SAVE PAGE =========================================>>>>>>>>>>>///////

   // Fill CheckList table
   
   function fillmultiplechecklist()
   {
	  	 showModal();
	  	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
         db.transaction(Queryfillmultiplechecklist, errorCB);
	   
   }
   
   function Queryfillmultiplechecklist(tx)
   {
	      var chkone=$("#checkbox-classroom").is(':checked') ;
	   var chktwo=$("#checkbox-field").is(':checked') ;
	   var chkthree=$("#checkbox-handson").is(':checked') ;
	 //  alert(chkone+" "+chktwo+" "+chkthree);
	
	   var userids= JSON.parse(sessionStorage.userchoose);
	   //alert(userids[0].id);
	   var usersquery='';
	   var otherusers='';
	   for (var i=0; i<userids.length; i++){
		 //  alert(userids[i].id);
		   if(i!=userids.length-1)
		   {
			   usersquery+="c.UserID='"+userids[i].id+"' OR ";
			   otherusers+="UserID='"+userids[i].id+"' OR ";
		   }
		   else
		   {
			   usersquery+="c.UserID='"+userids[i].id+"' ";
			   otherusers+="UserID='"+userids[i].id+"' ";
			   

			}
		   

		}
	   
	  // alert("SELECT b.ID AS CheckID, a.Description, a.Type FROM CHECKLISTS a INNER JOIN  MODULES2CHECKLISTS b ON b.ID = a.ID ");
	   var querytosend="SELECT b.ID AS CheckID, a.Description, a.Type,c.Date AS dates, (SELECT COUNT(CheckID) FROM users2checklists WHERE CheckID=b.ID AND ("+otherusers+") ) as tco FROM CHECKLISTS a INNER JOIN  MODULES2CHECKLISTS b ON b.ID = a.ID LEFT OUTER JOIN (SELECT UserID,CheckID,max(Date) as Date FROM users2checklists GROUP BY CheckID) c ON  a.ID = c.CheckID WHERE "+usersquery+" AND (  ";
	   if(chkone==true)
	   {
		    querytosend+=" a.Type='Classroom' ";
	   }
	   if(chktwo==true)
	   {
		   if(chkone==true)
		   {
			  querytosend+=" OR a.Type='Field'  "; 
		   }
		   else
		   {
			   querytosend+=" a.Type='Field'"; 
		   }
		   
	   }
	   if(chkthree==true)
	   {
		   if(chkone==true || chktwo==true)
		   {
			  querytosend+=" OR a.Type='Hands-On'  "; 
		   }
		   else
		   {
			   querytosend+=" a.Type='Hands-On'"; 
		   }
		 
		   
	   }
	   
	   if(chkone==false && chktwo==false && chkthree==false)
	   {
		    querytosend+=" a.Type='Hands-On' OR a.Type='Classroom' OR a.Type='Hands-On' "; 

	    }
	 
	   
	    querytosend+=")";
		//alert(querytosend);
		tx.executeSql(querytosend, [], Queryfillmultiplechecklistsuccess, errorCB);
	   
   }
   
   function Queryfillmultiplechecklistsuccess(tx,results)
   {
	   
	   // var len = results.rows.length;
		//alert(len);
		//for (var i=0; i<results.rows.length; i++){
		//	alert("count"+results.rows.item(i).tco);
		//}
		   var len = results.rows.length;
	  // sessionStorage.arrayone=results;
	   var dbtwo = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       dbtwo.transaction(function(tx){ Queryallchecklistsmultiple(tx,results) }, errorCB);
}

function Queryallchecklistsmultiple(txtwo,resultone)
{
		 // alert(resultone.rows.length);
	  var chkone=$("#checkbox-classroom").is(':checked') ;
	   var chktwo=$("#checkbox-field").is(':checked') ;
	   var chkthree=$("#checkbox-handson").is(':checked') ;
	 var querytwo="SELECT * FROM CHECKLISTS WHERE ";
	    if(chkone==true)
	   {
		    querytwo+="CHECKLISTS.Type='Classroom' ";
	   }
	   if(chktwo==true)
	   {
		   if(chkone==true)
		   {
			  querytwo+=" OR CHECKLISTS.Type='Field'  "; 
		   }
		   else
		   {
			   querytwo+=" CHECKLISTS.Type='Field'"; 
		   }
		   
	   }
	   if(chkthree==true)
	   {
		   if(chkone==true || chktwo==true)
		   {
			  querytwo+=" OR CHECKLISTS.Type='Hands-On'  "; 
		   }
		   else
		   {
			   querytwo+=" CHECKLISTS.Type='Hands-On'"; 
		   }
		 
		   
	   }
	   
	   if(chkone==false && chktwo==false && chkthree==false)
	   {
		    querytwo+=" CHECKLISTS.Type='Hands-On' OR CHECKLISTS.Type='Classroom' OR CHECKLISTS.Type='Hands-On' "; 

	    }
		querytwo+=" ORDER BY Description";

	   txtwo.executeSql(querytwo, [],function(tx,results){ QueryallchecklistsSuccessMultiple(tx,results,resultone) }, errorCB);
	   
   }
   
   function QueryallchecklistsSuccessMultiple(tx,subresults,resultone)
   {
	     var userids= JSON.parse(sessionStorage.userchoose);

                        var tb = $('#bodycheck-list');
	 var tablehtml="";
	 if(resultone.rows.length==0)
	 {
	    for (var i=0; i<subresults.rows.length; i++){
			tablehtml+=' <tr><td><label><input type="checkbox" name="'+subresults.rows.item(i).ID+'" id="'+subresults.rows.item(i).ID+'">'+subresults.rows.item(i).DESCRIPTION+'</label></td><td>'+subresults.rows.item(i).TYPE+'</td><td id="td'+subresults.rows.item(i).ID+'"></td></tr>';
			
			        }
		 
	 }
	 else
	 {
		 //akivoy
		 var datevar="";
		 var chks="";
		 for (var i=0; i<subresults.rows.length; i++){
			 datevar="";
			 chks="";
			  for (var x=0; x<resultone.rows.length; x++){
				  
				 if(resultone.rows.item(x).CheckID==subresults.rows.item(i).ID)
				 {
					// alert(resultone.rows.item(x).CheckID);
					 datevar=ShowFormatDate(resultone.rows.item(x).dates);
					 if(resultone.rows.item(x).tco==userids.length)
					 {
					 chks='style="background:#1780ac; bordercolor:red; border:medium; color:white;"';
					 }
					 else
					 {
						 chks='style="background:yellow; bordercolor:red; border:medium; color:black;"';
					 }
					 
			     }
				  
			  }
			  
			  tablehtml+=' <tr><td><label '+chks+' ><input type="checkbox"  name="'+subresults.rows.item(i).ID+'" id="'+subresults.rows.item(i).ID+'">'+subresults.rows.item(i).DESCRIPTION+'</label></td><td '+chks+'>'+subresults.rows.item(i).TYPE+'</td><td id="td'+subresults.rows.item(i).ID+'" '+chks+'>'+datevar+'</td></tr>';
			 
		 }
		 
	 }
	 tb.empty().append(tablehtml);
	 $("#table-listchk").table("refresh");
	 $("#table-listchk").trigger('create');
	 hideModal();	   
    }
   
     function QueryallchecklistsSuccess(tx,subresults,resultone)
   {
	  var tb = $('#bodycheck-list');
	 var tablehtml="";
	 if(resultone.rows.length==0)
	 {
	    for (var i=0; i<subresults.rows.length; i++){
			tablehtml+=' <tr><td><label><input type="checkbox" name="'+subresults.rows.item(i).ID+'" id="'+subresults.rows.item(i).ID+'">'+subresults.rows.item(i).DESCRIPTION+'</label></td><td>'+subresults.rows.item(i).TYPE+'</td><td id="td'+subresults.rows.item(i).ID+'"></td></tr>';
			
			        }
		 
	 }
	 else
	 {
		 
		 var datevar="";
		 var chks="";
		 for (var i=0; i<subresults.rows.length; i++){
			 datevar="";
			 chks="";
			  for (var x=0; x<resultone.rows.length; x++){
				  
				 if(resultone.rows.item(x).CheckID==subresults.rows.item(i).ID)
				 {
					// alert(resultone.rows.item(x).CheckID);
					 datevar=ShowFormatDate(resultone.rows.item(x).dates);
					 chks='style="background:#1780ac; bordercolor:red; border:medium; color:white;"';
					 
			     }
				  
			  }
			  
			  tablehtml+=' <tr><td><label '+chks+' ><input type="checkbox"  name="'+subresults.rows.item(i).ID+'" id="'+subresults.rows.item(i).ID+'">'+subresults.rows.item(i).DESCRIPTION+'</label></td><td '+chks+'>'+subresults.rows.item(i).TYPE+'</td><td id="td'+subresults.rows.item(i).ID+'" '+chks+'>'+datevar+'</td></tr>';
			 
		 }
		 
	 }
	 tb.empty().append(tablehtml);
	 $("#table-listchk").table("refresh");
	 $("#table-listchk").trigger('create');
	 hideModal();
	
	
}

   function fillchecklist()
   {
	    showModal();
	   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querytochecklistsave, errorCB);
	   
   }
   
      function Querytochecklistsave(tx)
   {
	   
	  
	   var chkone=$("#checkbox-classroom").is(':checked') ;
	   var chktwo=$("#checkbox-field").is(':checked') ;
	   var chkthree=$("#checkbox-handson").is(':checked') ;
	 //  alert(chkone+" "+chktwo+" "+chkthree);
	   var userid=sessionStorage.userchoose;
	  // alert("SELECT b.ID AS CheckID, a.Description, a.Type FROM CHECKLISTS a INNER JOIN  MODULES2CHECKLISTS b ON b.ID = a.ID ");
	   var querytosend="SELECT b.ID AS CheckID, a.Description, a.Type,c.Date AS dates FROM CHECKLISTS a INNER JOIN  MODULES2CHECKLISTS b ON b.ID = a.ID LEFT OUTER JOIN USERS2CHECKLISTS c ON  a.ID = c.CheckID WHERE c.UserID='"+userid+"' AND (  ";
	   if(chkone==true)
	   {
		    querytosend+=" a.Type='Classroom' ";
	   }
	   if(chktwo==true)
	   {
		   if(chkone==true)
		   {
			  querytosend+=" OR a.Type='Field'  "; 
		   }
		   else
		   {
			   querytosend+=" a.Type='Field'"; 
		   }
		   
	   }
	   if(chkthree==true)
	   {
		   if(chkone==true || chktwo==true)
		   {
			  querytosend+=" OR a.Type='Hands-On'  "; 
		   }
		   else
		   {
			   querytosend+=" a.Type='Hands-On'"; 
		   }
		 
		   
	   }
	   
	   if(chkone==false && chktwo==false && chkthree==false)
	   {
		    querytosend+=" a.Type='Hands-On' OR a.Type='Classroom' OR a.Type='Hands-On' "; 

	    }
	 
	   
	    querytosend+=")";
		//alert(querytosend);
		tx.executeSql(querytosend, [], QueryChecklistSaveSuccess, errorCB);
	   
   }
   
      function QueryChecklistSaveSuccess(tx,results)
   {
	   var len = results.rows.length;
	  // sessionStorage.arrayone=results;
	   var dbtwo = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       dbtwo.transaction(function(tx){ Queryallchecklists(tx,results) }, errorCB);
	   
   }
   
   function Queryallchecklists(txtwo,resultone)
   {
	 // alert(resultone.rows.length);
	  var chkone=$("#checkbox-classroom").is(':checked') ;
	   var chktwo=$("#checkbox-field").is(':checked') ;
	   var chkthree=$("#checkbox-handson").is(':checked') ;
	 var querytwo="SELECT * FROM CHECKLISTS WHERE ";
	    if(chkone==true)
	   {
		    querytwo+="CHECKLISTS.Type='Classroom' ";
	   }
	   if(chktwo==true)
	   {
		   if(chkone==true)
		   {
			  querytwo+=" OR CHECKLISTS.Type='Field'  "; 
		   }
		   else
		   {
			   querytwo+=" CHECKLISTS.Type='Field'"; 
		   }
		   
	   }
	   if(chkthree==true)
	   {
		   if(chkone==true || chktwo==true)
		   {
			  querytwo+=" OR CHECKLISTS.Type='Hands-On'  "; 
		   }
		   else
		   {
			   querytwo+=" CHECKLISTS.Type='Hands-On'"; 
		   }
		 
		   
	   }
	   
	   if(chkone==false && chktwo==false && chkthree==false)
	   {
		    querytwo+=" CHECKLISTS.Type='Hands-On' OR CHECKLISTS.Type='Classroom' OR CHECKLISTS.Type='Hands-On' "; 

	    }
		querytwo+=" ORDER BY Description";

	   txtwo.executeSql(querytwo, [],function(tx,results){ QueryallchecklistsSuccess(tx,results,resultone) }, errorCB);
	   
   }
   
     function QueryallchecklistsSuccess(tx,subresults,resultone)
   {
	  var tb = $('#bodycheck-list');
	 var tablehtml="";
	 if(resultone.rows.length==0)
	 {
	    for (var i=0; i<subresults.rows.length; i++){
			tablehtml+=' <tr><td><label><input type="checkbox" name="'+subresults.rows.item(i).ID+'" id="'+subresults.rows.item(i).ID+'">'+subresults.rows.item(i).DESCRIPTION+'</label></td><td>'+subresults.rows.item(i).TYPE+'</td><td id="td'+subresults.rows.item(i).ID+'"></td></tr>';
			
			        }
		 
	 }
	 else
	 {
		 //akivoy
		 var datevar="";
		 var chks="";
		 for (var i=0; i<subresults.rows.length; i++){
			 datevar="";
			 chks="";
			  for (var x=0; x<resultone.rows.length; x++){
				  
				 if(resultone.rows.item(x).CheckID==subresults.rows.item(i).ID)
				 {
					// alert(resultone.rows.item(x).CheckID);
					 datevar=ShowFormatDate(resultone.rows.item(x).dates);
					 chks='style="background:#1780ac; bordercolor:red; border:medium; color:white;"';
					 
			     }
				  
			  }
			  
			  tablehtml+=' <tr><td><label '+chks+' ><input type="checkbox"  name="'+subresults.rows.item(i).ID+'" id="'+subresults.rows.item(i).ID+'">'+subresults.rows.item(i).DESCRIPTION+'</label></td><td '+chks+'>'+subresults.rows.item(i).TYPE+'</td><td id="td'+subresults.rows.item(i).ID+'" '+chks+'>'+datevar+'</td></tr>';
			 
		 }
		 
	 }
	 tb.empty().append(tablehtml);
	 $("#table-listchk").table("refresh");
	 $("#table-listchk").trigger('create');
	 hideModal();
	   
   }
   
   
   
   //SAVE CHECKLIST
   
   function savecheck()
{
	//alert($('#table-list').find('input[type="checkbox"]:checked').length + ' checked');
	var entrydate=InsertFormatDate($("#dateentry").val());
	
	$('#table-listchk').find('input[type="checkbox"]:checked').each(function () {
     var idcheck=  $(this).attr('id');
	 //alert(idcheck);
	if($(this).is(':checked')==true)
	{
		
	
		DeleteCheckList(idcheck);
    }
	 

	 
    });
	
		$('#table-listchk').find('input[type="checkbox"]:checked').each(function () {
     var idcheck=  $(this).attr('id');
	 //alert(idcheck);
	if($(this).is(':checked')==true)
	{
		InsertCheckList(idcheck);
	
		
    }
	 

	 
    });
	
var mult=$('#mult').val();
if(mult=="0")
{
	fillchecklist();
}
else
{
	fillmultiplechecklist()
}
	
}

//INSERT CHECKLIST

   function InsertCheckList(idchecklist)
  {
	
	    var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       db.transaction(function(tx){ QueryInsertchecklist(tx,idchecklist) }, errorCB, successChecklist);


  }
  
    function QueryInsertchecklist(tx,idchecklist)
  {
	 var mult=$('#mult').val();
     var userid=sessionStorage.userchoose;
	 var date=InsertFormatDate($("#dateentry").val());
	 //alert('INSERT INTO USERS2CHECKLISTS (UserID,CheckID,Date) VALUES ("'+userid+'","'+idchecklist+'","'+date+'")');
	 if(mult=="0")
	 {
		 tx.executeSql('INSERT INTO USERS2CHECKLISTS (UserID,CheckID,Date,Sync) VALUES ("'+userid+'","'+idchecklist+'","'+date+'","no")');
	  }
	  else
	  {
		   var userids= JSON.parse(sessionStorage.userchoose);
 			 for (var i=0; i<userids.length; i++){
				
               tx.executeSql('INSERT INTO USERS2CHECKLISTS (UserID,CheckID,Date,Sync) VALUES ("'+userids[i].id+'","'+idchecklist+'","'+date+'","no")');

				}

	  }
	 
	  
  }
  
    function successChecklist()
  {
	//alert("Insertado");
  }
  
   function DeleteCheckList(idchecklist)
  {
	     var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       db.transaction(function(tx){ QueryDeleteCheckList(tx,idchecklist) }, errorCB, successDeleteChecklist);
	  
  }
  
      function QueryDeleteCheckList(tx,idchecklist)
  {
	  var mult=$('#mult').val();
     var userid=sessionStorage.userchoose;
	 var date=InsertFormatDate($("#dateentry").val());
	 //alert('INSERT INTO USERS2CHECKLISTS (UserID,CheckID,Date) VALUES ("'+userid+'","'+idchecklist+'","'+date+'")');
	  if(mult=="0")
	 {
		 tx.executeSql('DELETE FROM USERS2CHECKLISTS WHERE UserID="'+userid+'" AND CheckID="'+idchecklist+'"');
	 }
	 else
	 {
		 var userids= JSON.parse(sessionStorage.userchoose);
 		for (var i=0; i<userids.length; i++){
				
         tx.executeSql('DELETE FROM USERS2CHECKLISTS WHERE UserID="'+userids[i].id+'" AND CheckID="'+idchecklist+'"');

		}
		 
	 }
	 
	  
  }
  
  function successDeleteChecklist()
  {
	  //alert("Eliminado");
	  
  }
   
   



///////=============================<<<<<<<<<<<< END CHECKLIST SAVE PAGE  >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<============================= LAUNCH PROCEDURE PAGE =========================================>>>>>>>>>>>///////
//Check procedures on database
function checkdbprocedures()
{	 
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(Querycheckdbprocedures, errorCB);	
}
function Querycheckdbprocedures(tx)
{
	var querytosend="SELECT * FROM PROCEDURES";
	tx.executeSql(querytosend, [], QuerycheckdbproceduresSuccess, errorCB);
}
function QuerycheckdbproceduresSuccess(tx,results)
{
	var len = results.rows.length;
	alert("Total Procedures: "+len);
}
//Fill table
  function fillprocedurestolaunch()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querytoprocedurestolaunch, errorCB);
	  
  }
  
  function Querytoprocedurestolaunch(tx)
  {
	  
	   showModal();
	   var grouptoshow=$("#select_group").val();
	   var chk_preventive=$("#checkbox-preventive").is(':checked') ;
	   var chk_routine=$("#checkbox-routine").is(':checked') ;
	   var chk_operator=$("#checkbox-operator").is(':checked') ;
	   var chk_startup=$("#checkbox-startup").is(':checked') ;
	   var chk_shutdown=$("#checkbox-shutdown").is(':checked') ;
	   var numquery=1;
	   var chk_preoperational=$("#checkbox-preoperational").is(':checked') ;
	   //var newquery="SELECT * FROM PROCEDURES ";
	    var newquery = "SELECT ( SELECT SUBMITTEDPROCS.UserID || ' - '  FROM  SUBMITTEDPROCS WHERE PROCEDURES.ProcID = SUBMITTEDPROCS.ProcID ORDER BY Time DESC LIMIT 1) AS lastp,SUBMITTEDPROCS.Time AS timec, PROCEDURES.Name, PROCEDURES.ProcID FROM PROCEDURES LEFT OUTER JOIN SUBMITTEDPROCS ON PROCEDURES.ProcID = SUBMITTEDPROCS.ProcID ";
				// var newquery="SELECT ( SELECT SUBMITTEDPROCS.UserID || ' - ' FROM  SUBMITTEDPROCS WHERE PROCEDURES.ProcID = SUBMITTEDPROCS.ProcID ORDER BY Time DESC LIMIT 1) AS lastp,SUBMITTEDPROCS.Time  AS timec, PROCEDURES.Name, PROCEDURES.ProcID FROM PROCEDURES LEFT OUTER JOIN  GROUPS2PROCEDURES ON PROCEDURES.ProcID = GROUPS2PROCEDURES.ID LEFT OUTER JOIN SUBMITTEDPROCS ON PROCEDURES.ProcID = SUBMITTEDPROCS.ProcID INNER JOIN PROCEDURES";
            if (grouptoshow != "0")
            {
				numquery=2;
			    var newquery = "SELECT ( SELECT SUBMITTEDPROCS.UserID || ' - ' FROM  SUBMITTEDPROCS WHERE PROCEDURES.ProcID = SUBMITTEDPROCS.ProcID ORDER BY Time DESC LIMIT 1) AS lastp,SUBMITTEDPROCS.Time  AS timec, PROCEDURES.Name, PROCEDURES.ProcID FROM PROCEDURES LEFT OUTER JOIN  GROUPS2PROCEDURES ON PROCEDURES.ProcID = GROUPS2PROCEDURES.ID LEFT OUTER JOIN SUBMITTEDPROCS ON PROCEDURES.ProcID = SUBMITTEDPROCS.ProcID ";	
        //  newquery = "SELECT DISTINCT(SELECT CONCAT_WS(' - ', submittedprocs.UserID, submittedprocs.SubmitDate) AS daten FROM  submittedprocs WHERE procedures.ProcID = submittedprocs.ProcID ORDER BY SubmitDate DESC LIMIT 1) AS lastp, procedures.Name, procedures.ProcID,(SELECT submittedprocs.Status FROM  submittedprocs WHERE procedures.ProcID = submittedprocs.ProcID ORDER BY SubmitDate DESC LIMIT 1) AS Status  FROM procedures LEFT OUTER JOIN groups2procedures ON procedures.ProcID = groups2procedures.ID LEFT OUTER JOIN submittedprocs ON procedures.ProcID = submittedprocs.ProcID WHERE (procedures.Name LIKE '%" + TextBox_searchsteps.Text + "%') AND (groups2procedures.GroupID = '" + DropDownList_group.SelectedValue + "')";
            }
        
            
            var filters = "";
            if (chk_operator == true)
            {
                if (filters == "")
                {
                    filters += " PROCEDURES.type='Operator Task'";
                }
                else
                {
                    filters += " OR PROCEDURES.type='Operator Task'";
 
                }
                
 
            }
            if (chk_preoperational == true)
            {
                if (filters == "")
                {
                    filters += " PROCEDURES.type='Preoperational'";

                }
                else
                {
                    filters += " OR PROCEDURES.type='Preoperational'";

                }
               

            }
            if(chk_preventive == true)
            {
                if (filters == "")
                {
                    filters += " PROCEDURES.type='Preventive Maintenance'";
                }
                else
                {
                    filters += " OR PROCEDURES.type='Preventive Maintenance'";
 
                }
                

            }
            if (chk_routine == true)
            {
                if (filters == "")
                {
                    filters += " PROCEDURES.type='Routine'";

                }
                else
                {
                    filters += " OR PROCEDURES.type='Routine'";
 
                }
                
                
 
            }
            if (chk_shutdown == true)
            {
                if (filters == "")
                {
                    filters += " PROCEDURES.type='Shutdown'";
                }
                else
                {
                    filters += " OR PROCEDURES.type='Shutdown'";
 
                }
                
 
            }
            if (chk_startup == true)
            {
                if (filters == "")
                {
                    filters += " PROCEDURES.type='Start-Up'";

                }
                else
                {
                    filters += " OR PROCEDURES.type='Start-Up'";
 
                }
                
               
 
            }
			if(numquery==1)
			{
				     if (filters != "")
            {
                newquery += "WHERE (" + filters + ") ";
            }
            else
            {
                newquery += " GROUP BY PROCEDURES.ProcID";
 
            }
				
			}
			else
			{
				newquery +="WHERE (groups2procedures.GroupID = '" +grouptoshow + "')"; 
				     if (filters != "")
            			{
                newquery += "AND (" + filters + ") ";
            			}
           			 else
           				 {
                newquery += " GROUP BY PROCEDURES.ProcID";
 
            			}
				
			}

            newquery += " GROUP BY PROCEDURES.ProcID";
			//alert(newquery);
		tx.executeSql(newquery, [], QuerytoprocedurestolaunchSuccess, errorCB);
	  
	  
  }
  
  function QuerytoprocedurestolaunchSuccess(tx,resultadoss)
  {
	var UserID=sessionStorage.userid;  
	var query="SELECT PROCEDURES.ProcID FROM GROUPS2PROCEDURES INNER JOIN PROCEDURES ON GROUPS2PROCEDURES.ID = PROCEDURES.ProcID INNER JOIN USERS2GROUPS ON GROUPS2PROCEDURES.GroupID = USERS2GROUPS.ID WHERE (USERS2GROUPS.UserID = '"+UserID+"')";  
	//alert(query);
	tx.executeSql(query, [], function(tx,results){ ContinueTableProcedures(tx,results,resultadoss) }, errorCB);	  
  }
  
  function ContinueTableProcedures(tx,results,resultadoss)
  {
	  	 var len=resultadoss.rows.length;
		 var lento=results.rows.length;
		// alert("All: "+len+" groups: "+ lento); 
	 var tb = $('#proceduresbodytable');
	 var tablehtml="";
	 var sbdate="";
	 for (var i=0; i<resultadoss.rows.length; i++){
		 //alert(resultadoss.rows.item(i).ProcID);
		 for(var x=0; x<results.rows.length; x++)
		 {
			 //alert("segundp for");
			// alert(results.rows.item(x).ProcID+"--->"+resultadoss.rows.item(i).ProcID);
			 if(results.rows.item(x).ProcID==resultadoss.rows.item(i).ProcID)
			 {
				 	 sbdate=" ";
		// alert(results.rows.item(i).lastp);
		 if(resultadoss.rows.item(i).lastp!=null)
		 {
			 sbdate=resultadoss.rows.item(i).lastp+" "+ShowFormatDateTime(resultadoss.rows.item(i).timec);
		 }
   tablehtml+='<tr data-name="'+resultadoss.rows.item(i).ProcID+'"><td>'+resultadoss.rows.item(i).Name+'</td><td>'+sbdate+'</td></tr>';
   //alert(results.rows.item(i).lastp+" "+results.rows.item(i).Name+" "+results.rows.item(i).ProcID);
			 
				 
			 }
			 	
		 }

		 
	 }
	 //alert(tablehtml);
	  tb.empty().append(tablehtml);
	 $("#table-procedures").table("refresh");
	 $("#table-procedures").trigger('create');
	 hideModal();
	  
  }
  
  
  //FILL GROUPS DROPDOWN
  
  function fillGroupsSelecttwo()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoGroupsSelecttwo, errorCB);
	
}

        function QuerytoGroupsSelecttwo(tx)
   {
	  var UserID=sessionStorage.userid;
	  //alert("SELECT * FROM GROUPS INNER JOIN Users2Groups ON GROUPS.GroupID=Users2Groups.ID WHERE UserID='"+UserID+"' ORDER BY Description");
	  tx.executeSql("SELECT * FROM GROUPS INNER JOIN Users2Groups ON GROUPS.GroupID=Users2Groups.ID WHERE UserID='"+UserID+"' ORDER BY Description", [], GroupsSelectSuccesstwo, errorCB);
	   
   }
   
    function GroupsSelectSuccesstwo(tx, results)
   {
	    var len = results.rows.length;
	  var selecthtml='<option value="0">All</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
			 selecthtml+='<option value="'+results.rows.item(i).GroupID+'">'+results.rows.item(i).Description+'</option>';
             }
			 
			 $("#select_group").html(selecthtml);
	
		  
	  }
	  else
	  {
		  navigator.notification.alert("No registered groups", null, 'FieldTracker', 'Accept'); 
	  }
	   
   }
   
   //LAUNCH PROCEDURE
   
   function launchprocedure()
{
	var idprocedure=$("#chpro").val();
	
	if(idprocedure!="0")
	{
		sessionStorage.nameprocedure=$("#chnamep").val();
		sessionStorage.currentProcedure=idprocedure;
		$(':mobile-pagecontainer').pagecontainer('change', '#pageProcedure', {
        transition: 'slide',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    	});
		
	}
	else
	{
		navigator.notification.alert("Please select a procedure", null, 'FieldTracker', 'Accept');
		
	}
	

	
	
}

function searchnameprocedure()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoGetProcedureName, errorCB);
	
}

function QuerytoGetProcedureName(tx)
{
	var idprocedure=$("#chpro").val();
	tx.executeSql("SELECT * FROM PROCEDURES WHERE ProcID='"+idprocedure+"'", [], QuerytoGetProcedureNameSuccess, errorCB);
	
}

function QuerytoGetProcedureNameSuccess(tx, results)
{
	//alert("aqui");
	var len = results.rows.length;
	  if(len>0)
	  {
		  //alert(results.rows.item(0).Name);
		// alert(results.rows.item(0).Name);
		 $("#chnamep").val(results.rows.item(0).Name); 
	  }
	
}

function searchnameprocedureval()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoGetProcedureNameval, errorCB);
	
}

function QuerytoGetProcedureNameval(tx)
{
	var idprocedure=$("#cheval").val();
	tx.executeSql("SELECT * FROM PROCEDURES WHERE ProcID='"+idprocedure+"'", [], QuerytoGetProcedureNameSuccess, errorCB);
	
}

function QuerytoGetProcedureNameSuccess(tx, results)
{
	//alert("aqui");
	var len = results.rows.length;
	  if(len>0)
	  {
		  //alert(results.rows.item(0).Name);
		 //alert(results.rows.item(0).Name);
		 $("#chnameeval").val(results.rows.item(0).Name); 
	  }
	
}

function searchnameprocedurebysubmit()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoGetProcedureNamebysubmit, errorCB);
	
}

function QuerytoGetProcedureNamebysubmit(tx)
{
	var idsubmitted=$("#chsubmit").val();
	tx.executeSql("SELECT * FROM SUBMITTEDPROCS WHERE SubmitID='"+idsubmitted+"'", [], QuerytoGetProcedureNamebysubmitSuccess, errorCB);
	
}

function QuerytoGetProcedureNamebysubmitSuccess(tx, results)
{
	//alert("aqui");
	var len = results.rows.length;
	//alert(len);
	  if(len>0)
	  {
		  //alert(results.rows.item(0).Name);
		 //alert(results.rows.item(0).Name);
		 $("#chnamep").val(results.rows.item(0).Name); 
	  }
	  else
	  {
		   $("#chnamep").val("0"); 
		  
	  }
	
}

///////=============================<<<<<<<<<<<< END LAUNCH PROCEDURE PAGE  >>>>>>>>>>>=========================================///////



///////<<<<<<<<<<<<============================= PROCEDURES STEPS PAGE =========================================>>>>>>>>>>>///////

//Fill steps
    function fillstepsprocedure()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querystepsprocedure, errorCB);
	  
  }
  
    function Querystepsprocedure(tx)
  {
	   showModal();
	   var idprocedure=sessionStorage.currentProcedure;
	   
	   var query="SELECT StepID, OrdNum, Text, Type, Num, SelAllComps,SelAllFaults FROM PROCEDURESTEPS WHERE (ProcID = '"+idprocedure+"')  ORDER BY OrdNum";
	   //akivoy
	  // alert(query);
	   tx.executeSql(query, [], QuerystepsprocedureSuccess, errorCB);
	  
	  
  }
  
  //CHECK IF PROCEDURE HAVE STEPS
  
    function QuerystepsprocedureSuccess(tx,results)
  {
	  var len = results.rows.length;
	 
	  if(len=="0")
	  {
		   				hideModal();
		     			 navigator.notification.confirm(
    					'No registered Steps',      // mensaje (message)
    						onConfirm,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   							 'FieldTracker',            // titulo (title)
        				'Exit'          // botones (buttonLabels)
        				);
    

		 // navigator.notification.alert("No registered Steps", null, 'FieldTracker', 'Accept'); 
		  
	  }
	  else
	  {
		 filltablesteps(results); 
	  }
	 
	  
  }
  
    // ON CONFIRM NO STEPS
    function onConfirm(button) {
			    $(':mobile-pagecontainer').pagecontainer('change', '#pageProcedureLaunch', {
        transition: 'pop',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
       
    }
	
	//STEPS OF PROCEDURE
	
	function filltablesteps(results)
	{
		var specialequipment=false;
		var introduction=false;
		var stepshtml='';	
		 var tb = $('#stepsbody');
	
		// Search For Special equipment required and Introduction.
		 for (var i=0; i<results.rows.length; i++){
			 
			 if(results.rows.item(i).Type=="Required Equipment")
			 {
				 specialequipment=true;
				 
			 }
			 else if(results.rows.item(i).Type=="Introduction")
			 {
				 introduction=true;
			 }
			 
			 
			 
		 }
		 
		  if (specialequipment == true)
            {
				
				stepshtml+="  <tr><td><b>SPECIAL EQUIPMENT REQUIRED</b></td><td></td></tr>";
				stepshtml+="<tr><td>   </td></tr>";
				for (var i=0; i<results.rows.length; i++){
					if(results.rows.item(i).Type=="Required Equipment")
					{
						stepshtml+="<tr><td>"+results.rows.item(i).Text+"</td><td></td></tr>";
					}
				}
				stepshtml+="<tr><td>   </td><td></td></tr>";
				
			}
				  if (introduction == true)
            {
				stepshtml+="<tr><td>   </td><td></td></tr>";
				stepshtml+="  <tr><td><b>INTRODUCTION</b></td><td></td></tr>";
				stepshtml+="<tr><td>   </td><td></td></tr>";
				for (var i=0; i<results.rows.length; i++){
					if(results.rows.item(i).Type=="Introduction")
					{
						stepshtml+="<tr><td>"+results.rows.item(i).Text+"</td><td></td></tr>";
					}
				}
				stepshtml+="<tr><td>   </td><td></td></tr>";
				
			}
			
			stepshtml+="<tr><td><b>PROCEDURE</b></td><td></td></tr>";
			stepshtml+="<tr><td>   </td><td></td></tr>";
			for (var i=0; i<results.rows.length; i++){
				
					if(results.rows.item(i).Type=="Caution")
					{
					stepshtml+='<tr><td><table><tr><td><img src="img/alert.png" ></td><td>'+results.rows.item(i).Text+'</td></tr></table></td><td></td></tr>';
					}
					else if(results.rows.item(i).Type=="Warning")
					{
						stepshtml+='<tr><td><table><tr><td><img src="img/Stop.png" ></td><td>'+results.rows.item(i).Text+'</td></tr></table></td><td></td></tr>';
						
					}
					else if(results.rows.item(i).Type=="Note")
					{
						stepshtml+='<tr><td><table><tr><td><img src="img/note.png" ></td><td>'+results.rows.item(i).Text+'</td></tr></table></td><td></td></tr>';
					}
					else if(results.rows.item(i).Type=="Substep")
					{
						//alert('<tr><td><label class="ui-icon-delete ui-shadow-icon"><input type="checkbox" name="" id="">'+results.rows.item(i).Num+' &nbsp;'+results.rows.item(i).Text+'</label> </td><td><a href="javascript:reportissue('+results.rows.item(i).StepID+');" data-theme="b" data-role="button" data-inline="true" data-icon="alert" data-iconpos="right">Report Issue</a></td></tr>');
						
						stepshtml+='<tr><td><label id="lbl'+results.rows.item(i).StepID+'" class="ui-icon-delete ui-shadow-icon" ><input type="checkbox"  name="'+results.rows.item(i).StepID+'" id="'+results.rows.item(i).StepID+'">'+results.rows.item(i).Num+' &nbsp;'+results.rows.item(i).Text+'</label> </td><td><a href="javascript:reportissue('+"'"+results.rows.item(i).StepID+"'"+');" data-theme="b" data-role="button" data-inline="true" data-icon="alert" data-iconpos="right">Report Issue</a></td></tr>';
					}
					else if(results.rows.item(i).Type=="Step")
					{
				       stepshtml+='<tr><td><label id="lbl'+results.rows.item(i).StepID+'" class="ui-icon-delete ui-shadow-icon" ><input type="checkbox"  name="'+results.rows.item(i).StepID+'" id="'+results.rows.item(i).StepID+'">'+results.rows.item(i).Num+' &nbsp;'+results.rows.item(i).Text+'</label> </td><td><a href="javascript:reportissue('+"'"+results.rows.item(i).StepID+"'"+');" data-theme="b" data-role="button" data-inline="true" data-icon="alert" data-iconpos="right">Report Issue</a></td></tr>';
					}
				
			}
			//alert(stepshtml);
			//$("#stepsbody").html(stepshtml);
			tb.empty().append(stepshtml);
			$("#table-result").table("refresh");
	 		$("#table-result").trigger('create');
			 hideModal();
		 
		 
		 	
		
		
		}
		
		
		//IF WHATTODO IS TRUE CHECK FOR ISSUES ON SUBMIT ID
		
		   function fillredlables()
   {
	   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querygetredissues, errorCB);
	   
	   
   }
   
      function Querygetredissues(tx)
   {
	    showModal();
	  var SubmitID=sessionStorage.submitID;
	  var query="SELECT * FROM TEMPSUBMITTEDSTEPS WHERE SubmitID='"+SubmitID+"'";
	 // alert(query);
	  tx.executeSql(query, [], QuerygetredissuesSuccess, errorCB);
   }
   
   	function QuerygetredissuesSuccess(tx,results)
	{
		var len = results.rows.length;
		//alert(len)
		var x="";
		 if(len>0)
	   {
		    for (var i=0; i<results.rows.length; i++){
				//alert(results.rows.item(i).StepID);
				try
				{
					var testlbl=results.rows.item(i).StepID;
					testlbl=testlbl.trim();
					 x=document.getElementById("lbl"+testlbl);	
		  			 x.style.backgroundColor="#FFD7D8";
		   			 x.style.borderColor="red";
		   			 x.style.border="medium";
					
				}
				catch(err)
				{
					alert(err.message);
				}
		  
		
			
			}
		   
	   }
	  // alert("escondo modal");
	   
	   hideModal();
		
	}
	
	function searchtextandnum(idstep)
	{
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(function(tx){ Querysearchtextandnum(tx,idstep) }, errorCB);
	}
	
	function Querysearchtextandnum(tx,idstep)
	{
		var query="SELECT * FROM PROCEDURESTEPS WHERE StepID='"+idstep+"'";
	  	tx.executeSql(query, [], QuerysearchtextandnumSuccess, errorCB);
	}
	function QuerysearchtextandnumSuccess(tx,results)
	{
		var len = results.rows.length;
		if (len>0)
		{
			
			sessionStorage.currentStepText=results.rows.item(0).Text;
			sessionStorage.currentStepNum=results.rows.item(0).Num;
			sessionStorage.SelAllComps=results.rows.item(0).SelAllComps;
            sessionStorage.SelAllFaults=results.rows.item(0).SelAllFaults;                           
			//alert(results.rows.item(0).SelAllComps+" "+results.rows.item(0).SelAllFaults);
		}
		
	}
	
	
	
	// Open Page Report Issue
			function reportissue(idstep)
		{
			//alert(idstep);
		sessionStorage.currentStep=idstep;
		//search for steptext and num
		searchtextandnum(idstep);
		$(':mobile-pagecontainer').pagecontainer('change', '#pageReport', {
        transition: 'slide',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
  		 	 });
		}
		
		//Save submit
	function submitprocedure()
	{
		checkIssuesSteps();
		
	}
	
		function checkIssuesSteps()
	{
		   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
           db.transaction(QueryCheckIssuesSteps, errorCB);
	}
	
		function QueryCheckIssuesSteps(tx)
	{
		//showModal();
		var SubmitID=sessionStorage.submitID;
		var query="SELECT * FROM TEMPSUBMITTEDSTEPS WHERE SubmitID='"+SubmitID+"'";
	  	tx.executeSql(query, [], QueryCheckIssuesStepsSuccess, errorCB);
	}
	
		function QueryCheckIssuesStepsSuccess(tx,results)
	{
		$("#Statushidden").val("0");
		var incorrectIssue=false;
		var len = results.rows.length;
			$('#table-result').find('input[type="checkbox"]').each(function () {
     var idcheck=  $(this).attr('id');
	
		if($(this).is(':checked')==false)
		{
		incorrectIssue=true;
		for (var i=0; i<results.rows.length; i++){
			// alert(idcheck+" "+results.rows.item(i).StepID);
			if(idcheck==results.rows.item(i).StepID)
			{
				incorrectIssue=false;
				break;
			}
		}
		
	} 

	  });
	  
	  if (incorrectIssue==true)
	  {
		  $("#Statushidden").val("1");
		  openpquestion();
		  
	  }
	  else
	  {
		  SaveSubmit();
	  }
		
	}
	
	//Save Submit
		function SaveSubmit()
	{
		$('#popupnoissue').popup('close');
		 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
           //db.transaction(QuerySaveIssuesSteps, errorCB);
		   db.transaction(searchtextsteps, errorCB);
	}
	
	function searchtextsteps(tx)
	{
		var query="SELECT * FROM PROCEDURESTEPS";
	  	tx.executeSql(query, [], searchtextstepsSuccess, errorCB);
		
	}
	
	function searchtextstepsSuccess(tx,results)
	{
		
		saveStepsissues(results)
		
	}
	
	function saveStepsissues(resultallsteps)
	{
		
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
		db.transaction(function(tx){ QuerySaveIssuesSteps(tx,resultallsteps) }, errorCB);
	}
	
	
		function QuerySaveIssuesSteps(tx,resultallsteps)
	{
		
		var SubmitID=sessionStorage.submitID;
		var query="SELECT * FROM TEMPSUBMITTEDSTEPS WHERE SubmitID='"+SubmitID+"'";
	  	tx.executeSql(query, [], function(tx,results){ QuerySaveIssuesStepsSuccess(tx,results,resultallsteps) }, errorCB);
	}
	
		function QuerySaveIssuesStepsSuccess(tx,results,resultallsteps)
	{
		
		var dt = new Date();
		var SubmitDate = dt.toYMD();
		var SubmitTime=dt.toYMDhrs();
		//alert(SubmitDate);
		var status_procedure=$("#Statushidden").val();
		//alert(status_procedure);
		var procedurename=sessionStorage.nameprocedure;
		var Ok="false";
		var Text='text step';
		var Num='666';
		var StepID="";
		var Component="";
		var Fault="";
		var Priority="";
		var Comments="";
		var exists=0;
		var UserID=sessionStorage.userid;
	 	var ProcID=sessionStorage.currentProcedure;
     	var SubmitID=sessionStorage.submitID;
	 	var FaultID="";
		
	
			$('#table-result').find('input[type="checkbox"]').each(function () {
	
     var idcheck=  $(this).attr('id');
	 for (var icont=0; icont<resultallsteps.rows.length; icont++){
					
		if(idcheck==resultallsteps.rows.item(icont).StepID)
					{
						Text=resultallsteps.rows.item(icont).Text;
						Num=resultallsteps.rows.item(icont).Num;
						//break;
						
					}
	 }
    // alert(Text+" "+Num);
	 //alert($(this).is(':checked'));
	
		if($(this).is(':checked')==true)
		{
			
				Ok="true";
				for (var i=0; i<results.rows.length; i++){
					FaultID=results.rows.item(i).StepID+new Date().getTime() + Math.random();
					if(idcheck==results.rows.item(i).StepID)
					{
						 
				
					 
						Ok="false";
						StepID=results.rows.item(i).StepID;
						Component=results.rows.item(i).Component;
						Fault=results.rows.item(i).Fault;
						Priority=results.rows.item(i).Priority;
						Comments=results.rows.item(i).Comments;
						
						
					//alert('INSERT INTO SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'")');
tx.executeSql('INSERT INTO SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments,Sync) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'","no")');
				
					}
		  		}
					if(Ok!="false")
					{
				
						Ok="true";
						StepID=idcheck;
						Component="";
				Fault="";
				Priority="";
				Comments="";
		
			     // alert('INSERT INTO SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'")');
				tx.executeSql('INSERT INTO SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments,Sync) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'","no")');
				
					}

		
		
		} 
		else
		{
			//alert("aki en el else"+idcheck);
		exists=0;
		for (var i=0; i<results.rows.length; i++){
			 FaultID=results.rows.item(i).StepID+new Date().getTime() + Math.random();
			if(idcheck==results.rows.item(i).StepID)
			{
				
				
				exists=1;
				Ok="false";
				StepID=results.rows.item(i).StepID;
				Component=results.rows.item(i).Component;
				Fault=results.rows.item(i).Fault;
				Priority=results.rows.item(i).Priority;
				Comments=results.rows.item(i).Comments;
				Text=results.rows.item(i).Text;
				Num=results.rows.item(i).Num;
				//alert('INSERT INTO SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'")');
				tx.executeSql('INSERT INTO SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments,Sync) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'","no")');
				
			}
		  }
			if(exists=0)
			{
				
				Ok="false";
				StepID=idcheck;
				Component="";
				Fault="";
				Priority="";
				Comments="";
		        //alert('INSERT INTO SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'")');
				tx.executeSql('INSERT INTO SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments,Sync) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'","no")');
				
			}
			
			
		}

	  });
	 // alert('INSERT INTO SUBMITTEDPROCS  (SubmitID,ProcID,Name,UserID,SubmitDate,Time,Comments,Status,Sync) VALUES ("'+SubmitID+'","'+ProcID+'","'+procedurename+'","'+UserID+'","'+SubmitDate+'","'+SubmitTime+'"," ","'+status_procedure+'","'+"no"+'")');
	 tx.executeSql('INSERT INTO SUBMITTEDPROCS  (SubmitID,ProcID,Name,UserID,SubmitDate,Time,Comments,Status,Sync) VALUES ("'+SubmitID+'","'+ProcID+'","'+procedurename+'","'+UserID+'","'+SubmitDate+'","'+SubmitTime+'"," ","'+status_procedure+'","'+"no"+'")');
	 
	   searchfortempmedia(SubmitID,StepID);
	
	  
	}
	
	function searchfortempmedia(SubmitID,StepID)
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ Querysearchfortempmedia(tx,SubmitID,StepID) }, errorCB);
	
}

     function Querysearchfortempmedia(tx,SubmitID,StepID)
   {
	 // alert(SubmitID+"   "+StepID)
		tx.executeSql("SELECT * FROM TEMPMEDIA WHERE SubmitID='"+SubmitID+"'", [], insermediatoprocedure, errorCB);
	   
   }
	
		  function insermediatoprocedure(tx,results)
	   {
		  // alert(results.rows.length);
		   for (var i=0; i<results.rows.length; i++)
			{
				//alert(results.rows.item(i).Path+" "+results.rows.item(i).SubmitID);
				tx.executeSql('INSERT INTO MEDIA (SubmitID,StepID,FileType,FileName,Path,Sync) VALUES ("'+results.rows.item(i).SubmitID+'","'+results.rows.item(i).StepID+'","'+results.rows.item(i).FileType+'","'+results.rows.item(i).FileName+'","'+results.rows.item(i).Path+'","no")');
				
			}
			if(results.rows.length>0)
			{
				var SubmitID=results.rows.item(0).SubmitID;
				verifymediainsubmitted(SubmitID);
			}
			
			 		 navigator.notification.confirm(
    					'Saved',      // mensaje (message)
    						onsuccessprocedure,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   							 'FieldTracker',            // titulo (title)
        				'Accept'          // botones (buttonLabels)
        				);
	   }
	   
	
	   function onsuccessprocedure(button) {
		 var tb = $('#stepsbody');
		 tb.html("");
			    $(':mobile-pagecontainer').pagecontainer('change', '#pageMenu', {
        transition: 'pop',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	   }
	
	//Open modal question if all steps are not checked
		function openpquestion()
	{
		//alert("pregunta");
		$("#popupnoissue").popup("open");
	}
		


///////=============================<<<<<<<<<<<< END PROCEDURES STEPS PAGE  >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<============================= REPORT ISSUES PAGE =========================================>>>>>>>>>>>///////

//Dropdown Components
function fillComponentsSelect()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoComponentSelect, errorCB);
	
}

     function QuerytoComponentSelect(tx)
   {
	     var StepID=sessionStorage.currentStep;
		// alert(sessionStorage.SelAllComps);
	    if(sessionStorage.SelAllComps=="TRUE")
		{
			tx.executeSql("SELECT * FROM COMPONENTS ORDER BY Component", [], GroupsComponentSuccess, errorCB);
		}
		else
		{
			tx.executeSql("SELECT Steps2Comps.*, Components.ID, Components.Component, Components.CompType FROM Steps2Comps INNER JOIN Components ON Steps2Comps.CompID = Components.ID WHERE Steps2Comps.StepID='"+StepID+"' ORDER BY Components.Component", [], GroupsComponentSuccess, errorCB);
		}
		
	   
   }
   
   function GroupsComponentSuccess(tx, results)
   {
	    var len = results.rows.length;
	  	var selecthtml='<option value="0">Choose a component</option>';
		var Edithtml='<option value="0">Choose a component</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
            //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
			 selecthtml+='<option value="'+results.rows.item(i).ID+'">'+results.rows.item(i).Component+'</option>';
			 Edithtml+='<option value="'+results.rows.item(i).Component+'">'+results.rows.item(i).Component+'</option>';
             }
			 
			 $("#select-addcomponent").html(selecthtml);
			 $("#select-editcomponent").html(Edithtml);
			 $('#select-addcomponent').selectmenu('refresh');
		   $('#select-addcomponent').selectmenu('refresh', true);
			$('#select-editcomponent').selectmenu('refresh');
		   $('#select-editcomponent').selectmenu('refresh', true);
			
			 
	
		  
	  }
	  else
	  {
		 // navigator.notification.alert("No registered components", null, 'FieldTracker', 'Accept'); 
	  }
	   
   }
   
   //Dropddown Faults
   
   function fillFaultSelect()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoFaultSelect, errorCB);
	
}

    function QuerytoFaultSelect(tx)
   {
	   var Component= $("#select-addcomponent").val();
	  // alert(Component);
	    if(sessionStorage.SelAllFaults=="TRUE")
		{
			tx.executeSql("SELECT * FROM FAULTS ORDER BY Description", [], GroupsFaultSuccess, errorCB);
		}
		else
		{
			if(Component=="0")
			{
				 $("#select-addfault").html('');
			 	 $("#select-editfault").html('');
			  	 $('#select-addfault').selectmenu('refresh');
		  		 $('#select-addfault').selectmenu('refresh', true);
			 	 $('#select-editfault').selectmenu('refresh');
		         $('#select-editfault').selectmenu('refresh', true);
				
				
			}
			else
			{
				tx.executeSql("SELECT Components.ID AS Expr1, Comps2Faults.FaultID, Faults.* FROM Comps2Faults INNER JOIN Components ON Comps2Faults.ID = Components.ID INNER JOIN Faults ON Comps2Faults.FaultID = Faults.ID WHERE Components.ID='"+Component+"'", [], GroupsFaultSuccess, errorCB);
				
			}
			
			
		}
		
	   
   }
   
      function GroupsFaultSuccess(tx, results)
   {
	   
	    var len = results.rows.length;
	  var selecthtml='<option value="0">Choose a fault</option>';
	  var Edithtml='<option value="0">Choose a fault</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
			 selecthtml+='<option value="'+results.rows.item(i).ID+'">'+results.rows.item(i).Description+'</option>';
			 Edithtml+='<option value="'+results.rows.item(i).Description+'">'+results.rows.item(i).Description+'</option>';
             }
			// alert(selecthtml);
			 $("#select-addfault").html(selecthtml);
			 $("#select-editfault").html(Edithtml);
			  	  $('#select-addfault').selectmenu('refresh');
		  $('#select-addfault').selectmenu('refresh', true);
			 	  $('#select-editfault').selectmenu('refresh');
		  $('#select-editfault').selectmenu('refresh', true);

		  
	  }
	  else
	  {
		   $("#select-addfault").html(selecthtml);
			 $("#select-editfault").html(selecthtml);
			  	  $('#select-addfault').selectmenu('refresh');
		  $('#select-addfault').selectmenu('refresh', true);
			 	  $('#select-editfault').selectmenu('refresh');
		  $('#select-editfault').selectmenu('refresh', true);
		  //navigator.notification.alert("No registered faults", null, 'FieldTracker', 'Accept'); 
	  }
	  
	 
	   
   }
   
     function SearchFaulte()
  {
	  var component=$("#select-editcomponent").val();
	  if(component!="0" && sessionStorage.SelAllFaults=="FALSE")
	  {
		  fillFaultSelecte();
		  
	  }
	  //alert(component);
	  
  }


 function fillFaultSelecte()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoFaultSelecte, errorCB);
	
}

    function QuerytoFaultSelecte(tx)
   {
	   var Component= $("#select-editcomponent").val();
	  // alert(Component);
	    if(sessionStorage.SelAllFaults=="TRUE")
		{
			tx.executeSql("SELECT * FROM FAULTS ORDER BY Description", [], GroupsFaultSuccess, errorCB);
		}
		else
		{
			if(Component=="0")
			{
				 $
			 	 $("#select-editfault").html('');
			 	 $('#select-editfault').selectmenu('refresh');
		         $('#select-editfault').selectmenu('refresh', true);
				
			}
			else
			{
				//alert("SELECT Components.ID AS Expr1, Comps2Faults.FaultID, Faults.* FROM Comps2Faults INNER JOIN Components ON Comps2Faults.ID = Components.ID INNER JOIN Faults ON Comps2Faults.FaultID = Faults.ID WHERE Components.Description='"+Component+"'");
				tx.executeSql("SELECT Components.ID AS Expr1,Components.Component, Comps2Faults.FaultID, Faults.* FROM Comps2Faults INNER JOIN Components ON Comps2Faults.ID = Components.ID INNER JOIN Faults ON Comps2Faults.FaultID = Faults.ID WHERE Components.Component='"+Component+"'", [], GroupsFaultSuccesse, errorCB);
				
			}
			
			
		}
		
	   
   }
   
      function GroupsFaultSuccesse(tx, results)
   {
	    var len = results.rows.length;
		//alert(len);
	  var Edithtml='<option value="0">Choose a fault</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
			 Edithtml+='<option value="'+results.rows.item(i).Description+'">'+results.rows.item(i).Description+'</option>';
             }
			// alert(selecthtml);
		
			 $("#select-editfault").html(Edithtml);
			 	  $('#select-editfault').selectmenu('refresh');
		  $('#select-editfault').selectmenu('refresh', true);

		  
	  }
	  else
	  {
		
			 $("#select-editfault").html(Edithtml);
			 $('#select-editfault').selectmenu('refresh');
		  $('#select-editfault').selectmenu('refresh', true);
		 // navigator.notification.alert("No registered faults", null, 'FieldTracker', 'Accept'); 
	  }
	   
   }
   
   
   
   //GET STEP ISSUES
   
         function getissues()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querygetissues, errorCB);
	  
  }
  
    function Querygetissues(tx)
  {
	   showModal();
	   var StepID=sessionStorage.currentStep;
	   var ProcID=sessionStorage.currentProcedure;
       var SubmitID=sessionStorage.submitID;
	  // alert(StepID+" "+ProcID+" "+SubmitID);
	   var query="SELECT * FROM TEMPSUBMITTEDSTEPS WHERE StepID='"+StepID+"' AND ProcID='"+ProcID+"' AND SubmitID='"+SubmitID+"'";
	   //alert(query);
	   tx.executeSql(query, [], QuerygetissuesSuccess, errorCB);
	   
	  
  }
  
    function QuerygetissuesSuccess(tx, results)
  {
	 var len = results.rows.length;
	 var tb = $('#bodyissues');
	 var tablehtml="";
	 if(len>0)
	 {
		 	 for (var i=0; i<results.rows.length; i++){
	var capitalizeMe=results.rows.item(i).Priority;
	var capitalized = capitalizeMe.charAt(0).toUpperCase() + capitalizeMe.substring(1);
  tablehtml+='<tr data-name="'+results.rows.item(i).FaultID+'"><td>'+results.rows.item(i).Component+'</td><td>'+results.rows.item(i).Fault+'</td><td>'+capitalized+'</td><td>'+results.rows.item(i).Comments+'</td><td><a href="javascript:openEditFault('+"'"+results.rows.item(i).FaultID+"'"+');"  data-transition="slideup" data-theme="b"  class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-gear ui-btn-icon-left ui-btn-c">Actions</a></td></tr>';
		 //alert(results.rows.item(i).lastp+" "+results.rows.item(i).Name+" "+results.rows.item(i).ProcID);
	 }
	// alert(tablehtml);
	  tb.empty().append(tablehtml);
	 $("#table-issues").table("refresh");
	 $("#table-issues").trigger('create');
		 
	 }

	 hideModal();
  }
  
  function SearchFault()
  {
	  var component=$("#select-addcomponent").val();
	  if(component!="0" && sessionStorage.SelAllFaults=="FALSE")
	  {
		  fillFaultSelect();
		  drawonchangecomponent();
		  
	  }
	  else
	  {
		   drawonchangecomponent();
	  }
	  //alert(component);
	  
  }
  
  function SearchPriority()
  {
	  var fault=$("#select-addfault").val();
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerySearchPriority, errorCB);
	 
	  
  }
  
  function QuerySearchPriority(tx)
  {
	  var fault=$("#select-addfault").val();
	  if(fault=="0")
	  {
		  $("#select-addpriority").val("0");
		  $('#select-addpriority').selectmenu('refresh');
	  	$('#select-addpriority').selectmenu('refresh', true);
		  
	  }
	  else
	  {
		 var query="SELECT * FROM Faults WHERE ID='"+fault+"'";
	  
	  		tx.executeSql(query, [], QuerySearchPrioritySuccess, errorCB);
		  
	  }
	  
  }
  
  function QuerySearchPrioritySuccess(tx,results)
  {
	  var len = results.rows.length;
	  //alert(len);
	  var priority=results.rows.item(0).Priority;
	  if(priority=="3 - Low")
	  {
		  $("#select-addpriority").val("low");
	  }
	  else if(priority=="2 - Med")
	  {
		  $("#select-addpriority").val("medium");
	  }
	  else if(priority=="1 - High")
	  {
		  $("#select-addpriority").val("high");
		  
	  }
	  $('#select-addpriority').selectmenu('refresh');
	  $('#select-addpriority').selectmenu('refresh', true);
	  
  }
  
  
    function SearchPriorityh()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerySearchPriorityh, errorCB);
	 
	  
  }
  
  function QuerySearchPriorityh(tx)
  {
	  var fault=$("#select-editfault").val();
	  if(fault=="0")
	  {
		  $("#select-editpriority").val("0");
		  $('#select-editpriority').selectmenu('refresh');
	  	$('#select-editpriority').selectmenu('refresh', true);
		  
	  }
	  else
	  {
		 var query="SELECT * FROM Faults WHERE Description='"+fault+"'";
	  
	  		tx.executeSql(query, [], QuerySearchPrioritySuccessh, errorCB);
		  
	  }
	  
  }
  
  function QuerySearchPrioritySuccessh(tx,results)
  {
	  var len = results.rows.length;
	  //alert(len);
	  var priority=results.rows.item(0).Priority;
	  if(priority=="3 - Low")
	  {
		  $("#select-editpriority").val("low");
	  }
	  else if(priority=="2 - Med")
	  {
		  $("#select-editpriority").val("medium");
	  }
	  else if(priority=="1 - High")
	  {
		  $("#select-editpriority").val("high");
		  
	  }
	  $('#select-editpriority').selectmenu('refresh');
	  $('#select-editpriority').selectmenu('refresh', true);
	  
  }
  
  
  //ADD ISSUE
  
  	function AddIssue()
	{

		var StepID=sessionStorage.currentStep;
		var Component=$("#select-addcomponent option:selected").text();
		var Fault=$("#select-addfault option:selected").text();
		var Priority=$("#select-addpriority").val();
		var Comments=$("#textarea-addcomments").val();
		var FaultID=StepID+new Date().getTime() + Math.random();
		//alert(Component+" "+Fault+" "+Priority+" "+Comments);
		if(Component!="0" && Fault!="0" && Priority!="0")
		{
					var div = document.getElementById("drawcustomfields");
		var divcomp = document.getElementById("compdrawcustomfields");
		$(div).find('input:text, input:password,select, textarea')
        .each(function() {
            var id=$(this).attr('id');
			var value=$(this).val();
			//alert(id+" and "+value);
			InsertIssueCustomTemp(id,value,FaultID);
			
			//alert(id+" and "+value);
        });
		
		$(divcomp).find('input:text, input:password,select, textarea')
        .each(function() {
            var id=$(this).attr('id');
			var value=$(this).val();
			//alert(id+" and "+value);
			InsertIssueCustomTemp(id,value,FaultID);
			
			//alert(id+" and "+value);
        });
			
			InsertIssueTemp(Component,Fault,Priority,Comments,FaultID);
		//	
		}
		else
		{
			navigator.notification.alert("Please select priority", null, 'FieldTracker', 'Accept');
			
		}
		
	}
	
	function InsertIssueCustomTemp(id,value,FaultID)
	{
	   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       db.transaction(function(tx){ QueryInsertIssueCustomTemp(tx,id,value,FaultID) }, errorCB);
		
	}
	
	function QueryInsertIssueCustomTemp(tx,id,value,FaultID)
	{
			 var Ok="false";
	 var StepID=sessionStorage.currentStep;
	 var ProcID=sessionStorage.currentProcedure;
	 var Text=sessionStorage.currentStepText;
	 var Num=sessionStorage.currentStepNum;
     var SubmitID=sessionStorage.submitID;
	 
	 var query='INSERT INTO TEMPSUBMITTEDCUSTOMVALUES (FaultID,SubmitID,ProcID,StepID,MeasID,Value) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+id+'","'+value+'")';
	// alert(query);
	 tx.executeSql(query);	
		
	}
	
		   function InsertIssueTemp(Component,Fault,Priority,Comments,FaultID)
  {
	  	//alert(Comments);
	    var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       db.transaction(function(tx){ QueryInsertIssueTemp(tx,Component,Fault,Priority,Comments,FaultID) }, errorCB, successInsertIssue);


  }
  
      function QueryInsertIssueTemp(tx,Component,Fault,Priority,Comments,FaultID)
  {
	 var Ok="false";
	 var StepID=sessionStorage.currentStep;
	 var ProcID=sessionStorage.currentProcedure;
	 var Text=sessionStorage.currentStepText;
	 var Num=sessionStorage.currentStepNum;
     var SubmitID=sessionStorage.submitID;
	
	 //akivoy
	// alert('INSERT INTO TEMPSUBMITTEDSTEPS  (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'")');
	 tx.executeSql('INSERT INTO TEMPSUBMITTEDSTEPS  (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'")');
	  
  }
  
      function successInsertIssue()
  {
	  $("#select-addcomponent").val('0');
	  $("#select-addfault").val('0');
	  $("#select-addpriority").val('0');
	  $("#textarea-addcomments").val('');
	   $('#select-addfault').selectmenu('refresh');
		  $('#select-addfault').selectmenu('refresh', true);
		   $('#select-addfault').selectmenu('refresh');
		  $('#select-addcomponent').selectmenu('refresh', true);
		   $('#select-addcomponent').selectmenu('refresh');
		  $('#select-addpriority').selectmenu('refresh', true);
		  $('#select-addpriority').selectmenu('refresh');
	  getissues();
	  $('#popupAddIssue').popup('close');
	 // alert("grabo");
  }
  
  //Open modal to edit issue
  
    function openEditFault(FaultID)
  {
	  //alert(FaultID);
	  try{
	  $('#popupAddIssue').popup('close');
	  }
	  catch(err)
	  {
		  alert(err.message);
	  }
	  $("#steptoedit").val(FaultID);
	 // alert(FaultID);
	  $("#popupMenu").popup("open",{history:false});
	 
	  
  }
  
  // Fill Modal to Edit 
  
    function EditFault()
  {
	  
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
     db.transaction(QueryEditFault, errorCB);	  
	
  }
  
          function QueryEditFault(tx)
  {
	  var FaultID=$("#steptoedit").val();
	   var query="SELECT * FROM TEMPSUBMITTEDSTEPS WHERE FaultID='"+FaultID+"'";
	  // alert(query);
	   tx.executeSql(query, [], QueryEditFaultSuccess, errorCB);
	 
	  
	  
  }
  
    function QueryEditFaultSuccess(tx,results)
  {
	  //alert("in");
	   var len = results.rows.length;
	  // alert(results.rows.item(0).Component+" "+results.rows.item(0).Fault+" "+results.rows.item(0).Priority);
	   if(len>0)
	   {
		   
		   $("#select-editcomponent").val(results.rows.item(0).Component);
		   $("#select-editfault").val(results.rows.item(0).Fault);
		   $("#select-editpriority").val(results.rows.item(0).Priority);
		   $("#textarea-editcomments").val(results.rows.item(0).Comments);
		   $('#select-editcomponent').selectmenu('refresh');
		   $('#select-editcomponent').selectmenu('refresh', true);
		  $('#select-editfault').selectmenu('refresh');
		  $('#select-editfault').selectmenu('refresh', true);
		   $('#select-editpriority').selectmenu('refresh');
		   $('#select-editpriority').selectmenu('refresh', true);
		   GetCustomfieldValues(results.rows.item(0).FaultID);
		  
		   //refresh value			



		   
		
	   }
	   else
	   {
		     $('#popupMenu').popup('close'); 
	   }
	  
  }
  
  function GetCustomfieldValues(FaultID)
  {
	  var dbtwo = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       dbtwo.transaction(function(tx){ QueryGetCustomfieldValues(tx,FaultID) }, errorCB);
	  
	  
  }
  
  function QueryGetCustomfieldValues(tx,FaultID)
  {
	  var query="SELECT * FROM TEMPSUBMITTEDCUSTOMVALUES WHERE FaultID='"+FaultID+"'";
	   tx.executeSql(query, [], QueryGetCustomfieldValuesSuccess, errorCB);
	  
	  
  }
  
  function QueryGetCustomfieldValuesSuccess(tx,results)
  {
	     var len = results.rows.length;
		// alert(len);
		 if(len>0)
		 {
			 
			 for (var i=0; i<results.rows.length; i++){
				 alert(results.rows.item(i).MeasID+"  "+results.rows.item(i).Value);
				 try
				 {
					 $('#'+results.rows.item(i).MeasID).val(results.rows.item(i).Value);
				 }
				 catch(err)
				 {
				 }
				 
			 }
			 
		 }
		  setTimeout(function(){$('#popupEditIssue').popup('open');},500)
         $('#popupMenu').popup('close'); 
	  
  }
  
  
  

  
  //EDIT FAULT
    function updateFault()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QueryUpdateFault, errorCB,SuccesQueryUpdateFault);
	
	 
  }
  
    function QueryUpdateFault(tx)
  {
	   var FaultID=$("#steptoedit").val();
	    var Component=$("#select-editcomponent").val();
		var Fault=$("#select-editfault").val();
		var Priority=$("#select-editpriority").val();
		var Comments=$("#textarea-editcomments").val();
		if(Component!="0" && Fault!="0" && Priority!="0")
		{
			tx.executeSql('UPDATE TEMPSUBMITTEDSTEPS SET Component="'+Component+'", Fault="'+Fault+'", Priority="'+Priority+'", Comments="'+Comments+'" WHERE FaultID="'+FaultID+'"');
			
		}
		else
		{
			navigator.notification.alert("Please select priority", null, 'FieldTracker', 'Accept');
		}

	  
   }
   
      function SuccesQueryUpdateFault()
   {
	   //alert("updated");
	   getissues();
	   $('#popupEditIssue').popup('close'); 
   }
  
  //DELETE FAULT
    function DeleteFault()
  {
	 // alert("aki");
	  var FaultID=$("#steptoedit").val();
	  //alert(FaultID);
	  setTimeout(function(){$('#popupDelete').popup('open');},500)
         $('#popupMenu').popup('close');
	  //alert(FaultID);
  }
  
     function DeleteFaults()
  {
	  $('#bodyissues').html("");
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QueryDeleteFault, errorCB,SuccesQueryDelteFault);
	
	 
  }
  
    function QueryDeleteFault(tx)
  {
	  
	   var FaultID=$("#steptoedit").val();
	   //alert(FaultID);
	   FaultID=$.trim(FaultID);
       var query="DELETE FROM TEMPSUBMITTEDSTEPS  WHERE FaultID='"+FaultID+"'";
	  // alert(query);
	   tx.executeSql(query); 
	  
   }
   
      function SuccesQueryDelteFault()
   {
	  // alert("Deleted");
	   getissues();
	   $('#popupDelete').popup('close'); 
   }
   
   //ON FAIL MEDIA PROCESS
       function onFail(message) {
      alert('Error: ' + message);
    }
	
	
function resOnError(error) {
    alert(error.code);
}
   
   // TAKE PHOTO
      function capturePhoto() {
      // Toma la imagen y la retorna como una string codificada en base64
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 80,
	    destinationType : Camera.DestinationType.FILE_URI});
    }
	
	    function onPhotoDataSuccess(imageData) {
      // Descomenta esta linea para ver la imagen codificada en base64
      // console.log(imageData);
	   movePic(imageData);
	
     
           
    }
	

//GET PHOTO FROM LIBRARY
    function getPhoto(source) {
      // Retorna la ruta del fichero de imagen desde el origen especificado
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 80, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }
	
	    function onPhotoURISuccess(imageURI) {
	  
	   movePic(imageURI);
    }

	//SAVE PHOTO TO DATABASE AND LOCAL STORAGE
	function movePic(file){
		//alert(file); 
 
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
} 

//CAPTURE VIDEO

function captureVideo()
	{
		 navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});
	}
	
	        // Called when capture operation is finished
    //
    function captureSuccess(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            uploadFile(mediaFiles[i]);
        }
    }
	
	    // Called if something bad happens.
    //
    function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
    }
	
		 // storage video files 
    function uploadFile(mediaFile) {
		var temp=mediaFile.fullPath;
		var temptwo=mediaFile.fullPath;
		temp = temp.substring(0,5);
		temptwo=temptwo.substring(6);
		var completepath=temp.concat("///",temptwo);
		moveVid(completepath);

		
		
	}
	


//GET VIDEO FROM GALLERY

function getVideo(source) {
      // Retorna la ruta del fichero de imagen desde el origen especificado
      navigator.camera.getPicture(onVideoURISuccess, onFail, { quality: 80, 
        destinationType: destinationType.FILE_URI,
        sourceType: source, mediaType:1 });
    }
	
		    function onVideoURISuccess(imageURI) {
	  moveVid(imageURI)
    }
	
		//SAVE VIDEO TO DATABASE AND LOCAL STORAGE
	
	function moveVid(file){ 
    window.resolveLocalFileSystemURI(file, resolveOnSuccessVid, resOnError); 
} 

//Callback function when the file system uri has been resolved
function resolveOnSuccessVid(entry){ 
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".mp4";
    var myFolderApp = ".FieldTracker";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( myFolderApp,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.copyTo(directory, newFileName, function(entry){ successMove(entry,"video") }, resOnError);
                    },
                    resOnError);
                    },
    resOnError);
}

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry){ 
   
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = ".FieldTracker";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( myFolderApp,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.copyTo(directory, newFileName,  function(entry){ successMove(entry,"photo") }, resOnError);
                    },
                    resOnError);
                    },
    resOnError);
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry,type) {
	
	//alert(entry.toURL()+" "+type);
	if(type=="video")
	{
		saveVideotemp(entry.toURL());

	}
	else if(type=="photo")
	{
		savePhototemp(entry.toURL());
		
	}
    //I do my insert with "entry.fullPath" as for the path
}

//SAVE PHOTO URL TO DATABASE
function savePhototemp(photopath)
{
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
           db.transaction(function(tx){ QueryPhotoTemp(tx,photopath) }, errorCB);
}


function QueryPhotoTemp(tx,photopath)
{
	//var code64=encodeImageUri(photopath);
	//alert(code64);
	
	var SubmitID=sessionStorage.submitID;
	var StepID=sessionStorage.currentStep;
	var query='INSERT INTO TEMPMEDIA (SubmitID,StepID,FileType,FileName,Path) VALUES ("'+SubmitID+'","'+StepID+'","image"," ","'+photopath+'")';
	//alert(query);
	tx.executeSql(query);
	$('#popupPhotoOptions').popup('close');
	navigator.notification.alert("Photo Saved", null, 'FieldTracker', 'Accept');
	
}

//SAVE VIDEO URL TO DATABASE
function saveVideotemp(videopath)
{
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
           db.transaction(function(tx){ QueryVideoTemp(tx,videopath) }, errorCB);
}

function QueryVideoTemp(tx,videopath)
{
	//alert(videopath);
	var SubmitID=sessionStorage.submitID;
	var StepID=sessionStorage.currentStep;
	var FileType="video";
	
	var query='INSERT INTO TEMPMEDIA (SubmitID,StepID,FileType,FileName,Path) VALUES ("'+SubmitID+'","'+StepID+'","video"," ","'+videopath+'")';
	//alert(query);
	tx.executeSql(query);
	$('#popupVideoOptions').popup('close');
	navigator.notification.alert("Video Saved", null, 'FieldTracker', 'Accept');
	
}

function fillcustomfields()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
     db.transaction(Querycustomfields, errorCB);
	
}

function Querycustomfields(tx)
{
	var StepID=sessionStorage.currentStep;
	
   var query="SELECT * FROM STEP2MEAS WHERE StepID='"+StepID+"'";
    tx.executeSql(query, [], QuerycustomfieldsSuccess, errorCB);	  
	  		
}

function QuerycustomfieldsSuccess(tx,results)
{
	var len=results.rows.length;
	//alert(len);
	if(len>0)
	{
		//$('#popupAddIssue').css('overflow-y', 'scroll'); 
		var dbtwo = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       dbtwo.transaction(function(tx){ searchallcustoms(tx,results) }, errorCB);
	}
	else
	{
		$("#drawcustomfields").html('');
		$("#Editdrawcustomfields").html('');
	}
	//for (var i=0; i<len; i++){
		//alert(results.rows.item(i).MeasID);
	//}
	
	
	
}

function searchallcustoms(tx,resultsfsteps)
{
	var len=resultsfsteps.rows.length;
	
	//alert(len);
	var query="SELECT * FROM MEASUREMENTS WHERE ";
	var counter=0;
	for (var i=0; i<len; i++){
		if(counter==0)
		{
			query+=" MeasID='"+resultsfsteps.rows.item(i).MeasID+"'";
			
		}
		else
		{
			query+=" OR MeasID='"+resultsfsteps.rows.item(i).MeasID+"'";
			
		}
		
		counter++;
		
		
	}
	 //alert(query);
	 tx.executeSql(query, [], searchallcustomsSuccess, errorCB);
	
	
}

function searchallcustomsSuccess(tx,results)
{
	sessionStorage.currentDraws=results;
	var len=results.rows.length;
	var drawcustomfields='';
	var editdrawcustomfields='';
    for (var i=0; i<len; i++){
		var idfield=results.rows.item(i).MeasID;
		
		var lbl=results.rows.item(i).MeasDesc;
		//alert(results.rows.item(i).FieldType);
		if(results.rows.item(i).FieldType=="D")
		{
			drawcustomfields+='<label for="'+idfield+'">'+lbl+':</label><select name="'+idfield+'" id="'+idfield+'"></select>';
			editdrawcustomfields+='<label for="E'+idfield+'">'+lbl+':</label><select name="E'+idfield+'" id="E'+idfield+'"></select>';
		}
		else if(results.rows.item(i).FieldType=="T")
		{
			drawcustomfields+='<label for="'+idfield+'" >'+lbl+':</label><input type="text" data-clear-btn="true" name="'+idfield+'" id="'+idfield+'" value="">';
			editdrawcustomfields+='<label for="E'+idfield+'" >'+lbl+':</label><input type="text" data-clear-btn="true" name="E'+idfield+'" id="E'+idfield+'" value="">';
			
			
		}
		//alert(drawcustomfields);
		$("#drawcustomfields").html(drawcustomfields);
		$("#Editdrawcustomfields").html(editdrawcustomfields);
		
		
		//$('#ALARM').selectmenu('refresh');
		
		//$("#popupAddIssue").popup("open");
		
	}
	FillSelectsdraw(results);
	
		


}

function FillSelectsdraw(results)
{
	var len=results.rows.length;
	for(var i=0; i<len; i++){
		var idfield=results.rows.item(i).MeasID;
		if(results.rows.item(i).FieldType=="T")
		{
			$('#'+idfield).textinput();
			$('#E'+idfield).textinput();
			
		}
		else if(results.rows.item(i).FieldType=="D")
		{
			
			drawselectoptions(results.rows.item(i).MeasID);
		}
		
	}
	
}

function drawselectoptions(MeasID)
{
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
           db.transaction(function(tx){ Querydrawselectoptions(tx,MeasID) }, errorCB);
	
}

function Querydrawselectoptions(tx,MeasID)
{
	   var query="SELECT * FROM MEASDATA WHERE MeasID='"+MeasID+"'";
    tx.executeSql(query, [], QuerydrawselectoptionsSuccess, errorCB);
}

function QuerydrawselectoptionsSuccess(tx,results)
{
	var len=results.rows.length;
	if(len>0)
	{
	var MeasID=results.rows.item(0).MeasID;
	var Edithtml='<option value="0">Choose a option</option>';
	for(var i=0; i<len; i++){
		 Edithtml+='<option value="'+results.rows.item(i).DropDownData+'">'+results.rows.item(i).DropDownData+'</option>';
	//	alert(results.rows.item(i).DropDownData);
		}
		//alert(Edithtml);
		
		$("#"+MeasID).html(Edithtml);
		
		$("#"+MeasID).prop('selectedIndex', 0);
		$("#E"+MeasID).html(Edithtml);
		$("#E"+MeasID).prop('selectedIndex', 0);
		
	}
	$('.ui-page').trigger('create');  

	
}


function drawonchangecomponent()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Querydrawonchangecomponent, errorCB);
	
}

function Querydrawonchangecomponent(tx)
{
	var compid=$("#select-addcomponent").val();
	//alert(compid);
	if(compid!="0")
	{
		 var query="SELECT * FROM COMP2MEAS WHERE CompID='"+compid+"'";
	
    tx.executeSql(query, [], QuerydrawonchangecomponentSuccess, errorCB);
	
	}
	else
	{
		$('#compdrawcustomfields').html('');
	}
		
	
}

function QuerydrawonchangecomponentSuccess(tx,results)
{
	

	var len=results.rows.length;
	
	if(len>0)
	{
		var dbtwo = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    	dbtwo.transaction(function(tx){ norepeatcustoms(tx,results) }, errorCB);
	}
	else
	{
		$('#compdrawcustomfields').html('');
	}
}
	
	function norepeatcustoms(tx,resultsComp)
	{
		var StepID=sessionStorage.currentStep;
	
   var query="SELECT * FROM STEP2MEAS WHERE StepID='"+StepID+"'";

		tx.executeSql(query, [], function(tx,results){ QuerynorepeatcustomsSuccess(tx,results,resultsComp) }, errorCB);
		
	}
	
	function QuerynorepeatcustomsSuccess(tx,results,resultsComp)
	{
		//alert("entro");
		var len=results.rows.length;
		var lencomp=resultsComp.rows.length;
		var exists=0;
		if(len>0)
		{
					 for (var i=0; i<lencomp; i++){
			 exists=0;
			  for (var z=0; z<lencomp; z++){
				  if(results.rows.item(z).MeasID==resultsComp.rows.item(i).MeasID)
				  {
					  exists=1;
					 // alert("Existe repetido: "+results.rows.item(z).MeasID);
					  
				  }
				
			  }
			  if(exists==0)
			  {
				  AppendCustomFields(resultsComp.rows.item(i).MeasID);
				  
			  }
			
				  
			 
		 }
			
		}
		else
		{
			 for (var i=0; i<lencomp; i++){
				 AppendCustomFields(resultsComp.rows.item(i).MeasID);
				 
			 }
			
			
		}

		
		//alert("step:"+len+" comp:"+lencomp);
		
	}
	//alert(len);
	
	


function AppendCustomFields(MeasID)
{
	//alert("openappend "+MeasID);
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       db.transaction(function(tx){ AppendCustomFieldsQuery(tx,MeasID) }, errorCB);
	
}

function AppendCustomFieldsQuery(tx,MeasID)
{
	
	var query="SELECT * FROM MEASUREMENTS WHERE MeasID='"+MeasID+"'";
	//alert(query);
	
    tx.executeSql(query, [], AppendCustomFieldsQuerySuccess, errorCB);
	
}

function AppendCustomFieldsQuerySuccess(tx,results)
{
	var len=results.rows.length;
	var len=results.rows.length;
	var drawcustomfields='';
    for (var i=0; i<len; i++){
		var idfield=results.rows.item(i).MeasID;
		
		var lbl=results.rows.item(i).MeasDesc;
		//alert(results.rows.item(i).FieldType);
		if(results.rows.item(i).FieldType=="D")
		{
			drawcustomfields+='<label for="'+idfield+'">'+lbl+':</label><select name="'+idfield+'" id="'+idfield+'"></select>';
			
		}
		else if(results.rows.item(i).FieldType=="T")
		{
			drawcustomfields+='<label for="'+idfield+'" >'+lbl+':</label><input type="text" data-clear-btn="true" name="'+idfield+'" id="'+idfield+'" value="">';
		
		}
	}
	 
		$('#compdrawcustomfields').append(drawcustomfields);
		$('.ui-page').trigger('create'); 
		for (var i=0; i<len; i++){
		 if(results.rows.item(i).FieldType=="D")
		 {
			 //alert("aki");
			drawselectoptionscomp(results.rows.item(i).MeasID); 
		 }
	 }

		 
	//alert(len);
}

function drawselectoptionscomp(MeasID)
{
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
           db.transaction(function(tx){ Querydrawselectoptionscomp(tx,MeasID) }, errorCB);
	
}

function Querydrawselectoptionscomp(tx,MeasID)
{
	   var query="SELECT * FROM MEASDATA WHERE MeasID='"+MeasID+"'";
	  // alert(query);
    tx.executeSql(query, [], QuerydrawselectoptionsSuccesscomp, errorCB);
}

function QuerydrawselectoptionsSuccesscomp(tx,results)
{
	var len=results.rows.length;
	if(len>0)
	{
	var MeasID=results.rows.item(0).MeasID;
	var Edithtml='<option value="0">Choose a option</option>';
	for(var i=0; i<len; i++){
		 Edithtml+='<option value="'+results.rows.item(i).DropDownData+'">'+results.rows.item(i).DropDownData+'</option>';
		//alert(results.rows.item(i).DropDownData);
		}
		//alert(Edithtml);
		
		$("#"+MeasID).html(Edithtml);
		
		$("#"+MeasID).prop('selectedIndex', 0);

		
	}
	$('.ui-page').trigger('create');  

	
}






  
  

///////=============================<<<<<<<<<<<< END REPORT ISSUES PAGE  >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= PHOTO GALLERY TEMP PAGE =========================================>>>>>>>>>>>///////

function fillgallerytemp()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       db.transaction(Queryphototemp, errorCB);
	
}

function Queryphototemp(tx)
{
	var SubmitID=sessionStorage.submitID;
	var StepID=sessionStorage.currentStep;
	var query="SELECT * FROM TEMPMEDIA WHERE SubmitID='"+SubmitID+"' AND StepID='"+StepID+"' AND FileType='image' ";
	//alert(query);
	tx.executeSql(query, [], QueryphototempSuccess, errorCB);
	
}

function QueryphototempSuccess(tx,results)
{
	//alert(results.rows.length +" "+ results.rows.item(0).FileType+ " " + results.rows.item(0).Path );
	var ccc=0;
	var outputhtml='<div class="gallery-row">';
	for (var i=0; i<results.rows.length; i++)
	{
		ccc++;
		outputhtml+='<div class="gallery-item"><a href="'+results.rows.item(i).Path+'" rel="external"><img src="'+results.rows.item(i).Path+'" alt="Image 001" /></a></div>';
			// alert(idcheck+" "+results.rows.item(i).StepID);
			if(ccc>3)
			{
				outputhtml+='</div><div class="gallery-row">';
				ccc=0;
			
			}
	}
		if(ccc!=0)
		{
			outputhtml+='</div>';
		}
		$("#galltemp").html(outputhtml);
		//$("#galltemp").html(outputhml);
	
}

///////=============================<<<<<<<<<<<< END PHOTO GALLERY TEMP PAGE  >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<============================= VIDEO GALLERY TEMP PAGE =========================================>>>>>>>>>>>///////
function fillgalleryvidtemp()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       db.transaction(Queryvideotemp, errorCB);
	
}

function Queryvideotemp(tx)
{
	var SubmitID=sessionStorage.submitID;
	var StepID=sessionStorage.currentStep;
	var query="SELECT * FROM TEMPMEDIA WHERE SubmitID='"+SubmitID+"' AND StepID='"+StepID+"' AND FileType='video'";
	//alert(query);
	tx.executeSql(query, [], QueryvideotempSuccess, errorCB);
	
}


function QueryvideotempSuccess(tx,results)
{
	//alert(results.rows.length +" "+ results.rows.item(0).FileType+ " " + results.rows.item(0).Path );
	var ccc=0;
	var tb = $('#bodyvideo-temp');
	var outputhtml='';
	var pathvideo="";
		
	
	for (var i=0; i<results.rows.length; i++)
	{
		ccc++;
		pathvideo=results.rows.item(i).Path;
		
		outputhtml+='<tr><td>video&nbsp;'+ccc+'</td><td><a href="javascript:playpathvideo('+"'"+pathvideo+"'"+');" data-icon="video" data-iconpos="left" >Play</a></td><t/r>';
		
	}

		   
 		tb.empty().append(outputhtml);
	 $("#table-tempvideo").table("refresh");
	 $("#table-tempvideo").trigger('create');
		//$("#galltemp").html(outputhml);
	
}

function playpathvideo(path)
{
	var xhtml='<video width="50%" height="50%" controls><source src="'+path+'" type="video/mp4">Your browser does not support the video tag.</video>';
	$("#videocontainer").html(xhtml);
	$("#popupPlayVideo").popup("open",{history:false});

	
	//videocontainer

	//alert(path);
}

///////=============================<<<<<<<<<<<< END VIDEO GALLERY TEMP PAGE  >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<============================= HISTORY PROCEDURES PAGE =========================================>>>>>>>>>>>///////

//FILL TABLE
function fillhistorylist()
{
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querytohistorylist, errorCB);
	
}

function Querytohistorylist(tx)
{
	showModal();
	  var datesubmith=InsertFormatDate($("#datesubmith").val());
	  var datesubmithfrom=InsertFormatDate($("#datesubmithfrom").val());
	// alert(datesubmith);
	   var chkone=$("#checkbox-sync").is(':checked') ;
	   var chktwo=$("#checkbox-nosync").is(':checked') ;

	   var querytosend="SELECT submittedprocs.*, procedures.Name FROM submittedprocs INNER JOIN procedures ON submittedprocs.ProcID = procedures.ProcID WHERE SubmitDate BETWEEN '"+datesubmithfrom+"' AND '"+datesubmith+"'";
 
	   if(chktwo==true && chkone==false)
		{
			querytosend="SELECT submittedprocs.*, procedures.Name FROM submittedprocs INNER JOIN procedures ON submittedprocs.ProcID = procedures.ProcID WHERE submittedprocs.Sync='no' AND SubmitDate BETWEEN '"+datesubmithfrom+"' AND '"+datesubmith+"'";
	   }
	    else if(chktwo==false && chkone==true)
	   {
		   
			querytosend="SELECT submittedprocs.*, procedures.Name FROM submittedprocs INNER JOIN procedures ON submittedprocs.ProcID = procedures.ProcID WHERE submittedprocs.Sync='yes' AND SubmitDate BETWEEN '"+datesubmithfrom+"' AND '"+datesubmith+"'";
	   }
		//alert(querytosend);
		tx.executeSql(querytosend, [], QuerytohistorylistSuccess, errorCB);
	
}

function QuerytohistorylistSuccess(tx,results)
{
		 var len = results.rows.length;
		// alert(len);
	 var tb = $('#bodyhistory-list');
	 var tablehtml="";
	 var status="";
	 for (var i=0; i<results.rows.length; i++){
   if(results.rows.item(i).Status=="0")
   {
	   status="Complete";
   }
   else
   {
	   status="Incomplete";
   }
	   
	   tablehtml+='<tr data-name="'+results.rows.item(i).SubmitID+'"><td>'+results.rows.item(i).Name+'</td><td>'+status+'</td><td>'+results.rows.item(i).UserID+'</td><td>'+ShowFormatDateTime(results.rows.item(i).Time)+'</td><td>'+results.rows.item(i).Sync+'</td></tr>';
	   

   
   
		 //alert(results.rows.item(i).lastp+" "+results.rows.item(i).Name+" "+results.rows.item(i).ProcID);
	 }
	 //alert(tablehtml);
	  tb.empty().append(tablehtml);
	 $("#table-history").table("refresh");
	 $("#table-history").trigger('create');
	//alert(results.rows.length);
	hideModal();
}

function getprocedureidsub()
{
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querygetprocedureidsub, errorCB);
}

function Querygetprocedureidsub(tx)
{
	var SubmitID=$("#idprohist").val();
	  var query="SELECT * FROM SUBMITTEDPROCS WHERE SubmitID='"+SubmitID+"'";
	 // alert(query);
	  tx.executeSql(query, [],  QuerygetprocedureidsubSuccess, errorCB);
	
	
}

function QuerygetprocedureidsubSuccess(tx, results)
{
	  var len = results.rows.length;
	  
	 // alert(len);
	  
	  if(len==1)
	  {
		  sessionStorage.currentProcedure=results.rows.item(0).ProcID;
	  }
	
}

function openhistory()
{
		var idsubmit=$("#idprohist").val();
		sessionStorage.submitID=idsubmit;
		sessionStorage.nameprocedure=$("#chnamep").val();
		//alert(idsubmit);
	
	if(idsubmit!="0")
	{
		
		navbyapp('history');

		
	}
	else
	{
		navigator.notification.alert("Please select a procedure", null, 'FieldTracker', 'Accept');
		
	}
	
}

function deletesubmitid()
{
	var SubmitID=$("#idprohist").val();
	if(SubmitID=="0")
	{
		navigator.notification.alert("Please select a procedure", null, 'FieldTracker', 'Accept');
	}
	else
	{
		$('#popupDeleteSubmit').popup('open');
	}
	
	
}

function DeleteSubmitpro()
{

	
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QueryDeleteSubmit, errorCB,SuccesQueryDeleteSubmit);

}
//voys
function QueryDeleteSubmit(tx)
{
	$('#popupDeleteSubmit').popup('close');
	 var query="";
	 var SubmitID=$("#idprohist").val();
	 query="DELETE FROM SUBMITTEDSTEPS  WHERE SubmitID='"+SubmitID+"'";
	tx.executeSql(query);
	 query="DELETE FROM SUBMITTEDPROCS WHERE SubmitID='"+SubmitID+"'";
	 tx.executeSql(query);
	
}

function SuccesQueryDeleteSubmit()
{
	
	fillhistorylist();
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(DeleteMedis, errorCB);

}

function DeleteMedis(tx)
{
		var SubmitID=$("#idprohist").val();
		
	  var query="SELECT * FROM MEDIA WHERE SubmitID='"+SubmitID+"'";
	  //alert(query);
	  tx.executeSql(query, [],  QueryDeleteMedias, errorCB);
	
}

function QueryDeleteMedias(tx,results)
{
	
	 // alert("entro");
	 var SubmitID=$("#idprohist").val();
	   var len = results.rows.length;
	 // alert(len);
	  if(len!="0")
	  {
		  for (var i=0; i<results.rows.length; i++){
			  var FileName=results.rows.item(i).Path;
		  window.resolveLocalFileSystemURI(FileName,gotRemoveFileEntry, failre);  
		  
		  }
		  
	  }
	   tx.executeSql("DELETE FROM MEDIA WHERE SubmitID='"+SubmitID+"'");
	   $("#idprohist").val("0");
	   	hideModal();
		navigator.notification.alert("Deleted", null, 'FieldTracker', 'Accept');
	
}

//function removefile(fileSystem,FileName){
//	alert(FileName);
   // fileSystem.root.getFile(FileName, {create: false, exclusive: false}, gotRemoveFileEntry, failre);
//}

function gotRemoveFileEntry(fileEntry){
    console.log(fileEntry);
	//alert(fileEntry);
    fileEntry.remove(successre, failre);
}

function successre(entry) {
	alert("Removal Succeeded");
    console.log("Removal succeeded");
}

function failre(error) {
	alert("error "+error.code);
    console.log("Error removing file: " + error.code);
}




///////=============================<<<<<<<<<<<< END HISTORY PROCEDURES PAGE  >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<============================= HISTORY PROCEDURES STEPS PAGE =========================================>>>>>>>>>>>///////

      function fillstepsubmit()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querystepssubmit, errorCB);
	  
  }
  
    function Querystepssubmit(tx)
  {
	  showModal();
	   var idprocedure=sessionStorage.currentProcedure;
	   var query="SELECT StepID, OrdNum, Text, Type, Num, SelAllComps,SelAllFaults FROM PROCEDURESTEPS WHERE (ProcID = '"+idprocedure+"')  ORDER BY OrdNum";
	   tx.executeSql(query, [], QuerystepssubmitSuccess, errorCB);
	  
  }
  
    function QuerystepssubmitSuccess(tx,results)
  {
	    var len = results.rows.length;
	 
	  if(len=="0")
	  {
		   				hideModal();
		     			 navigator.notification.confirm(
    					'No registered Steps',      // mensaje (message)
    						onConfirms,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   							 'FieldTracker',            // titulo (title)
        				'Exit'          // botones (buttonLabels)
        				);
    

		
		  
	  }
	  else
	  {
		 filltablestepsubmit(results); 
	  }
	  
  }
  
  	function filltablestepsubmit(results)
	{

			 fillsubmitpro(results);
		
	}
	
	      function fillsubmitpro(results)
   {
	   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
		db.transaction(function(tx){ Querygetsubmitissues(tx,results) }, errorCB);
	
	   
	   
   }
   
      function Querygetsubmitissues(tx,resultsteps)
   {
	   showModal();
	  // alert(resultsteps.rows.length);
	 // alert("fff");
	  var SubmitID=sessionStorage.submitID;
	  
	  var query="SELECT * FROM SUBMITTEDSTEPS WHERE SubmitID='"+SubmitID+"'";
	  tx.executeSql(query, [],  function(tx,results){ QuerygetsubmitissuesSuccess(tx,results,resultsteps) }, errorCB);
	 
   }
   
   function QuerygetsubmitissuesSuccess(tx,results,resultsteps)
	{
		
		//alert("entro"+resultsteps.rows.length+" " +results.rows.length);

         var specialequipment=false;
		var introduction=false;
		var stepshtml='';	
		 var tb = $('#stepsbodyh');
	
		// Search For Special equipment required and Introduction.
		 for (var i=0; i<resultsteps.rows.length; i++){
			 
	
			 
			 if(resultsteps.rows.item(i).Type=="Required Equipment")
			 {
				 specialequipment=true;
				 
			 }
			 else if(resultsteps.rows.item(i).Type=="Introduction")
			 {
				 introduction=true;
			 }
			 
			 
			 
		 }
		 
		  if (specialequipment == true)
            {
				
				stepshtml+="  <tr><td><b>SPECIAL EQUIPMENT REQUIRED</b></td><td></td></tr>";
				stepshtml+="<tr><td>   </td></tr>";
				for (var i=0; i<resultsteps.rows.length; i++){
					if(resultsteps.rows.item(i).Type=="Required Equipment")
					{
						stepshtml+="<tr><td>"+resultsteps.rows.item(i).Text+"</td><td></td></tr>";
					}
				}
				stepshtml+="<tr><td>   </td><td></td></tr>";
				
			}
				  if (introduction == true)
            {
				stepshtml+="<tr><td>   </td><td></td></tr>";
				stepshtml+="  <tr><td><b>INTRODUCTION</b></td><td></td></tr>";
				stepshtml+="<tr><td>   </td><td></td></tr>";
				for (var i=0; i<resultsteps.rows.length; i++){
					if(resultsteps.rows.item(i).Type=="Introduction")
					{
						stepshtml+="<tr><td>"+resultsteps.rows.item(i).Text+"</td><td></td></tr>";
					}
				}
				stepshtml+="<tr><td>   </td><td></td></tr>";
				
			}
			
			stepshtml+="<tr><td><b>PROCEDURE</b></td><td></td></tr>";
			stepshtml+="<tr><td>   </td><td></td></tr>";
			var style='style="background:#FFD7D8; bordercolor:red; border:medium;"';
			var ischeck='checked="checked"';
			for (var i=0; i<resultsteps.rows.length; i++){
				style="";
				ischeck="";
				//alert(results.rows.length);
				for(var y=0; y<results.rows.length; y++)
				{
					if(results.rows.item(y).StepID == resultsteps.rows.item(i).StepID)
					{
						
						if(results.rows.item(y).OK=="true")
						{

							
						ischeck='checked="checked"';
							
						}
						else
						{
						style='style="background:#FFD7D8; bordercolor:red; border:medium;"';
						}
					
						
					}
					
					//alert(results.rows.item(y).StepID+" "+results.rows.item(y).OK);					
				}
				
					if(resultsteps.rows.item(i).Type=="Caution")
					{
					stepshtml+='<tr><td><table><tr><td><img src="img/alert.png" ></td><td>'+resultsteps.rows.item(i).Text+'</td></tr></table></td><td></td></tr>';
					}
					else if(resultsteps.rows.item(i).Type=="Warning")
					{
						stepshtml+='<tr><td><table><tr><td><img src="img/Stop.png" ></td><td>'+resultsteps.rows.item(i).Text+'</td></tr></table></td><td></td></tr>';
						
					}
					else if(resultsteps.rows.item(i).Type=="Note")
					{
						stepshtml+='<tr><td><table><tr><td><img src="img/note.png" ></td><td>'+resultsteps.rows.item(i).Text+'</td></tr></table></td><td></td></tr>';
					}
					else if(resultsteps.rows.item(i).Type=="Substep")
					{
						//alert('<tr><td><label class="ui-icon-delete ui-shadow-icon"><input type="checkbox" name="" id="">'+results.rows.item(i).Num+' &nbsp;'+results.rows.item(i).Text+'</label> </td><td><a href="javascript:reportissue('+results.rows.item(i).StepID+');" data-theme="b" data-role="button" data-inline="true" data-icon="alert" data-iconpos="right">Report Issue</a></td></tr>');
						
						stepshtml+='<tr><td><label id="lbl2'+resultsteps.rows.item(i).StepID+'" class="ui-icon-delete ui-shadow-icon" '+style+' ><input type="checkbox"    name="'+resultsteps.rows.item(i).StepID+'" id="'+resultsteps.rows.item(i).StepID+'" '+ischeck+' >'+resultsteps.rows.item(i).Num+' &nbsp;'+resultsteps.rows.item(i).Text+'</label> </td><td><a href="javascript:reportissueh('+"'"+resultsteps.rows.item(i).StepID+"'"+');" data-theme="b" data-role="button" data-inline="true" data-icon="alert" data-iconpos="right">Report Issue</a></td></tr>';
					}
					else if(resultsteps.rows.item(i).Type=="Step")
					{
				       stepshtml+='<tr><td><label id="lbl2'+resultsteps.rows.item(i).StepID+'" class="ui-icon-delete ui-shadow-icon" '+style+' ><input type="checkbox"  name="'+resultsteps.rows.item(i).StepID+'" id="'+resultsteps.rows.item(i).StepID+'" '+ischeck+'>'+resultsteps.rows.item(i).Num+' &nbsp;'+resultsteps.rows.item(i).Text+'</label> </td><td><a href="javascript:reportissueh('+"'"+resultsteps.rows.item(i).StepID+"'"+');" data-theme="b" data-role="button" data-inline="true" data-icon="alert" data-iconpos="right">Report Issue</a></td></tr>';
					}
				
			}
			//alert(stepshtml);
			//$("#stepsbody").html(stepshtml);
			tb.empty().append(stepshtml);
			$("#table-resulth").table("refresh");
	 		$("#table-resulth").trigger('create');
			 hideModal();	
		
		
	}
	
		function reportissueh(idstep)
		{
			//alert(idstep);
			searchtextandnum(idstep);
		sessionStorage.currentStep=idstep;
		$(':mobile-pagecontainer').pagecontainer('change', '#pageReportHistory', {
        transition: 'slide',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
  		 	 });
		}
		
		
			//IF WHATTODO IS TRUE CHECK FOR ISSUES ON SUBMIT ID
		
		   function fillredlablesh()
   {
	   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querygetredissuesh, errorCB);
	   
	   
   }
   
      function Querygetredissuesh(tx)
   {
	    showModal();
	  var SubmitID=sessionStorage.submitID;
	 var query="SELECT * FROM SUBMITTEDSTEPS WHERE SubmitID='"+SubmitID+"' AND OK='false'";
	  //alert(query);
	  tx.executeSql(query, [], QuerygetredissuesSuccessh, errorCB);
   }
   
   	function QuerygetredissuesSuccessh(tx,results)
	{
		var len = results.rows.length;
		var x="";
		 if(len>0)
	   {
		    for (var i=0; i<results.rows.length; i++){
				//alert(results.rows.item(i).StepID);
		   x=document.getElementById("lbl2"+results.rows.item(i).StepID);	
		   x.style.backgroundColor="#FFD7D8";
		   x.style.borderColor="red";
		   x.style.border="medium";
		
			
			}
		   
	   }
	   
	   hideModal();
		
	}
	function submitprocedureh()
	{
		checkIssuesStepsh();
		
	}
	
		function checkIssuesStepsh()
	{
		   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
           db.transaction(QueryCheckIssuesStepsh, errorCB);
	}
	
		function QueryCheckIssuesStepsh(tx)
	{
		//showModal();
		var SubmitID=sessionStorage.submitID;
		var query="SELECT * FROM SUBMITTEDSTEPS WHERE SubmitID='"+SubmitID+"'";
	  	tx.executeSql(query, [], QueryCheckIssuesStepsSuccessh, errorCB);
	}
	
		function QueryCheckIssuesStepsSuccessh(tx,results)
	{
		$("#Statushiddenh").val("0");
		var incorrectIssue=false;
		var len = results.rows.length;
			$('#table-resulth').find('input[type="checkbox"]').each(function () {
     var idcheck=  $(this).attr('id');
	
		if($(this).is(':checked')==false)
		{
		incorrectIssue=true;
		for (var i=0; i<results.rows.length; i++){
			// alert(idcheck+" "+results.rows.item(i).StepID);
			if(idcheck==results.rows.item(i).StepID)
			{
				incorrectIssue=false;
				break;
			}
		}
		
	} 

	  });
	  
	  if (incorrectIssue==true)
	  {
		  $("#Statushiddenh").val("1");
		  $('#popupnoissueh').popup('open');
		  
	  }
	  else
	  {
		  SaveSubmith();
	  }
		
	}
	
	//Save Submit
		function SaveSubmith()
	{
	
	
		  
		$('#popupnoissueh').popup('close');
		 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
          // db.transaction(QuerySaveIssuesStepsh, errorCB);
		   db.transaction(searchtextstepsh, errorCB);
	}
	
	function searchtextstepsh(tx)
	{
		var query="SELECT * FROM PROCEDURESTEPS";
	  	tx.executeSql(query, [], searchtextstepsSuccessh, errorCB);
		
	}
	
	function searchtextstepsSuccessh(tx,results)
	{
		
		saveStepsissuesh(results)
		
	}
	
	function saveStepsissuesh(resultallsteps)
	{
		
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
		db.transaction(function(tx){ QuerySaveIssuesStepsh(tx,resultallsteps) }, errorCB);
	}
	
		function QuerySaveIssuesStepsh(tx,resultallsteps)
	{
		
		var SubmitID=sessionStorage.submitID;
		var query="SELECT * FROM SUBMITTEDSTEPS WHERE SubmitID='"+SubmitID+"'";
	  	//tx.executeSql(query, [], QuerySaveIssuesStepsSuccessh, errorCB);
		tx.executeSql(query, [], function(tx,results){ QuerySaveIssuesStepsSuccessh(tx,results,resultallsteps) }, errorCB);
	}
	
		function QuerySaveIssuesStepsSuccessh(tx,results,resultallsteps)
	{
		var dt = new Date();
		var SubmitDate = dt.toYMD();
		var SubmitTime=dt.toYMDhrs();
		//alert(SubmitDate);
		var status_procedure=$("#Statushiddenh").val();
		var procedurename=sessionStorage.nameprocedure;
		//alert(status_procedure);
		var Text='text step';
		var Num='799';
		var Ok="false";
		var exOK="";
		var StepID="";
		var Component="";
		var Fault="";
		var Priority="";
		var Comments="";
		var exists=0;
		var UserID=sessionStorage.userid;
	 	var ProcID=sessionStorage.currentProcedure;
     	var SubmitID=sessionStorage.submitID;
	 	var FaultID="";
		var query="";
		
	
			$('#table-resulth').find('input[type="checkbox"]').each(function () {
	 FaultID=StepID+new Date().getTime() + Math.random();
     var idcheck=  $(this).attr('id');
	// alert($(this).is(':checked'));
	 	 for (var icont=0; icont<resultallsteps.rows.length; icont++){
					
		if(idcheck==resultallsteps.rows.item(icont).StepID)
					{
						Text=resultallsteps.rows.item(icont).Text;
						Num=resultallsteps.rows.item(icont).Num;
						//break;
						
					}
		 }
		 // alert(Text+" "+Num);
	
		if($(this).is(':checked')==true)
		{
			//alert("is true");
			
				Ok="true";
				exists=0;
				for (var i=0; i<results.rows.length; i++){
					if(idcheck==results.rows.item(i).StepID)
					{
						exists=1;

					}
		  		}
				//alert(exists);
				if(exists==0)
				{
					Ok="true";
						StepID=idcheck;
						Component="";
				Fault="";
				Priority="";
				Comments="";
				//alert('INSERT INTO SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'")');
				tx.executeSql('INSERT INTO SUBMITTEDSTEPS (FaultID,SubmitID,ProcID,StepID,Text,OK,Num,Component,Fault,Priority,Comments) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Text+'","'+Ok+'","'+Num+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'")');
				//alert(query);
				//tx.executeSql(query);
					
				}	
				
						
			
				
				
				

		
		
		} 
		else
		{
			//alert("is false");
			//alert("aki en el else"+idcheck);
		exists=0;
		for (var i=0; i<results.rows.length; i++){
			 
			if(idcheck==results.rows.item(i).StepID)
			{
				exists=1;
				
				if(results.rows.item(i).OK=="true")
				{
					
				Ok="false";
				StepID=results.rows.item(i).StepID;
				Component=results.rows.item(i).Component;
				Fault=results.rows.item(i).Fault;
				Priority=results.rows.item(i).Priority;
				Comments=results.rows.item(i).Comments;
				//alert('DELETE FROM SUBMITTEDSTEPS  WHERE FaultID="'+results.rows.item(i).FaultID+'"');
				tx.executeSql('DELETE FROM SUBMITTEDSTEPS  WHERE FaultID="'+results.rows.item(i).FaultID+'"');
					
				}
				
				
			}
		  }
		 // alert(exists);
			if(exists==0)
			{
				
			}
			
			
		}

	  });
	  //alert(UserID+" "+SubmitDate);
	//  alert('UPDATE SUBMITTEDPROCS SET UserID="'+UserID+'", SubmitDate="'+SubmitDate+'",Time="'+SubmitTime+'", Status="'+status_procedure+'",Sync="no" WHERE SubmitID="'+SubmitID+'"');
	  tx.executeSql('UPDATE SUBMITTEDPROCS SET UserID="'+UserID+'", SubmitDate="'+SubmitDate+'",Time="'+SubmitTime+'", Status="'+status_procedure+'",Sync="no" WHERE SubmitID="'+SubmitID+'"');
	  tx.executeSql('UPDATE SUBMITTEDSTEPS SET Sync="no" WHERE SubmitID="'+SubmitID+'"');
	  verifymediainsubmitted(SubmitID);
	//tx.executeSql('INSERT INTO SUBMITTEDPROCS  (SubmitID,ProcID,UserID,SubmitDate,Comments,Status,Sync) VALUES ("'+SubmitID+'","'+ProcID+'","'+UserID+'","'+SubmitDate+'"," ","'+status_procedure+'","'+"no"+'")');
	
	navigator.notification.confirm(
    					'Updated',      // mensaje (message)
    						onsuccessprocedureh,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   							 'FieldTracker',            // titulo (title)
        				'Accept'          // botones (buttonLabels)
        				);
	 
	 
	
	  
	}
	
	
	   function onsuccessprocedureh(button) {
		 var tb = $('#stepsbodyh');
		 tb.html("");
			    $(':mobile-pagecontainer').pagecontainer('change', '#pageHistoryProc', {
        transition: 'pop',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
	   }
		
   


///////=============================<<<<<<<<<<<< END HISTORY PROCEDURES STEPS PAGE  >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= REPORT ISSUES HISTORY PAGE =========================================>>>>>>>>>>>///////

//Dropdown Components
function fillComponentsSelecth()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoComponentSelecth, errorCB);
	
}

     function QuerytoComponentSelecth(tx)
   {
	  
		     var StepID=sessionStorage.currentStep;
		// alert(sessionStorage.SelAllComps);
	    if(sessionStorage.SelAllComps=="TRUE")
		{
			tx.executeSql("SELECT * FROM COMPONENTS ORDER BY Component", [], GroupsComponentSuccessh, errorCB);
		}
		else
		{
			tx.executeSql("SELECT Steps2Comps.*, Components.ID, Components.Component, Components.CompType FROM Steps2Comps INNER JOIN Components ON Steps2Comps.CompID = Components.ID WHERE Steps2Comps.StepID='"+StepID+"' ORDER BY Components.Component", [], GroupsComponentSuccessh, errorCB);
		}
	   
   }
   
   function GroupsComponentSuccessh(tx, results)
   {
	   	    var len = results.rows.length;
			//alert(len);
	  	var selecthtml='<option value="0">Choose a component</option>';
		var Edithtml='<option value="0">Choose a component</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
            //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
			 selecthtml+='<option value="'+results.rows.item(i).ID+'">'+results.rows.item(i).Component+'</option>';
			 Edithtml+='<option value="'+results.rows.item(i).Component+'">'+results.rows.item(i).Component+'</option>';
			
             }
			// alert("aki");
			 
			 $("#select-addcomponenth").html(selecthtml);
			  $("#select-editcomponenth").html(Edithtml);
			  $('#select-editcomponenth').selectmenu('refresh');
		   $('#select-editcomponenth').selectmenu('refresh', true);
			 $('#select-addcomponenth').selectmenu('refresh');
		   $('#select-addcomponenht').selectmenu('refresh', true);
		// alert("refresco");			
			 
	
		  
	  }
	  else
	  {
		  //navigator.notification.alert("No registered components", null, 'FieldTracker', 'Accept'); 
	  }
	   
   }
   
   //Dropddown Faults
   
    function fillFaultSelecteh()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoFaultSelecteh, errorCB);
	
}

    function QuerytoFaultSelecteh(tx)
   {
	   var Component= $("#select-editcomponenth").val();
	  // alert(Component);
	    if(sessionStorage.SelAllFaults=="TRUE")
		{
			tx.executeSql("SELECT * FROM FAULTS ORDER BY Description", [], GroupsFaultSuccessh, errorCB);
		}
		else
		{
			if(Component=="0")
			{
				 $
			 	 $("#select-editfaulth").html('');
			 	 $('#select-editfaulth').selectmenu('refresh');
		         $('#select-editfaulth').selectmenu('refresh', true);
				
			}
			else
			{
				//alert("SELECT Components.ID AS Expr1, Comps2Faults.FaultID, Faults.* FROM Comps2Faults INNER JOIN Components ON Comps2Faults.ID = Components.ID INNER JOIN Faults ON Comps2Faults.FaultID = Faults.ID WHERE Components.Description='"+Component+"'");
				tx.executeSql("SELECT Components.ID AS Expr1,Components.Component, Comps2Faults.FaultID, Faults.* FROM Comps2Faults INNER JOIN Components ON Comps2Faults.ID = Components.ID INNER JOIN Faults ON Comps2Faults.FaultID = Faults.ID WHERE Components.Component='"+Component+"'", [], GroupsFaultSuccesseh, errorCB);
				
			}
			
			
		}
		
	   
   }
   
      function GroupsFaultSuccesseh(tx, results)
   {
	    var len = results.rows.length;
		//alert(len);
	  var Edithtml='<option value="0">Choose a fault</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
			 Edithtml+='<option value="'+results.rows.item(i).Description+'">'+results.rows.item(i).Description+'</option>';
             }
			// alert(selecthtml);
		
			 $("#select-editfaulth").html(Edithtml);
			 	  $('#select-editfaulth').selectmenu('refresh');
		  $('#select-editfaulth').selectmenu('refresh', true);

		  
	  }
	  else
	  {
		
			 $("#select-editfaulth").html(Edithtml);
			 $('#select-editfaulth').selectmenu('refresh');
		  $('#select-editfaulth').selectmenu('refresh', true);
		  navigator.notification.alert("No registered faults", null, 'FieldTracker', 'Accept'); 
	  }

   }
   
     function SearchPriorityhh()
  {
	  
	  var fault=$("#select-addfaulth").val();
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerySearchPriorityhh, errorCB);
	 
	  
  }
  
  function QuerySearchPriorityhh(tx)
  {
	  var fault=$("#select-addfaulth").val();
	 
	  if(fault=="0")
	  {
		  $("#select-addpriorityh").val("0");
		  $('#select-addpriorityh').selectmenu('refresh');
	  	$('#select-addpriorityh').selectmenu('refresh', true);
		  
	  }
	  else
	  {
		 var query="SELECT * FROM Faults WHERE ID='"+fault+"'";
	  
	  		tx.executeSql(query, [], QuerySearchPrioritySuccesshh, errorCB);
		  
	  }
	  
  }
  
  function QuerySearchPrioritySuccesshh(tx,results)
  {
	  var len = results.rows.length;
	 // alert(len);
	  var priority=results.rows.item(0).Priority;
	 // alert(priority);
	  if(priority=="3 - Low")
	  {
		  $("#select-addpriorityh").val("low");
	  }
	  else if(priority=="2 - Med")
	  {
		  $("#select-addpriorityh").val("medium");
	  }
	  else if(priority=="1 - High")
	  {
		  $("#select-addpriorityh").val("high");
		  
	  }
	  $('#select-addpriorityh').selectmenu('refresh');
	  $('#select-addpriorityh').selectmenu('refresh', true);
	  
  }
  
      function SearchPriorityhhh()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QuerySearchPriorityhhh, errorCB);
	 
	  
  }
  
  function QuerySearchPriorityhhh(tx)
  {
	  var fault=$("#select-editfaulth").val();
	  if(fault=="0")
	  {
		  $("#select-editpriorityh").val("0");
		  $('#select-editpriorityh').selectmenu('refresh');
	  	$('#select-editpriorityh').selectmenu('refresh', true);
		  
	  }
	  else
	  {
		 var query="SELECT * FROM Faults WHERE Description='"+fault+"'";
	  
	  		tx.executeSql(query, [], QuerySearchPrioritySuccesshhh, errorCB);
		  
	  }
	  
  }
  
  function QuerySearchPrioritySuccesshhh(tx,results)
  {
	  var len = results.rows.length;
	  //alert(len);
	  var priority=results.rows.item(0).Priority;
	  if(priority=="3 - Low")
	  {
		  $("#select-editpriorityh").val("low");
	  }
	  else if(priority=="2 - Med")
	  {
		  $("#select-editpriorityh").val("medium");
	  }
	  else if(priority=="1 - High")
	  {
		  $("#select-editpriorityh").val("high");
		  
	  }
	  $('#select-editpriorityh').selectmenu('refresh');
	  $('#select-editpriorityh').selectmenu('refresh', true);
	  
  }
   
   
     function SearchFaulthh()
  {
	  var component=$("#select-addcomponenth").val();
	  if(component!="0" && sessionStorage.SelAllFaults=="FALSE")
	  {
		  fillFaultSelecth();
		  
	  }
	  //alert(component);
	  
  }
   
   function fillFaultSelecth()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoFaultSelecth, errorCB);
	
}

    function QuerytoFaultSelecth(tx)
   {
	  
		   var Component= $("#select-addcomponenth").val();
		   var selecthtml='<option value="0">Choose a fault</option>';
	   //alert(Component);
	    if(sessionStorage.SelAllFaults=="TRUE")
		{
			tx.executeSql("SELECT * FROM FAULTS ORDER BY Description", [], GroupsFaultSuccessh, errorCB);
		}
		else
		{
			if(Component=="0")
			{
				 $("#select-addfaulth").html(selecthtml);
			 	 $("#select-editfaulth").html(selecthtml);
			  	 $('#select-addfaulth').selectmenu('refresh');
		  		 $('#select-addfaulth').selectmenu('refresh', true);
			 	 $('#select-editfaulth').selectmenu('refresh');
		         $('#select-editfaulth').selectmenu('refresh', true);
				
			}
			else
			{
				tx.executeSql("SELECT Components.ID AS Expr1, Comps2Faults.FaultID, Faults.* FROM Comps2Faults INNER JOIN Components ON Comps2Faults.ID = Components.ID INNER JOIN Faults ON Comps2Faults.FaultID = Faults.ID WHERE Components.ID='"+Component+"'", [], GroupsFaultSuccessh, errorCB);
				
			}
			
			
		}
	   
   }
   
      function GroupsFaultSuccessh(tx, results)
   {
	    var len = results.rows.length;
		//alert(len+" nn");
	  var selecthtml='<option value="0">Choose a fault</option>';
	  var Edithtml='<option value="0">Choose a fault</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
			 selecthtml+='<option value="'+results.rows.item(i).ID+'">'+results.rows.item(i).Description+'</option>';
			 Edithtml+='<option value="'+results.rows.item(i).Description+'">'+results.rows.item(i).Description+'</option>';
             }
			 
			 $("#select-addfaulth").html(selecthtml);
			 $("#select-editfaulth").html(Edithtml);
			  	  $('#select-addfaulth').selectmenu('refresh');
		  $('#select-addfaulth').selectmenu('refresh', true);
			 	  $('#select-editfaulth').selectmenu('refresh');
		  $('#select-editfaulth').selectmenu('refresh', true);

		  
	  }
	  else
	  {
		   $("#select-addfaulth").html(selecthtml);
			 $("#select-editfaulth").html(Edithtml);
			  	  $('#select-addfaulth').selectmenu('refresh');
		  $('#select-addfaulth').selectmenu('refresh', true);
			 	  $('#select-editfaulth').selectmenu('refresh');
		  $('#select-editfaulth').selectmenu('refresh', true);
		  navigator.notification.alert("No registered faults", null, 'FieldTracker', 'Accept'); 
	  }
	   
   }
   
   //GET STEP ISSUES
   
         function getissuesh()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querygetissuesh, errorCB);
	  
  }
  
    function Querygetissuesh(tx)
  {
	   showModal();
	   var StepID=sessionStorage.currentStep;
	   var ProcID=sessionStorage.currentProcedure;
       var SubmitID=sessionStorage.submitID;
	  // alert(StepID+" "+ProcID+" "+SubmitID);
	   var query="SELECT * FROM SUBMITTEDSTEPS WHERE StepID='"+StepID+"' AND ProcID='"+ProcID+"' AND SubmitID='"+SubmitID+"'";
	   //alert(query);
	   tx.executeSql(query, [], QuerygetissuesSuccessh, errorCB);
	   
	  
  }
  
    function QuerygetissuesSuccessh(tx, results)
  {
	 var len = results.rows.length;
	// alert(len);
	 var tb = $('#bodyissuesh');
	 var tablehtml="";
	 if(len>0)
	 {
		 	 for (var i=0; i<results.rows.length; i++){
				// alert(results.rows.item(i).Component+"<-->"+results.rows.item(i).Fault);
			//	alert("sal");
	if(results.rows.item(i).Component!="")
	{
		// alert("aqui voy");
		var capitalizeMe=results.rows.item(i).Priority;
	var capitalized = capitalizeMe.charAt(0).toUpperCase() + capitalizeMe.substring(1);
   tablehtml+='<tr data-name="'+results.rows.item(i).FaultID+'"><td>'+results.rows.item(i).Component+'</td><td>'+results.rows.item(i).Fault+'</td><td>'+capitalized+'</td><td>'+results.rows.item(i).Comments+'</td><td><a href="javascript:openEditFaulth('+"'"+results.rows.item(i).FaultID+"'"+');"  data-transition="slideup" data-theme="b"  class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-gear ui-btn-icon-left ui-btn-c">Actions</a></td></tr>';
		
	}			
	
		 //alert(results.rows.item(i).lastp+" "+results.rows.item(i).Name+" "+results.rows.item(i).ProcID);
	 }
	
	  tb.empty().append(tablehtml);
	 $("#table-issuesh").table("refresh");
	 $("#table-issuesh").trigger('create');
		 
	 }

	 hideModal();
  }
  
  
  //ADD ISSUE
  
  	function AddIssueh()
	{
		
		
		var Component=$("#select-addcomponenth option:selected").text();
		var Fault=$("#select-addfaulth option:selected").text();
		var Priority=$("#select-addpriorityh").val();
		var Comments=$("#textarea-addcommentsh").val();
		//alert(Component+" "+Fault+" "+Priority+" "+Comments);
				if(Component!="0" && Fault!="0" && Priority!="0")
		{
			InsertIssueTemph(Component,Fault,Priority,Comments);
			
		}
		else
		{
			navigator.notification.alert("Please select priority", null, 'FieldTracker', 'Accept');
			
		}
		
	}
	
		   function InsertIssueTemph(Component,Fault,Priority,Comments)
  {
	  	//alert(Comments);
	    var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       db.transaction(function(tx){ QueryInsertIssueTemph(tx,Component,Fault,Priority,Comments) }, errorCB, successInsertIssueh);


  }
  
      function QueryInsertIssueTemph(tx,Component,Fault,Priority,Comments)
  {
	 var Ok="false";
	 var StepID=sessionStorage.currentStep;
	 var ProcID=sessionStorage.currentProcedure;
     var SubmitID=sessionStorage.submitID;
	 var FaultID=StepID+new Date().getTime() + Math.random();
	 //alert(FaultID+" "+StepID+" "+ProcID+" "+SubmitID);
	 tx.executeSql('INSERT INTO SUBMITTEDSTEPS  (FaultID,SubmitID,ProcID,StepID,OK,Component,Fault,Priority,Comments) VALUES ("'+FaultID+'","'+SubmitID+'","'+ProcID+'","'+StepID+'","'+Ok+'","'+Component+'","'+Fault+'","'+Priority+'","'+Comments+'")');
	  
  }
  
      function successInsertIssueh()
  {
	   $("#select-addcomponenth").val('0');
	  $("#select-addfaulth").val('0');
	  $("#select-addpriorityh").val('0');
	  $("#textarea-addcommentsh").val('');
	  getissuesh();
	  $('#popupAddIssueh').popup('close');
	 // alert("grabo");
  }
  
  //Open modal to edit issue
  
    function openEditFaulth(FaultID)
  {
	 // alert(FaultID);
	  $("#steptoedith").val(FaultID);
	 // alert(FaultID);
	  $("#popupMenuh").popup("open",{history:false});
	 
	  
  }
  
  // Fill Modal to Edit 
  
    function EditFaulth()
  {
	  
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
     db.transaction(QueryEditFaulth, errorCB);	  
	
  }
  
          function QueryEditFaulth(tx)
  {
	  var FaultID=$("#steptoedith").val();
	   var query="SELECT * FROM SUBMITTEDSTEPS WHERE FaultID='"+FaultID+"'";
	  // alert(query);
	   tx.executeSql(query, [], QueryEditFaultSuccessh, errorCB);
	 
	  
	  
  }
  
    function QueryEditFaultSuccessh(tx,results)
  {
	  //alert("in");
	   var len = results.rows.length;
	  // alert(len);
	   if(len>0)
	   {
		   $("#select-editcomponenth").val(results.rows.item(0).Component);
		   fillFaultSelecteh();
		   $("#select-editfaulth").val(results.rows.item(0).Fault);
		   $("#select-editpriorityh").val(results.rows.item(0).Priority);
		   $("#textarea-editcommentsh").val(results.rows.item(0).Comments);
		   $('#select-editcomponenth').selectmenu('refresh');
		   $('#select-editcomponenth').selectmenu('refresh', true);
		  $('#select-editfaulth').selectmenu('refresh');
		  $('#select-editfaulth').selectmenu('refresh', true);
		   $('#select-editpriorityh').selectmenu('refresh');
		   $('#select-editpriorityh').selectmenu('refresh', true);
		   
		  
		   //refresh value			



		   
		 setTimeout(function(){$('#popupEditIssueh').popup('open');},500)
         $('#popupMenuh').popup('close'); 
	   }
	   else
	   {
		     $('#popupMenuh').popup('close'); 
	   }
	  
  }
  
  //EDIT FAULT
    function updateFaulth()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QueryUpdateFaulth, errorCB,SuccesQueryUpdateFaulth);
	
	 
  }
  
    function QueryUpdateFaulth(tx)
  {
	   var FaultID=$("#steptoedith").val();
	    var Component=$("#select-editcomponenth").val();
		var Fault=$("#select-editfaulth").val();
		var Priority=$("#select-editpriorityh").val();
		var Comments=$("#textarea-editcommentsh").val();
tx.executeSql('UPDATE SUBMITTEDSTEPS SET Component="'+Component+'", Fault="'+Fault+'", Priority="'+Priority+'", Comments="'+Comments+'" WHERE FaultID="'+FaultID+'"');
	  
   }
   
      function SuccesQueryUpdateFaulth()
   {
	   //alert("updated");
	   getissuesh();
	   $('#popupEditIssueh').popup('close'); 
   }
  
  //DELETE FAULT
    function DeleteFaulth()
  {
	  var FaultID=$("#steptoedith").val();
	  setTimeout(function(){$('#popupDeleteh').popup('open');},500)
         $('#popupMenuh').popup('close');
	  //alert(FaultID);
  }
  
     function DeleteFaultsh()
  {
	  $('#bodyissuesh').html("");
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(QueryDeleteFaulth, errorCB,SuccesQueryDelteFaulth);
	
	 
  }
  
    function QueryDeleteFaulth(tx)
  {
	  
	   var FaultID=$("#steptoedith").val();
	   //alert(FaultID);
	   FaultID=$.trim(FaultID);
       var query="DELETE FROM SUBMITTEDSTEPS  WHERE FaultID='"+FaultID+"'";
	  // alert(query);
	   tx.executeSql(query); 
	  
   }
   
      function SuccesQueryDelteFaulth()
   {
	  // alert("Deleted");
	   getissuesh();
	   $('#popupDeleteh').popup('close'); 
   }
   
   //ON FAIL MEDIA PROCESS
       function onFailh(message) {
      alert('Error: ' + message);
    }
	
	
function resOnErrorh(error) {
    alert(error.code);
}
   
   // TAKE PHOTO
      function capturePhotoh() {
      // Toma la imagen y la retorna como una string codificada en base64
      navigator.camera.getPicture(onPhotoDataSuccessh, onFailh, { quality: 80,
	    destinationType : Camera.DestinationType.FILE_URI});
    }
	
	    function onPhotoDataSuccessh(imageData) {
      // Descomenta esta linea para ver la imagen codificada en base64
      // console.log(imageData);
	   movePich(imageData);
	
     
           
    }
	

//GET PHOTO FROM LIBRARY
    function getPhotoh(source) {
      // Retorna la ruta del fichero de imagen desde el origen especificado
      navigator.camera.getPicture(onPhotoURISuccessh, onFailh, { quality: 80, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }
	
	    function onPhotoURISuccessh(imageURI) {
	  
	   movePich(imageURI);
    }

	//SAVE PHOTO TO DATABASE AND LOCAL STORAGE
	function movePich(file){
		//alert(file); 
 
    window.resolveLocalFileSystemURI(file, resolveOnSuccessh, resOnErrorh); 
} 

//CAPTURE VIDEO

function captureVideoh()
	{
		 navigator.device.capture.captureVideo(captureSuccessh, captureErrorh, {limit: 1});
	}
	
	        // Called when capture operation is finished
    //
    function captureSuccessh(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            uploadFileh(mediaFiles[i]);
        }
    }
	
	    // Called if something bad happens.
    //
    function captureErrorh(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
    }
	
		 // storage video files 
    function uploadFileh(mediaFile) {
		var temp=mediaFile.fullPath;
		var temptwo=mediaFile.fullPath;
		temp = temp.substring(0,5);
		temptwo=temptwo.substring(6);
		var completepath=temp.concat("///",temptwo);
		moveVidh(completepath);
		
		
	}
	


//GET VIDEO FROM GALLERY

function getVideoh(source) {
      // Retorna la ruta del fichero de imagen desde el origen especificado
      navigator.camera.getPicture(onVideoURISuccessh, onFailh, { quality: 80, 
        destinationType: destinationType.FILE_URI,
        sourceType: source, mediaType:1 });
    }
	
		    function onVideoURISuccessh(imageURI) {
	  moveVidh(imageURI)
    }
	
		//SAVE VIDEO TO DATABASE AND LOCAL STORAGE
	
	function moveVidh(file){ 
    window.resolveLocalFileSystemURI(file, resolveOnSuccessVidh, resOnErrorh); 
} 

//Callback function when the file system uri has been resolved
function resolveOnSuccessVidh(entry){ 
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".mp4";
    var myFolderApp = ".FieldTracker";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( myFolderApp,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.copyTo(directory, newFileName, function(entry){ successMoveh(entry,"video") }, resOnErrorh);
                    },
                    resOnErrorh);
                    },
    resOnErrorh);
}

//Callback function when the file system uri has been resolved
function resolveOnSuccessh(entry){ 
   
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = ".FieldTracker";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( myFolderApp,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.copyTo(directory, newFileName,  function(entry){ successMoveh(entry,"photo") }, resOnErrorh);
                    },
                    resOnErrorh);
                    },
    resOnError);
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMoveh(entry,type) {
	
	//alert(entry.fullPath+" "+type);
	if(type=="video")
	{
		saveVideotemph(entry.toURL());

	}
	else if(type=="photo")
	{
		savePhototemph(entry.toURL());
		
	}
    //I do my insert with "entry.fullPath" as for the path
}

//SAVE PHOTO URL TO DATABASE
function savePhototemph(photopath)
{
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
           db.transaction(function(tx){ QueryPhotoTemph(tx,photopath) }, errorCB);
}

function QueryPhotoTemph(tx,photopath)
{
	var SubmitID=sessionStorage.submitID;
	var StepID=sessionStorage.currentStep;
	var query='INSERT INTO MEDIA (SubmitID,StepID,FileType,FileName,Path,Sync) VALUES ("'+SubmitID+'","'+StepID+'","image"," ","'+photopath+'","no")';
	//alert(query);
	tx.executeSql(query);
	$('#popupPhotoOptionsh').popup('close');
	navigator.notification.alert("Photo Saved", null, 'FieldTracker', 'Accept');
	
}

//SAVE VIDEO URL TO DATABASE
function saveVideotemph(videopath)
{
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
           db.transaction(function(tx){ QueryVideoTemph(tx,videopath) }, errorCB);
}

function QueryVideoTemph(tx,videopath)
{
	//alert(videopath);
	var SubmitID=sessionStorage.submitID;
	var StepID=sessionStorage.currentStep;
	var FileType="video";
	
	var query='INSERT INTO MEDIA (SubmitID,StepID,FileType,FileName,Path,Sync) VALUES ("'+SubmitID+'","'+StepID+'","video"," ","'+videopath+'","no")';
	//alert(query);
	tx.executeSql(query);
	$('#popupVideoOptionsh').popup('close');
	navigator.notification.alert("Video Saved", null, 'FieldTracker', 'Accept');
	
}

  
  

///////=============================<<<<<<<<<<<< END REPORT ISSUES HISTORY PAGE  >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= PHOTO GALLERY TEMP PAGE =========================================>>>>>>>>>>>///////

function fillgallerytemph()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       db.transaction(Queryphototemph, errorCB);
	
}

function Queryphototemph(tx)
{
	var SubmitID=sessionStorage.submitID;
	var StepID=sessionStorage.currentStep;
	var query="SELECT * FROM MEDIA WHERE SubmitID='"+SubmitID+"' AND StepID='"+StepID+"' AND FileType='image' ";
	//alert(query);
	tx.executeSql(query, [], QueryphototempSuccessh, errorCB);
	
}

function QueryphototempSuccessh(tx,results)
{
	var ccc=0;
	var outputhtml='<div class="gallery-row">';
	for (var i=0; i<results.rows.length; i++)
	{
		ccc++;
		outputhtml+='<div class="gallery-item"><a href="'+results.rows.item(i).Path+'" rel="external"><img src="'+results.rows.item(i).Path+'" alt="Image 001" /></a></div>';
			// alert(idcheck+" "+results.rows.item(i).StepID);
			if(ccc>3)
			{
				outputhtml+='</div><div class="gallery-row">';
				ccc=0;
			
			}
	}
		if(ccc!=0)
		{
			outputhtml+='</div>';
		}
		$("#galltemph").html(outputhtml);
		//$("#galltemp").html(outputhml);
	
}

///////=============================<<<<<<<<<<<< END PHOTO GALLERY TEMP PAGE  >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<============================= VIDEO GALLERY TEMP PAGE =========================================>>>>>>>>>>>///////
function fillgalleryvidtemph()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       db.transaction(Queryvideotemph, errorCB);
	
}

function Queryvideotemph(tx)
{
	var SubmitID=sessionStorage.submitID;
	var StepID=sessionStorage.currentStep;
	var query="SELECT * FROM MEDIA WHERE SubmitID='"+SubmitID+"' AND StepID='"+StepID+"' AND FileType='video'";
	tx.executeSql(query, [], QueryvideotempSuccessh, errorCB);
	
}


function QueryvideotempSuccessh(tx,results)
{
	//alert(results.rows.length +" "+ results.rows.item(0).FileType+ " " + results.rows.item(0).Path );
	var ccc=0;
	var tb = $('#bodyvideo-temph');
	var outputhtml='';
	var pathvideo="";
		
	
	for (var i=0; i<results.rows.length; i++)
	{
		ccc++;
		pathvideo=results.rows.item(i).Path;
		
		outputhtml+='<tr><td>video&nbsp;'+ccc+'</td><td><a href="javascript:playpathvideoh('+"'"+pathvideo+"'"+');" data-icon="video" data-iconpos="left" >Play</a></td><t/r>';
		
	}

		   
 		tb.empty().append(outputhtml);
	 $("#table-tempvideoh").table("refresh");
	 $("#table-tempvideoh").trigger('create');
		//$("#galltemp").html(outputhml);
	
}

function playpathvideoh(path)
{
	var xhtml='<video width="50%" height="50%" controls><source src="'+path+'" type="video/mp4">Your browser does not support the video tag.</video>';
	$("#videocontainerh").html(xhtml);
	$("#popupPlayVideoh").popup("open",{history:false});

	
	//videocontainer

	//alert(path);
}

///////=============================<<<<<<<<<<<< END VIDEO GALLERY TEMP  >>>>>>>>>>>=========================================///////


///////<<<<<<<<<<<<============================= DATA QUERIES PAGE =========================================>>>>>>>>>>>///////
//dropdown operatorname

function fillOperatorNameSelect()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoOperatorNameSelect, errorCB);
	
}

     function QuerytoOperatorNameSelect(tx)
   {
	  
		tx.executeSql("SELECT * FROM USERS ORDER BY Username", [], OperatorNameSelectSuccess, errorCB);
	   
   }
   
   function OperatorNameSelectSuccess(tx, results)
   {
	  var len = results.rows.length;
	  var selecthtml='<option value="0">Choose operator name</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
            //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
			 selecthtml+='<option value="'+results.rows.item(i).Username+'">'+results.rows.item(i).LastName+', '+results.rows.item(i).FirstName+'</option>';
             }
			 
			 $("#select-operator").html(selecthtml);
			 $('#select-operator').selectmenu('refresh');
		   $('#select-operator').selectmenu('refresh', true);
			 			
			
			 
	
		  
	  }
	  else
	  {
		  navigator.notification.alert("No registered Users", null, 'FieldTracker', 'Accept'); 
	  }
	   
   }
   
   //dropdown procedure

function fillProcedureSelect()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoProcedureSelect, errorCB);
	
}

     function QuerytoProcedureSelect(tx)
   {
	  
		tx.executeSql("SELECT * FROM PROCEDURES ORDER BY Name", [], QuerytoProcedureSelectSuccess, errorCB);
	   
   }
   
   function QuerytoProcedureSelectSuccess(tx, results)
   {
	  var len = results.rows.length;
	  var selecthtml='<option value="0">Choose procedure</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
            //console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
			 selecthtml+='<option value="'+results.rows.item(i).ProcID+'">'+results.rows.item(i).Name+'</option>';
             }
			 
			 $("#select-procedure").html(selecthtml);
			 $('#select-procedure').selectmenu('refresh');
		   $('#select-procedure').selectmenu('refresh', true);
			 			
			
			 
	
		  
	  }
	  else
	  {
		  navigator.notification.alert("No registered procedures", null, 'FieldTracker', 'Accept'); 
	  }
	   
   }
   
      //Dropddown Faults
   
   function fillFaultSelectdt()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoFaultSelectdt, errorCB);
	
}

    function QuerytoFaultSelectdt(tx)
   {
	  
		tx.executeSql("SELECT * FROM FAULTS ORDER BY Description", [], GroupsFaultSuccessdt, errorCB);
	   
   }
   
      function GroupsFaultSuccessdt(tx, results)
   {
	    var len = results.rows.length;
	  var selecthtml='<option value="0">Choose fault</option>';
	    if(len>0)
	  {
		  
		   for (var i=0; i<len; i++){
			 selecthtml+='<option value="'+results.rows.item(i).Description+'">'+results.rows.item(i).Description+'</option>';
             }
			 
			 $("#select-fault").html(selecthtml);
			  	  $('#select-fault').selectmenu('refresh');
		  $('#select-fault').selectmenu('refresh', true);
	

		  
	  }
	  else
	  {
		   $("#select-fault").html(selecthtml);
			  	  $('#select-fault').selectmenu('refresh');
		  $('#select-fault').selectmenu('refresh', true);
		  navigator.notification.alert("No registered faults", null, 'FieldTracker', 'Accept'); 
	  }
	   
   }
   
    function nextquery()
   {
	  
	   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
   		db.transaction(Querytogetsubmits, errorCB);
	   	//$(':mobile-pagecontainer').pagecontainer('change', '#pageResult', {
        //transition: 'slidedown',
        //changeHash: false,
        //reverse: true,
        //showLoadMsg: true
	   
	//});
   }
   
   function Querytogetsubmits(tx)
   {
	   var query="SELECT submittedprocs.*, procedures.Name FROM submittedprocs INNER JOIN procedures ON submittedprocs.ProcID = procedures.ProcID";
	   var operator=$("#select-operator").val();	   
	   var procedureID=$("#select-procedure").val();
	   var fromdate=InsertFormatDate($("#date-from").val());
	   var todate=InsertFormatDate($("#date-to").val());
	   var where=0; 
	   if(fromdate && todate)
	   {
		   where=1;
		   query=query+" WHERE submittedprocs.SubmitDate BETWEEN '"+fromdate+"' AND '"+todate+"'";
		   
	   }
	   if(operator!="0")
	   {
		   
		   	 if (where==1)
		 {
			 query=query+" AND submittedprocs.UserID='"+operator+"'";;
			 
		 }
		 else
		 {
			 query=query+" WHERE submittedprocs.UserID='"+operator+"'";
		 }
		 where=1;
	   }
	   if(procedureID!="0")
	   {
		    
		 if (where==1)
		 {
			 query=query+" AND procedures.type='"+procedureID+"'";
			 
		 }
		 else
		 {
			 query=query+" WHERE procedures.type='"+procedureID+"'";
		 } 
		 where=1;  
	   }
	   
	  // alert(query);
	   //if(
	   
	   tx.executeSql(query, [],QuerytogetsubmitsSuccess , errorCB);
   }
   
   function QuerytogetsubmitsSuccess(tx,results)
   {
	 var len = results.rows.length;
	  if (len>0)
	  {
	  var dbtwo = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
       dbtwo.transaction(function(tx){ Queryallresultsdata(tx,results) }, errorCB);
	  }
	  else
	  {
		  navigator.notification.alert("No search results found ", null, 'FieldTracker', 'Accept');
	  }
	   
	   
	   
	   
	   
   }
   
   function  Queryallresultsdata(txtwo,resultsproc)
   {
	     var len = resultsproc.rows.length;
		 var prior=$("#select-priority").val();
		 var Query="SELECT submittedsteps.*, proceduresteps.Text FROM submittedsteps INNER JOIN proceduresteps ON submittedsteps.StepID = proceduresteps.StepID WHERE submittedsteps.OK='false' OR submittedsteps.OK='true'";
		 if(prior!="0")
		 {
			  Query="SELECT submittedsteps.*, proceduresteps.Text FROM submittedsteps INNER JOIN proceduresteps ON submittedsteps.StepID = proceduresteps.StepID WHERE submittedsteps.OK='false'";
			 
		 }
		 
	  // alert(len);
	   
	   var maintext=$("#text-main").val();
	   var fault=$("#select-fault").val();
	  if(maintext)
	  {
		   Query=Query+" AND proceduresteps.Text LIKE '%"+maintext+"%' AND submittedsteps.Component LIKE '%"+maintext+"%' AND submittedsteps.Comments LIKE '%"+maintext+"%'";
		  
	  }
	  if(fault!="0")
	  {
		  Query=Query+" AND submittedsteps.Fault='"+fault+"'";
	  }
	  
	  if(prior=="high")
	  {
		  Query=Query+" AND submittedsteps.Priority='high'";
		  
	 }
	 else if (prior=="medium")
	 {
		 Query=Query+" AND submittedsteps.Priority='medium'";
		 
	 }
	 else if (prior=="low")
	 {
		 Query=Query+" AND submittedsteps.Priority='low'";
		 
	 }
	  
	  
	  Query=Query+"GROUP BY submittedsteps.SubmitID" ;
	//  alert(Query);
	  txtwo.executeSql(Query, [],function(tx,results){ QueryallresultsdataSuccess(tx,results,resultsproc) }, errorCB);
	   
	}
	
	function QueryallresultsdataSuccess(tx,results,resultproc)
	{
		//alert("entro");
		  var len = results.rows.length;
		  var tb = $('#bodydataqueries');
		  var htmloutput="";
		  if(len>0)
		  {
			 
			  for (var i=0; i<resultproc.rows.length; i++)
	{
				  for (var t=0; t<results.rows.length; t++)
					{
						if(resultproc.rows.item(i).SubmitID==results.rows.item(t).SubmitID)
						{
							//alert(resultproc.rows.item(i).UserID+"=="+resultproc.rows.item(i).SubmitDate);
							htmloutput+='<tr data-name="'+resultproc.rows.item(i).SubmitID+'"><td>'+resultproc.rows.item(i).Name+'</td><td>'+resultproc.rows.item(i).UserID+'</td><td>'+ShowFormatDateTime(resultproc.rows.item(i).Time)+'</td></tr>';
						}
						
						
					}
		
		
	}
	//alert(htmloutput);

		   
 	tb.empty().append(htmloutput);

	 //$("#table-resultq").table("refresh");
	// $("#table-resultq").trigger('create');
      $(':mobile-pagecontainer').pagecontainer('change', '#pageResult', {
        transition: 'slidedown',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
	   
		});
		  }
		  else
		  {
			   navigator.notification.alert("No search results found", null, 'FieldTracker', 'Accept');
		  }
		
	}


///////=============================<<<<<<<<<<<< END DATA QUERIES PAGE  >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= SETTINGS PAGE =========================================>>>>>>>>>>>///////
function showsettings()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Queryshowsettings, errorCB);
	
}

function Queryshowsettings (tx)
{
	var query="SELECT * FROM SETTINGS";
	//alert(query);
	tx.executeSql(query, [], QueryshowsettingsSuccess, errorCB);
	
	
	
}

function QueryshowsettingsSuccess(tx,results)
{
	var len = results.rows.length;
	//alert(results.rows.item(0).Language);
	if(len>0)
	{
      $("#ipsetting").val(results.rows.item(0).IP);
	  $("#select-lang").val(results.rows.item(0).Language);
	  $("#select-lang").selectmenu("refresh");	
	  $("#ipsettinginit").val(results.rows.item(0).IP);
	  $("#select-langinit").val(results.rows.item(0).Language);
	  $("#select-langinit").selectmenu("refresh");		
	}

	
}

function savesettings()
{
	var ipaddress=$("#ipsetting").val();
	var val_ip=/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
	//if(!val_ip.test(ipaddress)) {
	//	navigator.notification.alert("Invalid IP Address", null, 'FieldTracker', 'Accept');
	//}
	//else
	//{
		var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    	db.transaction(Querychecksettings, errorCB);
	//}
	
	
}

function Querychecksettings(tx)
{
	var query="SELECT * FROM SETTINGS";
	tx.executeSql(query, [], QuerychecksettingsSuccess, errorCB);
}

function QuerychecksettingsSuccess(tx,results)
{
	var len = results.rows.length;
	if(len>0)
	{
		settingstodb("1");
	}
	else
	{
		settingstodb("0");
		
	}
}

function settingstodb(todo)
{
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
         db.transaction(function(tx){ Querysavesettings(tx,todo) }, errorCB);
	
	
}

function Querysavesettings(tx,todo)
{
	var ipaddress=$("#ipsetting").val();
	var language=$("#select-lang").val();
	var query="";
	if(todo=="0")
	{
		query='INSERT INTO SETTINGS (Language,IP) VALUES ("'+language+'","'+ipaddress+'")';
	}
	else
	{
		query='UPDATE SETTINGS SET Language="'+language+'", IP="'+ipaddress+'"';
	}
	tx.executeSql(query);
	translatehtml();
	 navigator.notification.alert("Saved", null, 'FieldTracker', 'Accept');
	
}



///////=============================<<<<<<<<<<<< END SETTINGS PAGE  >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= REJECTED PROCEDURES PAGE =========================================>>>>>>>>>>>///////


//FILL TABLE
function fillrejectedlist()
{
	
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querytorejectedlist, errorCB);
	
}

function Querytorejectedlist(tx)
{
	showModal();


	var querytosend="SELECT REJECTED.*, SUBMITTEDPROCS.SubmitDate as Timex FROM REJECTED INNER JOIN SUBMITTEDPROCS ON SUBMITTEDPROCS.SubmitID=REJECTED.SubmitID";
 
		//alert(querytosend);
		tx.executeSql(querytosend, [], QuerytorejectedlistSuccess, errorCB);
	
}

function QuerytorejectedlistSuccess(tx,results)
{
		 var len = results.rows.length;
		 //alert(len);
	 var tb = $('#bodyrejected-list');
	 var tablehtml="";
	 for (var i=0; i<results.rows.length; i++){

	  // alert(results.rows.item(i).SubmitID);
	   tablehtml+='<tr data-name="'+results.rows.item(i).SubmitID+'"><td>'+results.rows.item(i).Name+'</td><td>'+results.rows.item(i).UserID+'</td><td>'+ShowFormatDateTime(results.rows.item(i).Timex)+'</td><td>'+results.rows.item(i).RejectReason+'</td></tr>';
	   

   
   
		 //alert(results.rows.item(i).lastp+" "+results.rows.item(i).Name+" "+results.rows.item(i).ProcID);
	 }
	 //alert(tablehtml);
	  tb.empty().append(tablehtml);
	 $("#table-rejected").table("refresh");
	 $("#table-rejected").trigger('create');
	//alert(results.rows.length);
	hideModal();
}



function openrejected()
{
		var idsubmit=$("#idprorejected").val();
		sessionStorage.submitID=idsubmit;
		sessionStorage.nameprocedure=$("#chnamep").val();
		//alert(idsubmit);
	
	if(idsubmit!="0")
	{
		
		navbyapp('history');

		
	}
	else
	{
		navigator.notification.alert("Please select a procedure", null, 'FieldTracker', 'Accept');
		
	}
}




///////=============================<<<<<<<<<<<< END REJECTED PROCEDURES PAGE  >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= LAUNCH EVALUATIONS PAGE =========================================>>>>>>>>>>>///////
//Fill table
  function fillevaluationstolaunch()
 {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
      db.transaction(Querytoevaluationstolaunch, errorCB);
}	

  
  function Querytoevaluationstolaunch(tx)
  {
//	  
	  // showModal();
//	   var grouptoshow=$("#select_group").val();
//	   var chk_preventive=$("#checkbox-preventive").is(':checked') ;
//	   var chk_routine=$("#checkbox-routine").is(':checked') ;
//	   var chk_operator=$("#checkbox-operator").is(':checked') ;
//	   var chk_startup=$("#checkbox-startup").is(':checked') ;
//	   var chk_shutdown=$("#checkbox-shutdown").is(':checked') ;
//	   var numquery=1;
//	   var chk_preoperational=$("#checkbox-preoperational").is(':checked') ;
	               var newquery = "SELECT ( SELECT SUBMITTEDPROCS.EvalUserName || ' - '  FROM  SUBMITTEDPROCS WHERE PROCEDURES.ProcID = SUBMITTEDPROCS.ProcID ORDER BY Time DESC LIMIT 1) AS lastp,SUBMITTEDPROCS.Time AS timeccc, PROCEDURES.Name, PROCEDURES.ProcID FROM PROCEDURES LEFT OUTER JOIN SUBMITTEDPROCS ON PROCEDURES.ProcID = SUBMITTEDPROCS.ProcID WHERE PROCEDURES.Type='Evaluation' GROUP BY PROCEDURES.PROCID";
     // alert(newquery);
		tx.executeSql(newquery, [], QuerytoevaltolaunchSuccess, errorCB);
//	  
//	  
  }
//  
    function QuerytoevaltolaunchSuccess(tx,results)
  {
	 var len = results.rows.length;
	 var tb = $('#evaluationsbodytable');
	 var tablehtml="";
	 var sbdate="";
    for (var i=0; i<results.rows.length; i++){
		 sbdate=" ";
//		// alert(results.rows.item(i).lastp);
		 if(results.rows.item(i).lastp!=null)
		 {
			 sbdate=results.rows.item(i).lastp+" "+ShowFormatDate(results.rows.item(i).timeccc);
		 }
    tablehtml+='<tr data-name="'+results.rows.item(i).ProcID+'"><td>'+results.rows.item(i).Name+'</td><td>'+sbdate+'</td></tr>';
//		 //alert(results.rows.item(i).lastp+" "+results.rows.item(i).Name+" "+results.rows.item(i).ProcID);
	 }
//	 //alert(tablehtml);
	  tb.empty().append(tablehtml);
	 $("#table-evaluations").table("refresh");
	 $("#table-evaluations").trigger('create');
//	 hideModal();
//	  
  }
  //LAUNCH NAME MODAL
  function ModalEvalName()
  {
	  var idevaluation=$("#cheval").val();
	  if(idevaluation!="0")
	  {
		  $("#popupEvalName").popup("open");
	  }
	  else
	  {
		  navigator.notification.alert("Please select a Evaluation", null, 'FieldTracker', 'Accept');
		  
	  }
	  
  }
    //LAUNCH Evaluation
   
   function launcheval()
{
	var ideval=$("#cheval").val();
	var nameeval=$("#textarea-nameeval").val();
	var position=$("#textarea-positioneval").val();
	if(nameeval!="")
	{
			if(ideval!="0")
	{
		$("#chEvalName").val(nameeval);
		$("#chpositioneval").val(position);
		sessionStorage.nameevaluation=$("#chnameeval").val();
		sessionStorage.positionevaluation=$("#chpositioneval").val();
		sessionStorage.currentevaluation=ideval;
		sessionStorage.currentevalname=$("#chEvalName").val();
		$("#headproevalname").html("EVALUATION: "+nameeval);
		//alert("avanza");
		$(':mobile-pagecontainer').pagecontainer('change', '#pageEvaluation', {
        transition: 'slide',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    	});
		
	}
	else
	{
		navigator.notification.alert("Please select a Evaluation", null, 'FieldTracker', 'Accept');
		
	}
		
	}
	else
	{
		navigator.notification.alert("Please enter a Name", null, 'FieldTracker', 'Accept');
	
	}
			
} 

///////=============================<<<<<<<<<<<< END LAUNCH EVALUATIONS PAGE  >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= EVALUATIONS STEPS PAGE   =========================================>>>>>>>>>>>///////
//Fill table
     function fillevaluationsteps()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(Querystepsevalprocedure, errorCB);
	  
  }
      function Querystepsevalprocedure(tx)
  {
	   //showModal();
	   var idprocedure=sessionStorage.currentevaluation;
	   
	   var query="SELECT StepID, OrdNum, Text, Type, Num, SelAllComps,SelAllFaults FROM PROCEDURESTEPS WHERE (ProcID = '"+idprocedure+"')  ORDER BY OrdNum";
	   //akivoy
	  // alert(query);
	   tx.executeSql(query, [], QuerystepsevalSuccess, errorCB);
	  
	  
  }
      function QuerystepsevalSuccess(tx,results)
  {
	  var len = results.rows.length;
	 
	  if(len=="0")
	  {
		   				//hideModal();
		     			 navigator.notification.confirm(
    					'No registered Questions',      // mensaje (message)
    						onConfirma,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   							 'FieldTracker',            // titulo (title)
        				'Exit'          // botones (buttonLabels)
        				);
    

		 // navigator.notification.alert("No registered Steps", null, 'FieldTracker', 'Accept'); 
		  
	  }
	  else
	  {
		 filltableevaluationsnow(results); 
	  }
	 
	  
  }
      // ON CONFIRM NO STEPS
    function onConfirma(button) {
			    $(':mobile-pagecontainer').pagecontainer('change', '#pageEvaluationsLaunch', {
        transition: 'pop',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
       
    }
	    function onConfirmaxxx(button) {
			    $(':mobile-pagecontainer').pagecontainer('change', '#pageEvaluationsLaunch', {
        transition: 'pop',
        changeHash: false,
        reverse: true,
        showLoadMsg: true
    });
       
    }
	
		//STEPS OF PROCEDURE
	
	function filltableevaluationsnow(results)
	{
        var nameoper=$("#chnameeval").val();                                         
		var stepshtml='';	
		var tb = $('#stepsevalbody');
			arrayresponses= new Array(results.rows.length);
			stepshtml+="<tr><td><b>"+nameoper+"</b></td><td></td></tr>";
			stepshtml+="<tr><td>   </td><td></td></tr>";
			
			for (var i=0; i<results.rows.length; i++){
stepshtml+='<tr data-name="'+results.rows.item(i).StepID+'"><td><label id="lbl'+results.rows.item(i).StepID+'" class="ui-icon-delete ui-shadow-icon" >'+results.rows.item(i).Num+' &nbsp;'+results.rows.item(i).Text+'</label> </td><label id="l'+results.rows.item(i).StepID+'" class="ui-icon-delete ui-shadow-icon" ></label><td id="resp'+results.rows.item(i).Num+'"></td></tr>';

				
			}
			//alert(stepshtml);
			//$("#stepsbody").html(stepshtml);
			tb.empty().append(stepshtml);
			$("#table-resulteval").table("refresh");
	 		$("#table-resulteval").trigger('create');
			// hideModal();
		
	}
	//Searchname SElected Question
	
	
	//FILL MODAL RESPONSES
	function fillresponsesmodal(idquestion)
	{
		searchnameevalmodal();
		
		
	}
	function searchnameevalmodal()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytoGetnameevalmodal, errorCB);
	
}

function QuerytoGetnameevalmodal(tx)
{
	var idquestion=$("#chQuestion").val();
	tx.executeSql("SELECT * FROM PROCEDURESTEPS WHERE StepID='"+idquestion+"'", [], QuerytonameevalmodalSuccess, errorCB);
	
}

function QuerytonameevalmodalSuccess(tx, results)
{
	//alert("aqui");
	var len = results.rows.length;
	  if(len>0)
	  {
		  //alert(results.rows.item(0).Name);
		// alert(results.rows.item(0).Name);
		$("#chTypeQuestion").val(results.rows.item(0).Type);
		 $("#headquestions").html("<b> "+results.rows.item(0).Text+"</b>"); 
		 $("#questiontext").val(results.rows.item(0).Text);
	  }
	  fillQuestions();
	
}
     function fillQuestions()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(QueryQuestions, errorCB);
	  
  }
  function QueryQuestions(tx)
{
	var idquestion=$("#chQuestion").val();
	$("#fieldQuestions").html('');
	//alert("SELECT * FROM STEPS2RESPONSES WHERE ID='"+idquestion+"' ORDER BY OrdNum");
	tx.executeSql("SELECT * FROM STEPS2RESPONSES WHERE ID='"+idquestion+"' ORDER BY OrdNum", [], QueryQuestionsSuccess, errorCB);
	
}

function QueryQuestionsSuccess(tx,results)
{
     var idquestion=$("#chQuestion").val();
	var TypeQuestion=$("#chTypeQuestion").val();
	var len = results.rows.length;
	var htmlform="";
	if(TypeQuestion=="B")
	{
		htmlform='<label for="openquestion"></label><textarea data-mini="true" cols="60" rows="14" name="openquestion" id="openquestion"></textarea>';
		
	}
	else if (TypeQuestion=="M")
	{
		    htmlform+='<fieldset data-role="controlgroup">';
			for (var i=0; i<results.rows.length; i++){
			htmlform+='<label><input type="checkbox" name="chkr'+i+'" id="chkr'+i+'">'+results.rows.item(i).Text+'</label>';

				
			}
			htmlform+='<label for="openquestion">Other</label><textarea data-mini="true" cols="60" rows="14" name="openquestion" id="openquestion"></textarea>';
			 htmlform+='</fieldset>';
		
	}
	else if (TypeQuestion=="S")
	{
		    htmlform+='<fieldset data-role="controlgroup">';
			for (var i=0; i<results.rows.length; i++){
			htmlform+='<label><input type="radio" name="radio-choice" id="radio'+i+'">'+results.rows.item(i).Text+'</label>';				
			}
			htmlform+='<label for="openquestion">Other</label><textarea data-mini="true" cols="60" rows="14" name="openquestion" id="openquestion"></textarea>';
			 htmlform+='</fieldset>';
		
	}
	$("#fieldQuestions").html(htmlform);
	//$("#popupQuestions").popup("refresh");  
	ReadAnswers();
	$("#popupQuestions").popup("open");
	
	
}

function CloseModalQ()
{
	
	$("#popupQuestions").popup('close');
	$("#fieldQuestions").html('');
	//$("#popupQuestions").popup("refresh");  
}

function AddResponses()
{

	var idquestion=$("#chQuestion").val();
	var TypeQuestion=$("#chTypeQuestion").val();
	DeleteQuestieontempanswers();
	//var formvalues=$('fieldQuestions').serialize();
	//alert(formvalues);	
}
     function GetResponses()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
        db.transaction(QueryGetResponses, errorCB);
	  
  }
  function QueryGetResponses(tx)
  {
	
	var idquestion=$("#chQuestion").val();
	var TypeQuestion=$("#chTypeQuestion").val();
	//alert("SELECT * FROM STEPS2RESPONSES WHERE ID='"+idquestion+"' ORDER BY OrdNum");
	tx.executeSql("SELECT * FROM STEPS2RESPONSES WHERE ID='"+idquestion+"' ORDER BY OrdNum", [], QueryGetResponsesSuccess, errorCB);
	  
  }
  function QueryGetResponsesSuccess(tx,results)
  { 
    var submitIDe=sessionStorage.EvalsubmitID;
	var idquestion=$("#chQuestion").val();
	var idprocedure=sessionStorage.currentevaluation;
	var TypeQuestion=$("#chTypeQuestion").val();
	var len = results.rows.length;
	var otherans=$("#openquestion").val();
	var haveother="no";
	var answer="";
	var quantrespon=0;
	var responses="";
	var inresponses="";
	var showresponses="";
	var idresponse="";
	var idsd="";
	var hayanswer=0;
	var renglon=$("#renglon").val();
	var textopregunta= $("#questiontext").val();
	if(otherans.length>=1)
	{
		haveother="yes";
	}

	if (TypeQuestion=="M")
	{
			for (var i=0; i<results.rows.length; i++){
				idsd="#chkr"+i;
                 //alert(idsd); 
				responses=$("#chkr"+i).is(':checked') ;
				//alert(responses);
				if(responses==true)
				{
				InTempAnswer(textopregunta,results.rows.item(i).OrdNum,results.rows.item(i).Text,"",renglon);   	
				hayanswer=1;	
					if(quantrespon=="0"){
				inresponses+=results.rows.item(i).Text;		
				showresponses+=results.rows.item(i).Text;
				
				}
				else
				{
					inresponses+=";;"+results.rows.item(i).Text;	
					showresponses+=" --"+results.rows.item(i).Text;
					
				}
				quantrespon=quantrespon+1;		
				}
				
				//alert(responses);
				
			}

	}
	else if (TypeQuestion=="S")
	{
			for (var i=0; i<results.rows.length; i++){
				responses=$("#radio"+i).is(':checked');
				//alert(responses);
				if(responses==true)
				{
				InTempAnswer(textopregunta,results.rows.item(i).OrdNum,results.rows.item(i).Text,"",renglon); 	
				hayanswer=1;	
				inresponses=results.rows.item(i).Text;		
				showresponses=results.rows.item(i).Text;
				}
				//alert(responses);
			}
			//alert(inresponses);
			

		
	}
		else if (TypeQuestion=="B")
	{
		    InTempAnswer(textopregunta,"B",otherans,otherans,renglon);
			inresponses=otherans;		
			showresponses=otherans;

	}
		if(otherans.length>=1)
	{
		InTempAnswer(textopregunta,"comments","",otherans,renglon); 	
		inresponses=otherans;		
		showresponses=otherans;
	} 
	$("#resp"+renglon).html(inresponses);
	$("#table-resulteval").table("refresh");
	 $("#table-resulteval").trigger('create');
	 $("#popupQuestions").popup('close');		
	
	  
  }
  
  function DeleteQuestieontempanswers()
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QueryDeleteQuestieont(tx) }, errorCB);
  }
  
  function QueryDeleteQuestieont(tx)
  {
	  var idstepquestion=$("#chQuestion").val();
	  var query="";
		query='DELETE FROM TEMPRESPONSES WHERE StepID="'+idstepquestion+'"';
		//alert(query);
	  tx.executeSql(query);
	 // alert("elimine todo");
	  GetResponses();
	  
  }
  
  function DeleteTemporalansers()
  {
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QueryDeleteTemporalansers(tx) }, errorCB);
  }
  function QueryDeleteTemporalansers(tx)
  {
	  var query="";
	  query='DELETE FROM TEMPRESPONSES';
	  tx.executeSql(query);
	  //alert("elimine todo temporal");	  
  }
  //Insert temporal answers
  function InTempAnswer(texto,numero,respuesta,comentarios,qnum)
  {

	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ Queryinserttempans(tx,texto,numero,respuesta,comentarios,qnum) }, errorCB);
  }
  function Queryinserttempans(tx,texto,numero,respuesta,comentarios,qnum)
  {
	var submitIDe=sessionStorage.EvalsubmitID;
	var idprocedure=sessionStorage.currentevaluation;
	var idstepquestion=$("#chQuestion").val();
	var userid=sessionStorage.userid;
	var query="";
	query='INSERT INTO TEMPRESPONSES (SubmitID,ProcID,StepID,Text,Num,Response,Comments,UserID,QNum) VALUES ("'+submitIDe+'","'+idprocedure+'","'+idstepquestion+'","'+texto+'","'+numero+'","'+respuesta+'","'+comentarios+'","'+userid+'","'+qnum+'")';
	//alert(query);
	tx.executeSql(query);
	//alert("saved");	
  }
  
  //check answerts
  function ReadAnswers()
  {
	  //alert("leer");
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
 	 db.transaction(QueryReadAnswers, errorCB);
	  
  }
  function QueryReadAnswers(tx)
  {
	 var renglon=$("#renglon").val();
	 var idquestion=$("#chQuestion").val();
	 tx.executeSql("SELECT * FROM STEPS2RESPONSES WHERE ID='"+idquestion+"' ORDER BY OrdNum", [], QueryReadAnswersSuccess, errorCB);
  }
  function QueryReadAnswersSuccess(tx,results)
  {
	  ContinueReadAnswers(results)
  }
  function ContinueReadAnswers(resultsallres)
  {
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	  db.transaction(function(tx){ QueryContinueReadAnswers(tx,resultsallres) }, errorCB);
  }
  function QueryContinueReadAnswers(tx,resultsallres)
  {
	  var idstepquestion=$("#chQuestion").val();
	  var query="SELECT * FROM TEMPRESPONSES WHERE StepID='"+idstepquestion+"'";
	  tx.executeSql(query, [], function(tx,results){ QueryContinueReadAnswersSuccess(tx,results,resultsallres) }, errorCB);	  
  }
  function QueryContinueReadAnswersSuccess(tx,results,resultsallres)
  {
	   var len = results.rows.length;
	   //alert(len);
	    var lendos = resultsallres.rows.length;
	  //alert(lendos);
		var TypeQuestion=$("#chTypeQuestion").val();	
		var positions=0;	
		if (TypeQuestion=="M")
		{
					for (var i=0; i<results.rows.length; i++){
			for (var x=0; x<resultsallres.rows.length; x++){
				//alert("checarespuesta"+results.rows.item(i).Num+"ordernumber:"+resultsallres.rows.item(x).OrdNum);
					if(resultsallres.rows.item(x).OrdNum==results.rows.item(i).Num)
					{
						//alert("respuestaencontrada"+results.rows.item(i).Num+"ordernumber:"+resultsallres.rows.item(x).OrdNum);
						try {
						positions=results.rows.item(i).Num-1;
						$("#chkr"+positions).prop('checked', true);
						//$("#chkr"+positions).checkboxradio('refresh');
						}
						catch(err) {
							alert(err.message);
						}
					
						
					}
			}		
			
		}
			
		}		
		else if (TypeQuestion=="S")
	   {
		   		for (var i=0; i<results.rows.length; i++){
			for (var x=0; x<resultsallres.rows.length; x++){
				//alert("checarespuesta"+results.rows.item(i).Num+"ordernumber:"+resultsallres.rows.item(x).OrdNum);
					if(resultsallres.rows.item(x).OrdNum==results.rows.item(i).Num)
					{
						//alert("respuestaencontrada"+results.rows.item(i).Num+"ordernumber:"+resultsallres.rows.item(x).OrdNum);
						try {
						positions=results.rows.item(i).Num-1;
						$("#radio"+positions).prop('checked', true);
						//$("#radio"+positions).checkboxradio('refresh');
						}
						catch(err) {
							alert(err.message);
						}
						
					}
			}		
			
		}
		   
	   }
		else if (TypeQuestion=="B")
		{
			for (var i=0; i<results.rows.length; i++){
				if(results.rows.item(i).Num=="B")
				{
					$("#openquestion").val(results.rows.item(i).Response);
				}
			}
			
 		}
             //alert("checarcomentarios");                                    
			for (var i=0; i<results.rows.length; i++){
				//alert(results.rows.item(i).Num);
				if(results.rows.item(i).Num=="comments")
				{
					//alert("sihay:"+results.rows.item(i).Comments+"rerer");
					$("#openquestion").val(results.rows.item(i).Comments);
				}
			}
		//alert(len+"==>"+lendos);
  }
  
  //Submitevaluation
  
  function submiteval()
  {
	  //verifiy if all have responeses
	   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
 		db.transaction(Queryverifyresponses, errorCB);
 
	//$(':mobile-pagecontainer').pagecontainer('change', '#pageMenu', {
      //  transition: 'pop',
       // changeHash: false,
        //reverse: true,
        //showLoadMsg: true
    //});
	  
  }
  function Queryverifyresponses(tx)
  {
	   var idprocedure=sessionStorage.currentevaluation;	   
	   var query="SELECT StepID, OrdNum, Text, Type, Num, SelAllComps,SelAllFaults FROM PROCEDURESTEPS WHERE (ProcID = '"+idprocedure+"')  ORDER BY OrdNum";
	   tx.executeSql(query, [], QueryverifyresponsesSuccess, errorCB);	  
  }
  function QueryverifyresponsesSuccess(tx,results)
  {
	   var len = results.rows.length;
	   var completed=1;
	   for (var i=0; i<results.rows.length; i++){
		   var responsex= $("#resp"+results.rows.item(i).Num).html();
		   if(responsex=="")
		   {
			   completed=0;
		   }
	   }
	   if(completed=="1")
	   {
		   savesubmiteval();
	   }
	   else
	   {
		   //navigator.notification.alert("Please complete all the questions.", null, 'FieldTracker', 'Accept');
		   $("#popupsureval").popup("open");
	   }
  }
  function savesubmiteval()
  {
	  // navigator.notification.confirm(
    				//	'Evaluation submitted',      // mensaje (message)
    				//		onConfirmaxxx,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   					//		 'FieldTracker',            // titulo (title)
        			//	'Accept'          // botones (buttonLabels)
        			//	);
	 // navigator.notification.alert("Evaluation submitted", null, 'FieldTracker', 'Accept');
	  var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
 	  db.transaction(Querysaveprocedureeval, errorCBeval,SuccessQuerysaveseval);
  }
  function Querysaveprocedureeval(tx)
  {
	  var EvSubmitID=sessionStorage.EvalsubmitID;
	  var ProcID=sessionStorage.currentevaluation;
	  var UserID=sessionStorage.userid;
	  var Status="Submitted";
	  var dt = new Date();
	  var SubmitDate = dt.toYMD();
	  var SubmitTime=dt.toYMDhrs();
	  var Namecito=$("#chnameeval").val(); 
	  var Evalusername=sessionStorage.currentevalname;
	  var Position=$("#chpositioneval").val();
	  var query='INSERT INTO SUBMITTEDPROCS (SubmitID,ProcID,UserID,Status,SubmitDate,Name,EvalUserName,Position,Time) VALUES ("'+EvSubmitID+'","'+ProcID+'","'+UserID+'","'+Status+'","'+SubmitDate+'","'+Namecito+'","'+Evalusername+'","'+Position+'","'+SubmitTime+'")';
	 // alert(query);
	  tx.executeSql(query);
  }
  function SuccessQuerysaveseval()
  {
	   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
 		db.transaction(QueryGetQuestionsFinal, errorCB,Successfinaleval);
	
  }
  function QueryGetQuestionsFinal(tx)
  {
	  var idprocedure=sessionStorage.currentevaluation;
	  var query="SELECT StepID, OrdNum, Text, Type, Num, SelAllComps,SelAllFaults FROM PROCEDURESTEPS WHERE (ProcID = '"+idprocedure+"')  ORDER BY OrdNum";
	  tx.executeSql(query, [], QueryGetQuestionsFinalSuccess, errorCB);
  }
  function QueryGetQuestionsFinalSuccess(tx,results)
  {
	  SecondGetResponses(results);
  }
  function SecondGetResponses(resultsquestions)
  {
	   var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	  db.transaction(function(tx){ QuerySecondGetResponses(tx,resultsquestions) }, errorCB);
  }
  function QuerySecondGetResponses(tx,resultsquestions)
  {
	   var query="SELECT * FROM TEMPRESPONSES";
	   tx.executeSql(query, [], function(tx,results){ QuerySecondGetResponsesSuccess(tx,results,resultsquestions) }, errorCB);	  
  }
  function QuerySecondGetResponsesSuccess(tx,results,resultsquestions)
  {
	  var lenres = results.rows.length;
	  var lenques=resultsquestions.rows.length;
	 // alert(lenres+"==>"+lenques);
	  var founded=0;
	   var EvSubmitID=sessionStorage.EvalsubmitID;
	  var ProcID=sessionStorage.currentevaluation;
	  var UserID=sessionStorage.userid;
	  var StepID="";
	  var oktext="TRUE";
	  var texto="";
	  var qnum="";
	  var respuesta="";
	  var comments="";
	  var varias=0;
	  var query="";
	  for (var i=0; i<resultsquestions.rows.length; i++){
		  founded=0;
		  varias=0;
		  texto=resultsquestions.rows.item(i).Text;
	  	  qnum=resultsquestions.rows.item(i).OrdNum;
		  StepID=resultsquestions.rows.item(i).StepID;
	 	  respuesta="";
		  comments="";
		  for (var y=0; y<results.rows.length; y++){
		 if(resultsquestions.rows.item(i).StepID==results.rows.item(y).StepID)
		{
			 founded=1;
			if(results.rows.item(y).Num!="comments")
			{
						if(varias==0)
			 		{
						varias=1;
				 respuesta=results.rows.item(y).Response;
			 		}
			 		else
			 		{
				 respuesta+=";;"+results.rows.item(y).Response;
			 		}
			}
			else
			{
				comments=results.rows.item(y).Comments;
			}			 
	
		}
	  }
	  //alert(founded+" respuesta="+respuesta+" comentairos:"+comments+" la pregunta"+resultsquestions.rows.item(i).OrdNum);
	  if( founded==0)
	  {
		 query='INSERT INTO SUBMITTEDSTEPS (SubmitID,ProcID,StepID,Text,OK,Num,Response,UserID,Comments) VALUES ("'+EvSubmitID+'","'+ProcID+'","'+StepID+'","'+texto+'","'+oktext+'","'+qnum+'","n/a","'+UserID+'","")';
		  
	  }
	  else
	  {
		  if(resultsquestions.rows.item(i).Type=="B")
		  {
			  query='INSERT INTO SUBMITTEDSTEPS (SubmitID,ProcID,StepID,Text,OK,Num,Response,UserID,Comments) VALUES ("'+EvSubmitID+'","'+ProcID+'","'+StepID+'","'+texto+'","'+oktext+'","'+qnum+'","'+comments+'","'+UserID+'","")';
		  }
		  else
		  {
			  if(respuesta=="" && comments!="")
			  {
				   query='INSERT INTO SUBMITTEDSTEPS (SubmitID,ProcID,StepID,Text,OK,Num,Response,UserID,Comments) VALUES ("'+EvSubmitID+'","'+ProcID+'","'+StepID+'","'+texto+'","'+oktext+'","'+qnum+'","'+comments+'","'+UserID+'","")';
			  }
			  else
			  {
				   query='INSERT INTO SUBMITTEDSTEPS (SubmitID,ProcID,StepID,Text,OK,Num,Response,UserID,Comments) VALUES ("'+EvSubmitID+'","'+ProcID+'","'+StepID+'","'+texto+'","'+oktext+'","'+qnum+'","'+respuesta+'","'+UserID+'","'+comments+'")';
			  }
		
		  }
		  //insert responses
		  
	  }
	  //alert(query);
	  tx.executeSql(query);
	 // alert("saved");
	  
  	}
	navigator.notification.confirm(
    				'Evaluation submitted',      // mensaje (message)
    						onConfirmaxxx,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   							 'FieldTracker',            // titulo (title)
        				'Accept'          // botones (buttonLabels)
        				);
  }
  
  function Successfinaleval()
  {
	 // alert("guardado");
	  	  // navigator.notification.confirm(
    				//	'Evaluation submitted',      // mensaje (message)
    				//		onConfirmaxxx,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
   					//		 'FieldTracker',            // titulo (title)
        			//	'Accept'          // botones (buttonLabels)
        			//	);
  }
  function checksubsteps()
  {
	    var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	  db.transaction(function(tx){ Querychecksubsteps(tx) }, errorCB);
  }
  function Querychecksubsteps(tx)
  {
	  tx.executeSql("SELECT * FROM SUBMITTEDSTEPS", [], QuerychecksubstepsSuccess, errorCB);  
  }
  function QuerychecksubstepsSuccess(tx,results)
  {
	  var len = results.rows.length;
	 // alert(len+"number of submittedsteps on table");
  }

///////=============================<<<<<<<<<<<< END EVALUATIONS STEPS PAGE  >>>>>>>>>>>=========================================///////

///////<<<<<<<<<<<<============================= FUNCTION TO VERIFY STEPS HAVE MEDIA =========================================>>>>>>>>>>>
//Dropdown Components
	function verifymediainsubmitted(SubmitID)
	{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ Queryverifymedia(tx,SubmitID) }, errorCB);
	}

     function Queryverifymedia(tx,SubmitID)
   {
	  
		tx.executeSql("SELECT * FROM MEDIA WHERE SubmitID='"+SubmitID+"'", [], verifymediaSuccess, errorCB);
	   
   }
   
   function verifymediaSuccess(tx, results)
   {
	    var len = results.rows.length;
		var query;
		var resulttocount=results
		var mediaquant=0;
		for (var i=0; i<results.rows.length; i++){
			mediaquant=0;
			for (var t=0; t<resulttocount.rows.length; t++){
				if(results.rows.item(i).StepID==results.rows.item(t).StepID)
				{
					mediaquant++;
				}
			}
			query="UPDATE SUBMITTEDSTEPS SET HaveMedia='yes', NumFiles='"+mediaquant+"' WHERE SubmitID='"+results.rows.item(i).SubmitID+"' AND StepID='"+results.rows.item(i).StepID+"'";
			//alert(query);
			tx.executeSql(query);
			
			
		}
		 
	   
   }
	   
	   ///////=============================<<<<<<<<<<<< END FUNCTION TO VERIFY STEPS HAVE MEDIA  >>>>>>>>=====================///////
	   
	   ///////<<<<<<<<<<<<============================= FUNCTION TO CHANGE DATE FORMAT =========================================>>>>>>>>>>>
	   function ShowFormatDate(olddate)
	   {
		   try
		   {
		   var d1 = Date.parse(olddate);
		   var format=sessionStorage.dateformat;
		   if(format=="2")
		   {
			   return d1.toString('dd/MM/yyyy');
			   
		   }
		   else
		   {
			   return d1.toString('MM/dd/yyyy');
		   }
		   }
		   catch(err)
		   {
			   return err.message;
		   }
		   
			//alert(d1.toString('MM/dd/yyyy H:mm:ss ')+"next: "+d1.toString('dd/MM/yyyy'));
	   }
	   	   function ShowFormatDateFile(olddate)
	   {
		   try
		   {
		   var d1 = Date.parse(olddate);
		   var format=sessionStorage.dateformat;
		   if(format=="2")
		   {
			   return d1.toString('yyyyMMdd');
			   
		   }
		   else
		   {
			   return d1.toString('yyyyMMdd');
		   }
		   }
		   catch(err)
		   {
			   return err.message;
		   }
		   
			//alert(d1.toString('MM/dd/yyyy H:mm:ss ')+"next: "+d1.toString('dd/MM/yyyy'));
	   }
	   
	      function ShowFormatDateTime(olddate)
	   {
		  // alert(olddate);
		   try
		   {
		      var d1 = Date.parse(olddate);
		   var format=sessionStorage.dateformat;
		   if(format=="2")
		   {
			   return d1.toString('dd/MM/yyyy H:mm:ss');
			   
		   }
		   else
		   {
			   return d1.toString('MM/dd/yyyy H:mm:ss');
		   }
		   }
		   catch(err)
		   {
			   return err.message;
		   }
		   	//var d1 = Date.parse('2015-07-23 13:22:53');
			//alert(d1.toString('MM/dd/yyyy H:mm:ss ')+"next: "+d1.toString('dd/MM/yyyy'));
	   }
	   
	   function InsertFormatDate(newdate)
	   {
		   try
		   {
		   var d1 = Date.parse(newdate);
		   return d1.toString('yyyy-MM-dd');
		   }
		   catch(err)
		   {
			   return "";
		  }
		   
	   }
	   
	   function GetDateFormat()
	   {
		   try
		   {
		      var format=sessionStorage.dateformat;
		   if(format=="2")
		   {
			   return 'dd/MM/yyyy';
			   
		   }
		   else
		   {
			   return 'MM/dd/yyyy';
		   }
		   }
		   catch(err)
		   {
			   return err.message;
		   }

		}
	   
	   
	   
	   ///////=============================<<<<<<<<<<<< END FUNCTION CHANGE DATE FORMAT  >>>>>>>>=====================///////
	   
   ///////<<<<<<<<<<<<============================= BackUp Folders  =========================================>>>>>>>>>>>	


  
function backupfolder()
{
	// What directory should we place this in?
if (cordova.file.documentsDirectory !== null) {
    // iOS, OSX
    texportDirectory = cordova.file.documentsDirectory;
} else if (cordova.file.sharedDirectory !== null) {
    // BB10
   texportDirectory = cordova.file.sharedDirectory;
} else if (cordova.file.externalRootDirectory !== null) {
    // Android, BB10
    texportDirectory = cordova.file.externalRootDirectory;
} else {
    // iOS, Android, BlackBerry 10, windows
    texportDirectory = cordova.file.DataDirectory;
} 

window.resolveLocalFileSystemURL(texportDirectory, function (directoryEntry) {
    console.log("Got directoryEntry. Attempting to open / create subdirectory:" + tsubdir);
    directoryEntry.getDirectory(tsubdir, {create: true}, function (subdirEntry) {
	
    }, onGetDirectoryFail);
	directoryEntry.getDirectory("FieldTracker", {create: true}, function (subdirEntry) {
		
    }, onGetDirectoryFail);
}, onGetDirectoryFail);
	
}


function onGetDirectoryFail(error) { 
        alert("Error creating directory "+error.code);
     console.log("Error creating directory "+error.code); 
}

   ///////<<<<<<<<<<<<=============================END FUNCTION BackUp Folders  =========================================>>>>>>>>>>>
  var textProcedures="";
  var textSteps="";
  var fulltextexport=""; 
   function GetTextBackup()
{
	 var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryGetTextBackup, errorCB);
}

function QueryGetTextBackup(tx)
{
	tx.executeSql("SELECT * FROM SUBMITTEDPROCS ORDER BY  SubmitDate,SubmitID", [], QueryGetTextBackupSuccess, errorCB);
}
function QueryGetTextBackupSuccess(tx,results)
{
	var txtinitial="ProcID,UserID,Name,SubmitDate,EvalUserName,EvalUserPos"+"\n";
	var content="";
	for (var t=0; t<results.rows.length; t++){
content+=results.rows.item(t).ProcID+","+results.rows.item(t).UserID+',"'+results.rows.item(t).Name+'",'+results.rows.item(t).SubmitDate+',"'+results.rows.item(t).EvalUserName+'","'+results.rows.item(t).Position+'" '+String.fromCharCode(13)+String.fromCharCode(10);       
	}
    textProcedures=txtinitial+content;	
	textstepsub();  
}
function textstepsub()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Querytextstepsub, errorCB);
	
}
function Querytextstepsub(tx)
{
	tx.executeSql("SELECT SUBMITTEDSTEPS.ProcID,SUBMITTEDSTEPS.StepID,SUBMITTEDSTEPS.Num,SUBMITTEDSTEPS.Text,SUBMITTEDSTEPS.Comments,SUBMITTEDSTEPS.Response,SUBMITTEDSTEPS.UserID,SUBMITTEDPROCS.EvalUserName,SUBMITTEDPROCS.Position FROM SUBMITTEDSTEPS INNER JOIN SUBMITTEDPROCS ON SUBMITTEDSTEPS.SubmitID=SUBMITTEDPROCS.SubmitID  ORDER BY  SUBMITTEDPROCS.SubmitDate,SUBMITTEDPROCS.SubmitID,CAST(SUBMITTEDSTEPS.Num AS INTEGER)", [], QuerytextstepsubSuccess, errorCB);
	
}
function QuerytextstepsubSuccess(tx,results)
{
	var txtinitial="ProcID,Num,Text,Comments,Response,UserID,EvalUserName,EvalUserPos"+"\n";
	var content="";
	for (var t=0; t<results.rows.length; t++){
      content+=results.rows.item(t).ProcID+","+results.rows.item(t).Num+',"'+results.rows.item(t).Text+'","'+results.rows.item(t).Comments+'","'+results.rows.item(t).Response+'",'+results.rows.item(t).UserID+',"'+results.rows.item(t).EvalUserName+'","'+results.rows.item(t).Position+'"'+String.fromCharCode(13)+String.fromCharCode(10);        
	}
	fulltextexport=textProcedures+"\n"+txtinitial+content;
	//alert("insertaratexto");
	needbackup();
	
}
   
   function backupdb()
{
	GetTextBackup();
	 //Deleteoldfile();
	//alert("Error creating file "+"EACCES (Permission denied)");
	//needbackup();
}
function needbackup()
{
		// What directory should we place this in?
if (cordova.file.documentsDirectory !== null) {
    // iOS, OSX
    texportDirectory = cordova.file.documentsDirectory;
} else if (cordova.file.sharedDirectory !== null) {
    // BB10
   texportDirectory = cordova.file.sharedDirectory;
} else if (cordova.file.externalRootDirectory !== null) {
    // Android, BB10
    texportDirectory = cordova.file.externalRootDirectory;
} else {
    // iOS, Android, BlackBerry 10, windows
    texportDirectory = cordova.file.DataDirectory;
} 
var dt = new Date();
var Datexxx = dt.toYMD();
var realdate=ShowFormatDateFile(Datexxx);
var userid=sessionStorage.userid;
var archivename=realdate+userid+".csv";
//alert(archivename);
window.resolveLocalFileSystemURL(texportDirectory, function (directoryEntry) {
    console.log("Got directoryEntry. Attempting to open / create subdirectory:" + tsubdir);
    directoryEntry.getDirectory(tsubdir, {create: true}, function (subdirEntry) {
	subdirEntry.getFile(archivename, {create: true}, function (fileEntry) {
		    
            fileEntry.createWriter(function (fileWriter) {
                console.log("Got fileWriter");
				 fileWriter.onwrite = function (evt) {
                console.log("write success");
				navigator.notification.alert("Backup "+archivename+" Saved", null, 'FieldTracker', 'Accept');
            };
		        // alert("escribir");
            	fileWriter.write(fulltextexport);
        		
				//navigator.notification.alert("Backup "+archivename+" Saved", null, 'FieldTracker', 'Accept');
				//alert(userid);
                // make your callback to write to the file here...
            }, FileexportFail);
        }, FileexportFail);	
	
    }, onGetDirectoryFail);
}, onGetDirectoryFail);
	
}

function FileexportFail()
{
	alert("Error creating file");
}

function Deleteoldfile()
{
	if (cordova.file.documentsDirectory !== null) {
    // iOS, OSX
    texportDirectory = cordova.file.documentsDirectory;
} else if (cordova.file.sharedDirectory !== null) {
    // BB10
   texportDirectory = cordova.file.sharedDirectory;
} else if (cordova.file.externalRootDirectory !== null) {
    // Android, BB10
    texportDirectory = cordova.file.externalRootDirectory;
} else {
    // iOS, Android, BlackBerry 10, windows
    texportDirectory = cordova.file.DataDirectory;
} 
texportDirectory =texportDirectory+"\EvalArcs";
var dt = new Date();
var Datexxx = dt.toYMD();
var realdate=ShowFormatDateFile(Datexxx);
var userid=sessionStorage.userid;
var archivename=realdate+userid+".csv";
window.resolveLocalFileSystemURL(texportDirectory, function(dir) {
	dir.getFile(archivename, {create:false}, function(fileEntry) {
              fileEntry.remove(function(){
				  alert("The file has been removed succesfully");
				  needbackup();
                  // The file has been removed succesfully
              },function(error){
				  alert("Error deleting the file");
                  // Error deleting the file
              },function(){
				  // alert(" The file doesn't exist");
				  needbackup();
                 // The file doesn't exist
              });
	});
});
}

