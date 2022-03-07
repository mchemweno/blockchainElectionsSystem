import passport from 'passport'
import nextConnect from 'next-connect'
import jwt from 'jsonwebtoken'
import localStrategy from '../../../../utils/authUtils/passportLocal'
import authenticateHandler from '../../../../utils/authUtils/authenticateHandler'

passport.use('local', localStrategy)
export default nextConnect()
    .use(passport.initialize('local'))
    .post(async (req, res) => {
        try {
            const user = await authenticateHandler('local', req, res)
            if (!user) {
                const err = new Error('Failed to login with given credentials')
                throw err
            }
            // session is the payload to save in the token, it may contain basic info about the user

            const token = jwt.sign(
                {
                    user: {
                        id: user._id,
                        email: user.email,
                        username: user.username,
                        admin: user.admin,
                        phoneNumber: user.phoneNumber
                    },
                },
                process.env.SECRET,
                {
                    expiresIn: '50d',
                },
            )
            res.status(201).json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phoneNumber: user.phoneNumber,
                    admin: user.admin
                },
            })
        } catch (error) {
            res.status(401).json(error.message)
        }
    })
