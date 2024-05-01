const express = require('express');

const router = express.Router();

router.get('/getall', async (req, res) => {
    try {
        const categories = [
            {
                id: 1,
                name: 'شبکه',
            },
            {
                id: 2,
                name: 'فرانت اند',
            },
            {
                id: 3,
                name: 'بک اند',
            },
            {
                id: 4,
                name: 'دیزاین',
            },
            {
                id: 5,
                name: 'دیتابیس',
            },
            {
                id: 6,
                name: 'هوش مصنوعی',
            },
            {
                id: 7,
                name: 'یادگیری ماشین',
            },
            {
                id: 8,
                name: 'امنیت',
            },
        ];

        return res.send({
            success: true,
            result: categories,
            message: [
                {
                    message: 'با موفقیت انجام شد',
                },
            ],
        });
    } catch (error) {
        return res.send({
            success: true,
            result: [],
            message: [
                {
                    message: 'با موفقیت انجام شد',
                },
            ],
        });
    }
});

module.exports = router;
