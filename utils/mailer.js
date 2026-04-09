const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendFakeNewsAlert = async (emails, post) => {
  await transporter.sendMail({
    from: `"Fake News Alert 🚨" <${process.env.EMAIL_USER}>`,
    to: emails.join(','),
    subject: `🚨 Fake News Alert: "${post.title}"`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:24px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:22px;">🚨 Fake News Alert</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;">A community report is gaining attention</p>
        </div>
        <div style="padding:28px;">
          <h2 style="color:#1a1a2e;font-size:18px;margin-bottom:10px;">${post.title}</h2>
          <p style="color:#555;line-height:1.7;margin-bottom:16px;">${post.description}</p>
          ${post.source ? `<a href="${post.source}" style="display:inline-block;color:#667eea;font-weight:600;margin-bottom:16px;">🔗 View Source</a>` : ''}
          <div style="background:#f8f9ff;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
            <p style="margin:0;color:#888;font-size:13px;">Reported by <strong style="color:#444;">${post.postedBy}</strong></p>
          </div>
          <p style="color:#e74c3c;font-weight:600;font-size:14px;">⚠️ Please do not share this news without verifying it first.</p>
        </div>
        <div style="background:#f0f0f8;padding:16px;text-align:center;">
          <p style="margin:0;color:#aaa;font-size:12px;">You received this because you are registered on Fake News Detection platform.</p>
        </div>
      </div>
    `,
  })
}

module.exports = { sendFakeNewsAlert }
