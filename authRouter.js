const Router = require('express')
const controller = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middlewars/authMiddleware')
const roleMiddleware = require('./middlewars/roleMiddleware')
const router = new Router

router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть от 4 до 10 символов').isLength({min: 4, max: 10})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', [authMiddleware, roleMiddleware(['ADMIN'])], controller.getUser)

router.get('/', (req, res) => {
    res.send('Hello World!')
})

module.exports = router
