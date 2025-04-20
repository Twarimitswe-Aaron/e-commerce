
import nodemailer from 'nodemailer';

const sendMail =async (option)=>{
    const transporter =nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        service:process.env.SMTP_SERVICE,
        secure:true,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASS,
        }
    });

    const mailOptions={
        from:process.env.SMTP_MAIL,
        to:option.mail,
        subject:option.subject,
        text:option.message,
        html:option.html,
    }

    await transporter.sendMail(mailOptions);
}

export default sendMail;