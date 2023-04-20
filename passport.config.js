import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "dotenv";
config();

passport.use(
  new LocalStrategy(function (username, password, done) {
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return done(null, "ADMIN");
    }
    return done(null, false);
  })
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

export default passport;
