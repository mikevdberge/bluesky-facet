import { HandlerEvent } from '@netlify/functions'
//import { AppBskyRichtextFacet } from '@atproto/api'
import { RichText } from '@atproto/api'
import { AtpAgent } from '@atproto/api'

const agent = new AtpAgent({ service: 'https://bsky.social' })

export const handler = async (event: HandlerEvent) => {
//exports.handler = async (event, context) => {
 
  let api_key = event.headers["x-api-key"]; //Get API key from headers

  if (!api_key) {
    console.warn("Missng API Key in header");
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
          error: 'The requested resource requires authentication'
      })
    }
  }

    if (!event.body || event.httpMethod !== 'POST') {
      console.log("Invalid request body: ",event.body);
      console.log("Invald HTTP Method:", event.httpMethod);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
          error: 'Invalid Method'
        })
      }
    }
    
      const data = JSON.parse(event.body)
    
      if (!data.text) {
        console.error('Required information is missing.')
        console.log("Invalid request body: ",event.body);
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({
            status: 'Missing Information'
          })
        }
      }

    const body = JSON.parse(event.body)
    console.log("Received body",JSON.stringify(body))

    // creating richtext
      const rt = new RichText({
        text: body.text,
    })
    await rt.detectFacets(agent) // automatically detects mentions and links

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({"facets": rt.facets}),
    }
}