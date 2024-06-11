import * as https from 'https'
import * as ngrok from 'ngrok'

const commonCloudflareOptions = {
  headers: {
    'x-auth-email': process.env.CF_AUTH_EMAIL,
    'x-auth-key': process.env.CF_AUTH_KEY,
    'content-type': 'application/json'
  }
}

const httpsRequest = (url, options, payload) => {
  options = {
    ...commonCloudflareOptions,
    ...options
  }
  if (payload) {
    options.headers['content-length'] = payload.length
  }
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, res => {
      let data = [];

      res.on('data', chunk => {
        data.push(chunk)
      })

      res.on('end', () => {
        resolve(Buffer.concat(data).toString())
      })
    }).on('error', err => {
      reject(err.message)
    })
    if (payload) {
      req.write(payload)
    }
    req.end()
  })
}

const getZoneId = async () => {
  const zones = JSON.parse(await httpsRequest(
    'https://api.cloudflare.com/client/v4/zones?name=ejoan.me'))
  return zones.result && zones.result.length && zones.result[0].id;
}

const getDnsRecord = async (zoneId, name) => {
  const dnsRecords = JSON.parse(await httpsRequest(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?name=${name}`
  ))
  return dnsRecords.result && dnsRecords.result.length && dnsRecords.result[0].id
}

const updateDnsRecord = async (zoneId, recordId, payload) => {
  return JSON.parse(await httpsRequest(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`,
    {
      method: 'PATCH'
    },
    payload
  ))
}


console.log("Starting Ngrok")
const url = await ngrok.connect({
  proto: 'tcp',
  addr: process.env.SERVER_ADDRESS,
  authtoken: process.env.NGROK_AUTH_TOKEN,
})

console.log("Ngrok forwarder address: ", url)

const ngrokSplit = url.split(":")
const ngrokAddress = ngrokSplit[1].split("//")[1]
const ngrokPort = ngrokSplit[2]

console.log("Getting Cloudflare Domain Zone Id")
const zoneId = await getZoneId()

console.log("Checking if CNAME and SRV Exist")
const cnameId = await getDnsRecord(zoneId, process.env.SERVICE_URL)
const srvId = await getDnsRecord(zoneId, `_${SERVICE_NAME}._tcp.${process.env.SERVICE_URL}`)

if (cnameId === 0) {
  console.log("CNAME does not exist, creating")
  // Create Entry
} else {
  console.log("Updating CNAME with current Ngrok URL")
  const payload = JSON.stringify({
    content: ngrokAddress
  })
  const req = await updateDnsRecord(zoneId, cnameId, payload)
}

if (srvId === 0) {
  console.log("SRV Record does not exist, creating")
  // Create Entry
} else {
  console.log("Updating SRV Record with current Ngrok port")
  const payload = JSON.stringify({
    data: {
      port: ngrokPort
    }
  })
  const req = await updateDnsRecord(zoneId, srvId, payload)
}

console.log("Successfully Updated Cloudflare DNS Records with current Ngrok Details")
