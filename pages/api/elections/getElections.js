import Election from "../../../models/Election";
import dbConnect from "../../../utils/dbConnect";
import middlewareHandler from "../../../utils/middlewareHandler";
import isAuth from "../../../utils/authUtils/isAuth";

export default async function handler(req, res) {
    await dbConnect()
    await middlewareHandler(req, res, isAuth);
    const election = await Election.findOne({post: req.body.post, year: req.body.year})

    if (!election) return res.status(404).end(`Not found`)

    res.status(200).json({election: election})

}
