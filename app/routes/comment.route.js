const express = require('express');
const Comment = require('../database/models/comment.schema');

const router = express.Router();

router.get('/', (req, res) => {
    Comment.find({}, (err, users) => {
        var commentMap = [];
        users.forEach((comment) => {
            commentMap.push(comment);
        });
        res.send(commentMap);
    });
});

router.post('/send', (req, res) => {
    var comment = new Comment();
    comment.postId = req.body.postId;
    comment.email = req.body.email;
    comment.username = req.body.username;
    comment.comment = req.body.comment;
    comment.answer = req.body.answer;
    comment.verified = req.body.verified;

    comment.save((err) => {
        if (err) {
            res.status(403).json({ message: 'ثبت کامنت با خطا مواجه شد' });
        } else {
            res.status(200).json({ message: 'ثبت کامنت با موفقیت انجام شد' });
        }
    });
});

router.post('/answer', (req, res) => {
    if (req.body.answer === '') {
        return res.status(400).json({
            message: 'متن پاسخ را وارد کنید',
        });
    }
    Comment.findById(req.body.id, (err, comment) => {
        if (!comment) {
            return res.status(400).json({
                message: 'کامنت مورد نظر یافت نشد',
            });
        } else if (err) {
            res.status(404).json({ message: 'یافت نشد' });
        } else {
            comment.answer = req.body.answer;
            try {
                comment.save((err) => {
                    if (err) {
                        res.status(403).json({
                            message: 'ارسال پاسخ با خطا مواجه شد',
                        });
                    } else {
                        res.status(200).json({ message: 'پاسخ ثبت شد' });
                    }
                });
            } catch (error) {
                console.log(error);
                return res.status(400).json({
                    message: 'آیدی  را وارد کنید',
                });
            }
        }
    });
});

router.post('/verify', (req, res) => {
    Comment.findById(req.body.id, (err, comment) => {
        if (!comment) {
            return res.status(400).json({
                message: 'کامنت مورد نظر یافت نشد',
            });
        } else if (err) {
            res.status(404).json({ message: 'یافت نشد' });
        } else {
            comment.verified = true;
            comment.save((err) => {
                if (err) {
                    res.status(403).json({
                        message: 'تایید کامنت با خطا مواجه شد',
                    });
                } else {
                    res.status(200).json({ message: 'کامنت تایید شد' });
                }
            });
        }
    });
});

module.exports = router;
