import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnect";
import middlewareHandler from "../../../utils/middlewareHandler";
import isAuth from "../../../utils/authUtils/isAuth";


export default async function handler(req, res) {

    await middlewareHandler(req, res, isAuth);
    await dbConnect()

    const user = await User.findOne({email: req.body.email, active: true})

    if (!user) return res.status(404).end(`Not found`)

    res.status(200).json({user: user})

}
