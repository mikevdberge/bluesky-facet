module.exports.handler = async (event, context) => {
  const message = `{"status": "OK"}`

  return {
    headers: {
      'Content-Type': 'application/json'
    },
    statusCode: 200,
    body: message
  }
}