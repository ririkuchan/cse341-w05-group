const express = require('express');
const passport = require('passport');

const router = express.Router();

// Google 認証開始
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google 認証コールバック
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/protected');
    }
);

// ログアウト
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);

        req.session.destroy(err => {
            if (err) return next(err);

            // ✅ domain: undefined → レンダーでも自動で有効になる
            res.clearCookie('connect.sid', {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });

            // ✅ 強制キャッシュバイパス
            res.setHeader('Cache-Control', 'no-store');
            res.redirect('/');
        });
    });
});

module.exports = router;
