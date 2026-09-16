export const getWelcomeEmailTemplate = (firstName: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Clud</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAFAFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #171717;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; background-color: #FAFAFA; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="padding: 32px 16px; text-align: center;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" align="center" style="max-width: 580px; width: 100%; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E5E5; border-radius: 16px; overflow: hidden; text-align: left; border-collapse: separate;">
          <tr>
            <td style="background-color: #611F69; padding: 22px 28px; text-align: left;">
              <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Clud</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 28px; text-align: left; background-color: #ffffff;">
              <h1 style="font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 20px 0; letter-spacing: -0.4px;">Welcome, ${firstName}.</h1>
              
              <p style="font-size: 15px; color: #4b5563; margin: 0 0 18px 0; line-height: 1.6;">Building software is an act of creation. It requires vision, momentum, and unbroken flow.</p>
              
              <p style="font-size: 15px; color: #4b5563; margin: 0 0 18px 0; line-height: 1.6;">But nothing breaks momentum like a silent failure: an undocumented API change, a shifted payload, or a drifted schema. These unseen fractures pull us away from creation and force us into reaction.</p>
              
              <p style="font-size: 15px; color: #4b5563; margin: 0 0 18px 0; line-height: 1.6;">We built <span style="font-weight: 600; color: #111827;">Clud</span> to watch the fractures, so you can keep your eyes on creation. We monitor the unseen boundaries of your APIs, catching drift the moment it happens and protecting your team from silent breakages.</p>
              
              <p style="font-size: 15px; color: #4b5563; margin: 0 0 18px 0; line-height: 1.6;">Your workspace is ready. The guardrails are up.</p>
              
              <p style="font-size: 15px; color: #4b5563; margin: 0; line-height: 1.6;">Let's build something lasting.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 28px; border-top: 1px solid #F1F5F9; background-color: #FAFAFA; text-align: center;">
              <p style="font-size: 12px; color: #94A3B8; margin: 0;">Clud &bull; Automated API Drift Detection</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}
