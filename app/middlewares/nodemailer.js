'use strict';
const nodemailer = require('nodemailer');
const config = require('config');
const winston = require('winston');

class NodeMailer {
    async sendEmail(reciever, subject, message, html) {
        //test account credential in ethereal
        const username =
            process.env.EMAIL_ADDRESS || config.get('EMAIL_ADDRESS');
        const password =
            process.env.NODEMAILER_PASSWORD ||
            config.get('NODEMAILER_PASSWORD');

        console.log({
            username,
            password,
        });
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'Gmail',
            auth: {
                user: username,
                pass: password,
            },
        });

        let content = {
            from: username, // sender address
            to: reciever, // list of receivers
            subject: subject, // Subject line
            text: message, // plain text body,
            html: html, //use html tag
        };

        await transporter.sendMail(content, (error, response) => {
            if (error) {
                console.log({
                    error,
                });
                winston.error(`Error in sending email to ${reciever} ...`);
            } else {
                winston.info(
                    `Email sent to ${reciever} with MessageID: ${response.messageId} ...`
                );
            }
            transporter.close();
        });
    }
}
module.exports = NodeMailer;
