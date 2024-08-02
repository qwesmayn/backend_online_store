const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const CheckRoleMiddleware = require('../middleware/CheckRoleMiddleware')

router.post('/',CheckRoleMiddleware("ADMIN"), typeController.create)
router.get('/', typeController.get)


module.exports = router