import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { db } from "../utils/db.server";
import passportJWT from "passport-jwt";
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Mock Data
const user = {
	id: 1,
	sub: 'nottdev',
	email: 'nottdev@gmail.com'
  }

passport.use(
	new LocalStrategy(
		{
			usernameField: "firstName",
			passwordField: "lastName",
		},
		(firstName: string, lastName: string, cb) => {
			// This one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
			return db.author
				.findFirst({
					where: { firstName, lastName },
				})
				.then((user) => {
					if (!user) {
						return cb(null, false, { message: "Incorrect firstName or lastName." });
					}
					return cb(null, user, { message: "Logged In Successfully" });
				})
				.catch((err) => cb(err));
		}
	)
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: "your_jwt_secret",
		},
		(jwtPayload, cb) => {
			//find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
			console.log("jwtPayload", jwtPayload);
			return db.author.findFirst(jwtPayload.id)
				.then((user : any) => {
					return cb(null, user);
				})
				.catch((err) => {
					return cb(err);
				});
		}
	)
);

export { passport };
