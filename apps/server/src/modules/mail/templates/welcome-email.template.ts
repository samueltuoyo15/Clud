export const getWelcomeEmailTemplate = (firstName: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Clud</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #171717;
      margin: 0;
      padding: 32px 16px;
      background-color: #FAFAFA;
    }
    .container {
      width: 100%;
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #E5E5E5;
      border-radius: 16px;
      overflow: hidden;
      text-align: left;
    }
    .header {
      background-color: #611F69;
      padding: 22px 28px;
      text-align: left;
    }
    .logo-text {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 36px 28px;
      text-align: left;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 20px 0;
      letter-spacing: -0.4px;
    }
    .text {
      font-size: 15px;
      color: #4b5563;
      margin: 0 0 18px 0;
      line-height: 1.6;
    }
    .highlight {
      font-weight: 600;
      color: #111827;
    }
    .footer {
      padding: 24px 28px;
      border-top: 1px solid #F1F5F9;
      background-color: #FAFAFA;
      text-align: center;
    }
    .footer-text {
      font-size: 12px;
      color: #94A3B8;
      margin: 0;
    }
  </style>
</head>
<body>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <div class="container">
          <div class="header">
            <span class="logo-text">Clud</span>
          </div>
          <div class="content">
            <h1 class="title">Welcome, ${firstName}.</h1>
            
            <p class="text">Building software is an act of creation. It requires vision, momentum, and unbroken flow.</p>
            
            <p class="text">But nothing breaks momentum like a silent failure: an undocumented API change, a shifted payload, or a drifted schema. These unseen fractures pull us away from creation and force us into reaction.</p>
            
            <p class="text">We built <span class="highlight">Clud</span> to watch the fractures, so you can keep your eyes on creation. We monitor the unseen boundaries of your APIs, catching drift the moment it happens and protecting your team from silent breakages.</p>
            
            <p class="text">Your workspace is ready. The guardrails are up.</p>
            
            <p class="text" style="margin-bottom: 0;">Let's build something lasting.</p>
          </div>
          <div class="footer">
            <p class="footer-text">Clud • Automated API Drift Detection</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
