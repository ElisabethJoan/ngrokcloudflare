[![Docker Build](https://github.com/ElisabethJoan/ngrokcloudflare/actions/workflows/main.yml/badge.svg)](https://github.com/ElisabethJoan/ngrokcloudflare/actions/workflows/main.yml) [![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/r/ejoan/ngrokcloudflare)

A small dockerised application that automates the forwarding of TCP services through the free tier of ngrok and updating the relevant Cloudflare CNAME and SRV records whenever the forwarder address changes. Useful for those wanting to expose low bandwidth applications from behind a CGNAT gated connection. (such as a small friends and family minecraft server)

Simply pass through the following variables to your container
- server ip address as SERVER_ADDRESS
- ngrok authentication token as NGROK_AUTH_TOKEN, 
- cloudflare authentication email as CF_AUTH_EMAIL 
- cloudflare authentication key as CF_AUTH_KEY
- CNAME and SRV url as SERVICE_URL 
- Service name as SERVICE_NAME
You do not need to have created the cloudflare CNAME and SRV record for the service you wish to forward the application will query for their existence and create then update them if they do not exist. 

For the period of time I used this I personally had run this as an autostart container on my Unraid server and due to the low bandwidth services I wanted to run via TCP this suited my needs until next I had a provider than didn't charge for public facing IP addresses.

