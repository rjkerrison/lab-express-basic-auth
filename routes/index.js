const router = require('express').Router()

/* GET default route */
router.get('/', (req, res, next) => {
  // res.json({ success: true })
  const root = __dirname.replace('routes', '')
  res.sendFile('public/index.html', {root})
})

module.exports = router
