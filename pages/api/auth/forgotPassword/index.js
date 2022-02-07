import jwt from 'jsonwebtoken'
import dbConnect from '../../../../utils/dbConnect'
import User from '../../../../models/User'
import sendEmail from '../../../../utils/nodemailer'

// eslint-disable-next-line consistent-return
export default async (req, res) => {
  const { method } = req

  if (method !== 'POST') {
    return res.status(405).end(`Method ${method} Not Allowed`)
  }

  const { email } = req.body

  try {
    if (!email) {
      const err = new Error('Please include email.')
      err.status = 400
      throw err
    }

    await dbConnect()

    const user = await User.findOne({ email })

    if (!user) {
      const err = new Error('User does not exist.')
      err.statusCode = 404
      throw err
    }

    const token = jwt.sign(
      {
        user: {
          // eslint-disable-next-line no-underscore-dangle
          id: user._id,
          email: user.email,
        },
      },
      process.env.SECRET,
      {
        expiresIn: '30d',
      },
    )

    await sendEmail(
      user.email,
      'Password Reset.',
      `${process.env.domain}/api/auth/resetPassword/${token}`,
    )

    res.status(200).json({ message: `Password reset email sent.` })
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 400
    }
    return res.status(e.statusCode).json({ message: e.message })
  }
}
