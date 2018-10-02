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
				this.oViewModel.setProperty("/bTruckScanEnabled", false);

			}, this);

		},

		//on live change of input
		onLiveChangeInput: function () {

			//set message strip visible
			this.oViewModel.setProperty("/bMStripVisible", false);

		},

		/**
		 *@memberOf pnp.ewm.dockatdoor.controller.App
		 */
		onChangeInpTruckScan: function (oEvent) {

			//set view model property to display door scan input
			this.oViewModel.setProperty("/bDoorScanVisible", true);

		},

		/**
		 *@memberOf pnp.ewm.dockatdoor.controller.App
		 */
		onChangeInpDoorScan: function (oEvent) {

			//set view model property to display door scan input
			this.oViewModel.setProperty("/bSubmitButtonEnabled", true);

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
					this.setStripMessage("Success", this.getOwnerComponent().getModel("i18n").getProperty("messageDockedSuccessfully"))

					//initialize app view for next docking transaction
					this.initAppView();

				}.bind(this),

				//function import call failed
				error: function (oError) {

					//notify about failure
					this.setStripMessage("Error", this.getOwnerComponent().getModel("i18n").getProperty("messageDockingFailed"))

					//set app page to no longer busy
					this.oViewModel.setProperty("/isAppPageBusy", false);

				}.bind(this)

			});

		},

		//prepare app view for rendering
		initAppView: function () {

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

		}

	});

});