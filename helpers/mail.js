const config = require('config')

const logger = require('pino')({
  name: 'mail',
  level: process.env.LOG_LEVEL || 'info'
})

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(config.get('sendgrid'))

const emails = {}

emails.receipt = function (order) {
  const msg = {
    to: order.email,
    from: 'noreply@bigbikebash.org.uk',
    templateId: 'd-14da0352b3384b40a704b0d1cfa287cf',
    dynamic_template_data: {
      ...order
    }
  }

  logger.debug('sending receipt', msg)

  return sgMail.send(msg)
}

module.exports = emails
