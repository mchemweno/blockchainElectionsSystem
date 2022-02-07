import Local from 'passport-local'
import User from '../../models/User'
import dbConnect from '../dbConnect'

const localStrategy = new Local.Strategy(
  {
    usernameField: 'email',
  },
  async (username, password, done) => {
    await dbConnect()
    // eslint-disable-next-line consistent-return
    const user = await User.findOne({ email: username }, (err, user) => {
      if (err) {
        return done(err)
      }
    })

    if (!user) {
      return done(null, false)
    }

    const isValid = await user.validatePassword(password)

    if (!isValid) {
      return done(null, false)
    }
    // eslint-disable-next-line no-underscore-dangle
    console.log(`User: ${user._id} authenticated`)
    return done(null, user)
  },
)

export default localStrategy
