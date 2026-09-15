export function getDriftAlertEmailTemplate(projectName: string, diffText: string) {
  const subject = `⚠️ API Drift Detected: ${projectName}`;
  
  // Quick format for human readability in HTML
  let formattedDiff = diffText.replace(/\n/g, '<br />');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafc; color: #171717; line-height: 1.6; margin: 0; padding: 20px; }
    .container { max-w-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    h1 { font-size: 20px; font-weight: 700; color: #dc2626; margin-top: 0; margin-bottom: 8px; }
    p { margin-bottom: 24px; color: #52525b; font-size: 15px; }
    .diff-box { background-color: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; overflow-x: auto; margin-bottom: 24px; }
    .footer { text-align: center; color: #a1a1aa; font-size: 12px; margin-top: 32px; border-top: 1px solid #f4f4f5; padding-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>API Drift Detected</h1>
    <p>Clud has detected unauthorized changes in your OpenAPI specification for <strong>${projectName}</strong>.</p>
    
    <div class="diff-box">
      ${formattedDiff}
    </div>
    
    <p>Please review these changes immediately to ensure your integrations don't break.</p>
    
    <div class="footer">
      Automated alert from Clud API Monitoring.<br/>
      You are receiving this because you are subscribed to alerts for this workspace.
    </div>
  </div>
</body>
</html>`;

  return { subject, html };
}
