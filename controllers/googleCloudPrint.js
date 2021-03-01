"use strict";
require("dotenv").config();
const db = require("../models");
const Op = db.Sequelize.Op;
const job_printer = db.job_printer;
const CloudPrint = require("node-gcp");
const fs = require("fs");
const GCP_REFRESH_TOKEN = process.env.GCP_REFRESH_TOKEN;
const clientId =process.env.GCP_CLIENT_ID;
const clientSecret = process.env.GCP_CLIENT_SECRET;
const printer_id = process.env.GCP_PRINTER_ID;
const LogHistoryController = require("../controllers/order_history");

//Functions to get access token from service account
const { GoogleToken } = require("gtoken");
const gtoken = new GoogleToken({
  keyFile: "library/path/to/my-project-1543821334274-0c13278b494b.json",
  scope: ["https://www.googleapis.com/auth/cloudprint"] // or space-delimited string of scopes
});

const { MSG_Settings_REPRINT, DAR_Settings_REPRINT } = require("../helper/pdf_settingTypes");

module.exports = {
  //get user info of specified id
  getPrinter: async (req, res) => {
    const { type, file_location, status, order_id, hub_id, shopify_order_name } = req.pdfDetails;
    const {user_id} = req.user;

    if (status === "NO MESSAGE") {
      return res.json({
        msg: `Message cannot be empty.`
        //job_printer: createdPdf
      });
    }

    if(hub_id !== 1){
      return res.json({
        msg: "REDIRECTED",
        url: file_location
      });
    }

    try {
      // const createdPdf = await job_printer.create({
      //   type,
      //   file_location,
      //   status
      // });

      gtoken.getToken((err, tokens) => {
        if (err) {
          console.log(err);
          return;
        }
        const cloud_print = new CloudPrint({
          clientId: clientId,
          clientSecret: clientSecret,
          accessToken: tokens.access_token,
          refreshToken: GCP_REFRESH_TOKEN
        });
        try {
          cloud_print.getPrinter(printer_id, function(err, response) {
            if (err) {
              console.log("ERROR:", "IROR");
            } else {
              console.log("printer info OK");
            }
          });

          let ticket = {};
          let action_id;

          //Check type to use correct settings
          switch (type) {
            case "DAR":
              ticket = DAR_Settings_REPRINT;
              action_id = 37;
              break;

            case "CR":
              ticket = DAR_Settings_REPRINT;
              action_id = 38;
              break;

            case "MSG":
              ticket = MSG_Settings_REPRINT;
              action_id = 39;
              break;

            case "COD":
              ticket = DAR_Settings_REPRINT;
              action_id = 38;
              break;

            default:
              return false;
          }
          const settings = { ticket: JSON.stringify(ticket) };
          //cloud_print.printTest1

          // console.log("PRINTED!!!!");
          // LogHistoryController.create({
          //   order_id,
          //   user_id,
          //   action: `${type} has been manually printed`,
          //   action_id,
          // }).then(() => {
          //   res.json({
          //     msg: `Successfully reprinted ${type} PDF!`
          //     //job_printer: createdPdf
          //   });
          // });

          // res.json({
          //   msg: `Successfully reprinted ${type} PDF!`
          //   //job_printer: createdPdf
          // });

          cloud_print.print(
            printer_id,
            file_location,
            "url",
            `${shopify_order_name} ${type} - REPRINT`,
            settings,
            function(err, response) {
              console.log("ress", response);
              console.log("PRINTED!");
              LogHistoryController.create({
                order_id,
                user_id,
                action: `${type} has been manually printed`,
                action_id,
              }).then(() => {
                res.json({
                  msg: `Successfully reprinted ${type} PDF!`
                  //job_printer: createdPdf
                });
              });
            }
          );
        } catch (e) {
          console.log("printer error:", e);
        }
      });
    } catch (error) {
      console.log(error);
      res.status(403).json({ msg: "Error inserting job_printer" });
    }
  }
};
