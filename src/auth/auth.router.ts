import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

export const authRouter = Router();

/* POST login. */
authRouter.post("/login", (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate("local", { session: false }, (err: any, user: string | object | Buffer, info: any) => {
		if (err) return next(err);
		if (user) {
			const token = jwt.sign(user, "your_jwt_secret");
			return res.json({ user, token });
		} else {
			return res.status(422).json(info);
		}
	})(req, res, next);
});
