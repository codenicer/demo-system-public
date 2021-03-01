const db = require('../models')
const sendEMail = require('../helper/sendEmail.json')
const nodemailer = require('nodemailer')
const paymentID = ['None','eGHL', 'COD', 'CPU', 'Paypal', 'Paypal_Intl', 'Bank - BPI', 'Dragonpay'];

const sendEmailBody = (order) => {

  var body = '\n\nInformation for this order is the following\n\n' + 'Order number: ' + order.shopify_order_name + '\nDelivery date: ' + order.delivery_date + '\nDelivery time: ' + order.delivery_time +
    '\nCustomer name: ' + order.customer.dataValues.first_name  + ' ' + order.customer.dataValues.last_name +
    '\nRecipient name: ' + order.addresses.dataValues.billing_name +
    '\nEmail: ' + order.contact_email +
    '\nPhone number (Customer): ' + order.addresses.dataValues.billing_phone +
    '\nPhone number (Recipient): ' + order.addresses.dataValues.shipping_phone +
    '\nCity: ' + order.addresses.dataValues.shipping_city +
    '\nSale price: ' + order.total_price + ' (' + paymentID[order.payment_id] + ')' +
    '\n\nDelivery address: ' + order.addresses.dataValues.shipping_address_1 + ' ' + order.addresses.dataValues.shipping_address_2 +
    '\nBilling address: ' + order.addresses.dataValues.billing_address_1 + ' ' + order.addresses.dataValues.billing_address_2

  return body

}

const emailSendScript = (contact,subject,body) => {

  var sendingEmail = {
    contacts: contact,
    subjects: subject,
    bodies: body
  }

  return sendingEmail
}

const sendEmailScript = async (req, res) => {

  let transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_SMTP : process.env.EMAIL_SMTP,
    port: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_PORT : process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_USER : 'calvento.calvin@gmail.com',
      pass: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_PASS : 'podpeste12345'
    }
  });

  console.log('WAWAWA!',req)


  try {

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_ENV === 'production' ? req.contacts : 'calvin@flowerstore.ph',
      subject: req.subjects,
      text: req.bodies
    }

    await transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log('Error occurs', err)
      } else {
        console.log(`Email Sent to ${req.contacts}`)
      }
    })
  }
  catch (err) {
    res.status(500).json({msg: 'Server Error.'})
  }
}


const mailer = {


  sendEmail: async (req, res) => {

    let transporter = nodemailer.createTransport({
      //service: 'gmail',
      host: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_SMTP : process.env.EMAIL_SMTP,
      port: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_PORT : process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_USER : process.env.EMAIL_USER,
        pass: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_PASS : process.env.EMAIL_PASS
      }
    });



    try {

      var mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? req.contact : process.env.EMAIL_TO_DEVELOPMENT,
        subject: 'No Subject',
        text: 'No Message'
      }
      await db.sequelize.query(`SELECT * FROM user WHERE user_id = ${req.user}`).then(([results, metadata]) => {
        console.log('resullllts', results[0].first_name)
        if (results) {
          if (req.action === 'confirm_payment') {
            mailOptions.subject = `Your Order Is Now Confirmed!`
            mailOptions.text = `Hi ${req.customer}\r\n\r\n` + sendEMail.send_email.confirm_payment

          } else if (req.action === 'cancel_order') {
            mailOptions.subject = `Your Order Is Now Cancelled!`
            mailOptions.text = `Hi ${req.customer}\r\n\r\n` + sendEMail.send_email.cancelled_order
          } else if (req.action === 'done_dispatch') {
            mailOptions.subject = `Your Order Is Now Dispatched!`
            mailOptions.text = `Hi ${req.customer}\r\n\r\n` + sendEMail.send_email.done_dispatch
          }else if (req.action === 'prime_arc'){
            mailOptions.subject = req.order_name
            mailOptions.to = process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_PRIME_ARC : process.env.EMAIL_PRIME_DEVELOPMENT
            mailOptions.text = req.order_name
            mailOptions.attachments = [
              {
                filename : 'receipt.png',
                path : req.picture
              }
            ]
          }
        }
      })
      await transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log('Error occurs', err)
        } else {
          console.log(`Email Sent to ${req.customer}`)
        }
      })
    }
    catch (err) {
      res.status(500).json({msg: 'Server Error.'})
    }
  }

}

module.exports = mailer