const express = require('express');
const router = express.Router(); // ← 必ずこれが必要

// Swaggerルート（/api-docs でSwagger UIを表示）
router.use('/', require('./swagger'));

// テスト用の Hello World エンドポイント
router.get('/', (req, res) => {
    // #swagger.tags = ['Hello World']
    res.send('Hello World!');
});

// ユーザー関連のルート（GET, POST, PUT, DELETE）
router.use('/users', require('./users'));

module.exports = router;