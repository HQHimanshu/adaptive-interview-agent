const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'adaptive-interview-agent-backend'
    });
});

module.exports = router;
