// Pre-built email template definitions for trading company campaigns

export interface EmailTemplateDefinition {
  id: string
  name: string
  type: string
  subject: string
  body: string
  variables: string[]
  description: string
}

// Shared email wrapper with table-based layout for maximum email client compatibility
function wrap(inner: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>{{brandName}}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style type="text/css">
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
    table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
    img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none}
    body{margin:0;padding:0;width:100%!important;height:100%!important;background-color:#f4f4f7}
    a{color:#1a56db}
    @media only screen and (max-width:620px){
      .container{width:100%!important;padding:0 16px!important}
      .content-cell{padding:24px 16px!important}
      h1{font-size:22px!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f7;">
    <tr>
      <td align="center" style="padding:24px 0;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width:600px;width:100%;">
          <tr><td align="center" style="padding:16px 0;"><span style="font-size:24px;font-weight:700;color:#1a56db;">{{brandName}}</span></td></tr>
        </table>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width:600px;width:100%;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 4px rgba(0,0,0,.05);">
${inner}
        </table>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding:24px 16px;color:#9ca3af;font-size:12px;line-height:1.6;">
              <p style="margin:0 0 8px;">&copy; {{currentYear}} {{brandName}}. All rights reserved.</p>
              <p style="margin:0 0 8px;"><a href="https://{{domain}}" style="color:#9ca3af;text-decoration:underline;">Website</a> &nbsp;|&nbsp; <a href="https://{{domain}}/privacy" style="color:#9ca3af;text-decoration:underline;">Privacy</a> &nbsp;|&nbsp; <a href="{{unsubscribeUrl}}" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a></p>
              <p style="margin:0;font-size:11px;color:#b0b0b0;">Trading involves risk. Past performance is not indicative of future results.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function numberedStep(num: number, title: string, desc: string): string {
  return `<tr><td style="padding:12px 0;"><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td width="40" valign="top" style="padding-right:12px;"><div style="width:32px;height:32px;border-radius:50%;background:#1a56db;color:#fff;font-size:14px;font-weight:700;line-height:32px;text-align:center;">${num}</div></td><td style="font-size:15px;color:#374151;line-height:1.5;"><strong>${title}</strong> — ${desc}</td></tr></table></td></tr>`
}

function ctaButton(url: string, text: string, color: string = '#1a56db'): string {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:24px auto 0;"><tr><td align="center" style="border-radius:6px;background-color:${color};"><a href="${url}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">${text}</a></td></tr></table>`
}

function tipCard(title: string, desc: string, bgColor: string, borderColor: string): string {
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0;"><tr><td style="padding:16px;background:${bgColor};border-radius:6px;border-left:4px solid ${borderColor};"><p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#1e293b;">${title}</p><p style="margin:0;font-size:14px;color:#64748b;">${desc}</p></td></tr></table>`
}

export const EMAIL_TEMPLATE_DEFINITIONS: EmailTemplateDefinition[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    type: 'welcome',
    subject: 'Welcome to {{brandName}} — Your Trading Journey Starts Now',
    description: 'Sent immediately after a new user registers. Introduces the platform and guides them through first steps.',
    variables: ['brandName', 'userName', 'domain', 'ctaUrl', 'currentYear', 'unsubscribeUrl'],
    body: wrap(`
          <tr><td style="background:linear-gradient(135deg,#0f172a,#1a56db);padding:40px 32px;text-align:center;">
            <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;line-height:1.3;">Welcome to {{brandName}}, {{userName}}!</h1>
            <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,.85);">Your account is ready. Let us get you started.</p>
          </td></tr>
          <tr><td class="content-cell" style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Hi {{userName}},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Thank you for joining {{brandName}}. We are excited to have you on board. Here is how to get started:</p>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              ${numberedStep(1, 'Complete your profile', 'Verify your identity to unlock full trading features.')}
              ${numberedStep(2, 'Explore the platform', 'Try our demo account with $100,000 in virtual funds.')}
              ${numberedStep(3, 'Start trading', 'Fund your account and place your first trade.')}
            </table>
            ${ctaButton('{{ctaUrl}}', 'Access Your Account')}
            <p style="margin:24px 0 0;font-size:14px;color:#6b7280;text-align:center;">Need help? Our support team is available 24/7 via live chat.</p>
          </td></tr>`),
  },

  {
    id: 'demo_followup',
    name: 'Demo Account Follow-Up',
    type: 'demo_followup',
    subject: '{{userName}}, How Is Your Demo Going? Here Are Tips to Level Up',
    description: 'Sent 3 days after demo account signup to re-engage and educate the user.',
    variables: ['brandName', 'userName', 'domain', 'ctaUrl', 'currentYear', 'unsubscribeUrl'],
    body: wrap(`
          <tr><td style="background:#0f172a;padding:32px;text-align:center;">
            <h1 style="margin:0;font-size:24px;font-weight:700;color:#fff;">How Is Your Demo Account Going?</h1>
          </td></tr>
          <tr><td class="content-cell" style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Hi {{userName}},</p>
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">You opened your demo account 3 days ago. Here are some tips to make the most of your practice time:</p>
            ${tipCard('Start with major pairs', 'EUR/USD, GBP/USD, and USD/JPY have the tightest spreads and highest liquidity — ideal for beginners.', '#f0f9ff', '#1a56db')}
            ${tipCard('Use proper risk management', 'Never risk more than 1-2% of your account on a single trade. Always set a stop-loss.', '#f0fdf4', '#059669')}
            ${tipCard('Keep a trading journal', 'Track every trade — entry, exit, reasoning, and outcome. This is how professionals improve.', '#fefce8', '#ca8a04')}
            <p style="margin:16px 0;font-size:15px;color:#374151;">When you are ready to take the next step, switching to a live account takes less than 2 minutes.</p>
            ${ctaButton('{{ctaUrl}}', 'Open Live Account')}
          </td></tr>`),
  },

  {
    id: 'first_deposit',
    name: 'First Deposit Nudge',
    type: 'first_deposit',
    subject: '{{userName}}, Your Account Is Verified — Make Your First Deposit',
    description: 'Sent after account verification to encourage the first deposit with trust signals.',
    variables: ['brandName', 'userName', 'domain', 'ctaUrl', 'currentYear', 'unsubscribeUrl'],
    body: wrap(`
          <tr><td style="background:linear-gradient(135deg,#059669,#0f766e);padding:40px 32px;text-align:center;">
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#fff;">You Are All Set — Time to Fund Your Account</h1>
            <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,.85);">Your identity has been verified. You are ready to trade live.</p>
          </td></tr>
          <tr><td class="content-cell" style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Hi {{userName}},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">Congratulations on completing your verification. Make your first deposit to start trading live markets.</p>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
              <tr><td style="padding:16px 20px;background:#f8fafc;border-bottom:1px solid #e2e8f0;"><strong style="font-size:14px;color:#1e293b;">Why traders trust us with their funds</strong></td></tr>
              <tr><td style="padding:16px 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#10003; &nbsp;Funds held in segregated accounts at tier-1 banks</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#10003; &nbsp;Regulated by top-tier financial authorities</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#10003; &nbsp;Negative balance protection on all accounts</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#10003; &nbsp;Fast withdrawals processed within 24 hours</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#10003; &nbsp;256-bit SSL encryption on all transactions</td></tr>
                </table>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;font-size:14px;color:#6b7280;text-align:center;">We accept Visa, Mastercard, bank wire, Skrill, Neteller, and crypto.</p>
            ${ctaButton('{{ctaUrl}}', 'Make Your First Deposit', '#059669')}
          </td></tr>`),
  },

  {
    id: 'reengagement',
    name: 'Re-Engagement Email',
    type: 'reengagement',
    subject: 'We Miss You, {{userName}} — Come Back and See What Is New',
    description: 'Sent 7 days after last login to re-engage inactive users with new features or incentives.',
    variables: ['brandName', 'userName', 'domain', 'ctaUrl', 'currentYear', 'unsubscribeUrl'],
    body: wrap(`
          <tr><td style="background:#0f172a;padding:40px 32px;text-align:center;">
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#fff;">We Have Been Saving Your Spot</h1>
            <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,.85);">The markets have been moving. Here is what you have been missing.</p>
          </td></tr>
          <tr><td class="content-cell" style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Hi {{userName}},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">It has been a while since your last visit. Here is what is new at {{brandName}}:</p>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr><td style="padding:12px 16px;background:#f0f9ff;border-radius:6px;"><p style="margin:0;font-size:14px;color:#1e293b;"><strong>New instruments added</strong> — Trade the latest crypto tokens and commodity CFDs.</p></td></tr>
              <tr><td style="padding:4px 0;"></td></tr>
              <tr><td style="padding:12px 16px;background:#f0f9ff;border-radius:6px;"><p style="margin:0;font-size:14px;color:#1e293b;"><strong>Improved charting tools</strong> — New indicators, drawing tools, and multi-timeframe analysis.</p></td></tr>
              <tr><td style="padding:4px 0;"></td></tr>
              <tr><td style="padding:12px 16px;background:#f0f9ff;border-radius:6px;"><p style="margin:0;font-size:14px;color:#1e293b;"><strong>Tighter spreads</strong> — We have further reduced spreads on major pairs.</p></td></tr>
            </table>
            <p style="margin:24px 0 0;font-size:15px;color:#374151;text-align:center;">Your account is still active and ready to go.</p>
            ${ctaButton('{{ctaUrl}}', 'Log In Now')}
          </td></tr>`),
  },

  {
    id: 'newsletter',
    name: 'Weekly Market Newsletter',
    type: 'newsletter',
    subject: 'Weekly Market Wrap — {{weekDate}} | {{brandName}}',
    description: 'Weekly market summary with key events, analysis highlights, and upcoming economic data.',
    variables: ['brandName', 'userName', 'domain', 'ctaUrl', 'weekDate', 'currentYear', 'unsubscribeUrl'],
    body: wrap(`
          <tr><td style="background:linear-gradient(135deg,#1e293b,#334155);padding:32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:1px;">Weekly Market Update</p>
            <h1 style="margin:0;font-size:24px;font-weight:700;color:#fff;">Markets This Week</h1>
            <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,.7);">{{weekDate}}</p>
          </td></tr>
          <tr><td class="content-cell" style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Hi {{userName}},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">Here is your weekly roundup of the most important market developments and what to watch next week.</p>
            <h2 style="margin:0 0 12px;font-size:18px;font-weight:700;color:#1e293b;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">Key Market Moves</h2>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
              <tr><td style="padding:8px 0;font-size:14px;color:#374151;border-bottom:1px solid #f1f5f9;">EUR/USD — Consolidated around 1.0850 amid mixed economic data.</td></tr>
              <tr><td style="padding:8px 0;font-size:14px;color:#374151;border-bottom:1px solid #f1f5f9;">Gold — Held above $2,000 as Treasury yields eased.</td></tr>
              <tr><td style="padding:8px 0;font-size:14px;color:#374151;border-bottom:1px solid #f1f5f9;">BTC/USD — Tested resistance at $45,000 with increasing institutional interest.</td></tr>
              <tr><td style="padding:8px 0;font-size:14px;color:#374151;">S&amp;P 500 — Posted a weekly gain, supported by strong earnings results.</td></tr>
            </table>
            <h2 style="margin:0 0 12px;font-size:18px;font-weight:700;color:#1e293b;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">Week Ahead</h2>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
              <tr><td style="padding:8px 0;font-size:14px;color:#374151;border-bottom:1px solid #f1f5f9;"><strong>Monday</strong> — Manufacturing PMI data</td></tr>
              <tr><td style="padding:8px 0;font-size:14px;color:#374151;border-bottom:1px solid #f1f5f9;"><strong>Wednesday</strong> — Fed interest rate decision</td></tr>
              <tr><td style="padding:8px 0;font-size:14px;color:#374151;border-bottom:1px solid #f1f5f9;"><strong>Thursday</strong> — ECB policy meeting</td></tr>
              <tr><td style="padding:8px 0;font-size:14px;color:#374151;"><strong>Friday</strong> — Non-Farm Payrolls (NFP)</td></tr>
            </table>
            ${ctaButton('{{ctaUrl}}', 'Read Full Analysis')}
          </td></tr>`),
  },

  {
    id: 'promotion',
    name: 'Special Offer / Bonus',
    type: 'promotion',
    subject: 'Exclusive for You: {{promotionTitle}} | {{brandName}}',
    description: 'Time-sensitive promotional email with bonus details, terms, and a strong call to action.',
    variables: ['brandName', 'userName', 'domain', 'ctaUrl', 'promotionTitle', 'currentYear', 'unsubscribeUrl'],
    body: wrap(`
          <tr><td style="background:linear-gradient(135deg,#7c3aed,#4c1d95);padding:40px 32px;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:2px;font-weight:600;">Limited Time Offer</p>
            <h1 style="margin:0;font-size:28px;font-weight:800;color:#fff;">{{promotionTitle}}</h1>
            <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,.85);">Available for a limited time only. Do not miss out.</p>
          </td></tr>
          <tr><td class="content-cell" style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Hi {{userName}},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">As a valued member of {{brandName}}, we are offering you an exclusive bonus on your next deposit.</p>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;border:2px solid #7c3aed;border-radius:8px;overflow:hidden;">
              <tr><td style="padding:24px;text-align:center;background:#faf5ff;">
                <p style="margin:0 0 4px;font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Your Exclusive Bonus</p>
                <p style="margin:0 0 8px;font-size:36px;font-weight:800;color:#7c3aed;">100% Deposit Bonus</p>
                <p style="margin:0;font-size:14px;color:#6b7280;">Up to $5,000 in bonus funds</p>
              </td></tr>
            </table>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
              <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#10003; &nbsp;Minimum deposit: $100</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#10003; &nbsp;Bonus credited instantly</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#10003; &nbsp;Available on all account types</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#10003; &nbsp;Trade any instrument</td></tr>
            </table>
            ${ctaButton('{{ctaUrl}}', 'Claim Your Bonus', '#7c3aed')}
            <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;text-align:center;">Terms and conditions apply. Bonus requires trading volume before withdrawal.</p>
          </td></tr>`),
  },

  {
    id: 'webinar_invite',
    name: 'Webinar Invitation',
    type: 'webinar_invite',
    subject: 'You Are Invited: {{webinarTitle}} — Live Trading Webinar | {{brandName}}',
    description: 'Invites users to an upcoming live trading webinar with speaker info and registration link.',
    variables: ['brandName', 'userName', 'domain', 'ctaUrl', 'webinarTitle', 'webinarDate', 'webinarTime', 'speakerName', 'currentYear', 'unsubscribeUrl'],
    body: wrap(`
          <tr><td style="background:linear-gradient(135deg,#0d9488,#0f766e);padding:40px 32px;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:2px;font-weight:600;">Live Webinar</p>
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#fff;">{{webinarTitle}}</h1>
            <p style="margin:16px 0 0;font-size:15px;color:rgba(255,255,255,.9);">{{webinarDate}} at {{webinarTime}}</p>
          </td></tr>
          <tr><td class="content-cell" style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Hi {{userName}},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">You are invited to our upcoming live trading webinar hosted by {{speakerName}}. This is a free, interactive session where you will learn actionable strategies.</p>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
              <tr><td style="padding:16px 20px;background:#f0fdfa;border-bottom:1px solid #e2e8f0;"><strong style="font-size:14px;color:#1e293b;">What you will learn:</strong></td></tr>
              <tr><td style="padding:16px 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#8226; How to identify high-probability trading setups</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#8226; Risk management techniques used by professionals</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#8226; Live chart analysis and trade ideas for the week</td></tr>
                  <tr><td style="padding:6px 0;font-size:14px;color:#374151;">&#8226; Q&amp;A session — bring your questions</td></tr>
                </table>
              </td></tr>
            </table>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;background:#f8fafc;border-radius:8px;">
              <tr><td style="padding:16px 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr><td style="font-size:14px;color:#64748b;padding:4px 0;">Date:</td><td style="font-size:14px;color:#1e293b;font-weight:600;padding:4px 0;">{{webinarDate}}</td></tr>
                  <tr><td style="font-size:14px;color:#64748b;padding:4px 0;">Time:</td><td style="font-size:14px;color:#1e293b;font-weight:600;padding:4px 0;">{{webinarTime}}</td></tr>
                  <tr><td style="font-size:14px;color:#64748b;padding:4px 0;">Speaker:</td><td style="font-size:14px;color:#1e293b;font-weight:600;padding:4px 0;">{{speakerName}}</td></tr>
                  <tr><td style="font-size:14px;color:#64748b;padding:4px 0;">Cost:</td><td style="font-size:14px;color:#059669;font-weight:600;padding:4px 0;">Free</td></tr>
                </table>
              </td></tr>
            </table>
            ${ctaButton('{{ctaUrl}}', 'Reserve My Spot', '#0d9488')}
            <p style="margin:16px 0 0;font-size:13px;color:#6b7280;text-align:center;">Spots are limited. A recording will be available for 48 hours after the event.</p>
          </td></tr>`),
  },

  {
    id: 'verification',
    name: 'Account Verification Reminder',
    type: 'verification',
    subject: 'Action Required: Complete Your Account Verification | {{brandName}}',
    description: 'Reminds users to complete their KYC/identity verification to unlock full trading features.',
    variables: ['brandName', 'userName', 'domain', 'ctaUrl', 'currentYear', 'unsubscribeUrl'],
    body: wrap(`
          <tr><td style="background:#0f172a;padding:32px;text-align:center;">
            <h1 style="margin:0;font-size:24px;font-weight:700;color:#fff;">Complete Your Verification</h1>
            <p style="margin:8px 0 0;font-size:15px;color:rgba(255,255,255,.8);">One quick step to unlock your full trading account.</p>
          </td></tr>
          <tr><td class="content-cell" style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">Hi {{userName}},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">Your account is almost ready. To start trading live, we need to verify your identity. This is required by financial regulations and helps keep your account secure.</p>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;border:1px solid #fbbf24;border-radius:8px;overflow:hidden;background:#fffbeb;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#92400e;">What you will need:</p>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr><td style="padding:4px 0;font-size:14px;color:#78350f;">&#10003; &nbsp;Government-issued photo ID (passport, driver license, or national ID)</td></tr>
                  <tr><td style="padding:4px 0;font-size:14px;color:#78350f;">&#10003; &nbsp;Proof of address (utility bill or bank statement, less than 3 months old)</td></tr>
                </table>
              </td></tr>
            </table>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              ${numberedStep(1, 'Upload documents', 'Take a clear photo or upload a scan of your ID and proof of address.')}
              ${numberedStep(2, 'Wait for review', 'Our compliance team reviews submissions within 24 hours (usually much faster).')}
              ${numberedStep(3, 'Start trading', 'Once approved, make your first deposit and start trading live.')}
            </table>
            ${ctaButton('{{ctaUrl}}', 'Verify My Account')}
            <p style="margin:20px 0 0;font-size:13px;color:#6b7280;text-align:center;">Your data is encrypted and handled in accordance with our <a href="https://{{domain}}/privacy" style="color:#1a56db;text-decoration:underline;">privacy policy</a>.</p>
          </td></tr>`),
  },
]

export function getEmailTemplate(type: string): EmailTemplateDefinition | undefined {
  return EMAIL_TEMPLATE_DEFINITIONS.find((t) => t.type === type)
}

export function getEmailTemplateList(): Array<{ id: string; name: string; type: string; description: string }> {
  return EMAIL_TEMPLATE_DEFINITIONS.map(({ id, name, type, description }) => ({ id, name, type, description }))
}
