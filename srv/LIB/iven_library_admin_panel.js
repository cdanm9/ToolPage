const cds = require("@sap/cds");
const lib_common = require('./iven_library')
module.exports = {

  // getArrayFromResult: async function (aResult) {
  //     var aDataObjects = Object.keys(aResult).map(function(key) {
  //       return aResult[key];
  //     });

  //     return aDataObjects;
  // },

  getDataFromTableName: async function (connection, sTableName) {
    try {
      //local Variables
      var responseObject = {}, TableInfo = null;
      var sfullTableName ='VENDOR_PORTAL.' + sTableName
      if(!(sfullTableName in connection.entities)){
        throw "Table not configured in backend. Please Contact Admin"
      }

      // let connection = await cds.connect.to('db');
      let queryResult = await connection.run(SELECT.from`${connection.entities[sfullTableName]}`);

      TableInfo = await this.getMasterTableSchema(connection, sTableName) || [];
      responseObject['sTableName'] = queryResult || [];
      responseObject['TableColumns'] = TableInfo;
      responseObject['TableColumnsCount'] = TableInfo.length;
      return responseObject;
    }
    catch (error) { throw error; }
  },

  getTableNameFromTableCode: async function (connection, sTableCode) {
    try {

      // let connection = await cds.connect.to('db');
      let queryResult = await connection.run(SELECT`TABLE_NAME`.from`${connection.entities['VENDOR_PORTAL.MASTER_TABLENAMES']}`
        .where`TABLE_CODE = ${sTableCode}`);
      return queryResult[0].TABLE_NAME;
    }
    catch (error) { throw error; }
  },

  // #TabName : Masters
  getMasterTableSchema: async function (connection, sTableName) {
    try {
      // let connection = await cds.connect.to('db');
      let queryResult = await connection.run(SELECT`COLUMN_NAME ,DATA_TYPE_NAME`.from`TABLE_COLUMNS`
        .where`TABLE_NAME = ${'VENDOR_PORTAL_' + sTableName}`);

      var aDataObjects = Object.keys(queryResult).map(function (key) {
        return queryResult[key].COLUMN_NAME;
      });
      return aDataObjects
    }
    catch (error) { throw error; }

  },

  getMasterTablenamesData: async function (connection, sTableType) {
    try {
      var aResult = null;
      var queryResult

      // let connection = await cds.connect.to('db');

      if (sTableType !== null) {
        queryResult = await connection.run(SELECT.from`${connection.entities['VENDOR_PORTAL.MASTER_TABLENAMES']}`
          .where`TABLE_TYPE = ${sTableType}`.orderBy`TABLE_DESCRIPTION`);
      }
      else {
        queryResult = await connection.run(SELECT.from`${connection.entities['VENDOR_PORTAL.MASTER_TABLENAMES']}`
          .orderBy`TABLE_DESCRIPTION`);
      }

      return queryResult;
    }
    catch (error) { throw error; }
  },

  getRowCountOfTables: async function (connection, sTableName) {
    try {
     var sfullTableName = 'VENDOR_PORTAL.' + sTableName;
     var aDataObjects =[];
      if(sfullTableName in connection.entities){
      // let connection = await cds.connect.to('db');
      let queryResult = await connection.run(SELECT`COUNT(*) as COUNT`
        .from`${connection.entities['VENDOR_PORTAL.' + sTableName]}`);

       aDataObjects = Object.keys(queryResult).map(function (key) {
        return queryResult[key].COUNT;
      });
    }

      return parseInt(aDataObjects[0], 10) || 0;
    }
    catch (error) { throw error; }
  },

  // This funtion gives row counts of all Master Tables maintained in MASTER_TABLENAMES
  getRowCountsOfAllMasters: async function (connection, aAllMasterTables) {
    try {
      var iCount = 0, aDataObjects = [], oDataObj = {}, that = this;
      if (aAllMasterTables.length > 0) {

        for (var i = 0; i < aAllMasterTables.length; i++) {
          oDataObj = {}
          iCount = await that.getRowCountOfTables(connection, aAllMasterTables[i].TABLE_NAME);
          oDataObj.TABLE_NAME = aAllMasterTables[i].TABLE_NAME;
          oDataObj.TABLE_DESCRIPTION = aAllMasterTables[i].TABLE_DESCRIPTION;
          oDataObj.COUNT = iCount;
          oDataObj.TABLE_TYPE = aAllMasterTables[i].TABLE_TYPE;
          aDataObjects.push(oDataObj);
        }
      }

      return aDataObjects;
    }
    catch (error) { throw error; }
  },

  getTotalMasterFilled: function (aRowCountsOfAllMasters, sTableType) {
    var iDatalength = 0;
    var iCount = 0;
    var iNotFilledCount = 0;

    if (aRowCountsOfAllMasters.length > 0) {
      Object.keys(aRowCountsOfAllMasters).map(function (key) {
        if (aRowCountsOfAllMasters[key].TABLE_TYPE === sTableType) {
          iDatalength += 1;
          if (aRowCountsOfAllMasters[key].COUNT !== 0) {
            iCount += 1;
          }
        }
      });
    }

    iNotFilledCount = iDatalength - iCount || 0;

    return { "TOTAL": iDatalength, "FILLED": iCount, "NOT_FILLED": iNotFilledCount };
  },

  getMasterCredentials: async function (connection) {
    try {
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(SELECT`USERNAME,PASSWORD,ADD_INFO1`
        .from`${connection.entities['VENDOR_PORTAL.MASTER_CREDENTIAL']}`);

      if (aResult[0] === undefined || aResult[0] === null) {
        aResult[0] = {
          "USERNAME": null,
          "PASSWORD": null,
          "ADD_INFO1": null
        };
      }

      return aResult[0] || null;
    }
    catch (error) { throw error; }
  },

  getMasterClientContactInfo: async function (connection) {
    try {
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(SELECT`EMAIL_NOTIF_1,CONTACT_ID_1,CLIENT_FULL_NAME,CLIENT_SHORT_NAME,CLIENT_COUNTRY`
        .from`${connection.entities['VENDOR_PORTAL.MASTER_EMAIL_CONTACT_ID']}`);

      if (aResult[0] === undefined || aResult[0] === null) {
        aResult[0] = {
          "EMAIL_NOTIF_1": null,
          "CONTACT_ID_1": null,
          "CLIENT_FULL_NAME": null,
          "CLIENT_SHORT_NAME": null,
          "CLIENT_COUNTRY": null
        };
      }

      return aResult[0] || null;
    }
    catch (error) { throw error; }
  },
  getMasterSMTPInfo: async function (connection) {
    try {
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(SELECT`HOST,PORT,SECURE,USERNAME,PASSWORD,SENDER_EMAIL`
        .from`${connection.entities['VENDOR_PORTAL.EMAIL_CONFIG']}`);

      if (aResult[0] === undefined || aResult[0] === null) {
        aResult[0] = {
          "HOST": null,
          "PORT": null,
          "SECURE": null,
          "USERNAME": null,
          "PASSWORD": null,
          "SENDER_EMAIL": null
        };
      }

      return aResult[0] || null;
    }
    catch (error) { throw error; }
  },
  getMasterSapClient: async function (connection) {
    try {
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(SELECT`CLIENT,DESTINTAION`
        .from`${connection.entities['VENDOR_PORTAL.MASTER_SAP_CLIENT']}`);

      if (aResult[0] === undefined || aResult[0] === null) {
        aResult[0] = {
          "CLIENT": null,
          "DESTINTAION": null
        };
      }

      return aResult[0] || null;
    }
    catch (error) { throw error; }
  },
  getMasterSubaccounttInfo: async function (connection) {
    try {
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(SELECT`SUBACCOUNT,PORTAL_LINK`
        .from`${connection.entities['VENDOR_PORTAL.MASTER_SUBACCOUNT']}`);

      if (aResult[0] === undefined || aResult[0] === null) {
        aResult[0] = {
          "SUBACCOUNT": null,
          "PORTAL_LINK": null
        };
      }

      return aResult[0] || null;
    }
    catch (error) { throw error; }
  },


  // #TabName : Admin (Dashboard)
  getPercentOfConfig: async function (connection) {
    var aMasterCredentials = await this.getMasterCredentials(connection);
    var aMasterClientContactInfo = await this.getMasterClientContactInfo(connection);
    var aMasterSubaccounttInfo = await this.getMasterSubaccounttInfo(connection);
    var aMasterSapClientials = await this.getMasterSapClient(connection);
    var aMasterSMTPInfo = await this.getMasterSMTPInfo(connection)

    var aConfigArr = [aMasterClientContactInfo, aMasterSubaccounttInfo, aMasterSapClientials,aMasterSMTPInfo];
    var dataArr = [];
    var aReturnArr = [];
    var oIterationObj = {};
    var iCountOfAllConfigfFields = 0;
    var iCountOfNullConfigfFields = 0;
    var iPercentOfConfigfFields = 0;
    for (var i = 0; i < aConfigArr.length; i++) {
      oIterationObj = aConfigArr[i];
      if (oIterationObj !== null && Object.keys(oIterationObj).length > 0) {
        for (let key in oIterationObj) {
          if (oIterationObj.hasOwnProperty(key)) {
            iCountOfAllConfigfFields += 1;
            if (oIterationObj[key] === null || oIterationObj[key] === "" || oIterationObj[key] === undefined) {
              iCountOfNullConfigfFields += 1;
            }
          }
        }
      }
    }

    iPercentOfConfigfFields = Math.round(((iCountOfAllConfigfFields - iCountOfNullConfigfFields) / iCountOfAllConfigfFields) * 100 || 0);

    aReturnArr.push(
      {
        "VALUE": "Complete",
        "COUNT": (iCountOfAllConfigfFields - iCountOfNullConfigfFields) || 0
      });

    if (iPercentOfConfigfFields !== 100) {
      aReturnArr.push(
        {
          "VALUE": "Pending",
          "COUNT": iCountOfNullConfigfFields || 0
        });
    }

    return {
      "ALL_CONFIG_FIELDS_COUNT": iCountOfAllConfigfFields,
      "COMPLETED_CONFIG_FIELDS_COUNT": iCountOfAllConfigfFields - iCountOfNullConfigfFields,
      "NULL_CONFIG_FIELDS_COUNT": iCountOfNullConfigfFields,
      "PERCENT_OF_FILEDS_COMPLETE": iPercentOfConfigfFields,
      "SUCCESS_STATE": iPercentOfConfigfFields === 100 ? 'Success' : 'Warning',
      "CHART_ARRAY": aReturnArr
    };
  },

  getDashboardData: async function (connection) {
    var aAllMasterTables = await this.getMasterTablenamesData(connection, null);
    var aRowCountsOfAllMasters = await this.getRowCountsOfAllMasters(connection, aAllMasterTables) || [];
    var iTotalMastersFilled = await this.getTotalMasterFilled(aRowCountsOfAllMasters, 'Master');
    var iTotalConfigFilled = await this.getTotalMasterFilled(aRowCountsOfAllMasters, 'Config');

    var oDataObj = {
      "ALL_MASTER_TABLES_COUNT": aAllMasterTables.length || 0,
      "TOTAL_NO_OF_MASTERS": iTotalMastersFilled || 0,
      "TOTAL_NO_OF_CONFIGS": iTotalConfigFilled || 0,
      "ALL_MASTERS_ROW_COUNT": aRowCountsOfAllMasters,
      "ALL_CONGIG_FIELD_PERCENT": await this.getPercentOfConfig(connection)

    };

    return oDataObj;
  },

  // #TabName : Form Fields
  // getTemplateColumns: async function (conn) {
  //   try {
  //     // var aResult = await SELECT .from `VENDOR_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY`  .where `CCODE = 'TEMPLATE' AND TYPE = 1`;

  //     let aResult = await conn.run(
  //       SELECT
  //         .from`${conn.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY']}`
  //         .where`CCODE = 'TEMPLATE' AND TYPE = 1`
  //     );
  //     return aResult;
  //   }
  //   catch (error) {
  //     throw error;
  //   }
  // },

  getFieldsDescData: async function (conn) {
    try {
      let aResult = await conn.run(
        SELECT
          .from`${conn.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_ID_DESC']}`
      );

      // var aDataObjects = this.getArrayFromResult(aResult)
      return aResult;
    }
    catch (error) { throw error; }
  },
  getFieldsDesc: function (sFieldId, aArrayData) {
    // var index = myArray.findIndex(item => item.id === 2);
    var index = aArrayData.findIndex(function (items) {
      return items.FIELDS === sFieldId;
    });
    if (aArrayData[index] !== undefined) {
      return aArrayData[index];
    } else {
      return {};
    }
  },

  getVisibleFieldsData: async function (connection, iEntityCode, iType) {
    try {
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(
        SELECT
          .from`${connection.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_VISIBLE']}`
          .where`CCODE = ${iEntityCode} AND TYPE = ${iType}`
      );

      // var aDataObjects = this.getArrayFromResult(aResult)
      return aResult;
    }
    catch (error) { throw error; }
  },

  getMandatoryFieldsData: async function (connection, iEntityCode, iType) {
    try {
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(
        SELECT
          .from`${connection.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY']}`
          .where`CCODE = ${iEntityCode} AND TYPE = ${iType}`
      );

      // var aDataObjects = this.getArrayFromResult(aResult)
      return aResult;
    }
    catch (error) { throw error; }
  },
  getCountryDesc: async function (connection, countryCode) {
    try {
      var sDesc = "";
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(
        SELECT`LANDX as DESC`
          .from`${connection.entities['VENDOR_PORTAL.MASTER_COUNTRY']}`
          .where`LAND1 = ${countryCode}`
      );
      // var sQuery =
      //   'SELECT "LANDX" AS DESC FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_COUNTRY" 
      //   WHERE LAND1 = ?';
      // var aResult = conn.executeQuery(sQuery, countryCode);

      if (aResult.length > 0) {
        sDesc = aResult[0].DESC;
      }
      return sDesc;
    }
    catch (error) { throw error; }
  },
  getClientInfoWithDesc: async function (connection, aClientInfoArr) {
    var aClientInfoWithDesc = [];
    if (aClientInfoArr.length > 0) {
      var dataObj = {};
      for (var i = 0; i < aClientInfoArr.length; i++) {
        dataObj = JSON.parse(JSON.stringify(aClientInfoArr[i]));
        if (dataObj.CLIENT_COUNTRY !== "" || dataObj.CLIENT_COUNTRY !== null) {
          dataObj.CLIENT_COUNTRY_DESC = await this.getCountryDesc(connection, dataObj.CLIENT_COUNTRY) || "";
        }
        aClientInfoWithDesc.push(dataObj);
      }     
      // aClientInfoWithDesc = Object.keys(aClientInfoArr).map(function(key) {
      //   dataObj = JSON.parse(JSON.stringify(aClientInfoArr[key]));

      //   if (dataObj.CLIENT_COUNTRY !== "" || dataObj.CLIENT_COUNTRY !== null) {
      //     dataObj.CLIENT_COUNTRY_DESC = await getCountryDesc( dataObj.CLIENT_COUNTRY) || "";
      //   }
      //   return dataObj;
      // });
    }

    return aClientInfoWithDesc;
  },
  getTableData: async function (connection, sTable) {
    try {
      // var aDataObjects = [];
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(
        SELECT
          .from`${connection.entities['VENDOR_PORTAL.' + sTable]}`
      );

      return aResult;
    }
    catch (error) { throw error; }
  },
  getTableDataWithPrimaryKey: async function (connection, sTable) {
    try {
      var response ={"TableData":"","PrimaryKey":""}
      // var aDataObjects = [];
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(
        SELECT
          .from`${connection.entities['VENDOR_PORTAL.' + sTable]}`
      );
        response.TableData = aResult;
      
        let aPrimaryKeyResult = await connection.run(
          SELECT`PRIMARY_KEY`
            .from`${connection.entities['VENDOR_PORTAL.MASTER_TABLENAMES' ]}`
            .where`TABLE_NAME = ${sTable}`
        );
        response.PrimaryKey = aPrimaryKeyResult;
      return response;
    }
    catch (error) { throw error; }
  },
  getAttachmentsTableData: async function (connection, sTable) {
    try {
      var responseAttachment = {
        "AttachmentTable":"",
        "EnableUserManualViaURL" :"",
        "UserManualURL":"",
        "PrmiaryKey":""
      }
      // var aDataObjects = [];
      // let connection = await cds.connect.to('db');
      let aResult = await connection.run(
        SELECT`SR_NO,ENTITY_CODE,ATTACH_CODE,ATTACH_GROUP,ATTACH_DESC,FILE_NAME,FILE_TYPE,FILE_MIMETYPE,UPLOADED_ON,ATTACH_TYPE_CODE,ATTACH_TYPE_DESC`
          .from`${connection.entities['VENDOR_PORTAL.' + sTable]}`
      );
      // var aDataObjects = [];
      // var sQuery =
      //   'SELECT "SR_NO","ENTITY_CODE","ATTACH_CODE","ATTACH_GROUP","ATTACH_DESC","FILE_NAME","FILE_TYPE","FILE_MIMETYPE","UPLOADED_ON","ATTACH_TYPE_CODE","ATTACH_TYPE_DESC"';
      // sQuery += 'FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::' + sTable + '"';
      // var aResult = conn.executeQuery(sQuery);
      // if (aResult.length > 0) {
      //   aDataObjects = Object.keys(aResult).map(function(key) {
      //     return aResult[key];
      //   });
      // }
      responseAttachment.AttachmentTable = aResult;
      let aEnableURLResult = await connection.run(
        SELECT`SETTING,DESCRIPTION`
          .from`${connection.entities['VENDOR_PORTAL.MASTER_IVEN_SETTINGS' ]}`
          .where`CODE = 'PORTAL_HELP_CONFIG'`
      );
      responseAttachment.EnableUserManualViaURL = aEnableURLResult;
      let aURLResult = await connection.run(
        SELECT`SETTING`
          .from`${connection.entities['VENDOR_PORTAL.MASTER_IVEN_SETTINGS' ]}`
          .where`CODE = 'PORTAL_HELP_URL'`
      );
      responseAttachment.UserManualURL = aURLResult;
      let aPrimaryKeyResult = await connection.run(
        SELECT`PRIMARY_KEY`
          .from`${connection.entities['VENDOR_PORTAL.MASTER_TABLENAMES' ]}`
          .where`TABLE_NAME = 'MASTER_IVEN_ATTACHMENTS'`
      );
      responseAttachment.PrmiaryKey = aPrimaryKeyResult;
      return responseAttachment;
    }
    catch (error) { throw error; }
  },

  getMasterFormsData: async function (connection) {
    var aTableResponse = await this.getTableDataWithPrimaryKey(connection, "MASTER_EMAIL_CONTACT_ID")
    var oMasterobj = {
      "Client_Info":{"TableData": await this.getClientInfoWithDesc(connection, aTableResponse.TableData),"PrimayKey":aTableResponse.PrimaryKey},
      "Sap_Info": await this.getTableDataWithPrimaryKey(connection, "MASTER_SAP_CLIENT"),
      "SubAccount_Info": await this.getTableDataWithPrimaryKey(connection, "MASTER_SUBACCOUNT"),
      "MasterCredential_Info": await this.getTableDataWithPrimaryKey(connection, "MASTER_CREDENTIAL"),
      "IvenAttachments": await this.getAttachmentsTableData(connection, "MASTER_IVEN_ATTACHMENTS")
    };
    return oMasterobj;
  },
  convertIntegerToString: function (dataArray) {
    var aConvertedArray = [];

    if (dataArray.length > 0) {
      aConvertedArray = Object.keys(dataArray).map(function (key) {

        if (dataArray[key].LENGTH) {
          dataArray[key].LENGTH = parseInt(dataArray[key].LENGTH, 10);
          // remove aExclusiveArr.push(aResult[key]);
        }

        return dataArray[key];
      });
    }

    return aConvertedArray;
  },
  removeMetadata: function (dataArray) {
    var aNonMetadataArr = [];

    if (dataArray.length > 0) {
      aNonMetadataArr = Object.keys(dataArray).map(function (key) {

        if (dataArray[key].__metadata) {
          delete dataArray[key].__metadata;
        }
        if (dataArray[key][""]) {
          delete dataArray[key][""];
        }

        return dataArray[key];
      });
    }

    return aNonMetadataArr;
  },
  // getTemplateColumns: async function (conn) {
  //   try {
  //     // var aDataObjects = [];
  //     // var sQuery =
  //     // 	'SELECT * FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::ENTITY_FIELDS_MANDATORY" WHERE CCODE = ? AND TYPE = ?';
  //     // var aResult = conn.executeQuery(sQuery, 'TEMPLATE', 1);
  //     let aResult = await conn.run(
  //       SELECT
  //         .from`${conn.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY']}`
  //         .where`CCODE = 'TEMPLATE' and TYPE = 1`
  //     );
  //     // aDataObjects = Object.keys(aResult).map(function(key) {
  //     // 	return aResult[key];
  //     // });
  //     return aResult;
  //   }
  //   catch (error) { throw error; }
  // },

  getUpdatedFieldsData: async function (aColumnsWithX, conn) {
    var aUpdatedData = [];

    var aColumnsTemplate = await lib_common.getTemplateColumns(conn);

    if (aColumnsWithX.length > 0) {

      if (aColumnsTemplate.length !== 0) {
        // var aColumnsTemplateObj = JSON.parse(JSON.stringify(aColumnsTemplate[0]));
        var aTemplateColunns = Object.keys(aColumnsTemplate[0]);

        for (var j = 0; j < aColumnsWithX.length; j++) {

          var dataObj = aColumnsWithX[j];

          for (var i = 0; i < aTemplateColunns.length; i++) {

            // throw JSON.stringify(dataObj[aTemplateColunns[i].toString()]);

            if (aTemplateColunns[i].toString() == "CCODE" || aTemplateColunns[i].toString() === "TYPE") {
              //  throw JSON.stringify(aTemplateColunns[1]);
              continue;
              // } else if(aTemplateColunns.includes(dataObjdataObj[aTemplateColunns[i].toString())) {
            } else if (dataObj[aTemplateColunns[i].toString()] === undefined || dataObj[aTemplateColunns[i].toString()] === "") {
              dataObj[aTemplateColunns[i].toString()] = null;
              continue;
              // throw JSON.stringify(dataObj[aTemplateColunns[i].toString()] + " - " + aTemplateColunns[i].toString() + " is undefined");
            } else {
              dataObj[aTemplateColunns[i].toString()] = 'X';
              continue;
              //   throw JSON.stringify(dataObj[aTemplateColunns[i].toString()] + " - " + aTemplateColunns[i].toString() + " is defined");
            }
          }
          // throw JSON.stringify(dataObj); 
          aUpdatedData.push(dataObj);
        }

      } else {
        throw "TEMPLATE Data missing Mandatory Fields Table";
      }

    }

    return aUpdatedData;
  },


  updateData: async function (connection, oVisibilityObj, oMandatoryObj, oFieldDescObj) {

    try {
      // var sQuery1 = '';
      var oVisibilityObjLV = {};
      var arrQuery1 = [];
      // var sResults1 = '';

      // var sQuery2 = '';
      var oMandatoryObjLV = {};
      var arrQuery2 = [];
      // var sResults2 = '';

      // var sQuery3 = '';
      var oFieldDescObjLV = {};
      var arrQuery3 = [];
      // var sResults3 = '';     

      for (var i = 0; i < oVisibilityObj.FIELDS.length; i++) {
        oVisibilityObjLV = oVisibilityObj.FIELDS[i];
        oMandatoryObjLV = oMandatoryObj.FIELDS[i];
        oFieldDescObjLV = oFieldDescObj.FIELDS[i];

        // sQuery1 += 'UPDATE "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_REGFORM_FIELDS_MANDATORY" ';
        // sQuery1 += 'SET "' + Object.keys(oMandatoryObjLV)[0] + '" = ?';
        // sQuery1 += 'WHERE "CCODE" = ? AND "TYPE" = ?';

        // sQuery2 += 'UPDATE "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_REGFORM_FIELDS_VISIBLE" ';
        // sQuery2 += 'SET "' + Object.keys(oVisibilityObjLV)[0] + '" = ?';
        // sQuery2 += 'WHERE "CCODE" = ? AND "TYPE" = ?';

        // sQuery3 += 'UPDATE "VENDOR_PORTAL"."VENDOR_PORTAL.Table::MASTER_REGFORM_FIELDS_ID_DESC" ';
        // sQuery3 += 'SET "DESCRIPTION" = ?';
        // sQuery3 += 'WHERE "FIELDS" = ?'; column = COALESCE(NULLIF(?, ''), column)


        let oSetValues1 = {};
        oSetValues1[Object.keys(oMandatoryObjLV)[0]] = oMandatoryObjLV[Object.keys(oMandatoryObjLV)[0]];
        let sResults1 = await connection.run(UPDATE
          .entity(`${connection.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY']}`)
          .set(oSetValues1)
          .where({ CCODE: oMandatoryObj.CCODE, TYPE: oMandatoryObj.TYPE }))

        let oSetValues2 = {};
        oSetValues2[Object.keys(oVisibilityObjLV)[0]] = oVisibilityObjLV[Object.keys(oVisibilityObjLV)[0]];
        let sResults2 = await connection.run(UPDATE
          .entity(`${connection.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_VISIBLE']}`)
          .set(oSetValues2)
          .where({ CCODE: oVisibilityObj.CCODE, TYPE: oVisibilityObj.TYPE }))

        let oSetValues3 = {};
        oSetValues3['DESCRIPTION'] = oFieldDescObjLV[Object.keys(oFieldDescObjLV)[0]];
        let whereClauseObj = { 'FIELDS': Object.keys(oFieldDescObjLV)[0] }

        let sResults3 = await connection.run(UPDATE
          .entity(`${connection.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_ID_DESC']}`)
          .set(oSetValues3)
          .where(whereClauseObj))

        // let sResults1 = await connection.run(
        //   UPDATE `${connection.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_MANDATORY']}`
        //     .set `${Object.keys(oMandatoryObjLV)[0]} = COALESCE(${oMandatoryObjLV[Object.keys(oMandatoryObjLV)[0]]}, '')`
        //     .where ` "CCODE" = ${oMandatoryObj.CCODE} AND "TYPE" = ${oMandatoryObj.TYPE}`
        // );


        // let sResults3 = await connection.run(
        //   UPDATE `${connection.entities['VENDOR_PORTAL.MASTER_REGFORM_FIELDS_ID_DESC']}`
        //     // .set `"DESCRIPTION" = ${oFieldDescObjLV[Object.keys(oFieldDescObjLV)[0]]}`
        //     .set `"DESCRIPTION" = CASE WHEN ${oFieldDescObjLV[Object.keys(oFieldDescObjLV)[0]]} IS NULL 
        //     THEN '' ELSE ${oFieldDescObjLV[Object.keys(oFieldDescObjLV)[0]]}`
        //     .where `WHERE "FIELDS" = ${ Object.keys(oFieldDescObjLV)[0]}`
        // );


        // sResults1 = conn.executeUpdate(sQuery1, oMandatoryObjLV[Object.keys(oMandatoryObjLV)[0]], oMandatoryObj.CCODE, oMandatoryObj.TYPE);
        // sResults2 = conn.executeUpdate(sQuery2, oVisibilityObjLV[Object.keys(oVisibilityObjLV)[0]], oVisibilityObj.CCODE, oVisibilityObj.TYPE);
        // sResults3 = conn.executeUpdate(sQuery3, oFieldDescObjLV[Object.keys(oFieldDescObjLV)[0]], Object.keys(oFieldDescObjLV)[0]);

        arrQuery1.push(sResults1);
        arrQuery2.push(sResults2);
        arrQuery3.push(sResults3);
      }

      // conn.commit();

      return {
        "Results1": arrQuery1 || [],
        "Results2": arrQuery2 || [],
        "sResults3": arrQuery3 || []
      };

    } catch (e) {
      throw e;
    }


  },
  //Dynamic Admin Panel Logic
  funcPostAdminPanelData: async function (connection, action, sTableName, tableDesc, tableData) {
    try {
      var sTableFullName = 'VENDOR_PORTAL.' + sTableName;
      var aResult, iSR_NO;
      if (sTableName === 'MASTER_IVEN_ATTACHMENTS') {
        var maxSrNoResult = await connection.run(SELECT`MAX(SR_NO) AS MAX_VAL,COUNT(SR_NO) AS COUNT_VAL`
          .from`${connection.entities['VENDOR_PORTAL.MASTER_IVEN_ATTACHMENTS']}`
        );
        iSR_NO = maxSrNoResult[0].COUNT_VAL != 0 ? maxSrNoResult[0].MAX_VAL + 1 : maxSrNoResult[0].COUNT_VAL + 1;
        tableData[0].SR_NO = iSR_NO;

      }

      //  aResult = await connection.run(
      // 	INSERT 
      // 		(tableData)
      //     .into(connection.entities[sTableFullName])
      // 		);
      aResult = await this.insertQueryExecution(connection, sTableFullName, tableData);

      // if (aResult.length > 0) return aResult;
      if (aResult.results[0].affectedRows == tableData.length) {
        if (action === "CREATE")
          return 'New Master Data Created for: ' + tableDesc
        else if (action === "IMPORT_CSV")
          return 'CSV data inserted into table for: ' + tableDesc
      }



    }
    catch (error) { throw error; }
  },
  funcDeleteAdminPanelData: async function(connection, deletiondata, sTableName, tableDesc) {
    try {
      let sTableFullName = 'VENDOR_PORTAL.' + sTableName;
      // let aResult = await connection.run(
      // 	DELETE 
      //     .from(connection.entities[sTableFullName])
      //     .where(deletiondata)
      // 		);
      let aResult = await this.deleteQueryExecution(connection, sTableFullName, deletiondata);
      // if (aResult.length > 0) return aResult;
      if (aResult > 0) {
        return 'Record deleted for: ' + tableDesc

      }



    }
    catch (error) { throw error; }
  },
  dynamicWhereClause: async function (connection, sTableName, tableData) {
    try {
      var aKeys = [], awhereClause = [];

      //Fetch Primary Key
      var aPrimaryKeyResult = await connection.run(
        SELECT`PRIMARY_KEY`
          .from`${connection.entities['VENDOR_PORTAL.MASTER_TABLENAMES']}`
          .where`TABLE_NAME=${sTableName}`
      );
      if (aPrimaryKeyResult.length > 0) {
        let sKeys = aPrimaryKeyResult[0].PRIMARY_KEY;
        aKeys = sKeys.split(',');
        aKeys.map(function (skey) {
          tableData.map(function (record) {
            let obj = {};
            // obj += skey +":'"+ record[skey] + "'"
            obj[skey] = record[skey]
            awhereClause.push(obj)
          })
        })
      }
      //reduce the object to generate dynamic Where clause for delete query
      var reducedWhereClause = awhereClause.reduce(function (acc, x) {
        for (var key in x) acc[key] = x[key];
        return acc;
      }, {});
      return reducedWhereClause;
    }
    catch (error) { throw error; }
  },
  deleteQueryExecution: async function (connection, sTableFullName, oWhereClause) {
    try {
      let aDeleteResult = await connection.run(
        DELETE
          .from(connection.entities[sTableFullName])
          .where(oWhereClause)
      );
      return aDeleteResult;
    }
    catch (error) { throw error; }
  },
  insertQueryExecution: async function (connection, sTableFullName, tableData) {
    try {
      let aInsertResult = await connection.run(
        INSERT
          (tableData)
          .into(connection.entities[sTableFullName])
      );
      return aInsertResult;
    }
    catch (error) { 
      throw error;   
    }
  },
  funcEditAdminPanelData: async function (connection, tableData, sTableName, tableDesc, oPrimaryKeydetails) {
    try {
      // sTableName = 'MASTER_COUNTRY'
      let sTableFullName = 'VENDOR_PORTAL.' + sTableName;

      // var reducedWhereClause =await dynamicWhereClause(connection,sTableName,tableData);
      //Delete the record
      let aDeleteResult = await this.deleteQueryExecution(connection, sTableFullName, oPrimaryKeydetails);

      //Insert New record
      aInsertResult = await this.insertQueryExecution(connection, sTableFullName, tableData);
      if (aInsertResult.results[0].affectedRows == tableData.length) {
        return tableDesc + ' updated successfully'

      }
    }
    catch (error) { throw error; }
  },

  funcEditFormsAdminPanelData: async function (connection, sTableName, tableData, oPrimaryKeydetails) {
    try {
      var sTableFullName = 'VENDOR_PORTAL.' + sTableName;
      var aResult, iSR_NO, success_flag = 'N';

      var maxSrNoResult = await connection.run(
        SELECT`MAX(SR_NO) AS MAX_VAL`
          .from`${connection.entities[sTableFullName]}`
      );
      
      // var maxSrNoResult = await connection.run(
      //    SELECT 
      //    .from`${connection.entities[sTableFullName]}`
      // );
      if (maxSrNoResult.length > 0) {
        if (maxSrNoResult[0].MAX_VAL > 0) {
          // var reducedWhereClause =await dynamicWhereClause(connection,sTableName,tableData);
          //Delete the record
          let aDeleteResult = await this.deleteQueryExecution(connection, sTableFullName, oPrimaryKeydetails);
          //Insert New record
          aInsertResult = await this.insertQueryExecution(connection, sTableFullName, tableData);
          var maxSrNoResult = await connection.run(SELECT`MAX(SR_NO) AS MAX_VAL`
            .from`${connection.entities[sTableFullName]}`
          );
          if (maxSrNoResult[0].MAX_VAL > 0)
            success_flag = 'Y';
        }
      }
      return success_flag;
    }
    catch (error) { throw error; }
  },
  funcFormSettingAdminPanelData: async function (connection, oData) {
    try {
      var Response = {};
   
      for (var i = 0; i < oData.length; i++) {
       

          let sResults1 = await connection.run(UPDATE
            .entity(`${connection.entities['VENDOR_PORTAL.MASTER_IVEN_SETTINGS']}`)
           
            .set({SETTING:oData[i].SETTING,DESCRIPTION:oData[i].DESCRIPTION})
            .where(`CODE = '${oData[i].CODE}'`))         
    
     
     
      }   
      Response.OUT_SUCCESS_FLAG = 'Y';
      Response.OUT_SUCCESS = 'Form Settings Updated Successfully';
      return Response;
    }
    catch (error) { throw error; }
  }



}
