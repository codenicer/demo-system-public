require('dotenv').config()
const express = require('express')
const m_auth = require('./middleware/mid_auth')
const app = express()
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

app.use(cors())
app.use(express.json({ extended: false }))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, PATCH, OPTIONS'
  )
  next()
})

app.use(express.static(path.join(__dirname, 'client/build')))

//connectDB()

// DEFINE ROUTES

app.get('/', m_auth, (req, res) => {
  res.json({ server_msg: 'WELCOME TO OUR NEW API', decoded_toke: req.user })
})

// GENERAL ROUTES
app.use('/api/web/auth', require('./routes/general_routes/auth'))
app.use('/api/web/private', require('./routes/general_routes/private'))
app.use('/api/web/gsearch', require('./routes/general_routes/global_search'))

// ALL WEB ROUTE
app.use('/api/web/user', require('./routes/web_routes/user'))

app.use('/api/web/order', require('./routes/web_routes/order'))
app.use('/api/web/order_item', require('./routes/web_routes/order_item'))
app.use('/api/web/product', require('./routes/web_routes/product'))
app.use('/api/web/customer', require('./routes/web_routes/customer'))

app.use('/api/web/ticket', require('./routes/web_routes/ticket'))
app.use('/api/web/dispositions', require('./routes/web_routes/dispositions'))
app.use('/api/web/annotation', require('./routes/web_routes/annoation'))
app.use('/api/web/florist', require('./routes/web_routes/florist'))
app.use('/api/web/floristjob', require('./routes/web_routes/floristjob'))
app.use('/api/web/assemblyjob', require('./routes/web_routes/assemblyjob'))
app.use('/api/web/order_logs', require('./routes/web_routes/order_logs'))
app.use('/api/web/order_notes', require('./routes/web_routes/order_notes'))

//USING CONTROLLERS AND MODELS
const RiderRoute = require('./routes/web_routes/rider')
const HubRoutes = require('./routes/web_routes/hub')
const DispatchRoute = require('./routes/web_routes/dispatch')
const DispatchJobDetailRoute = require('./routes/web_routes/dispatch_job_detail')
const ProviderRoute = require('./routes/web_routes/rider_provider')
const gcPController = require('./controllers/googleCloudPrint')
const RoleRoute = require('./routes/web_routes/role')

app.get('/api', (req, res) => {
  res.status(200).send('Welcome')
})

app.use('/api/web/hub', HubRoutes)
app.use('/api/web/rider', RiderRoute)
app.use('/api/web/dispatch', DispatchRoute)
app.use('/api/web/dispatch_job_detail', DispatchJobDetailRoute)
app.use('/api/web/rider_provider', ProviderRoute)
app.use('/api/web/role', RoleRoute)

//ALL MOBILE ROUTES
app.use('/api/mobile/orderitem', require('./routes/mobile_routes/order_item'))

//ALL BARCODE ROUTES
app.use('/api/barcode_api/v1', require('./routes/barcode_routes'))

//FOR REPRINT
// app.post('/reprint', m_auth, createPdf, gcPController.getPrinter)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + 'client/build/index.html'))
})

//  sample.googleSheetCheck()
const port = process.env.PORT || 3001

app.listen(port, async () => {
  try {
    console.log(`Sever started on port ${port}`)
  } catch (error) {
    console.log(error.msg)
  }

  // console.log(sample)
})
