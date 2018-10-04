sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";
	return Controller.extend("pnp.ewm.dockatdoor.controller.App", {

		//on initialization
		onInit: function () {

			//instantiate view model
			this.oViewModel = new JSONModel({});

			//set model to this view
			this.getView().setModel(this.oViewModel, "ViewModel");

			//prepare app view for rendering
			this.initAppView();

			//set OData model to this view
			this.oODataModel = this.getOwnerComponent().getModel("DockAtDoorModel");

			//attach to metadata load failure event
			this.oODataModel.attachMetadataFailed({}, function () {

				//inform about connectivity issue
				this.setStripMessage("Error", this.getOwnerComponent().getModel("i18n").getProperty("messageMetadataLoadFailed"));

				//disable truck scan form input 
				this.oViewModel.setProperty("/bTruckScanEnabled", true);

			}, this);

		},

		//on after rendering
		onAfterRendering: function () {

			//set focus on truck scan input field
			this.getView().byId("inpTruckScan").focus();

		},

		//on live change of input
		onLiveChangeInput: function (oEvent) {

			//set message strip visible
			this.oViewModel.setProperty("/bMStripVisible", false);

			//set submit button enabled state depending on input
			if (this.getView().byId("inpTruckScan").getValue() &&
				this.getView().byId("inpDoorScan").getValue()) {
				this.oViewModel.setProperty("/bSubmitButtonEnabled", true);
			} else {
				this.oViewModel.setProperty("/bSubmitButtonEnabled", false);
			}

			//truck scan input has changed
			if (/Truck/.test(oEvent.getSource().getId())) {
				this.onChangeInpTruckScan();
			}

			//door scan input has changed
			if (/Door/.test(oEvent.getSource().getId())) {
				this.onChangeInpDoorScan();
			}

		},

		/**
		 *@memberOf pnp.ewm.dockatdoor.controller.App
		 */
		onChangeInpTruckScan: function () {

			//get value contained in input
			var oValue = this.getView().byId("inpTruckScan").getValue();

			//decide whether input to be visible or not
			var bVisible = oValue ? true : false;

			//set view model property for door scan input visibility
			this.oViewModel.setProperty("/bDoorScanVisible", bVisible);

			//initialize door scan where applicable
			if (!bVisible) {
				this.oViewModel.setProperty("/iDoorScan", null);
			}

		},

		/**
		 *@memberOf pnp.ewm.dockatdoor.controller.App
		 */
		onChangeInpDoorScan: function () {

			//get value contained in input
			var oValue = this.getView().byId("inpDoorScan").getValue();

			//decide whether submit to be visible or not
			var bEnabled = oValue ? true : false;

			//set view model property to set enabled state of submit button
			this.oViewModel.setProperty("/bSubmitButtonEnabled", bEnabled);

		},

		/**
		 *@memberOf pnp.ewm.dockatdoor.controller.App
		 */
		onPressSubmitFormDockAtDoor: function (oEvent) {

			//set app page to busy
			this.oViewModel.setProperty("/isAppPageBusy", true);

			//execute function import on OData model
			this.oODataModel.callFunction("/dockatdoor", {

				//function import called successfully
				success: function (oData, response) {

					//notify about docking successfully
					this.setStripMessage("Success", this.getOwnerComponent().getModel("i18n").getProperty("messageDockedSuccessfully"));

					//initialize app view for next docking transaction
					this.initAppView();

				}.bind(this),

				//function import call failed
				error: function (oError) {

					//notify about failure
					this.setStripMessage("Error", this.getOwnerComponent().getModel("i18n").getProperty("messageDockingFailed"));

					//set app page to no longer busy
					this.oViewModel.setProperty("/isAppPageBusy", false);

				}.bind(this)

			});

		},

		//prepare app view for rendering
		initAppView: function () {

			this.getView().byId("inpTruckScan").focus();
			this.oViewModel.setProperty("/bMStripVisible", false);
			this.oViewModel.setProperty("/bMStripVisible", false);
			this.oViewModel.setProperty("/isAppPageBusy", false);
			this.oViewModel.setProperty("/iTruckScan", null);
			this.oViewModel.setProperty("/iDoorScan", null);
			this.oViewModel.setProperty("/bDoorScanVisible", false);
			this.oViewModel.setProperty("/bSubmitButtonEnabled", false);

		},

		//set strip message
		setStripMessage: function (sMessageType, sMessageText) {

			//set message strip text
			var oMStrip = this.getView().byId("mstripAppView");
			oMStrip.setText(sMessageText);
			oMStrip.setType(sMessageType);

			//set message strip visible
			this.oViewModel.setProperty("/bMStripVisible", true);

		},

		//on successfully scanning a truck
		onTruckBarcodeScanSuccessful: function (oEvent) {

			//adopt scanned truck barcode into view
			this.oViewModel.setProperty("/iTruckScan", oEvent.mParameters.text);

			//call truck scan input change handler
			this.onChangeInpTruckScan();

		},

		//on successfully scanning a door
		onDoorBarcodeScanSuccessful: function (oEvent) {

			//adopt scanned door barcode into view
			this.oViewModel.setProperty("/iDoorScan", oEvent.mParameters.text);

			//call door scan input change handler
			this.onChangeInpDoorScan();

		}

	});

});