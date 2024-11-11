import { HandlerEvent } from '@netlify/functions'
import { AppBskyRichtextFacet } from '@atproto/api'
import { RichText } from '@atproto/api'
import { AtpAgent } from '@atproto/api'

const agent = new AtpAgent({ service: 'https://bsky.social' })

export const handler = async (event: HandlerEvent) => {
//exports.handler = async (event, context) => {

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
          status: 'invalid-method'
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
            status: 'missing-information'
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