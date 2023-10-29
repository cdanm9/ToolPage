const cds = require("@sap/cds");
const lib_email = require("./iven_library_email.js");
const SequenceHelper = require("./SequenceHelper");

module.exports = {
     getMDGPayload:async function(oHanaPayload,addressData,contactsData,bankData, conn) {
		try{
        var iVenVendorCode = oHanaPayload[0].IVEN_VENDOR_CODE.toString() || "";
        var sSAPVendorCode = oHanaPayload[0].SAP_VENDOR_NO || "";
        var iRequestType = oHanaPayload[0].REQUEST_TYPE;
        var iSupplierType = oHanaPayload[0].SUPPL_TYPE;
        var sBP_Type = oHanaPayload[0].BP_TYPE_CODE || "";
        var aHQAddress =await this.getHQAddressArray(addressData);
        var aGeneralDataSet = null;
        var Scenario = "";
        var sTradingPartner = "";
        var sExemptionReason = await this.getAtachmentDataSet(iVenVendorCode, oHanaPayload[0], conn) || "";
    
        if (oHanaPayload.length) {
    
            if (iRequestType === 1 || iRequestType === 2 || iRequestType === 3 || iRequestType === 6 || iRequestType === 7) {
                Scenario = "C";
    
                // Generate SAP Vendor code sequence by Supplier Type
                if (iSupplierType === "ZVND") {
                    // Commercial Vendor
                    if (sSAPVendorCode === null || sSAPVendorCode === "" || sSAPVendorCode === undefined) {
                        //   sSAPVendorCode = getNewSapVendorCode(conn);
                        sSAPVendorCode = "";
                    }
                } else if (iSupplierType === "ZICB") {
                    // Intercompany Vendor
                    sTradingPartner = "0000000000" + sSAPVendorCode;
                    sTradingPartner = sTradingPartner.slice(-10);
    
                    sSAPVendorCode =await this.getNewSapVendorCode(conn);
                }
            } else if (iRequestType === 4) {
                Scenario = "E";
            } else if (iRequestType === 5 && sSAPVendorCode !== "") {
                Scenario = "U";
                sSAPVendorCode = ("0000000000" + sSAPVendorCode).slice(-10);
            } else if (iRequestType === 5 && sSAPVendorCode === "") {
                throw "SAP Vendor Code missing for Update request";
            } else if (sBP_Type === "") {
                throw "Supplier Sub Type is missing";
            }
    
            aGeneralDataSet =await this.getGeneralDataSet(iVenVendorCode, sSAPVendorCode, oHanaPayload[0], aHQAddress[0], sBP_Type, sExemptionReason);
            aGeneralDataSet.Scenario = Scenario;
            aGeneralDataSet.BankDetailsSet =await this.getBankDetailsSet(sSAPVendorCode, bankData) || [];
            aGeneralDataSet.ContactPersonSet =await this.getContactPersonSet(sSAPVendorCode, iRequestType,contactsData, aHQAddress[0]) || [];
    
            if (iRequestType === 7) {
                aGeneralDataSet.CompanyDataSet = []; // For Quick registration no Entity code details needed
            } else {
                aGeneralDataSet.CompanyDataSet =await this.getCompanyDataSet(sSAPVendorCode, oHanaPayload[0]) || [];
            }
        }
    
        return aGeneralDataSet;
	}catch(error){
		throw error;
	}
    },
	// Used to post data to MDG and get Change Request No. as response
 PostToMDG:async function(oSapPayload,conn) {
try{
	var dataobj = oSapPayload;
	var oResponseObj = null;
	var resultData = {
		oResponse: "",
		iStatusCode: 0
	};

	var iSapDest = lib_email.getSAPDestination(conn);
	if (iSapDest === null || iSapDest === "") {
		throw "SAP Destination missing";
	}

	try {
		if (dataobj !== undefined || dataobj !== "" || dataobj !== null) {
			var iVenVendorConnection = await cds.connect.to('ZMDG_VENDOR_REG_SRV');
			var response = await iVenVendorConnection.send({
			  method: 'POST',
			  path: "/GeneralDataSet",
			  headers: { 'Content-Type': 'application/json',
						  "accept": "application/json",
						  "X-Requested-With": "XMLHttpRequest"}
			})
	console.log(response);

			// var destination_package = "VENDOR_PORTAL.XSJS";
			// var destination_name = iSapDest;
			// 	
			// var dest = $.net.http.readDestination(destination_package, destination_name);

			// var client = new $.net.http.Client();
			// var CSRF = getCSRFTokenMDG(dest, client);

			// var url = "/ZMDG_VENDOR_REG_SRV/GeneralDataSet";
			// url = encodeURI(url);

			// var req = new $.web.WebRequest($.net.http.POST, url); //Entity Set 
			// req.headers.set("x-csrf-token", CSRF);
			// req.headers.set("Content-Type", "application/json");
			// req.headers.set("accept", "application/json");
			// req.headers.set("X-Requested-With", "XMLHttpRequest");
			// $.response.contentType = "application/json";

			// var postObj = JSON.stringify(dataobj);
			// req.setBody(postObj);

			// client.request(req, dest);
			var sClientResponse = client.getResponse();

			var sResponse = sClientResponse.body.asString();

			if (sResponse.includes("html")) {
				oResponseObj = "MDG CR generation failed. Unauthorized User.";
			} else {
				oResponseObj = JSON.parse(sResponse);
			}
			var iStatus = parseInt(sClientResponse.status, 10);

			if (oResponseObj && oResponseObj.d) {
				resultData.oResponse = oResponseObj.d.ChangeRequest;
				// resultData.oResponse = oResponseObj;
				resultData.iStatusCode = iStatus;
				// resultData.iStatusCode = 200;
			} else {
				resultData.oResponse = oResponseObj;
				// resultData.oResponse = "MDG CR generation failed";
				resultData.iStatusCode = iStatus;
			}
		} else {
			resultData.oResponse = "Invalid Posting Object";
			resultData.iStatusCode = 400;
		}

	} catch (e) {
		resultData.oResponse = e.toString();
		resultData.iStatusCode = 400;
	}

	// throw JSON.stringify(resultData);
	return resultData;
}catch(error){throw error;}
},

    // get MDG Genreal section Head office address from array of all Addresses
 getHQAddressArray : async function (aAddressDataArr) {
	try{
	var aDataObjects =[];
	 Object.keys(aAddressDataArr).map(function(key) {
		if (aAddressDataArr[key].ADDRESS_TYPE === "HQ") {
			aDataObjects.push(aAddressDataArr[key]);
		}
	});
	return aDataObjects;
}catch(error){
	throw error;
}
},

// Get MDG Payload structure for Attachment Data
 getAtachmentDataSet : async function(iVenVendorCode, aGeneralDataArr, conn) {
try{
	var sExpReason = "";
	var sAttachCode = 27;
	var iReqNo = aGeneralDataArr.REQUEST_NO;
	var sVatIndicator = aGeneralDataArr.VAT_CHECK;

	if (sVatIndicator === "N") {
		// var sQuery =
		// 	'SELECT ATTACH_VALUE AS ATTACH_VALUE FROM "VENDOR_PORTAL"."VENDOR_PORTAL.Table::ONBOARDING_ATTACHMENTS" WHERE REQUEST_NO = ? AND ATTACH_CODE = ?';
		// var aResult = conn.executeQuery(sQuery, iReqNo, sAttachCode);

        let aResult = await conn.run(
            SELECT `ATTACH_VALUE`
                .from`${conn.entities['VENDOR_PORTAL.REGFORM_ATTACHMENTS']}`
                .where`REQUEST_NO = ${iReqNo} AND ATTACH_CODE = ${sAttachCode}`
        );
		if (aResult.length > 0) {
			sExpReason = aResult[0].ATTACH_VALUE;
		}
	}
	return sExpReason;
}catch(error){
	throw error;
}
},
// Get new SAP vendor by checking which one has status as 'X' againts it. If blank search next.
 getNewSapVendorCode:async function(conn) {
	try{
	var sStatus = "",
		oNewVendorCode = {};

	// var iStartWith = 6000000300;
	var sStartWith = "";

	var i = 0;
	do {
		sStartWith =await this.getNextSAPVendorCodeFromSeq(conn);
		oNewVendorCode =await this.checkSAPVendorCodeAvailability(sStartWith,conn);
		i++;
	}
	while (oNewVendorCode.sAvailable === "" && oNewVendorCode.iStatusCode === 200);

	oNewVendorCode.Count = i;
	// throw JSON.stringify(oNewVendorCode);

	if (oNewVendorCode.iStatusCode !== 200) {
		throw "Check for Next SAP Vendor Code failed!";
	}

	return oNewVendorCode.oResponse;
}catch(error){
	throw error;
}
},
 getNextSAPVendorCodeFromSeq : async function(conn) {
	try{
	var iCount = 0;
	// var sQuery =
	// 	'SELECT "VENDOR_PORTAL.Sequence::SAP_VENDOR_CODE".NEXTVAL AS "NEW_CODE" FROM DUMMY;';
	// var aResult = conn.executeQuery(sQuery);
    // let aResult = await conn.run(
    //     SELECT `SAP_VENDOR_CODE.NEXTVAL 
    //     FROM DUMMY`
    // );
	// let db = await cds.connect.to('db');
	// var response = lib_mdg.getNextSAPVendorCodeFromSeq(connection)
	const productId = new SequenceHelper({
	  db: conn,
	  sequence: "SAP_VENDOR_CODE",
	  // table: "Products",
	  field: "ID"
	});

	var iCount = await productId.getNextNumber();
	// if (aResult.length > 0) {
	// 	iCount = aResult[0].NEW_CODE;
	// }
	return iCount;
}catch(error){
	throw error;
}
},
// Function reads the CheckVendorCodeSet from on premise service to get SAP Vendor code and its status of availability
 checkSAPVendorCodeAvailability: async function(iLastSapVendorCode,conn) {
try{
	var sLastSapVendorCode = "0000000000" + iLastSapVendorCode;
	sLastSapVendorCode = sLastSapVendorCode.slice(-10);

	var iSapClient = lib_email.getSAPClient(conn);
	if (iSapClient === null) {
		throw "SAP Client missing";
	}

	var iSapDest = lib_email.getSAPDestination(conn);
	if (iSapDest === null || iSapDest === "") {
		throw "SAP Destination missing";
	}

	var resultData = {
		"oResponse": "",
		"sAvailable": "",
		"iStatusCode": 0
	};

	var sNewSapCode = "";
	try {
		var iVenVendorConnection = await cds.connect.to('ZIVN_VENDOR_REG_SRV');
		var response = await iVenVendorConnection.send({
		  method: 'GET',
		  path: "/CheckVendorCodeSet('" + sLastSapVendorCode + "')",
		  headers: { 'Content-Type': 'application/json',
					  "sap-client":iSapClient.toString() ,
					  "accept": "application/json",
					  "X-Requested-With": "XMLHttpRequest"}
		})
console.log(response);
		// var destination_package = "VENDOR_PORTAL.XSJS";
		// var destination_name = iSapDest;
		// 		var destination_name = "iVen_OnPrem"; 
		// var dest = $.net.http.readDestination(destination_package, destination_name);
		// var client = new $.net.http.Client();

		// var url = "/ZIVN_VENDOR_REG_SRV/CheckVendorCodeSet('" + sLastSapVendorCode + "')";
		// var req = new $.web.WebRequest($.net.http.GET, url); //Entity Set
		// //req.headers.set("X-CSRF-Token", "CSRF");
		// req.headers.set("sap-client", iSapClient.toString()); // 110 Development | 100 Prod
		// req.headers.set("Content-Type", "application/json");
		// req.headers.set("accept", "application/json");
		// req.headers.set("X-Requested-With", "XMLHttpRequest");

		// client.request(req, dest);
		// var sClientResponse = client.getResponse();

		// var sResponse = sClientResponse.body.asString();
		// var oResponseObj = JSON.parse(sResponse);

		// var iStatus = parseInt(sClientResponse.status, 10);

		if (response && response.hasOwnProperty("Lifnr") && response.hasOwnProperty("Status")) {
			sNewSapCode = "0000000000" + response.Lifnr;
			sNewSapCode = sNewSapCode.slice(-10);
			resultData.oResponse = sNewSapCode;
			// 			resultData.oResponse = oResponseObj.d.Lifnr;
			resultData.sAvailable = response.Status;
			resultData.iStatusCode = 200;
		} else {
			resultData.oResponse = response;
			resultData.sAvailable = "";
			resultData.iStatusCode = null;
		}

	} catch (e) {
		resultData.oResponse = e.toString();
		resultData.sAvailable = "";
		resultData.iStatusCode = 400;
	}

	return resultData;
}catch(error){
	throw error;
}
},
// Get MDG Payload structure for General Data
 getGeneralDataSet:async function(iVenVendorCode, sSAPVendorCode, aGeneralDataArr, aAddressDataArr, sBP_Type, sExemptionReason) {
try{
	var sName1 = aGeneralDataArr.COMPANY_NAME1 || "";
	var oPayload = {
		"Lifnr": sSAPVendorCode,
		"Land1": aAddressDataArr.COUNTRY || "",
		"Name1": sName1.substring(0, 40) || "",
		"Name2": sName1.substring(40, sName1.length <= 80 ? sName1.length : 80) || "",
		"Ort01": aAddressDataArr.CITY || "",
		"Ort02": aAddressDataArr.DISTRICT || "",
		"Pfach": "", // PO Box
		"Pstlz": aAddressDataArr.POSTAL_CODE || "", // Pin Code
		"Regio": aAddressDataArr.STATE || "",
		"Sortl": await this.getSearchTerm(aGeneralDataArr.COMPANY_NAME1) || "",
		"Stras": aAddressDataArr.STREET1 || "",
		"STR_SUPPL1": aAddressDataArr.STREET2 || "",
		"STR_SUPPL2": aAddressDataArr.STREET3 || "",
		"STR_SUPPL3": aAddressDataArr.STREET4 || "",
		"Anred": "Company", //Title
		"HouseNum": aAddressDataArr.HOUSE_NUM1 || "",
		"Telephone1": aAddressDataArr.CONTACT_NO || "",
		"Telephone2": "",
		"Mobile1": "",
		"Mobile2": "",
		"Fax1": aAddressDataArr.FAX_NO || "",
		"Fax2": "",
		"Email1": aAddressDataArr.EMAIL || "",
		"Email2": "",
		"Sperr": "",
		"Sperm": "",
		"Partner": "1234567890",
		"Type": "CRM001",
		"Idnumber": iVenVendorCode,
		"BP_Type": sBP_Type, //classification
		"VAT_RegNo": aGeneralDataArr.VAT_REG_NUMBER || "",
		"BU_Group": aGeneralDataArr.SUPPL_TYPE || "",
		"TaxExempt": aGeneralDataArr.VAT_CHECK === "N" ? "X" : "", // 12/09/2022 changes done to accomodate Tax exemption changes
		"TaxExemptReason": sExemptionReason || "", // 12/09/2022 changes done to accomodate Tax exemption changes
		"Qualifier": this.getQualiferfromReqType(aGeneralDataArr.REQUEST_TYPE) || '', //13/04/2023 to add Qualifer for Quick Registration
		// 		"Qualifier" : "",
		"BankDetailsSet": [],
		"ContactPersonSet": []
	};

	return oPayload;
}catch(error){
	throw error;
}
}   ,

 getSearchTerm:async function(sValue) {
	var checkSpace = sValue.match(/^(\S+)\s(.*)/);
	var sSearchTerm = "";
	if (checkSpace !== null) {
		var aSlicedText = sValue.match(/^(\S+)\s(.*)/).slice(1);
		var sFirstText = aSlicedText[0];
		sSearchTerm = sFirstText.substr(0, 10);
	} else {
		sSearchTerm = sValue.substr(0, 10);
	}

	return sSearchTerm;
},
 getQualiferfromReqType:async function(iRequestType) {
	var sQualifier = '';
	if ((iRequestType === 1 || iRequestType === 2 || iRequestType === 3)) {
		sQualifier = 'CM';
	} else if (iRequestType === 5) {
		sQualifier = 'CM';
	} else if (iRequestType === 7) {
		sQualifier = 'QR';
	}

	// else if (iRequestType === 4){
	//     sQualifier = 'IC';
	// }

	return sQualifier;
},
// Get MDG Payload structure for Bank Data
 getBankDetailsSet:async function(sSAPVendorCode, aBankDataArr) {
	try{
	var aDataObjects = [],
		oDataObj = null,
		sBankAccNo = null;

	if (aBankDataArr.length > 0) {
		aDataObjects = Object.keys(aBankDataArr).map(function(key) {
			sBankAccNo = aBankDataArr[key].ACCOUNT_NO || "";

			oDataObj = {
				"Lifnr": sSAPVendorCode || "",
				"BankID": aBankDataArr[key].BANK_ID || "",
				"Banks": aBankDataArr[key].BANK_COUNTRY || "",
				"IBAN": aBankDataArr[key].IBAN_NUMBER || "",
				"Bankl": aBankDataArr[key].BANK_KEY || "",
				"Bankn": sBankAccNo.substring(0, 18) || "",
				"Bkont": "",
				"Xezer": "",
				"Bkref": sBankAccNo.substring(18, sBankAccNo.length <= 38 ? sBankAccNo.length : 38) || "",
				"Koinh": aBankDataArr[key].ACCOUNT_HOLDER || "",
				"EbppAccname": aBankDataArr[key].ACCOUNT_NAME || ""
			};
			return oDataObj;
		});
	}

	return aDataObjects;
}catch(error){
	throw error;
}
},

// Get MDG Payload structure for Contacts Data
 getContactPersonSet:async function(sSAPVendorCode, iRequestType, aContactsDataArr, aAddressDataArr) {
	try{
	var aDataObjects = [],
		oDataObj = null,
		sBRRegionCode = "",
		sBRPostalCode = "",
		sRegionCode = null,
		sPostalCode = null,
		sContactBpId = null,
		sNewSapCode = null;

	if (aContactsDataArr.length > 0) {
	    
		aDataObjects = Object.keys(aContactsDataArr).map(function(key) {
		    
		    if(iRequestType === 5) {
		        // Pass Contact BP ID in case of update request
		        sContactBpId = aContactsDataArr[key].BP_ID || "";
    	        sNewSapCode = "0000000000" + sContactBpId;
    			sNewSapCode = sNewSapCode.slice(-10);
    			sSAPVendorCode = (sContactBpId === "" || sContactBpId === null) ? "" : sNewSapCode;
    	    }

			oDataObj = {
				"Lifnr": sSAPVendorCode || "",
				"PartnerID": "",
				"Name1": aContactsDataArr[key].NAME1 || "",
				"Name2": aContactsDataArr[key].NAME2 || "",
				"Designation": aContactsDataArr[key].DESIGNATION || "",
				"HouseNum1": aContactsDataArr[key].HOUSE_NUM1 || "",
				"Street": aContactsDataArr[key].STREET1 || "",
				"City1": "",
				"Country": aContactsDataArr[key].NATIONALITY || "",
				"State": aContactsDataArr[key].STATE || "", // 12-10-2022 - Changed to accomodate separate region code & postal code from contacts section 
				"PoBox": "",
				"PostalCode": aContactsDataArr[key].POSTAL_CODE || "", // 12-10-2022 - Changed to accomodate separate region code & postal code from contacts section
				"TelephoneNumber": aContactsDataArr[key].CONTACT_NO || "",
				"Mobile": aContactsDataArr[key].MOBILE_NO || "",
				"EmailID": aContactsDataArr[key].EMAIL || ""
			};
			return oDataObj;
		});
	}

	return aDataObjects;
}catch(error){
	throw error;
}
},

// Get MDG Payload structure for Contacts Data
 getCompanyDataSet:async function(sSAPVendorCode, aGeneralDataArr) {
	try{
	var aDataObjects = [];
	var oDataObj = {
		"Lifnr": sSAPVendorCode || "",
		"Bukrs": aGeneralDataArr.ENTITY_CODE || ""
	};

	aDataObjects.push(oDataObj);

	return aDataObjects;
}catch(error){
	throw error;
}
}


    
}