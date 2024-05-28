const nodemailer = require("nodemailer");
const Response = require("../models/response");
const { genarateCode } = require("../utils/redisCaching");
const { redisClientConfig } = require("../config/dbConfig");
const redis = require("redis");
const { testCache, setCaching, getCaching } = require("../services/redisCachingService");

const sendRecoverringPasswordMail = async (req, res) => {
    const {to = null, username = null} = req.body;
    if(to == null || username == null) {
        res.send(new Response(-1, "Receiver email not provided"))
        return
    }

    var transporter =  nodemailer.createTransport({ 
        host: process.env.TRANSPORT_HOST,
        port: process.env.TRANSPORT_PORT,
        secure: true,
        auth: {
            user: process.env.SENDER_USERNAME,
            pass: process.env.SENDER_PASSWORD
        },
    });

    var content = '';
    let recoverCode = genarateCode(6);
    content += `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: red; font-size: 30px; text-align: center;">RECOVER YOUR PASSWORD</h4>
                <div>
                    <p style="color: #003375; font-size: 16px;">Chúng tôi cung cấp cho bạn một mã xác nhận gồm 6 chữ số, vui lòng nhập để khôi phục mật khẩu. Mã có hiệu lực trong vòng 180 giây</p>
                    <p>Mã của bạn là: </p>
                    <div style="text-align: center; margin: 40px 0 20px 0;">
                        <span style="background-color: #003375; color: white; font-size: 17px; font-weight: bold; text-align: center;padding: 20px 40px;">
                            ${recoverCode}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    var mainOptions = {
        to,
        subject: 'Recover Your Password Now',
        html: content
    }

    let key = "RECOVER:"+username;

    let value = {username, code: recoverCode}
    
    let setRes = await setCaching(key, JSON.stringify(value), 180) //180
    if(setRes == -1){
        return new Response(-1, "Error caching");
    }

    transporter.sendMail(mainOptions)
        .then(response => {
            res.send(new Response(0, "Success"))
            return;
        })
        .catch(err => {
            res.send(new Response(-1, "Send email failed, message: "+ err.message))
            return;
        })
    
}

module.exports = { sendRecoverringPasswordMail }