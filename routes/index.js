const Routers = require('express')
const router = new Routers()
const brandRouter = require('./brandRouter')
const deviceRouter = require('./deviceRouter')
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')

router.use('/user', userRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)
router.use('/type', typeRouter)

module.exports = router