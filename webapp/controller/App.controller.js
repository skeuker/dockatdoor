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

			//set view model properties
			this.oViewModel.setProperty("/bDoorScanVisible", false);
			this.oViewModel.setProperty("/bSubmitButtonEnabled", false);

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

			//set view model property to display door scan input
			this.oViewModel.setProperty("/iTruckScan", null);
			this.oViewModel.setProperty("/iDoorScan", null);
			this.oViewModel.setProperty("/bDoorScanVisible", false);
			this.oViewModel.setProperty("/bSubmitButtonEnabled", false);

		}

	});
});