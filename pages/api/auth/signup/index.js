import User from '../../../../models/User'
import hashSalt from '../../../../utils/authUtils/hashSalt'
import dbConnect from '../../../../utils/dbConnect'

export default async (req, res) => {
    const {email} = req.body
    const {password} = req.body
    const {username} = req.body
    const {firstName} = req.body
    const {lastName} = req.body
    const {phoneNumber} = req.body
    const {hash, salt} = await hashSalt(password)
    const {method} = req

    if (method !== 'POST') {
        return res.status(405).end(`Method ${method} Not Allowed`)
    }

    await dbConnect()

    const user = new User({
        email,
        username,
        hash,
        salt,
        firstName,
        lastName,
        phoneNumber
    })

    try {
        const userEmailExists = await User.findOne({email})
        const userUsernameExists = await User.findOne({username})
        const phoneNumberExists = await User.findOne({phoneNumber})

        if (userUsernameExists) {
            if (userUsernameExists.email !== email) {
                const err = new Error('username exists....')
                err.status = 401
                throw err
            }
        }

        if (userEmailExists) {
            const err = new Error('email exists....')
            err.status = 401
            throw err
        }

        if (phoneNumberExists) {
            const err = new Error('phone exists....')
            err.status = 401
            throw err
        }

        user.save()
        return res.status(201).json({message: 'User created!.', user})
    } catch (err) {
        if (!err.status) {
            err.status = 500
            err.msg = 'Something went badly wrong please try again later'
        }
        return res.status(err.status).json({message: err.message})
    }
}
