import express from 'express';
const router = express.Router();
import nodemailer from 'nodemailer';
  
router.post('/send-otp', async (req, res) => {

    const { email } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'lms.project.batch8@gmail.com',
            pass: 'suhb pbaz mhsy ljsa'
        }
    });

    const otp = Math.floor(100000 + Math.random() * 900000); 

    const info = await transporter.sendMail({
        from: {
            name: "Pursuit LMS",
            address: "souvik13.12.2000@gmail.com"
        },
        to: [`${email}`],
        subject: "Forgot Password OTP", 
        text: "Your otp is " + otp + ".",
    });

    res.json(otp);
});
  
export default router;