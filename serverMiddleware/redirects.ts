const redirects = [
  {
    from: '/realms/mint',
    new: '/claims-and-mints/mint-realms',
  },
]

module.exports = (req, res, next) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  // find the redirect if it exists where the from === the requested url
  const redirect = redirects.find((r) => r.from === req.url)
  // If it exists, redirect the page with a 301 response else carry on
  if (redirect) {
    res.writeHead(301, { Location: redirect.new })
    res.end()
  } else {
    next()
  }
}
