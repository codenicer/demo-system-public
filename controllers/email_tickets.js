const db = require('../models')
const sendEMail = require('../helper/sendEmail.json')
const nodemailer = require('nodemailer')
const paymentID = ['None','eGHL', 'COD', 'CPU', 'Paypal', 'Paypal_Intl', 'Bank - BPI', 'Dragonpay'];
const qs = require('../helper/query_string')

const emailer = require('../helper/email_helper');

const sendEmailBody = (order) => {

  let shipping_address_1 = order.addresses.dataValues.shipping_address_1 || '';
  let shipping_address_2 = order.addresses.dataValues.shipping_address_2 || '';
  let billing_address_1 = order.addresses.dataValues.billing_address_1 || '';
  let billing_address_2 = order.addresses.dataValues.billing_address_2 || '';


  return  '\n\nInformation for this order is the following\n\n' + 'Order number: ' + order.shopify_order_name + '\nDelivery date: ' + order.delivery_date + '\nDelivery time: ' + order.delivery_time +
    '\nCustomer name: ' + order.customer.dataValues.first_name  + ' ' + order.customer.dataValues.last_name +
    '\nRecipient name: ' + order.addresses.dataValues.billing_name +
    '\nEmail: ' + order.contact_email +
    '\nPhone number (Customer): ' + order.addresses.dataValues.billing_phone +
    '\nPhone number (Recipient): ' + order.addresses.dataValues.shipping_phone +
    '\nCity: ' + order.addresses.dataValues.shipping_city +
    '\nSale price: ' + order.total_price + ' (' + paymentID[order.payment_id] + ')' +
    '\n\nDelivery address: ' + shipping_address_1 + ' ' + shipping_address_2 +
    '\nBilling address: ' + billing_address_1 + ' ' + billing_address_2;


}



const ticketMailer = {

  sendEMailStalker: async (order) => {
    const {order_id} = order

    const subject = 'Secret admirer order ' + order.shopify_order_name;
    let body = sendEmailBody(order);
    body += "The order " + order.shopify_order_name + " has an celebrity as the recipient. We probably don't know the address yet, so this is just a reminder that we need our CS team to find it <3"

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_CONTACT_FLOWERSTORE_1 : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });

      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo id 16 : Stalker order
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"Stalker order",16]})
        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){

      return error

    }


},
  // if product is only add on
  onlyAddsOnEmail: async (order) => {
    const {order_id} = order


    var subject = 'Order ' + order.shopify_order_name + ' with add-ons only';
    var body = sendEmailBody(order)
    body = 'Please have a look at order ' + order.shopify_order_name+ ' for which the customer ordered add-ons only.' + body

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? 'ronnel@flowerstore.ph, paul@flowerstore.ph, contact@flowerstore.ph' : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });

       console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo id 3 : All add-ons
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"All add-ons",3]})


        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){

      return error

    }
  },
  // If antipolo is the delivery address
  antipoloMail: async (order) => {
    const {order_id} = order

    var subject = 'Order ' + order.shopify_order_name + ' for delivery in Antipolo';
    var body = sendEmailBody(order)
    body = 'Please have a look at order ' + order.shopify_order_name+ ' set for delivery in Antipolo.' + body

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_CONTACT_FLOWERSTORE_1 : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });
      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){

        //insert ticket
        // dispo id  = 1 : ODZ
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"Antipolo Delivery Address",21]})

        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){

      return error

    }
  },
  // delivery date is in the past today
  previousDateMail: async (order) =>{
    const {order_id} = order

    var subject = 'Order ' + order.shopify_order_name + ' with delivery date in the past';
    var body = sendEmailBody(order)
    body = 'Please have a look at order ' + order.shopify_order_name + ' which appears to have its delivery date set in the past.' + body

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_CONTACT_FLOWERSTORE_1 : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });
      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo id 14 : Previous delivery date
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"Previous delivery date ",14]})

        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){

      return error

    }
  },
  // NO PAYMENT METHOD

  noPaymentMail: async (order) =>{
    const {order_id} = order

    var subject = 'Order ' + oorder.shopify_order_name + ' with no payment method/0 value/100% voucher/special promo'
    var body = sendEmailBody(order)
    body = "The order " + order.shopify_order_name + " came in with no payment method. What this means is this order is placed (most likely) using a 100% discount voucher, or any other promo we might be currently running. The order will sync to dispatch in a few minutes, this is just a heads up to double check the order is legit."

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_CONTACT_FLOWERSTORE_2 : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });
      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo 13 : No payment method
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"No payment method",13]})

        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){


      return error
    }
  },
  // if sympathy flowers is the product
  forSympathyFlowers: async (order) =>{
    const {order_id} = order

    var subject = 'External partner order ' + order.shopify_order_name
    var body = sendEmailBody(order)
    body = "The order " + order.shopify_order_name + " contains sympathy/inaugural flowers. If the order is already paid, we can already call our 3rd party supplier and place this order. If this is COD/CPU, please prioritize the cash pick-up first with customer so we can proceed with the order." +
      "\nAlso remind customer to manage expectations since we might not be able to fulfill the order in the selected timeframe (especially 9 to 1)."

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? 'saul@flowerstore.ph, paul@flowerstore.ph, ronnel@flowerstore.ph, ismael@flowerstore.ph, contact@flowerstore.ph' : 'calvincalvento@gmail.com,calvento.calvin@gmail.com,calvin@flowerstore.ph',
        subject,
        text: body
      });
      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo id = 15 : 3rd party supplier needed
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"3rd party supplier needed",15]})

        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){

      return error

    }
  },
  // odz delivery
  odzDeliveryMail: async (order) =>{
    const {order_id} = order

    var subject = 'Order ' + order.shopify_order_name + ' possibly ODZ';
    var body = sendEmailBody(order)
    body = 'Please have a look at order ' + order.shopify_order_name + ' which seems to be out of our delivery zone.' + body

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? 'contact@flowerstore.ph' : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });
      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        // dispo id  = 1 : ODZ
        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }
    }catch(error){

      return error

    }
  },
  // if cash on delivery is greater than 3000
  codMoreThan3k: async (order) => {
    const {order_id} = order

    var subject = 'Cash on delivery order ' + order.shopify_order_name + ' worth more than ₱3000'
    var body = sendEmailBody(order)

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? 'contact@flowerstore.ph, ronnel@flowerstore.ph, paul@flowerstore.ph' : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });
      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo id  = 5 : COD > threshold
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"COD > threshold",5]})

        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){

      return error

    }
  },
  // COD shipping address not match on billing address
  codNonMatchingAddress: async (order) => {
    const {order_id} = order

    var subject = 'Cash on delivery order ' + order.shopify_order_name + ' with non-matching addresses'
    var body = sendEmailBody(order)

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_CONTACT_FLOWERSTORE_2 : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });
      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo id 4 : Unrecognized address
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"COD non matching address",19
          ]})

        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){

      return error

    }
  },
  // missing delivery date and time
  missingDeliveryDateAndTime: async (order) => {

    const {order_id} = order

    var subject = 'Order ' + order.shopify_order_name+ ' with missing delivery date and time'
    var body = sendEmailBody(order)

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_CONTACT_FLOWERSTORE_1 : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });
      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo id 7 : Missing delivery date

        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){

      return error

    }
  },
  // cash pick up is out of delivery zone
  odzCpuMail: async (order) => {
    const {order_id} = order

    var subject = 'Cash pick-up for order ' + order.shopify_order_name + ' possibly ODZ';
    var body = sendEmailBody(order)
    body = 'Please have a look at the billing address for ' + order.shopify_order_name + ' which seems to be out of our delivery zone.' + body

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_CONTACT_FLOWERSTORE_1 : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });
      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo id 1 : ODZ
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"ODZ",1]})
        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){

      return error

    }

  },
  cpuAsap: async (order) => {
    const {order_id} = order

    var subject = order.shopify_order_name + "-CPU to be processed before delivery"
    var body = sendEmailBody(order)
    body = order.shopify_order_name + '-CPU needs the cash to be collected before we proceed with the delivery.' + body

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? process.env.EMAIL_CONTACT_FLOWERSTORE_1 : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });
      console.log('eto yung res!!!!', res)

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo id 1 : ODZ
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"CPU ASAP",18]})

        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'
      }

    }catch(error){

      return error

    }

  },
  cpuSameAddress: async (order) => {
    const {order_id} = order

    var subject = 'Cash pick-up order ' + order.shopify_order_name + ' with same delivery and billing address'
    var body = sendEmailBody(order)
    body =  'Please have a look at order ' + order.shopify_order_name + ' which seems to have the same address for delivery and cash pick-up.' + body +
      '\n\nIf so, please kindly ask the customer if the provided information is correct.'

    try{

      const res = await emailer.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_ENV === 'production' ? 'contact@flowerstore.ph, ronnel@flowerstore.ph, paul@flowerstore.ph' : process.env.EMAIL_TO_DEVELOPMENT,
        subject,
        text: body
      });

      if(res == 'Mail Successful'){
        //insert ticket
        //dispo id 1 : ODZ
        await db.sequelize.query(qs.insertTicket + "level=1,tagged_from='ORDER_TABLE' ",
          {replacements:[1,order_id,null,"CPU same delivery and shipping address",20]})

        return "Email Sent!"
      }else if ( res == 'Mail Failed'){
        console.log('Failed Email Sent')
        return 'Failed Email Sent'

      }

    }catch(error){

      return error

    }

  },



}

module.exports = ticketMailer