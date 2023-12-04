// get libraries/modules
const cds = require('@sap/cds')
const dbClass = require("sap-hdbext-promisfied")
const hdbext = require("@sap/hdbext")
const lib_admin_panel = require('./LIB/iven_library_admin_panel')
const lib_common = require('./LIB/iven_library')
const lib_email = require('./LIB/iven_library_email')
const lib_mdg = require('./LIB/iven_library_mdg')
const connect = require('passport/lib/framework/connect')

// const { results } = require('@sap/cds/lib_admin_panel/utils/cds-utils')

module.exports = cds.service.impl(function () {
   //////////////////////////Dynamic Logic /////////////////////////
   this.on('PostAdminPanelData', async (req) => {
    try {

      //local Variables
      var oReqData = JSON.parse(req.data.input);
      var sAction = oReqData.ACTION ;
      var sTableName = oReqData.TABLE_NAME;
      var sTableDesc = oReqData.TABLE_DESCRIPTION;    
      var aInputData = oReqData.INPUT_DATA || null;
      var sResponse = null;
      var oUserDetails=oReqData.USER_DETAILS||{};                 
      var sUserID=oUserDetails.USER_ID || null;
      var sUserRole=oUserDetails.USER_ROLE || null;  

      // get connection
      // var client = await dbClass.createConnectionFromEnv();
      // let dbConn = new dbClass(client);
      // // load procedure
      // const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'ADMINPANEL_POSTDATA')

      //connect to db
      let conn = await cds.connect.to('db');

      if (sAction === "CREATE" || sAction === "IMPORT_CSV") {

        try{
        //Refactor payload for Import CSV
          if(sAction === "IMPORT_CSV")
            aInputData =await lib_admin_panel.removeMetadata(aInputData);
        
          if(sTableName === 'MASTER_ENTITY_CODE' )
          {
             //Refactor payload for Import CSV
            if(sAction === "IMPORT_CSV")
            aInputData = await lib_admin_panel.convertIntegerToString(aInputData);
          }
          else if(sTableName === 'MASTER_REGFORM_FIELDS_MANDATORY' || sTableName === 'MASTER_REGFORM_FIELDS_VISIBLE') {
            //Refactor payload for Import CSV
            if(sAction === "IMPORT_CSV")
              aInputData = await lib_admin_panel.getUpdatedFieldsData(aInputData,conn);
          }
         
            sResponse = await lib_admin_panel.funcPostAdminPanelData(conn,sAction,sTableName, sTableDesc,aInputData)
         
          return sResponse
        }catch(error){
          var sType=error.code?"Procedure":"Node Js";    
          var iErrorCode=error.code??500;     
          let Result = {
              OUT_ERROR_CODE: iErrorCode,
              OUT_ERROR_MESSAGE:  error.message ? error.message : error
          }
          lib_common.postErrorLog(Result,null,sUserID,sUserRole,"System Configuration",sType,dbConn,hdbext);
          req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }

      }
      else if (sAction === "DELETE") {
        try{
          var oData = aInputData[0].DELETED_DETAILS;
          sResponse = await lib_admin_panel.funcDeleteAdminPanelData(conn,oData,sTableName,sTableDesc)
          // sResponse = await dbConn.callProcedurePromisified(loadProc,
          //   [sAction, sTableName, sTableDesc, ID, "", "", [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],[],[],[],[]]);
          return sResponse;
        }catch(error){
          var sType=error.code?"Procedure":"Node Js";        
          var iErrorCode=error.code??500;     
          let Result = {
              OUT_ERROR_CODE: iErrorCode,
              OUT_ERROR_MESSAGE:  error.message ? error.message : error
          }
          lib_common.postErrorLog(Result,null,sUserID,sUserRole,"System Configuration",sType,dbConn,hdbext);
          req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
      }
      else if (sAction === "TEST_EMAIl") {
        //Changes By Chandan M Start 15/11/23
        try{
          let connection = await cds.connect.to('db');
          var sEmailBody = aInputData[0].EMAIL_BODY;
          var sEmailSubject = aInputData[0].EMAIL_SUBJECT;
          var aEmailTo = aInputData[0].EMAIL_TO;
          var aEmailCC = aInputData[0].EMAIL_CC;
          var sEmailSender = aInputData[0].EMAIL_SENDER;
          // sResponse = await lib_email.sendEmail(connection, sEmailBody, sEmailSubject, aEmailTo, aEmailCC, sEmailSender)
          var sCCEmail = await lib_email.setSampleCC( [aEmailCC]);
          await  lib_email.sendivenEmail(aEmailTo,sCCEmail,'html', sEmailSubject,sEmailBody)
      
          return sResponse
        }catch(error){     
          var sType=error.code?"Procedure":"Node Js";    
          var iErrorCode=error.code??500;     
          let Result = {
              OUT_ERROR_CODE: iErrorCode,
              OUT_ERROR_MESSAGE:  error.message ? error.message : error
          }
          lib_common.postErrorLog(Result,null,sUserID,sUserRole,"System Configuration",sType,dbConn,hdbext);
          req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }

        //Changes By Chandan M End 15/11/23   
      }


    } catch (error) {
      req.error({ code: "500", message: error.message });
      // lib_common.responseInfo(req,'error','500',error,null)
    }
  })

 

  this.on('EditAdminPanelData', async (req) => {
    try {
      
      //local Variables
      var oReqData = JSON.parse(req.data.input);
      var sEditType = oReqData.EDIT_TYPE || null;
      var sTableName = oReqData.VALUE[0].TABLE_NAME || null;
      var sTableDesc = oReqData.VALUE[0].TABLE_DESCRIPTION || null;
      var aMasterData = oReqData.VALUE[0].TABLE_DATA || [];
      var oPrimaryKeydetails = oReqData.VALUE[0].PRMIARY_KEY_DETAILS || [];
      var sResponse = null;

      var oUserDetails=oReqData.USER_DETAILS;   
      var sUserID=oUserDetails.USER_ID || null;
      var sUserRole=oUserDetails.USER_ROLE || null;  

      // Edit Forms Fields
      var sEntityCode = oReqData.CCODE || null;
      var iType = oReqData.TYPE || null;
      aData = oReqData.VALUE[0].TABLE_DATA;

      //Local Variable for edit forms
      var masterName, masterData, tableDescription, editType;
      // get connection
      // var client = await dbClass.createConnectionFromEnv();
      // let dbConn = new dbClass(client);
      
      var connection = await cds.connect.to('db');
    
      // load procedure
      // const loadProc = await dbConn.loadProcedurePromisified(hdbext, null, 'ADMINPANEL_EDITDATA')
      if (sEditType === 'EDIT_MASTERS') {
        try{
          sResponse = await lib_admin_panel.funcEditAdminPanelData(connection,aData,sTableName,sTableDesc,oPrimaryKeydetails)
          return sResponse;
        }catch(error){
          var sType=error.code?"Procedure":"Node Js";    
          var iErrorCode=error.code??500;     
          let Result = {
              OUT_ERROR_CODE: iErrorCode,
              OUT_ERROR_MESSAGE:  error.message ? error.message : error
          }
          lib_common.postErrorLog(Result,null,sUserID,sUserRole,"System Configuration",sType,dbConn,hdbext);
          req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
      }
      else if (sEditType === 'EDIT_FORMS') {
        try{
          var successMsg = '',
            aTableDesc = [],
            iChangeCount = 0,
            aSuccessArray = [];

          for (var i = 0; i < oReqData.VALUE.length; i++) {

            if (oReqData.VALUE[i].CHANGE_FLAG === "YES") {
              iChangeCount = iChangeCount + 1;
              masterName = oReqData.VALUE[i].TABLE_NAME;
              editType = oReqData.EDIT_TYPE;
              masterData = oReqData.VALUE[i].TABLE_DATA;
              tableDescription = oReqData.VALUE[i].TABLE_DESCRIPTION;
              aTableDesc.push(tableDescription)
                sResponse = await lib_admin_panel.funcEditFormsAdminPanelData(connection,masterName,masterData,oPrimaryKeydetails);
            if (sResponse !== null) {
                if (sResponse === 'Y') {
                  aSuccessArray.push(sResponse);
                }
              }

            }
          }
          // if (aSuccessArray.length === iChangeCount) {
          //   // conn.commit();

          // }
          // Created Success Msg Dynamically Cause Needed Both Master Or One Master at a Time With The Help Change Flag
          successMsg = await lib_common.generateSuccessMessage(aTableDesc);
          return successMsg
        }catch(oError){
          var sType=error.code?"Procedure":"Node Js";    
          var iErrorCode=error.code??500;     
          let Result = {
              OUT_ERROR_CODE: iErrorCode,
              OUT_ERROR_MESSAGE:  error.message ? error.message : error
          }
          lib_common.postErrorLog(Result,null,sUserID,sUserRole,"System Configuration",sType,dbConn,hdbext);
          req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
      }
      else if (sEditType === "FORM_FIELDS") {
        try{
        // conn = $.hdb.getConnection();
        let conn = await cds.connect.to('db');
  
        // var sEntityCode = oPayload.VALUE.CCODE;
        // var iType = oPayload.VALUE.TYPE;
        // aData = oPayload.VALUE.DATA;
  
        var obj = {};
        var oVisibilityObj = {};
        var oMandatoryObj = {};
        var oFieldDescObj = {};
        var oVisibilityObjTemp = {};
        var oMandatoryObjTemp = {};
        var oFieldDescTemp = {};
        var aVisibilityArr = [];
        var aMandatoryArr = [];
        var aFieldDescArr = [];
  
        for (var i = 0; i < aData.length; i++) {
          obj = aData[i];
          if (i === 0) {
            oVisibilityObj.CCODE = sEntityCode;
            oVisibilityObj.TYPE = iType;
            oMandatoryObj.CCODE = sEntityCode;
            oMandatoryObj.TYPE = iType;
            oFieldDescObj.CCODE = sEntityCode;
            oFieldDescObj.TYPE = iType;
          }
  
          oVisibilityObjTemp[obj.FIELDS.toString()] = obj.VISIBILITY;
          oMandatoryObjTemp[obj.FIELDS.toString()] = obj.MANDATORY;
          oFieldDescTemp[obj.FIELDS.toString()] = obj.DESCRIPTION;
          aVisibilityArr.push(oVisibilityObjTemp);
          aMandatoryArr.push(oMandatoryObjTemp);
          aFieldDescArr.push(oFieldDescTemp);
        }
  
        oVisibilityObj.FIELDS = aVisibilityArr;
        oMandatoryObj.FIELDS = aMandatoryArr;
        oFieldDescObj.FIELDS = aFieldDescArr;
  
     var   results = await lib_admin_panel.updateData(conn, oVisibilityObj, oMandatoryObj, oFieldDescObj);
  return results;
        }catch(error){
          var sType=error.code?"Procedure":"Node Js";    
          var iErrorCode=error.code??500;     
          let Result = {
              OUT_ERROR_CODE: iErrorCode,
              OUT_ERROR_MESSAGE:  error.message ? error.message : error
          }
          lib_common.postErrorLog(Result,null,sUserID,sUserRole,"System Configuration",sType,dbConn,hdbext);
          req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
        // responseInfo(JSON.stringify(results), "text/plain", 200);
      }
      else if (sEditType === "FORM_SETTINGS") {
        try{
          // sResponse = await dbConn.callProcedurePromisified(loadProc,
          //   [sEditType, sTableName, sTableDesc, [], [], [], [], [], [], [], [], [], [], [], [], [], aData, [], [], [], [], [],[] ]);
      sResponse = await lib_admin_panel.funcFormSettingAdminPanelData(connection,aData)
          // aData = oPayload.VALUE.DATA || [];
          // results = updateSettings(conn, aData);
          return sResponse
        }catch(error){
          var sType=error.code?"Procedure":"Node Js";    
          var iErrorCode=error.code??500;     
          let Result = {
              OUT_ERROR_CODE: iErrorCode,
              OUT_ERROR_MESSAGE:  error.message ? error.message : error
          }
          lib_common.postErrorLog(Result,null,sUserID,sUserRole,"System Configuration",sType,dbConn,hdbext);
          req.error({ code:iErrorCode, message:  error.message ? error.message : error }); 
        }
    }

    } catch (error) {       
      var sType=error.code?"Procedure":"Node Js";    
      var iErrorCode=error.code??500;     
      let Result = {
          OUT_ERROR_CODE: iErrorCode,
          OUT_ERROR_MESSAGE:  error.message ? error.message : error
      }
      lib_common.postErrorLog(Result,null,sUserID,sUserRole,"System Configuration",sType,dbConn,hdbext);
      req.error({ code:iErrorCode, message:  error.message ? error.message : error });
    }
  })
 //////////////////////////Dynamic Logic /////////////////////////
  
  this.on('GetAdminPanelData', async (req) => {
    try {
  
      // local variables
      const { action, tableCode, requestNo } = req.data;
      var sQueryResult = null, sTableName = null

      var connection = await cds.connect.to('db');

      if (action === "MASTER_TABLES") {
        //Fetch Table Name from Input Table Code
        sTableName = await lib_admin_panel.getTableNameFromTableCode(connection, tableCode)

        //Fetch Data based on Table Name
        sQueryResult = await lib_admin_panel.getDataFromTableName(connection, sTableName)
        console.log(sQueryResult)
        return sQueryResult
      }
      else if (action === "DASHBOARD") {
        // Get dashboard data from admin panel library
        var oResponse = await lib_admin_panel.getDashboardData(connection);
        return oResponse
      }
      else if (action === 'MASTER_FORMS') {

        var responseObj = {
          "Results": await lib_admin_panel.getMasterFormsData(connection),
          "ProgressBar": await lib_admin_panel.getPercentOfConfig(connection)
        };
        // iVen_Content.responseInfo(JSON.stringify(responseObj), "application/json", 200);
        return responseObj;
      }
      else if (action === "MDG_PAYLOAD") { 
		    responseObj = {};
    		responseObj.MDGPayload =await lib_mdg.getActiveDataPayload(connection, parseInt(requestNo, 10));
		    // responseInfo(JSON.stringify(responseObj), "application/json", 200);
		    req.reply(responseObj)
		}
      // else if(action === 'TEST_CONNECTION'){
      //   try{
      //       //   set connection to ZIVN_VENDOR_REG_SRV Destination
      //       var iVenVendorConnection = await cds.connect.to('ZIVN_VENDOR_REG_SRV');
      //       var response = await iVenVendorConnection.send({
      //         method: 'GET',
      //         path: '/GetCitySet',
      //         headers: { 'Content-Type': 'application/json' }
      //       })
      //       if( response.length >= 0)
      //         req.reply("Test Connection Successful");   
      //   }
      //   catch(error)
      //   {
      //     throw error;
      //   }
      // }

    } catch (error) {
      req.error({ code: "500", message: error.message ? error.message : error});
    }
  })

  this.on('TestOnPremiseConnection',async(req) =>{
    try{
      var {sapClient,destFileName} = req.data;
      //   set connection to ZIVN_VENDOR_REG_SRV Destination
      var iVenVendorConnection = await cds.connect.to('ZIVN_VENDOR_REG_SRV');
      var response = await iVenVendorConnection.send({
        method: 'GET',
        path: '/GetCitySet',
        headers: { 'Content-Type': 'application/json',
                    "sap-client":sapClient }
      })
      if( response.length >= 0)
        req.reply("Test Connection Successful");   
  }
  catch(error)
  {
    throw error;
  }
  })

 
  //Function to get all Registraion Form Mandatory & Visible fields
  this.on('GetVisbleMandatoryFields', async (req) => {

    try {
      // local variables
      const { requestType, entityCode } = req.data;

      let conn = await cds.connect.to('db');
      var aVisiMandatArrFields = [], responseObj = {};

      var columnTemplate = await lib_common.getTemplateColumns(conn);
      var aFieldDescData = await lib_admin_panel.getFieldsDescData(conn);
      var aFieldDescObj = {};

      var aTemplateKeys = Object.keys(columnTemplate[0]);
      var sTempCcode = null, iTempType = null, obj = {};

      if (entityCode === "TEMPLATE") {

        for (var i = 0; i < aTemplateKeys.length; i++) {
          if (aTemplateKeys[i] === "CCODE") {
            sTempCcode = entityCode;
          } else if ((aTemplateKeys[i] === "TYPE")) {
            iTempType = 1;
          } else {
            obj["SRNO"] = i - 1;
            obj["FIELDS"] = aTemplateKeys[i];
            obj["VISIBILITY"] = null;
            obj["MANDATORY"] = null;
            obj["DESCRIPTION"] = null;
            obj["SECTION"] = null;
            aVisiMandatArrFields.push(JSON.parse(JSON.stringify(obj)));
          }
        }

      } else {
        var aVisibleFieldsData = await lib_admin_panel.getVisibleFieldsData(conn, entityCode, requestType);
        var aMandatoryFieldsData = await lib_admin_panel.getMandatoryFieldsData(conn, entityCode, requestType);

        for (var i = 0; i < aTemplateKeys.length; i++) {
          if (aTemplateKeys[i] === "CCODE") {
            sTempCcode = aVisibleFieldsData[0][aTemplateKeys[i].toString()];
          } else if ((aTemplateKeys[i] === "TYPE")) {
            iTempType = parseInt(aVisibleFieldsData[0][aTemplateKeys[i].toString()], 10);
          } else {
            aFieldDescObj = await lib_admin_panel.getFieldsDesc(aTemplateKeys[i], aFieldDescData);
            obj["SRNO"] = i - 1;
            obj["FIELDS"] = aTemplateKeys[i];
            obj["VISIBILITY"] = aVisibleFieldsData[0][aTemplateKeys[i].toString()];
            obj["MANDATORY"] = aMandatoryFieldsData[0][aTemplateKeys[i].toString()];
            obj["DESCRIPTION"] = aFieldDescObj.DESCRIPTION || "NA";
            obj["SECTION"] = aFieldDescObj.SECTION || "NA";
            obj["CATEGORY"] = aFieldDescObj.CATEGORY || "NA";
            aVisiMandatArrFields.push(JSON.parse(JSON.stringify(obj)));
          }
        }
      }

      responseObj = {
        "CCODE": sTempCcode,
        "TYPE": iTempType,
        "DATA": aVisiMandatArrFields.length > 0 ? aVisiMandatArrFields : []
      };

      req.reply(responseObj)

    } catch (error) {
      req.error({ code: "500", message: error.message });
    }

  })


  


})