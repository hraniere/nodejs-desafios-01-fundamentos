export async function json(req, res) {
  const body = [];
  for await (const chunk of req) {
    body.push(chunk)
  }
  try {
    req.body = body.length ? JSON.parse(Buffer.concat(body).toString()) : null
  } catch (error) {
    req.body = null
  }

  res.setHeader('Content-type', 'application/json')
}