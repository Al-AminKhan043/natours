const nodemailer=require('nodemailer');
const pug=require('pug')
const htmlToText=require('html-to-text')
module.exports=class Email {
    constructor(user,url){
       this.to=user.email;
       this.firstName=user.name.split(' ')[0];
       this.url=url;
       this.from=`Al Amin <${process.env.EMAIL_FROM}>`
    }
   newTransport(){
        if(process.env.NODE_ENV==='production'){
            //sendgrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth:{
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            })
        }
        return  nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            port:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD
            }
        })
    }
    async send(template,subject){
        //send actual email
        const html=pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
            firstName:this.firstName,
            url:this.url,
            subject
        })

        const mailOptions={
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html)
    
        }
        ;        
        await this.newTransport().sendMail(mailOptions)

    }
    async sendWelcome(){
     await this.send('welcome','Welcome to the Natours Family')
    }
    async passwordReset(){
        await this.send('passwordReset', 'Your password reset token (valid for 10mins)')
    }
}

const sendEmail=async (options)=>{
    // const transporter=nodemailer.createTransport({
    //     host:process.env.EMAIL_HOST,
    //     port:process.env.EMAIL_PORT,
    //     auth:{
    //         user:process.env.EMAIL_USERNAME,
    //         pass:process.env.EMAIL_PASSWORD
    //     }
    // })

    // const mailOptions={
    //     from: 'Al Amin <alaminkhan10009@gmail.com>',
    //     to: options.email,
    //     subject: options.subject,
    //     text: options.message

    // }

//    await transporter.sendMail(mailOptions);
}

// module.exports=sendEmail;