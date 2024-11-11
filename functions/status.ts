module.exports.handler = async (event, context) => {
  const message = `{"status": "OK"}`

  return {
    statusCode: 200,
    body: message
  }
}