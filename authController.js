const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка при регистрации', errors})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: 'USER'})

            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            await user.save()

            return res.json({message: 'Юзер успешно создан'})
        } catch (e) {
            console.error(e)
            res.status(400).json({message: 'Registration Error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: 'Юзер не найден'})
            }

            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: 'Неверный пароль'})
            }

            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.error(e)
            res.status(400).json({message: 'Login Error'})
        }
    }

    async getUser(req, res) {
        try {
            const users = await User.find()
            console.log(users)
            res.json(users)
        } catch (e) {

        }
    }
}

module.exports = new AuthController()
