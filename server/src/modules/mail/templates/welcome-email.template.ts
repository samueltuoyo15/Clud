import { readFileSync } from 'fs'
import { join } from 'path'

export const getWelcomeEmailTemplate = (firstName: string): string => {
  let logoBase64 = ''
  try {
    const logoPath = join(process.cwd(), '../client/public/favicon-white.svg')
    const logoData = readFileSync(logoPath).toString('base64')
    logoBase64 = `data:image/svg+xml;base64,${logoData}`
  } catch (err) {
    console.error('Failed to load logo for welcome email:', err)
  }

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
      padding: 0;
      background-color: #FAFAFA;
    }
    .container {
      max-w: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border: 1px solid #E5E5E5;
      border-radius: 12px;
    }
    .header {
      background-color: #611F69;
      padding: 32px 40px;
      text-align: left;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    .logo {
      height: 28px;
    }
    .content {
      padding: 48px 40px;
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      color: #171717;
      margin: 0 0 24px 0;
      letter-spacing: -0.5px;
    }
    .text {
      font-size: 16px;
      color: #525252;
      margin: 0 0 24px 0;
    }
    .highlight {
      font-weight: 600;
      color: #171717;
    }
    .footer {
      padding: 32px 40px;
      border-top: 1px solid #E5E5E5;
      background-color: #FAFAFA;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    .footer-text {
      font-size: 13px;
      color: #A3A3A3;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${logoBase64}" alt="Clud" class="logo">
    </div>
    <div class="content">
      <h1 class="title">Welcome, ${firstName}.</h1>
      
      <p class="text">Building software is an act of creation. It requires vision, momentum, and unbroken flow.</p>
      
      <p class="text">But nothing breaks momentum like a silent failure. An undocumented API change. A shifted payload. A drifted schema. These unseen fractures pull us away from creation and force us into reaction.</p>
      
      <p class="text">We built <span class="highlight">Clud</span> to watch the fractures, so you can keep your eyes on the creation. We monitor the unseen boundaries of your APIs, catching drift the moment it happens, protecting your team from the chaos of silent breakages.</p>
      
      <p class="text">Your workspace is ready. The guardrails are up.</p>
      
      <p class="text">Let's build something lasting.</p>
    </div>
    <div class="footer">
      <p class="footer-text">Clud Inc. • Automated API Drift Detection</p>
    </div>
  </div>
</body>
</html>
`
}
