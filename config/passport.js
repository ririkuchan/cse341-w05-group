const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile); // ← OK
    }
));

// 🔥 ここが重要（セッションの識別子）
passport.serializeUser((user, done) => {
    done(null, user); // 必ず serialize してるか？
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
