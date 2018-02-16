function GetUsersSelectCertifications()
{
    var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryUsersSelectCert, errorCB);
}

function QueryUsersSelectCert(tx)
{
    var leveltypes=sessionStorage.lvltype;
    var currentuserlocation=sessionStorage.location;
    if(leveltypes!='9 - Trainee')
    {
        tx.executeSql("SELECT USERS.FirstName, USERS.LastName, Users.Username FROM USERS WHERE Location='"+currentuserlocation+"' ORDER BY LastName,FirstName", [], FillUsersSelectCert, errorCB);
        

    }
    else
    {
        var idusera=sessionStorage.userid;	
       // alert(idusera);
        tx.executeSql("SELECT USERS.FirstName, USERS.LastName, Users.Username FROM USERS WHERE USERS.Username='"+idusera+"' ORDER BY LastName,FirstName", [], FillUsersSelectCert, errorCB);

    }
    //alert(leveltypes);
    
}

function FillUsersSelectCert(tx,results)
{
    var len = results.rows.length;
    var selecthtml='';
    var namze="";
    for (var i=0; i<len; i++){
            namze=results.rows.item(i).LastName+", "+results.rows.item(i).FirstName;
            selecthtml+='<option value="'+results.rows.item(i).Username +'">'+namze+'</option>';
            }
            $("#select_usercertifications").html(selecthtml);
            $('#select_usercertifications').selectmenu('refresh');
            $('#select_usercertifications').selectmenu('refresh', true);
            filltablecertifications();
}

function filltablecertifications()
{
    var tb = $('#bodyscert');
    tb.empty().append("");
    $("#table-scert").table("refresh");
    $("#table-scert").trigger('create');
    $("#supervisorbutton").html('');
    $("#fechayear").val("0");
    $("#fechamonth").val("0");
    $("#fechaday").val("0");
    var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Querytablecert, errorCB);

}
function Querytablecert(tx)
{
    var idusera=$("#select_usercertifications").val();
    $("#hinfocerts").html("");
    //alert(idusera);
    tx.executeSql("SELECT  Users2Certs.FTID,Users2Certs.ID,Certifications.[Desc], Users2Certs.Date, Users2Certs.Expiration, Expires, Title, Months, Days, Years FROM Users2Certs INNER JOIN Certifications ON Users2Certs.ID = Certifications.ID WHERE Users2Certs.UserID ='"+idusera+"'", [], FillQuerytablecert, errorCert);
    
}
function FillQuerytablecert(tx,results)
{
    var len = results.rows.length;
    var tb = $('#body-certifications');
    var tablehtml="";
    var exoou="";
    var initialdates="";
    //alert("create table process "+len);
    for (var t=0; t<len; t++){
        if(results.rows.item(t).Date!="" && results.rows.item(t).Date!="null")
        {
            initialdates=ShowFormatDate(results.rows.item(t).Date);
            if(results.rows.item(t).Expires=="Never")
            {
                exoou="None";
    
            }
            else
            {
                if(results.rows.item(t).Expiration!="" && results.rows.item(t).Expiration!="null")
                {
                    exoou=ShowFormatDate(results.rows.item(t).Expiration);

                }
                else
                {
                    exoou="";

                }
                
            }

        }
        else
        {
            initialdates="";
            if(results.rows.item(t).Expiration!="" && results.rows.item(t).Expiration!="null")
            {
                exoou=ShowFormatDate(results.rows.item(t).Expiration);

            }
            else
            {
                exoou="";

            }
        }
  
        tablehtml+='<tr data-name="'+results.rows.item(t).FTID+'"><td align="center">'+results.rows.item(t).Desc+'</td><td align="center">'+initialdates+'</td><td align="center">'+exoou+'</td></tr>';
    }
    tb.empty().append(tablehtml);
	$("#table-Certifications").table("refresh");
	$("#table-Certifications").trigger('create');
    //alert("certifications for user: "+len);
}

function errorCert(tx, err) {
    alert("DB Error: "+err.message + " Code="+err.code);
 }

 function Getinfocertrow()
 {
    var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(Queryinfocert, errorCB);
 }

 function Queryinfocert(tx)
 {
    var idusera=$("#select_usercertifications").val();
    var tuid=$("#idhcert").val();
    var query="SELECT Users2Certs.FTID,Users2Certs.ID,Certifications.[Desc],Users2Certs.AssesorID,Users2Certs.Date, Users2Certs.Expiration, Expires, Title, Months, Days, Years FROM Users2Certs INNER JOIN Certifications ON Users2Certs.ID = Certifications.ID WHERE Users2Certs.UserID ='"+idusera+"' AND Users2Certs.FTID='"+tuid+"'";
    tx.executeSql(query, [], FillQueryinfocert, errorCert);

 }

 function FillQueryinfocert(tx,results)
 {
    var len = results.rows.length;
    var tb = $('#bodyscert');
    var tablehtml="";
    var assesorname="";
    var completedbutton="";
    var exouracui="";
    var initialdate="";
    var leveltypes=sessionStorage.lvltype;
    $("#idselect").val(results.rows.item(0).FTID);
    $("#fechayear").val(results.rows.item(0).Years);
    $("#fechamonth").val(results.rows.item(0).Months);
    $("#fechaday").val(results.rows.item(0).Days);
    $("#expcertype").val(results.rows.item(0).Expires);
    if(results.rows.item(0).Date!="" && results.rows.item(0).Date!="null")
    {
        $("#entrycertndate").val(results.rows.item(0).Date);
        initialdate=ShowFormatDate(results.rows.item(0).Date);
       // $("#entrycertndate").val(initialdate);
    }
    else
    {
        $("#entrycertndate").val('');
        initialdate='';
    }
    $("#fechacert").val("0");
    if(leveltypes!='9 - Trainee')
    {
        $("#supervisorbutton").html('<div class="ui-block-a"><a href="javascript:SavenewCertification();"  class="ui-btn ui-btn-b">Save</a></div>');
        if(initialdate=="")
        {
            initialdate="Enter Date";
        }
        completedbutton='<a href="javascript:Opencertnewdate();" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-transition="flow" id="inicertdates">'+initialdate+'</a>';
    }
    else
    {
        completedbutton=initialdate;
        $("#fechacert").val("");
    }
    if(results.rows.item(0).Date!="" && results.rows.item(0).Date!="null")
        {
            $("#fechacert").val(results.rows.item(0).Date);
            if(results.rows.item(0).Expires=="Never")
            {
                exouracui="None";
    
            }
            else
            {
                if(results.rows.item(0).Expiration!="" && results.rows.item(0).Expiration!="null")
                {
                    exouracui=ShowFormatDate(results.rows.item(0).Expiration);
    
                }
                else
                {
                    exouracui="";
    
                }
            }

        }
        else
        {
            if(results.rows.item(0).Expiration!="" && results.rows.item(0).Expiration!="null")
            {
                exouracui=ShowFormatDate(results.rows.item(0).Expiration);

            }
            else
            {
                exouracui="";

            }
        }
    tablehtml+='<tr><td align="center">'+results.rows.item(0).Title+'</td><td align="center">'+results.rows.item(0).Desc+'</td><td align="center" id="assesornamec"></td><td align="center">'+completedbutton+'</td><td align="center">'+exouracui+'</td></tr>';
    
    tb.empty().append(tablehtml);
	$("#table-scert").table("refresh");
    $("#table-scert").trigger('create');
    $("#hinfocerts").html("Selected Certification");
    FillNameByAssesor(results.rows.item(0).AssesorID);

 }

 function FillNameByAssesor(iduser)
{	
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ QueryByAssesor(tx,iduser)}, errorCB);

}

function QueryByAssesor(tx,iduser)
{
	var query="SELECT USERS.FirstName, USERS.LastName, Users.Username FROM USERS WHERE USERS.Username='"+iduser+"'";
	tx.executeSql(query, [],function(tx,results){ QueryByAssesorSuccessP(tx,results,iduser) }, errorCB);	
}

function QueryByAssesorSuccessP(tx,results,iduser)
{
	var len=results.rows.length;
	if(len>0)
	{
		//alert(results.rows.item(0).LastName+', '+results.rows.item(0).FirstName);
		$("#assesornamec").empty().append(results.rows.item(0).LastName+', '+results.rows.item(0).FirstName);
		$("#table-scert").table("refresh");
		//return results.rows.item(0).LastName+', '+results.rows.item(0).FirstName;
	}
}

function Opencertnewdate()
{
    $("#popuphoracert").popup("open");
}

function Entercertnewdate()
{
    var newdates=$("#entrycertndate").val();
    if(newdates!="0" && newdates!="")
    {
       
        
        $("#fechacert").val(newdates);
        $("#inicertdates").html(ShowFormatDate(newdates));
        $("#table-scert").table("refresh");

    }
    else
    {
        $("#inicertdates").html("Enter Date");
        $("#table-scert").table("refresh");
        $("#fechacert").val("0");

    }
    $("#popuphoracert").popup('close');
  

}

function Clearcertnewdate()
{
    $("#inicertdates").html("Enter Date");
    $("#table-scert").table("refresh");
    $("#fechacert").val("0");
    $("#popuphoracert").popup('close');

}

function SavenewCertification()
{
    var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerySaveCert, errorCB);
}

function QuerySaveCert(tx)
{
    try
    {
        var idusera=sessionStorage.userid;
        var idusseredit=$("#select_usercertifications").val();
        var idsellected=$("#idselect").val();
        var years=$("#fechayear").val();
        var months=$("#fechamonth").val();
        var days=$("#fechaday").val();
        var initialdate=$("#fechacert").val();
        var exptype=$("#expcertype").val();
        var enddate="";
        var query="";
       // alert(initialdate);
        if(exptype=="Never")
        {
            if(initialdate=="0")
            {
                initialdate="";
            }
            query='UPDATE USERS2CERTS SET Date="'+initialdate+'", AssesorID="'+idusera+'", Sync="no" WHERE FTID="'+idsellected+'" AND UserID="'+idusseredit+'"';
        }
        else
        {
            var newDate = Date.parse(initialdate);
            var newyear=newDate.getFullYear();
            var newmonth=newDate.getMonth()+1;
            var newdia=newDate.getDate();
            newyear=parseFloat(newyear)+parseFloat(years);
            newmonth=parseFloat(newmonth)+parseFloat(months);
            newdia=parseFloat(newdia)+parseFloat(days);
            if(parseFloat(newdia)<=9)
            {
                newdia="0"+newdia;
            }
            if(parseFloat(newmonth)<=9)
            {
                newmonth="0"+newmonth;
            }
           // alert(newyear+"==>"+newmonth+"==>"+newdia);
            enddate=newyear+"-"+newmonth+"-"+newdia;
            if(initialdate=="0")
            {
                initialdate="";
                enddate="";
            }
            query='UPDATE USERS2CERTS SET Date="'+initialdate+'", AssesorID="'+idusera+'",Expiration="'+enddate+'", Sync="no" WHERE FTID="'+idsellected+'" AND UserID="'+idusseredit+'"';
    
        }
        
       // alert(query);
         tx.executeSql(query);  
         navigator.notification.confirm(
                    'Saved',      // mensaje (message)
                        onsuccesscertsaved,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
                            'FieldTracker',            // titulo (title)
                    'Accept'          // botones (buttonLabels)
                    );

    }
    catch(err)
    {
        alert(err);
    }

}

function onsuccesscertsaved(button) {
	StartInsertDirectCertification();
 try
	 {
        filltablecertifications();
	 }
	 catch(error){}

 }

 //Silence Sync
 function StartInsertDirectCertification()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	db.transaction(GetStartDICert, errorCB);	
}

function GetStartDICert(tx)
{
	var querytosend="SELECT * FROM SETTINGS";
	tx.executeSql(querytosend, [], function(tx,results){ GetStartDICertSuccess(tx,results) }, errorCB);
}

function GetStartDICertSuccess(tx,results)
{
	var len = results.rows.length;
	if(len>0)
	{
		$("#ipsync").val(results.rows.item(0).IP);
		StartSyncCertSylence();
	}
}

function StartSyncCertSylence()
{
	var ipserver=$("#ipsync").val();
	sendAloneCertifications="";
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerySyncCertSylence, errorCB);	
}

function QuerySyncCertSylence(tx)
{
	var querytosend="SELECT * FROM USERS2CERTS WHERE Sync='no'";
	tx.executeSql(querytosend, [], QuerySyncCertSylenceSuccess, errorCB);
}

function QuerySyncCertSylenceSuccess(tx,results)
{
	var len = results.rows.length;
	var array = [];
	for (var i=0; i<results.rows.length; i++){
 	row = results.rows.item(i);
 	array.push(JSON.stringify(row));
	}	
	sendAloneCertifications=array;
	ExecutePostCertAlone();
}

function ExecutePostCertAlone()
{
	var ipserver=$("#ipsync").val();
	var obj = {};
	obj['CertificationsUpdate'] =JSON.stringify(sendAloneCertifications); 
	 $.ajax({
                    type: 'POST',
				    url: ipserver+'//SetCertifications',
                    data: JSON.stringify(obj),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                       // alert(response.d);
						if(response.d=="success")
						{

							updatenowcertsincy();
						}
						
           
                      
                    },
                    error: function (xmlHttpRequest, textStatus, errorThrown) {
						//alert("error silence sync");
                    console.log(xmlHttpRequest.responseXML);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
                });
}


function updatenowcertsincy()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(function(tx){ Querynowcertsincyyy(tx) }, errorCB);	
}

function Querynowcertsincyyy(tx)
{
	var query="UPDATE USERS2CERTS SET sync='yes'";
	//alert(query);
	tx.executeSql(query);
	//alert("ejecuta"); 	
}

/// Sync Modal
function opensynccert()
{
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
	db.transaction(Getopensynccertm, errorCB);	
}

function Getopensynccertm(tx)
{
	var querytosend="SELECT * FROM SETTINGS";
	tx.executeSql(querytosend, [], function(tx,results){ GetopensynccertmSuccess(tx,results) }, errorCB);
}

function GetopensynccertmSuccess(tx,results)
{

	var len = results.rows.length;
	if(len>0)
	{
		$("#ipsync").val(results.rows.item(0).IP);
		StartSyncModalcert();
	}
}
function StartSyncModalcert()
{
	var ipserver=$("#ipsync").val();
	sendAloneCertifications="";
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QueryModalcerti, errorCB);	
}

function QueryModalcerti(tx)
{

	var querytosend="SELECT * FROM USERS2CERTS WHERE Sync='no'";
	tx.executeSql(querytosend, [], QueryModalcertiSuccess, errorCB);
}

function QueryModalcertiSuccess(tx,results)
{
     showUpModal();
     try
     {
        $("#progressheader").html("Connecting...");
        $("#progressMessage").html("Waiting for server connection");
        pbar.setValue(0);
        var len = results.rows.length;
        var array = [];
        for (var i=0; i<results.rows.length; i++){
         row = results.rows.item(i);
         array.push(JSON.stringify(row));
        }	
        sendAloneCertifications=array;
        //alert("bien en array");
        ExecutePostCertiModal();

        
     }
     catch(err)
     {
         alert(err);
     }
}

function ExecutePostCertiModal()
{
    try
    {
        $("#progressMessage").html("Certifications ready to send");
        pbar.setValue(20);	
        var ipserver=$("#ipsync").val();
       // alert(ipserver);
        var obj = {};
        obj['CertificationsUpdate'] =JSON.stringify(sendAloneCertifications);  
        $("#progressheader").html("Uploading Data...");
        $("#progressMessage").html("Preparing data to send");
        pbar.setValue(30);
             $.ajax({
                        type: 'POST',
                        url: ipserver+'//SetCertifications',
                        data: JSON.stringify(obj),
                        dataType: 'json',
                        contentType: 'application/json; charset=utf-8',
                        success: function (response) {
                            if(response.d=="success")
                            {
                                pbar.setValue(100);
                                UpdateCertiModalSync();
                            }
                            
               
                          
                        },
                        error: function (xmlHttpRequest, textStatus, errorThrown) {
                        $("#progressheader").html("Can not connect to server");
                                $("#progressMessage").html("Error sending data:" +xmlHttpRequest.responseXML+" Status: "+textStatus+"==>"+xmlHttpRequest.statusText+" thrown: "+errorThrown);
                                alert("error");
                                 setTimeout(function () { $(':mobile-pagecontainer').pagecontainer('change', '#pageLogbook', {
                                                        transition: 'slidedown',
                                                        changeHash: false,
                                                           reverse: true,
                                                           showLoadMsg: true
                                                        }); }, 12000);
                        
                        console.log(xmlHttpRequest.responseXML);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                    });

    }
    catch(error)
    {
        alert(error);
    }
   

}

function UpdateCertiModalSync()
{
   
	$("#progressheader").html("Connecting...");
	$("#progressMessage").html("Waiting for server connection");
	pbar.setValue(10);
    var ipserver=$("#ipsync").val();
    var obj = {};
    //alert(ipserver);
    $.ajax({
        type: 'POST',
        url:ipserver+'//GetCertificationsData',
        data: JSON.stringify(obj),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            InsertDatabaseCertsLogModal(response.d);
        },
                        error: function (xmlHttpRequest, textStatus, errorThrown) {
                        $("#progressheader").html("Can not connect to server");
                         $("#progressMessage").html("Error sending data:" +xmlHttpRequest.responseXML+" Status: "+textStatus+"==>"+xmlHttpRequest.statusText+" thrown: "+errorThrown);
                         setTimeout(function () { $(':mobile-pagecontainer').pagecontainer('change', '#pageCert', {
                            transition: 'slidedown',
                            changeHash: false,
                               reverse: true,
                               showLoadMsg: true
                            }); }, 12000);
                            console.log(xmlHttpRequest.responseXML);
                            console.log(textStatus);
                            console.log(errorThrown);
    }
    });

}

function InsertDatabaseCertsLogModal(newdatabase)
{
	$("#progressheader").html("Connected");
	$("#progressMessage").html("Successful connection");
	pbar.setValue(70);
	newcertsdatatoinsert=newdatabase;
	var db = window.openDatabase("Fieldtracker", "1.0", "Fieldtracker", 50000000);
    db.transaction(QuerytDatabaseCertsLogModal, errorCB);
	
}

function QuerytDatabaseCertsLogModal(tx)
{
	$("#progressMessage").html("Insert New data");
	$("#progressMessage").html("Deleting old records");
		pbar.setValue(2);
		//alert("Deleting "+idusera);
		tx.executeSql("DELETE FROM CERTIFICATIONS");
		tx.executeSql("DELETE FROM USERS2CERTS");


	$("#progressMessage").html("Ready to insert new records");
	var query;
    var obj = jQuery.parseJSON(newcertsdatatoinsert.Certifications);
    var cuantos=obj.length;
	var itemcount=0;
	 try
	 {
    $.each(obj, function (key, value) {
		query='INSERT INTO CERTIFICATIONS (ID,Title,Desc,Type,ReqAllUsers,Expires,Months,Years,Days) VALUES ("'+escapeDoubleQuotes(value.ID)+'", "'+escapeDoubleQuotes(value.Title)+'", "'+escapeDoubleQuotes(value.Desc)+'", "'+escapeDoubleQuotes(value.Type)+'", "'+value.ReqAllUsers+'", "'+escapeDoubleQuotes(value.Expires)+'", "'+value.Months+'", "'+value.Years+'","'+value.Days+'")';
		//alert(query);
		tx.executeSql(query);
		itemcount++;
     });
	 //alert("Certifications: "+itemcount);
	 
	 	$("#progressMessage").html("Certifications updated");
	pbar.setValue(10);
	 }
	 catch(error)
	 {
		 alert(error);
		 $("#progressMessage").html("Error updating Certifications "+error);
			pbar.setValue(30);
		 
	 }
	 itemcount=0;
     obj=jQuery.parseJSON(newcertsdatatoinsert.Users2Certs);
     cuantos=obj.length;
	 try
	 {
    $.each(obj, function (key, value) {
		query='INSERT INTO USERS2CERTS (FTID,UserID,ID,Date,Expiration,AlertSent,CertFile,AssesorID,PrintID) VALUES ("'+"ft"+itemcount+'","'+escapeDoubleQuotes(value.UserID)+'", "'+escapeDoubleQuotes(value.ID)+'", "'+escapeDoubleQuotes(value.Date)+'", "'+escapeDoubleQuotes(value.Expiration)+'", "'+value.AlertSent+'", "'+value.CertFile+'", "'+value.AssesorID+'","'+value.PrintID+'")';
		tx.executeSql(query);
        itemcount++;
        if(itemcount==cuantos)
		{
			pbar.setValue(100);
		$("#progressheader").html("Sync completed");
		setTimeout( function(){ 
	 	$(':mobile-pagecontainer').pagecontainer('change', '#pageCert', {
 	 	transition: 'flip',
		changeHash: false,
		reverse: true,
		showLoadMsg: true
		});
	}, 3000 );
			
		}
     });
	 }
	 catch(error)
	 {
		 alert(error);
		 $("#progressMessage").html("Error updating USERS2CERTS "+error);
			pbar.setValue(50);
		 
	 }
	 	 


}