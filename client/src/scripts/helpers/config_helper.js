export const config = {
    headers:{
        'Content-Type' : 'application/json',
        'Access-Control-Allow-Origin': true,
    }
}

let shiftingDomain = process.env.REACT_APP_API_URL
let shiftingSocket = process.env.REACT_APP_SOCKET_DOMAIN

if(process.env.REACT_APP_SEVER_LOCATION === "LOCALSERVER"){
    const {href} =  window.location
    const ipAddress = href.split('/')[2].split(":")[0]
    shiftingDomain = `http://${ipAddress}:3001`
    shiftingSocket = `http://${ipAddress}:3002`
}

export const domain = shiftingDomain
export const sockdomain =  null;