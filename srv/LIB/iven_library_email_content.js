const cds = require("@sap/cds");
const lib_email = require("./iven_library_email.js");
const { Connection } = require("@sap/hana-client");

// App paths from portal
const sLink_Request_Report = "aabd5b0b-54d4-4217-b137-b0b0179f2a79.comibsplivenivenrequestreport.comibsplivenivenrequestreport-0.0.1/index.html#/RouteDetailPage/";
const sLink_Registraion_Approval = "site/iven#iven_registration_approval-display&/vendorDetails/";
const sLink_Request_Approval = "site/iven#iven_request_approval-display&/RouteMaster/";

module.exports = {

	getLongDate: function (dateValue) {
		// var sLongDate = "";
		var daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		var day = daysInWeek[dateValue.getDay()].substring(0, 3);
		var month = months[dateValue.getMonth()].substring(0, 3);
		var date = dateValue.getDate();
		var year = dateValue.getFullYear();

		return month + " " + date + ", " + year; //September 17, 2016
	},

	getEmailContent: async function (connection,sAction, sAppType, oEmailData, iStatus) {

		var mailid, Emailbody, Emailbody1, subject, msg;

		var oEmailContent = {
			"subject": null,
			"emailBody": null
		};

		var sDetails = await lib_email.getSubaccountDetais(connection);
		if (sDetails === null) {
			throw "Subaccount & Portal details missing for email"
		}

		var aEmailIds =await lib_email.getEmailContactId(connection);
		if (aEmailIds === null) {
			throw "Contact email id is missing in master"
		}
		var sClientContactEmail = aEmailIds.CONTACT_ID_1;

		var sClientName = aEmailIds.CLIENT_FULL_NAME;
		var sClientShortName = aEmailIds.CLIENT_SHORT_NAME;

		// var sLink_Portal_GuestAccess = sDetails.PORTAL_LINK + "/iven-guests";
		var sLink_Portal_GuestAccess = sDetails.PORTAL_LINK ;
		// var sLink_Portal_LoginAccess = sDetails.PORTAL_LINK + "/iven";
		var sLink_Portal_LoginAccess = sDetails.PORTAL_LINK ;

		var sLink_Registation_Form =  sLink_Portal_GuestAccess + "31f0823a-bdc7-470e-ad35-1f94f827afd5.comibsplivenivenregistrationform.comibsplivenivenregistrationform-0.0.1/index.html#/Routehome";
					
		
		var greetingsTo;
		var linkcontent;
		var sRows = "";
		if (sAppType === "REQUEST") {
			var supEmailContent = {};
			if (sAction === "CREATE") {

				var req_Type = oEmailData.ReqType.toString();
				if (req_Type === "1" || req_Type === "2" || req_Type === "3" || req_Type === "6") {
					var req = "";
				} else {
					var req = " Update ";
				}

				Emailbody = "Dear Approver," + "<br><br>";
				// var link = "Vendor_Request_Approval-Approve&/VendorInviteList/" + parseInt(oEmailData.ReqNo, 10);
				var link =sLink_Portal_LoginAccess + "site?siteId=dfe9a08b-9dd0-4282-b092-59cf8a8da401#iven_request_approval-display?&/RouteMaster/"+ parseInt(oEmailData.ReqNo, 10);
				oEmailContent.emailBody = req + "Request No. " + oEmailData.ReqNo + " for Vendor " + oEmailData.SupplierName +
					" has been created and is currently pending your approval." + "<br>" + "<br>" +
					"Please click " + "<a href=" +  link + ">" + "here" + "</a>" + " to login to " + sClientShortName + " Portal and approve." +
					"<br>" + "<br>" +
					// 			"<a href=" + EMAIL_LIBRARY.sLink_Portal_AdminAccess + "#" + link + ">" + EMAIL_LIBRARY.sLink_Portal_AdminAccess + "</a>" + "<br>" +
					// 			"<a href=" + "https://flpnwc-ww4hph2jbz.dispatcher.ae1.hana.ondemand.com/sites/iven#Home-show" +
					// 			">https://flpnwc-ww4hph2jbz.dispatcher.ae1.hana.ondemand.com/sites/iven#Home-show</a>" + "<br>" +
					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
					sClientContactEmail +
					"</a>" + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team" +
					"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody + oEmailContent.emailBody + "</p>";
				// 		subject = req + "Request created for supplier " + data[0].SupplierName;
				oEmailContent.subject = "Vendor request created";

			} else if (sAction === "APPROVE") {

				var req_Type = oEmailData.ReqType.toString();

				if (req_Type === "1" || req_Type === "2" || req_Type === "3" || req_Type === "6") {
					oEmailContent.subject = "Vendor Registration request approved";

					oEmailContent.emailBody = "Request No. " + oEmailData.ReqNo + " for vendor " + oEmailData.SupplierName +
						" has been approved." + "<br>" + "<br>" +
						"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
						sClientContactEmail +
						"</a>" + "<br>" +
						"<br>" +
						"Regards," + "<br>" +
						"Vendor Management Team" +
						"<br><br>";

				} else {
					oEmailContent.subject = "Vendor update request approved.";
					// 			subject = msg + "Invitation to update registration on the " + data[0].ENTITY_DESC + " supplier database";
					oEmailContent.emailBody = "Request No. " + oEmailData.ReqNo + " for vendor " + oEmailData.SupplierName +
						" has been approved." + "<br>" + "<br>" +
						"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
						sClientContactEmail +
						"</a>" + "<br>" +
						"<br>" +
						"Regards," + "<br>" +
						"Vendor Management Team" +
						"<br><br>";
				}

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
					oEmailContent.emailBody + "</p>";

			} else if (sAction === "REJECT" || sAction === "DELETE") {
				if(sAction === "DELETE") sAction = "DELET"
				var emailStartForUpdate, req;
				var req_Type = oEmailData.ReqType;
				if (req_Type === 1 || req_Type === 2 || req_Type === 3 || req_Type === 6) {
					req = "";
					emailStartForUpdate = "";
				} else {
					req = "update ";
					emailStartForUpdate = 'Your company details ';
				}
				

				Emailbody = "Dear Approver," + "<br><br>";
				oEmailContent.emailBody = emailStartForUpdate + req + "Request No. " + oEmailData.ReqNo + " for vendor " + oEmailData.SupplierName +
					" has been " + sAction.toLowerCase() + "ed." + "<br>" + "<br>" +
					"Reason for " + sAction.toLowerCase() + "ion. :" + "<br>" +
					oEmailData.RejComm +
					"<br>" +
					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
					sClientContactEmail +
					"</a>" + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team" +
					"<br><br>";

				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
					oEmailContent.emailBody + "</p>";
				// 		subject = req + "Request rejected for supplier " + data[0].SupplierName;
				oEmailContent.subject = "Vendor " + req + "request " + sAction.toLowerCase() + "ed. ";
			} else if (sAction === "INVITE" || sAction === "RE_INVITE") {

				if (sAction === "RE_INVITE") {
					msg = "Re-";
				} else {
					msg = "";
				}

				var req_Type = oEmailData.ReqType.toString();

				if (req_Type === "1" || req_Type === "2" || req_Type === "3" || req_Type === "6") {
					// let link = sLink_Portal_GuestAccess + "d6c42621-0dc7-4a69-a65c-3ee082ca5470.comibsplivenivenregistrationform.comibsplivenivenregistrationform-0.0.1/index.html#/Routehome";
					oEmailContent.subject = msg + "Invitation to register on IBSPL Vendor Portal";

					var emailBody = "Upon successful approval, you may receive future invitations to participate in procurement processes conducted by " +
						oEmailData.EntityDesc + "." + "<br>" + "<br>" +
						"Please note that your approved registration does not guarantee automatic invitation to all procurement processes. " + oEmailData.EntityDesc +
						" retains the right to select participants at its own discretion.";

					oEmailContent.emailBody = "We kindly " + msg + " invite your company " + oEmailData.SupplierName + ", to register as a vendor with " +
						oEmailData.EntityDesc +
						"." +
						"<br>" + "<br>" +
						"To engage in any business activities with " + oEmailData.EntityDesc +
						", it is mandatory for you to complete the registration form provided in " +
						"<a href=" + sLink_Registation_Form + ">" + "the link" + "</a>" + "<br>" +
						// ">https://edgevendorregistrationform-ww4hph2jbz.dispatcher.ae1.hana.ondemand.com/index.html</a>" + "<br>" +
						"<br>" +
						"Once you submit your registration, our dedicated teams will thoroughly review and approve your request. Additional information may be requested during this process." +
						"<br>" + "<br>" +
						// "Once approved, you may be invited to future procurement processes by " + data[0].ENTITY_DESC +
						// ". Your approved registration does not entitle you to be invited to any/all procurement processes. " + data[0].ENTITY_DESC +
						// " reserve the right to select the participants based on their discretion." 
						emailBody + "<br>" + "<br>" +
						"If you have any inquiries, please feel free to contact us via email at <a href=" + sClientContactEmail + ">" + sClientContactEmail +
						"</a>" + "<br>" + "<br>" +
						"Best Regards," + "<br>" +
						"Vendor Management Team" +
						"<br><br>";

				} else {

					oEmailContent.subject = msg + "Invitation to update your company details on  " + oEmailData.EntityDesc + " Vendor Portal";

					var emailBody = "Once approved, you may be invited to future procurement processes by " + oEmailData.EntityDesc +
						". Your approved registration does not entitle you to be invited to any/all procurement processes. " + oEmailData.EntityDesc +
						" reserve the right to select the participants based on their discretion.";

					oEmailContent.emailBody = "Your company, " + oEmailData.SupplierName + " is " + msg + "invited to update registration with " + oEmailData.EntityDesc +
						" as a vendor." + "<br>" + "<br>" +
						"In order to perform any business with us, you need to complete this registration in full " +
						"using the link " +
						"<a href=" + sLink_Registation_Form + ">" + "here" + "</a>" + "<br>" +
						"<br>" +
						"Upon submission, your registration request will be reviewed by the relevant teams. We may seek additional information as part of this process." +
						"<br>" + "<br>" +
						// "Once approved, you may be invited to future procurement processes by " + data[0].ENTITY_DESC +
						// ". Your approved registration does not entitle you to be invited to any/all procurement processes. " + data[0].ENTITY_DESC +
						// " reserve the right to select the participants based on their discretion." 
						"<u>" + emailBody + "</u><br>" + "<br>" +
						"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
						sClientContactEmail +
						"</a>" + "<br>" + "<br>" +
						"Regards," + "<br>" +
						"Vendor Management Team" +
						"<br><br>";
				}

				Emailbody = "Dear Vendor," + "<br><br>";
				oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + Emailbody +
					oEmailContent.emailBody + "</p>";
			}
		} else if (sAppType === "REGISTER") {
			if (sAction === "CREATE" || sAction === "APPROVE" || sAction === "RESEND" || sAction === "INTERNALREQ" || sAction === "QUICK_REG") {
				greetingsTo = 'Dear Approver,'
				linkcontent = "Please click " + "<a href=" + sLink_Portal_LoginAccess + sLink_Registraion_Approval + parseInt(oEmailData.ReqNo, 10) +
					">here</a>" + " to login to " + sClientShortName + " Portal and approve."
				var sActionTypeText = "";
				var sProcessTypeText = "registration form ";
				if (sAction === "CREATE") {
					sActionTypeText = "submitted";

				} else if (sAction === "APPROVE") {
					sActionTypeText = "approved ";
					// greetingsTo = 'Dear User,'
					// linkcontent ='You can check the details for the request on the TII portal using this '+"<a href=" + sLink_Portal_LoginAccess+ ">link</a>"
					// sActionTypeText = "approved at L" + oEmailData.Approver_Level;
				} else if (sAction === "RESEND") {
					greetingsTo = 'Dear Approver,'
					linkcontent = "Please click " + "<a href=" + sLink_Portal_LoginAccess + sLink_Registraion_Approval + parseInt(oEmailData.ReqNo, 10) +
						">here</a>" + " to login to " + sClientShortName + " Portal and approve."
					sActionTypeText = "re-submitted";
				} else if (sAction === "INTERNALREQ") {
					sActionTypeText = "submitted as Internal Request";
				} else if (sAction === "QUICK_REG") {
					sActionTypeText = "initiated";
					sProcessTypeText = "registration ";
				}

				var sRequestTypeText = "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "profile update ";
					sProcessTypeText = '';   
					// sActionTypeText = '';
					greetingsTo = 'Dear Approver,'
					linkcontent = "Please click " + "<a href=" + sLink_Portal_LoginAccess + sLink_Registraion_Approval + parseInt(oEmailData.ReqNo, 10) +
						">here</a>"
				} else if (sAction === "QUICK_REG") {
					sRequestTypeText = "Quick ";
				}
				// oEmailContent.subject = "Supplier " + oEmailData.SupplierName + sRequestTypeText + sProcessTypeText + sActionTypeText + "."; 
				oEmailContent.subject = "Vendor " + sRequestTypeText + sProcessTypeText + sActionTypeText + ".";

				oEmailContent.emailBody = greetingsTo + "<br><br>" +
					"Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText + "Vendor Registration of <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " has been " + sActionTypeText + " and is currently pending your approval.<br>" + "<br>" +
					linkcontent +
					"<br>" + "<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			}
			if (sAction === "SELFREG") {

				var sActionTypeText = "";
				if (iStatus === 5) {
					sActionTypeText = "submitted";
				} else if (iStatus === 9) {
					sActionTypeText = "re-submitted";
				}

				var sRequestTypeText = "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "updated ";
				}

				oEmailContent.subject = "Vendor " + sRequestTypeText + "self registration form " + sActionTypeText + " for " + oEmailData.SupplierName;

				oEmailContent.emailBody = "Dear Vendor," + "<br><br>" +
					"Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText +
					"Vendor self Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " has been " + sActionTypeText + " and is currently pending for approval.<br>" + "<br>" +
					// 			oEmailContent.emailBody += " has been " + sActionTypeText + " and is currently pending for buyer assignment.<br>" + "<br>" +

					"Please login to the following " + sClientShortName + " portal link to approve, using the link " +
					"<a href=" + sLink_Portal_LoginAccess + sLink_Registraion_Approval + parseInt(oEmailData.ReqNo, 10) + ">here</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			} else if (sAction === "REJECT") {
				var sRequestTypeText = "";
				var req = '';
				var sSupplierName = " for Vendor " + sRequestTypeText + " Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> has been rejected.<br>" + "<br>"
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "updated ";
					req = 'Update ';
					sSupplierName = " for <span style=\"text-transform:uppercase\">" +
						oEmailData.SupplierName +
						"</span> has been rejected.<br>" + "<br>"
				}

				oEmailContent.subject = "Vendor " + sRequestTypeText + "registration form rejected.";

				oEmailContent.emailBody = "Dear Vendor," + "<br><br>" +

					req + "Request No. " + oEmailData.ReqNo + sSupplierName +

					"Reason for rejection:" + "<br>" +
					oEmailData.Reason + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			} else if (sAction === "SENDBACK") {

				var sRequestTypeText = "";
				var req = '';
				var sPortal_Link = sLink_Registation_Form;
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "Updated ";
					req = 'Update '
					sPortal_Link = sLink_Registation_Form;
				}

				// 			oEmailContent.subject = "Supplier " + sRequestTypeText + "registration form sent back  for " + oEmailData.SupplierName; 
				oEmailContent.subject = "Vendor " + sRequestTypeText + "registration form returned.";

				oEmailContent.emailBody = "Dear Vendor," + "<br><br>" +

					req + "Request No: " + oEmailData.ReqNo + " for Vendor " + sRequestTypeText +
					"Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> has been sent back.<br><br>" +

					"Reason:" + "<br>" +
					oEmailData.Reason + "<br><br>" +

					"You can check the details for the request on the IBSPL portal using this " +
					"<a href=" + sPortal_Link + ">link</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			}
		} else if (sAppType === "BUYER_NOTIFICATION") {
			// Buyer notifications only
			var sRequestTypeText;
			var req = '';
			if (sAction === "APPROVE" || sAction === "FINAL_APPROVAL") {
				sRequestTypeText = " registration form ";
				var sActionTypeText = "approved ";
				// 			var sActionTypeText = "approved at L" + oEmailData.Approver_Level;
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = " update form";
					req = 'update ';
				}

				oEmailContent.subject = "Vendor " + sRequestTypeText + " " + sActionTypeText;

				oEmailContent.emailBody = "Dear User," + "<br><br>" +
					"Your " + req + "Request No. " + oEmailData.ReqNo + " for" + sRequestTypeText +
					" Vendor Registration of <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span> has been " + sActionTypeText + " by " + oEmailData.Approver_Email + ".<br><br>" +

					"You can check the details for the request on the " + sClientShortName + " portal using this " +
					"<a href=" + sLink_Portal_LoginAccess + sLink_Request_Report  + parseInt(oEmailData.ReqNo, 10)+ ">link</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			} else if (sAction === "REJECT") {
				var sRequestTypeText = "";
				// 			var sRejectionLevel = "L" + oEmailData.Approver_Level + " approval" || "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "updated ";
				}

				oEmailContent.subject = "Vendor " + sRequestTypeText + "registration form rejected.";

				oEmailContent.emailBody = "Dear Buyer," + "<br><br>" +

					"Request No. " + oEmailData.ReqNo + " for vendor " + sRequestTypeText + " registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> has been rejected " + " by " + oEmailData.Approver_Email + ".<br>" + "<br>" +

					"Reason for rejection:" + "<br>" +
					oEmailData.Reason + "<br><br>" +

					"You can check the details for the request on the " + sClientShortName + " portal report using the link " +
					"<a href=" +  sLink_Portal_LoginAccess + sLink_Request_Report  + parseInt(oEmailData.ReqNo, 10) + ">here</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			} else if (sAction === "SENDBACK") {

				var sRequestTypeText = "";
				var sRejectionLevel = " approval" || "";
				// 			var sRejectionLevel = "L" + oEmailData.Approver_Level + " approval" || ""; 
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "updated ";
				}

				oEmailContent.subject = "Vendor " + sRequestTypeText + "registration form sent back.";

				oEmailContent.emailBody = "Dear Buyer," + "<br><br>" +

					"Request No. " + oEmailData.ReqNo + " for Vendor " + sRequestTypeText + "registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> has been sent back during " + sRejectionLevel + " by " + oEmailData.Approver_Email + ".<br><br>" +

					"Reason for sendback:" + "<br>" +
					oEmailData.Reason + "<br><br>" +

					"You can check the details for the request on the " + sClientShortName + " portal report using the link " +
					"<a href=" + sLink_Portal_LoginAccess + sLink_Request_Report  + parseInt(oEmailData.ReqNo, 10) + ">here</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			} else if (sAction === "SELFREG_BUYER") {

				oEmailContent.subject = "New vendor self registration request No: " + oEmailData.ReqNo + " has been assigned to you";
				// 			oEmailContent.subject = "Self Registration Request No: " + oEmailData.ReqNo + " created for " + oEmailData.SupplierName;

				oEmailContent.emailBody = "Dear Valued Recipient," + "<br><br>" +

					// 			"Request No: " + oEmailData.ReqNo + " for Supplier <span style=\"text-transform:uppercase\">" + oEmailData.SupplierName +
					// 				"</span> has been created as self registration and you have been assigned to the request as buyer.<br><br>" +

					"Self Registration Request No : " + oEmailData.ReqNo + " has been assigned to you as buyer by SMDM team.<br><br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			}

		} else if (sAppType === "SUPPLIER_NOTIFICATION") {
			// Supplier notifications only
			var req = '';
			if (sAction === "MASTER_APPROVAL") {
				var sRequestTypeText = "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "updated ";
					req = 'update '
				}
				var portallink = sLink_Portal_LoginAccess+"site/iven#Shell-home";
				oEmailContent.subject = "Final approval of " + sRequestTypeText + "vendor registration form is complete.";

				oEmailContent.emailBody = "Dear Vendor," + "<br><br>" +
					"Your " + req + "Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText +
					"vendor registration with " + sClientName + " as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span> has been approved and the registration process is complete." +
					"You will receive an email with " + sClientShortName + " portal credentials soon.<br><br>" +

					"Once you receive the credentials, you can login to the " + sClientShortName + " portal using this  " +
					"<a href=" + portallink + ">link</a>" + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			} else if (sAction === "MASTER_REJECT") {
				var sRequestTypeText = "";
				if (oEmailData.ReqType === 5) {      
					sRequestTypeText = "Updated ";
				}

				oEmailContent.subject = sRequestTypeText + "Vendor registration form rejected.";

				oEmailContent.emailBody = "Dear Vendor," + "<br><br>" +

					"Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText + "Vendor registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> has been rejected.<br>" +

					"<br>" + "Reason for rejection:" + "<br>" +
					oEmailData.Reason + "<br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			} else if (sAction === "SELFREG_SUPPLIER") {

				oEmailContent.subject = "Request No: " + oEmailData.ReqNo + " created with " + sClientName + " for registration as vendor";

				oEmailContent.emailBody = "Dear Valued Recipient," + "<br><br>" +

					"Thank you for showing interest in registering with " + sClientName + " as a vendor.<br><br>" +

					"In order to perform any business with us, you need to complete this registration in full using the link " +
					"<a href=" + sLink_Registation_Form + ">here</a><br><br>" +

					"Upon submission, your registration request will be reviewed by the relevant teams <strong>within 30 working days</strong>. We may seek additional information as part of this process.<br><br>" +

					"<u>Once approved, you may be invited to future procurement processes by " + sClientName + ".</u>" +

					"<u>Your approved registration does not entitle you to be invited to any/all procurement processes. " + sClientName +
					" reserves the right to select the participants based on its own discretion.</u><br><br>" +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			}

		} else if (sAppType === "COMMUNCATION") {
			if (sAction === "VENDOR") {

				oEmailContent.emailBody = "Dear Approver," + "<br><br>" +
					"There is a message from <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>" +
					" for your request  <strong>" + oEmailData.ReqNo + "</strong>.<br>" + "<br>" +

					"Vendor's message:" + "<br>" +
					oEmailData.sMessage + "<br>" +
    
					"<br>" +
					"Thanks!" + "<br>" +
					oEmailData.SupplierName + "<br>" +
					"" + oEmailData.From_Email + "";

				oEmailContent.subject = "Message from Vendor: " + oEmailData.SupplierName;

			} else if (sAction === "BUYER") {

				oEmailContent.emailBody = "Dear Vendor," + "<br><br>" +
					"There is a message from <span style=\"text-transform:uppercase\">Procurement Team</span>" +
					" for your request  <strong>" + oEmailData.ReqNo + "</strong>.<br>" + "<br>" +

					"Procurement team's message:" + "<br>" +
					oEmailData.sMessage + "<br>" +

					"<br>" +
					"Thanks!" + "<br>" +
					"Vendor Registration Team" + "<br>" +
					"" + sClientShortName + "";

				oEmailContent.subject = "Message from Procurement Team";

			} else if (sAction === "APPROVER") {
				oEmailContent.emailBody = "Dear Vendor," + "<br><br>" +
					"There is a message from <span style=\"text-transform:uppercase\">Approver</span>" +
					" for request  <strong>" + oEmailData.ReqNo + "</strong>.<br>" + "<br>" +

					"Approver's message:" + "<br>" +
					oEmailData.sMessage + "<br>" +

					"<br>" +
					"Thanks!" + "<br>" +
					"Vendor Registration Team" + "<br>" +
					"" + sClientShortName + "";

				oEmailContent.subject = "Message from Registration Approver";

			}

		} else if (sAppType === "PENDING_NOTIFICATION") {
			if (iStatus === 5 || iStatus === 6) {

				var sActionTypeText = "";
				if (iStatus === 5) {
					sActionTypeText = "submitted";
				} else if (iStatus === 6) {
					sActionTypeText = "approved";
				} else if (iStatus === 9) {
					sActionTypeText = "re-submitted";
				}

				var sRequestTypeText = "";
				if (oEmailData.ReqType === 5) {
					sRequestTypeText = "Updated ";
				}

				oEmailContent.subject = "Vendor " + sRequestTypeText + "registration form " + sActionTypeText + ".";

				oEmailContent.emailBody = "Dear Approver," + "<br><br>" +

					sRequestTypeText + "Request No. " + oEmailData.ReqNo + " for Vendor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += "  has been " + sActionTypeText + " and is currently pending your approval<strong>" + oEmailData.For_Days +
					"</strong>.<br>" + "<br>" +

					"Please click " + "<a href=" + sLink_Registation_Form + ">here</a>" + "<br>" + " to login to " + sClientShortName +
					"  Portal and approve." +

					"<br>" +
					"Should you have any questions, please do not hesitate to reach out to us via email at " +
					"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
					"<br>" +
					"Regards," + "<br>" +
					"Vendor Management Team";

			}
		} else if (sAppType === "ATTACHMENTS") {
			var sRows = "";
			var options = {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			};
			var deadline = new Date();
			deadline.setHours(0, 0, 0, 0); // Sets Time values as zeroes

			oEmailContent.emailBody = "Dear Valued Recipient," + "<br><br>";

			if (sAction === "BEFORE") {

				deadline.setDate(deadline.getDate() + 30);

				oEmailContent.subject = "" + sClientShortName + " registration form attachments expiring in 7 days.";

				oEmailContent.emailBody +=
					"Some of your attachments (documents/certificates) uploaded in Vendor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " are set to expire in <strong>7 days</strong>." + "<br><br>";
				oEmailContent.emailBody +=
					"Please update the registration form with the renewed documents for the following attacments soon by <strong>" + getLongDate(deadline) +
					"</strong>:" + "<br>";

			} else if (sAction === "ON") {
				deadline.setDate(deadline.getDate() + 30);

				oEmailContent.subject = "" + sClientShortName + " registration form attachments expiring today.";

				oEmailContent.emailBody +=
					"Some of your attachments (documents/certificates) uploaded in Vendor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " are set to expire <strong>today</strong>." + "<br><br>";
				oEmailContent.emailBody +=
					"Please update the registration form with the renewed documents for the following attachments in 30 days. " +
					"Else your vendor registration may get deactivated on " +
					"<strong>" + getLongDate(deadline) + "</strong>." + "<br>";

			} else if (sAction === "AFTER_7Days") {
				deadline.setDate(deadline.getDate() + 23);

				oEmailContent.subject = "" + sClientShortName + " registration form attachments expiring in 20days";

				oEmailContent.emailBody +=
					"Some of your attachments (documents/certificates) uploaded in Vendor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " are set to expire <strong>today</strong>." + "<br><br>";
				oEmailContent.emailBody +=
					"Please update the registration form with the renewed documents for the following attachments in 30 days. " +
					"Else your vendor registration may get deactivated on " +
					"<strong>" + getLongDate(deadline) + "</strong>." + "<br>";

			} else if (sAction === "AFTER") {
				oEmailContent.subject = "" + sClientShortName + " registration form attachments expired 30 days back.";

				oEmailContent.emailBody +=
					"Some of your attachments (documents/certificates) uploaded in Vendor Registration as <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName + "</span>";

				oEmailContent.emailBody += " have <strong>expired 30 days back</strong>." + "<br><br>";
				oEmailContent.emailBody += "Your registration might be <strong>blocked</strong> as the following expired attachments were not updated:" +
					"<br>";

			} else if (sAction === "ATTACH_EXPIRY") {
				//PROC_MNGR_NOTIFICATION
				oEmailContent.subject = "Vendor: " + oEmailData.SupplierName + " has not updated expired documents after being notified.";

				oEmailContent.emailBody +=
					"Vendor <span style=\"text-transform:uppercase\">" +
					oEmailData.SupplierName +
					"</span> missed updating the expired attachments (documents/certificates) uploaded in Vendor Registration </span>";

				oEmailContent.emailBody += "even after sending final notification as reminder for the following attachments:" + "<br><br>";

			}

			oEmailContent.emailBody += "<br><TABLE width='650px' class='table100-head' style='text-align: center;border: 1px solid black;'>";
			sRows += "<thead>" +
				"<TR>" +
				"<TH class='column1'>Attachments</TH>" +
				"<TH class='column2'>Expiry Date</TH>" +
				"</TR>";

			sRows += "</thead><tbody>";

			for (var i = 0; i < oEmailData.Attachments.length; i++) {
				sRows += "<TR>";
				sRows += "<TD>" + oEmailData.Attachments[i].ATTACH_DESC + "</TD>";
				sRows += "<TD>" + getLongDate(oEmailData.Attachments[i].EXPIRY_DATE) + "</TD>";
				sRows += "</TR>";
			}
			sRows += "</tbody>";

			oEmailContent.emailBody += sRows;

			oEmailContent.emailBody += "</TABLE class='table100-head'><br><br>";

			if (sAction === "BEFORE" || sAction === "ON") {
				oEmailContent.emailBody += "You can check your form via the below link and click on the 'Edit' option in the form:" + "<br>" +
					"<a href=" + sLink_Registation_Form + ">here</a><br><br>";
			} else if (sAction === "ATTACH_EXPIRY") {
				oEmailContent.emailBody += "Kindly take the necessary actions.<br><br>";
			}

			oEmailContent.emailBody += "Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Vendor Management Team";

		} else if (sAppType === "USER_DELEGATE") {

			var sRequestTypeText = "";
			var sAppLink = "";
			if (oEmailData.ReqType === 5) {
				sRequestTypeText = "updated ";
			}

			var sRequestLevel = "";
			if (iStatus === 1 || iStatus === 2 || iStatus === 3) {
				sRequestLevel = "Request";
				sAppLink = sLink_Request_Approval;
			} else {
				sRequestLevel = "Registration";
				sAppLink = sLink_Registraion_Approval;
			}

			oEmailContent.subject = "Request No: " + parseInt(oEmailData.ReqNo, 10) + " is re-assigned for approval.";

			oEmailContent.emailBody = "Dear Approver," + "<br><br>" +
				"Request No. " + oEmailData.ReqNo + " for " + sRequestTypeText + "Vendor " + sRequestLevel +
				" of <span style=\"text-transform:uppercase\">" +
				oEmailData.SupplierName + "</span>";

			oEmailContent.emailBody += " has been re-assigned to <strong>" + oEmailData.Assigned_To +
				"</strong> and is currently pending approval.<br>" + "<br>" +

				"Please click " + "<a href=" + sLink_Portal_LoginAccess + sAppLink + parseInt(oEmailData.ReqNo, 10) + ">here</a>" + " to login to " +
				sClientShortName + " Portal and approve." + "<br>" +

				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Vendor Management Team";

		} else if (sAppType === "SEC_PIN") {

			oEmailContent.subject = "" + sClientShortName + " Registration form login PIN.";

			oEmailContent.emailBody = "Dear Vendor," + "<br><br>" +
				"Please use the below 6-digit PIN to login to your Vendor Registration Form as <span style=\"text-transform:uppercase\">" +
				oEmailData.SupplierName + "</span> and registered email id <span style=\"text-transform:bold\">" + oEmailData.SupplierId +
				"</span><br><br>";

			oEmailContent.emailBody += "Security login PIN: <strong>" + oEmailData.sSecurityPin + "</strong><br>" + "<br><br>" +

				// 		"Please login to the following " + sClientShortName + " portal link to approve, using the link " + 
				// 			"<a href=" + sLink_Portal_LoginAccess + sAppLink +  parseInt(oEmailData.ReqNo, 10) + ">here</a>" + "<br>" +

				"<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Vendor Management Team";

		} else if (sAppType === "REQ_TYPE_CHANGE") {

			var sType = "";
			if (oEmailData.sChangeType === "RT") {
				sType = "Request-Type";
			} else {
				sType = "Sub -Type";
			}

			oEmailContent.subject = "Request No: " + parseInt(oEmailData.ReqNo, 10) + " - Vendor Request Type/Sub Type changed";

			oEmailContent.emailBody = "Dear Approver," + "<br><br>" +
			"Request No. " + oEmailData.ReqNo + " for vendor as   <span style=\"text-transform:uppercase\">" +
			oEmailData.SupplierName + "</span> has below changes done by " + oEmailData.Changed_by +".<br>";
				
oEmailContent.emailBody += "<br><TABLE width='650px' class='table100-head' style='text-align: center;border:2px solid black;'>";
			sRows += "<thead>" +
				"<TR border:1px solid black;>" +
				"<TH  class='column1' border:1px solid black;>Sr No.</TH>" +
				"<TH class='column2' border:1px solid black;>Change Type</TH>" +
				"<TH class='column3' border:1px solid black;>Old Value</TH>" +
				"<TH class='column4' border:1px solid black;>New Value</TH>" +
				"</TR>";

			sRows += "</thead><tbody>";

			for (var i = 0; i < oEmailData.changeDetails.length; i++) {
				var srno=i+1;
				sRows += "<TR border:1px solid black;>";
				sRows += "<TD border:1px solid black;>" + srno + "</TD>";
				sRows += "<TD border:1px solid black;>" + oEmailData.changeDetails[i].CHANGE_TYPE + "</TD>";
				sRows += "<TD border:1px solid black;>" + oEmailData.changeDetails[i].OLD_VALUE + "</TD>";
				sRows += "<TD border:1px solid black;>" + oEmailData.changeDetails[i].NEW_VALUE + "</TD>";
				sRows += "</TR>";
			}
			sRows += "</tbody>";

			oEmailContent.emailBody += sRows;

			oEmailContent.emailBody += "</TABLE class='table100-head'><br><br> " +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Vendor Management Team";

		} else if (sAppType === "REG_EMAILID_CHANGE") {

			if (oEmailData.RequestType === 5) {
				sLink = sLink_Registation_Form;
			} else {
				sLink = sLink_Registation_Form;
			}
			var linkStatement = "";
			if(oEmailData.Status !== 1)
				linkStatement = "Please login to the following " + sClientShortName + " portal using the link " +
				"<a href=" + sLink + ">here</a><br><br>";

			oEmailContent.subject = "Registered Email ID changed for - " + oEmailData.SupplierName;

			oEmailContent.emailBody = "Dear Vendor," + "<br><br>" +
				"Vendor Registred Email ID for <span style=\"text-transform:uppercase\">" +
				oEmailData.SupplierName + "</span>";

			oEmailContent.emailBody += " has been changed from " + oEmailData.Changed_From + " to <strong>" +
				oEmailData.Changed_To + "</strong>.<br><br>" +
				linkStatement +
				"Should you have any questions, please do not hesitate to reach out to us via email at " +
				"<strong><a href=" + sClientContactEmail + ">" + sClientContactEmail + "</a></strong> " + "<br>" +
				"<br>" +
				"Regards," + "<br>" +
				"Vendor Management Team";

		} else if (sAppType === "INVITE_REMINDER") {
			var sLink = null;
			var sReqType = '';
			if (oEmailData.RequestType === 5) {
				sLink = sLink_Registation_Form;
				sReqType = 'update registration';
			} else {
				sLink = sLink_Registation_Form;
				sReqType = 'register';
			}

			oEmailContent.subject = "" + sClientShortName + " vendor registration invite: Reminder-" + oEmailData.Count;
			oEmailContent.emailBody = "Dear Vendor," + "<br><br>" +
				/*oEmailContent.emailBody = */
				"Your company, " + oEmailData.SupplierName + " is re-invited to " + sReqType + " with " + oEmailData.EntityDesc +
				" as a vendor." + "<br>" + "<br>";
			if (oEmailData.Count === '5') {
				oEmailContent.emailBody +=
					"This is a final reminder. Kindly complete the registration by submitting the E-Vendor registration form at the earliest." + "<br>" +
					"<br>";
			}
			var emailBodyCheck = "Once approved, you may be invited to future procurement processes by " + oEmailData.EntityDesc +
				". Your approved registration does not entitle you to be invited to any/all procurement processes. " + oEmailData.EntityDesc +
				" reserve the right to select the participants based on their discretion.";
			oEmailContent.emailBody += "In order to perform any business with us, you need to complete this registration in full using the link " +
				"<a href=" + sLink + ">" + "here" + "</a>" + "<br>" +

				"<br>" +
				"Upon submission, your registration request will be reviewed by relevant teams. We may seek additional information as part of this process." +
				"<br>" + "<br>" +
				// 			"Once approved, you may be invited to future procurement processes by " + oEmailData.EntityDesc +
				// 			". Your approved registration does not entitle you to be invited to any/all procurement processes. " + oEmailData.EntityDesc +
				// 			" reserve the right to select the participants based on their discretion." + "<br>" + "<br>" +
				"<u>" + emailBodyCheck + "</u><br>" + "<br>" +
				"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail + ">" +
				sClientContactEmail + "</a>" + "<br>" + "<br>" +
				"Regards," + "<br>" +
				"Vendor Management Team";

		}
		else if(sAppType === "DATA_MIGRATION"){
			// var sLink = null;
			// var sReqType = '';
			// if (oEmailData.RequestType === 5) {
			// 	sLink = sLink_Registation_Form;
			// 	sReqType = 'update registration';
			// } else {
			// 	sLink = sLink_Registation_Form;
			// 	sReqType = 'register';
			// }
			var sLink_Portal_LoginAccess = sLink_Registation_Form;

			oEmailContent.subject = "Invitation to update registration on the " + oEmailData.EntityDesc + " supplier database";
			var EmailBody = "Dear Valued Recipient," + "<br><br>";
			var emailBodyCheck = "Once approved, you may be invited to future procurement processes by " +  oEmailData.EntityDesc +
			". Your approved registration does not entitle you to be invited to any/all procurement processes. " +  oEmailData.EntityDesc +
			" reserve the right to select the participants based on their discretion.";
			var Emailbody1 = "Your company, " + oEmailData.SupplierName + " is invited to update registration with " +  oEmailData.EntityDesc  +
		" as a supplier." + "<br>" + "<br>" +
		"In order to perform any business with us, you need to complete this registration in full " +
		"using the link " +
		"<a href=" + sLink_Portal_LoginAccess +
		">here</a>" + "<br>" +
		"<br>" +
		"Upon submission, your registration request will be reviewed by relevant teams. We may seek additional information as part of this process." +
		"<br>" + "<br>" +
	// 		"Once approved, you may be invited to future procurement processes by " + data[0].ENTITY_DESC + 
	// 		". Your approved registration does not entitle you to be invited to any/all procurement processes. " + data[0].ENTITY_DESC +
	// 		" reserve the right to select the participants based on their discretion." + "<br>" + "<br>" +
	"<u>" + emailBodyCheck + "</u><br>" + "<br>" +
		"Should you have any questions, please do not hesitate to reach out to us via email at <a href=" + sClientContactEmail +
		">" + sClientContactEmail + "</a>" + "<br>" + "<br>" +
		"Regards," + "<br>" +
		"Vendor Management Team";

		oEmailContent.emailBody = "<p style=" + "font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black>" + EmailBody + Emailbody1 + "</p>";

		}

		oEmailContent.emailBody = oEmailContent.emailBody + "<br><br>" +
			"<p style=" +
			"font-family:Arial, Helvetica, sans-serif;font-size:9px;color:black>Please note that this email has been generated automatically.</p><br>";

		oEmailContent.emailBody = "<p style=font-family:Arial, Helvetica, sans-serif;font-size:11px;color:black;>" + oEmailContent.emailBody +
			"</p>";

		return oEmailContent;
	}

}