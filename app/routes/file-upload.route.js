// const upload = require('../middlewares/file-upload.middleware');
const router = require('express').Router();
// const asyncMiddleware = require('../middlewares/async.middleware');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const multipart = require('connect-multiparty');
const schema = require('../../config/schema');

const multipartMiddleware = multipart();

cloudinary.config({
    cloud_name: 'df9w7u89a',
    api_key: '849296583166861',
    api_secret: '03w_u9Yk2dWw3p0WGwkdOWyRxB4',
    secure: true,
});

var Photo = schema.models.Photo;

router.post('/image', multipartMiddleware, (req, res) => {
    var photo = new Photo(req.body);

    var imageFile = req.files.image.path;

    const pathName = path
        .extname(req.files.image.originalFilename)
        .toLowerCase();
    if (
        pathName.includes('png') ||
        pathName.includes('jpg') ||
        pathName.includes('jpeg') ||
        pathName.includes('gif') ||
        pathName.includes('bmp') ||
        pathName.includes('svg')
    )
        cloudinary.uploader
            .upload(imageFile, { tags: 'express_sample' })
            .then(function (image) {
                // console.log('** file uploaded to Cloudinary service');
                // console.dir(image.secure_url);
                photo.image = image;
                // Save photo with image metadata
                //console.log(image.secure_url);
                if (image.url) {
                    return res.send({
                        success: true,
                        result: image.url,
                        message: [
                            {
                                message: 'با موفقیت انجام شد',
                            },
                        ],
                    });
                } else
                    return res.send({
                        success: false,
                        result: null,
                        message: [
                            {
                                message: 'مشکلی در آپلود فایل رخ داده است',
                            },
                        ],
                    });
            })
            .catch(function () {
                return res.send({
                    success: false,
                    result: null,
                    message: [
                        {
                            message: 'مشکلی در آپلود فایل رخ داده است',
                        },
                    ],
                });
            })
            .finally(function () {
                console.log('object');
            });
    else
        return res.send({
            success: false,
            result: null,
            message: [
                {
                    message: 'لطفا یک عکس بارگذاری کنید',
                },
            ],
        });
});

module.exports = router;
