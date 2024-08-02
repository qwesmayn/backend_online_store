const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')
const CheckRoleMiddleware = require('../middleware/CheckRoleMiddleware')

router.post('/', CheckRoleMiddleware("ADMIN"), deviceController.create)
router.get('/', deviceController.get)
router.get('/:id', deviceController.getById)

module.exports = router 