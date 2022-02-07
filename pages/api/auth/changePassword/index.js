import middlewareHandler from '../../../../utils/middlewareHandler'
import isAuth from '../../../../utils/authUtils/isAuth'
import User from '../../../../models/User'
import dbConnect from '../../../../utils/dbConnect'
import hashSalt from '../../../../utils/authUtils/hashSalt'

// eslint-disable-next-line consistent-return
export default async (req, res) => {
    const {method} = req
    const { authorization } = req.headers

    if (method !== 'POST') {
        return res.status(405).end(`Method ${method} Not Allowed`)
    }

    if (!authorization) {
        return res.status(401).end('Unauthorized')
    }

    const {oldPassword} = req.body
    const {newPassword} = req.body
    const {reNewPassword} = req.body

    if (newPassword == oldPassword) {
        return res.status(400).json({
            message: 'Old password cannot be the same with the new password.',
        })
    }

    if (newPassword !== reNewPassword) {
        return res.status(400).json({message: "Passwords don't match"})
    }

    try {
        const jwtData = await middlewareHandler(req, res, isAuth)

        await dbConnect()
        const user = await User.findById(jwtData.user.id)

        if (!user) {
            throw new Error('User account does not exist.')
        }

        const passwordsMatch = await user.validatePassword(oldPassword)

        if (!passwordsMatch) {
            throw new Error('Wrong old password.')
        }

        const {hash, salt} = await hashSalt(newPassword)

        user.hash = hash
        user.salt = salt
        await user.save()
        res.status(200).json({user: user})
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 400
        }
        return res.status(err.statusCode).json({message: err.message})
    }
}
