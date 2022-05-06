require('dotenv').config()

const nodemailer = require('nodemailer')

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
    console.log('СОЗДАЛ КНСТРУКТОР');
  }

  async sendActivationMail(to, link) {
    console.log('ПРИНЯЛ для запуска ', to, process.env.SMTP_USER, this.transporter);

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      text: '',
      html: 
          `
            <div>
              <h1>Для активации перейдите по ссылке</h1>
              <a href="${link}">${link}</a>
            </div>
          `
    })
    console.log('MAIL CANCELL ==========');
  }
}

module.exports = new MailService()
