using Microsoft.Extensions.Configuration;

namespace ConnectCampus.Infrastructure.Services
{
    public class EmailTemplateService
    {
        private readonly IConfiguration _configuration;
        private readonly string _frontendUrl;
        private readonly string _appName;
        private readonly string _supportEmail;

        public EmailTemplateService(IConfiguration configuration)
        {
            _configuration = configuration;
            _frontendUrl = _configuration["App:FrontendUrl"] ?? "http://localhost:5173";
            _appName = _configuration["App:Name"] ?? "CampusConnect";
            _supportEmail = _configuration["App:SupportEmail"] ?? "support@campusconnect.com";
        }

        public string GetPasswordResetEmailTemplate(string resetToken)
        {
            var resetUrl = $"{_frontendUrl}/reset-password?token={resetToken}";
            
            return $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Reset Your Password - {_appName}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }}
        .container {{
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            text-align: center;
            margin-bottom: 40px;
        }}
        .logo-container {{
            text-align: center;
            margin-bottom: 30px;
        }}
        .logo {{
            width: 80px;
            height: auto;
            margin: 0 auto;
        }}
        .brand-name {{
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(135deg, #a1cd40, #38c0c5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-top: 10px;
        }}
        h1 {{
            color: #1e293b;
            margin: 0 0 20px;
            font-size: 28px;
            font-weight: 700;
        }}
        .content {{
            margin-bottom: 40px;
        }}
        .reset-button {{
            display: inline-block;
            background: linear-gradient(135deg, #a1cd40, #38c0c5);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s;
        }}
        .reset-button:hover {{
            transform: translateY(-2px);
        }}
        .alternative-link {{
            background-color: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #a1cd40;
        }}
        .alternative-link code {{
            background-color: #e2e8f0;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            word-break: break-all;
        }}
        .footer {{
            text-align: center;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
            padding-top: 30px;
            margin-top: 40px;
        }}
        .security-info {{
            background-color: #fef3cd;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
        }}
        .security-info h3 {{
            margin: 0 0 8px;
            color: #92400e;
            font-size: 16px;
        }}
        .security-info p {{
            margin: 0;
            color: #92400e;
            font-size: 14px;
        }}
        @media (max-width: 600px) {{
            body {{ padding: 10px; }}
            .container {{ padding: 20px; }}
            h1 {{ font-size: 24px; }}
            .logo {{ width: 60px; }}
            .brand-name {{ font-size: 20px; }}
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <div class=""logo-container"">
                <svg class=""logo"" viewBox=""0 0 90.64 28.32"" xmlns=""http://www.w3.org/2000/svg"">
                    <defs>
                        <linearGradient id=""linear-gradient"" x1=""4.66"" y1=""8.27"" x2=""20.81"" y2=""24.07"" gradientUnits=""userSpaceOnUse"">
                            <stop offset=""0"" stop-color=""#a1cd40""/>
                            <stop offset="".18"" stop-color=""#93cb51""/>
                            <stop offset="".53"" stop-color=""#6ec67f""/>
                            <stop offset="".99"" stop-color=""#38c0c5""/>
                        </linearGradient>
                    </defs>
                    <g>
                        <path fill=""url(#linear-gradient)"" d=""m14.4,0C6.58,0,.24,6.34.24,14.16c0,2.07.45,4.02,1.25,5.79l-1.49,7.21,5.66-1.87c2.41,1.9,5.44,3.04,8.74,3.04,7.82,0,14.16-6.34,14.16-14.16S22.23,0,14.4,0Z""/>
                        <g>
                            <path fill=""#a1cd40"" d=""m36.17,5.71c.38-.69.91-1.23,1.59-1.61.68-.38,1.45-.58,2.31-.58,1.06,0,1.96.28,2.71.84s1.25,1.32,1.51,2.28h-2.38c-.18-.37-.43-.65-.75-.85-.33-.19-.69-.29-1.11-.29-.67,0-1.21.23-1.62.7-.41.46-.62,1.09-.62,1.86s.21,1.4.62,1.86c.41.46.95.7,1.62.7.41,0,.78-.1,1.11-.29s.58-.48.75-.85h2.38c-.25.96-.76,1.72-1.51,2.27s-1.66.83-2.71.83c-.86,0-1.63-.19-2.31-.58-.68-.38-1.21-.92-1.59-1.6-.38-.68-.57-1.47-.57-2.34s.19-1.66.57-2.35Z""/>
                            <path fill=""#a1cd40"" d=""m45.61,7.06c.27-.55.65-.97,1.12-1.27.47-.3,1-.44,1.58-.44.5,0,.94.1,1.31.3.38.2.67.47.87.8v-1h2.17v7.07h-2.17v-1c-.21.33-.51.6-.88.8-.38.2-.81.3-1.31.3-.57,0-1.1-.15-1.57-.45-.47-.3-.85-.73-1.12-1.28s-.41-1.19-.41-1.92.14-1.36.41-1.91Zm4.44.65c-.3-.31-.67-.47-1.1-.47s-.8.15-1.1.46c-.3.31-.45.73-.45,1.27s.15.97.45,1.29.67.48,1.1.48.8-.16,1.1-.47c.3-.31.45-.74.45-1.28s-.15-.97-.45-1.28Z""/>
                            <path fill=""#a1cd40"" d=""m65.35,6.17c.52.53.78,1.27.78,2.22v4.13h-2.15v-3.84c0-.46-.12-.81-.36-1.06s-.57-.37-.99-.37-.75.12-1,.37-.36.6-.36,1.06v3.84h-2.15v-3.84c0-.46-.12-.81-.36-1.06s-.57-.37-1-.37-.75.12-.99.37-.36.6-.36,1.06v3.84h-2.17v-7.07h2.17v.89c.22-.3.51-.53.86-.7.35-.17.76-.26,1.2-.26.53,0,1.01.11,1.43.34.42.23.75.55.98.98.25-.39.58-.71,1-.95s.88-.37,1.38-.37c.88,0,1.58.27,2.1.8Z""/>
                            <path fill=""#a1cd40"" d=""m70.69,5.65c.37-.2.81-.3,1.31-.3.58,0,1.11.15,1.58.44.47.3.85.72,1.12,1.27.27.55.41,1.19.41,1.91s-.14,1.37-.41,1.92c-.27.55-.65.98-1.12,1.28-.47.3-1,.45-1.58.45-.49,0-.92-.1-1.3-.3-.38-.2-.67-.46-.88-.79v4.36h-2.17V5.45h2.17v1c.21-.33.5-.6.87-.8Zm1.77,2.05c-.3-.31-.67-.46-1.11-.46s-.8.16-1.1.47c-.3.31-.45.74-.45,1.28s.15.97.45,1.28c.3.31.67.47,1.1.47s.8-.16,1.1-.48.46-.75.46-1.29-.15-.97-.45-1.27Z""/>
                            <path fill=""#a1cd40"" d=""m83.24,5.45v7.07h-2.17v-.96c-.22.31-.52.56-.89.75-.38.19-.79.29-1.25.29-.54,0-1.02-.12-1.43-.36-.41-.24-.74-.59-.96-1.05-.23-.46-.34-.99-.34-1.61v-4.13h2.15v3.84c0,.47.12.84.37,1.1s.57.39.99.39.76-.13,1-.39.37-.63.37-1.1v-3.84h2.17Z""/>
                            <path fill=""#a1cd40"" d=""m86.03,12.31c-.48-.21-.86-.5-1.14-.87s-.44-.78-.47-1.24h2.14c.03.25.14.44.34.6.2.15.45.23.75.23.27,0,.48-.05.63-.16.15-.11.22-.24.22-.41,0-.2-.11-.35-.32-.45-.21-.1-.55-.2-1.03-.32-.51-.12-.93-.24-1.27-.37s-.63-.34-.87-.62-.37-.67-.37-1.15c0-.41.11-.77.34-1.11.22-.33.55-.6.99-.79s.95-.29,1.55-.29c.89,0,1.59.22,2.1.66.51.44.8,1.02.88,1.75h-2c-.03-.24-.14-.44-.32-.58-.18-.14-.42-.22-.72-.22-.25,0-.45.05-.58.15-.14.1-.2.23-.2.4,0,.2.11.35.32.46.22.1.55.2,1.01.3.52.14.95.27,1.28.4s.62.34.87.63c.25.29.38.68.39,1.17,0,.41-.12.78-.35,1.11-.23.33-.57.58-1,.77-.44.19-.94.28-1.51.28-.62,0-1.17-.11-1.65-.32Z""/>
                        </g>
                        <g>
                            <path fill=""#38c0c5"" d=""m36.61,17.89c.38-.69.91-1.23,1.59-1.61.68-.38,1.45-.58,2.31-.58,1.06,0,1.96.28,2.71.84s1.25,1.32,1.51,2.28h-2.38c-.18-.37-.43-.65-.75-.85-.33-.19-.69-.29-1.11-.29-.67,0-1.21.23-1.62.7-.41.46-.62,1.09-.62,1.86s.21,1.4.62,1.86c.41.46.95.7,1.62.7.41,0,.78-.1,1.11-.29s.58-.48.75-.85h2.38c-.25.96-.76,1.72-1.51,2.27s-1.66.83-2.71.83c-.86,0-1.63-.19-2.31-.58-.68-.38-1.21-.92-1.59-1.6-.38-.68-.57-1.47-.57-2.34s.19-1.66.57-2.35Z""/>
                            <path fill=""#38c0c5"" d=""m47.42,24.36c-.55-.3-.99-.72-1.31-1.27s-.48-1.19-.48-1.93.16-1.37.48-1.92c.32-.55.76-.98,1.32-1.27.56-.3,1.18-.44,1.88-.44s1.32.15,1.88.44c.56.3,1,.72,1.32,1.27.32.55.48,1.19.48,1.92s-.16,1.37-.49,1.92-.77.98-1.33,1.27c-.56.3-1.19.44-1.88.44s-1.32-.15-1.87-.44Zm2.93-1.89c.29-.3.44-.74.44-1.31s-.14-1-.42-1.31c-.28-.3-.63-.46-1.05-.46s-.77.15-1.05.45-.42.74-.42,1.31.14,1,.41,1.31.62.46,1.03.46.77-.15,1.06-.46Z""/>
                            <path fill=""#38c0c5"" d=""m60.43,18.36c.49.54.74,1.27.74,2.21v4.13h-2.15v-3.84c0-.47-.12-.84-.37-1.1-.25-.26-.57-.39-.99-.39s-.74.13-.99.39-.37.63-.37,1.1v3.84h-2.17v-7.07h2.17v.94c.22-.31.52-.56.89-.74.37-.18.79-.27,1.25-.27.83,0,1.49.27,1.98.8Z""/>
                            <path fill=""#38c0c5"" d=""m68.97,18.36c.49.54.74,1.27.74,2.21v4.13h-2.15v-3.84c0-.47-.12-.84-.37-1.1-.25-.26-.57-.39-.99-.39s-.74.13-.99.39-.37.63-.37,1.1v3.84h-2.17v-7.07h2.17v.94c.22-.31.52-.56.89-.74.37-.18.79-.27,1.25-.27.83,0,1.49.27,1.98.8Z""/>
                            <path fill=""#38c0c5"" d=""m77.85,21.68h-4.9c.03.44.18.78.42,1.01.25.23.56.35.92.35.54,0,.92-.23,1.13-.68h2.31c-.12.46-.33.88-.64,1.25-.31.37-.69.66-1.16.87-.46.21-.98.32-1.56.32-.69,0-1.31-.15-1.85-.44-.54-.3-.96-.72-1.27-1.27s-.46-1.19-.46-1.93.15-1.38.45-1.93.72-.97,1.26-1.27c.54-.3,1.16-.44,1.86-.44s1.29.14,1.82.43c.53.29.95.7,1.25,1.23.3.53.45,1.15.45,1.86,0,.2-.01.41-.04.63Zm-2.18-1.2c0-.37-.13-.67-.38-.89-.25-.22-.57-.33-.95-.33s-.67.11-.92.32c-.25.21-.4.51-.46.9h2.71Z""/>
                            <path fill=""#38c0c5"" d=""m79.05,19.24c.3-.55.72-.97,1.25-1.27.54-.3,1.15-.44,1.84-.44.89,0,1.63.23,2.22.7.6.46.99,1.12,1.17,1.96h-2.31c-.19-.54-.57-.81-1.13-.81-.4,0-.71.15-.95.46-.24.31-.35.75-.35,1.32s.12,1.02.35,1.32c.24.31.55.46.95.46.56,0,.93-.27,1.13-.81h2.31c-.19.83-.58,1.48-1.18,1.95-.6.47-1.34.71-2.22.71-.69,0-1.31-.15-1.84-.44-.54-.3-.96-.72-1.25-1.27s-.45-1.19-.45-1.93.15-1.38.45-1.93Z""/>
                            <path fill=""#38c0c5"" d=""m90.64,22.86v1.84h-1.1c-.79,0-1.4-.19-1.84-.58-.44-.38-.66-1.01-.66-1.88v-2.81h-.86v-1.8h.86v-1.72h2.17v1.72h1.42v1.8h-1.42v2.84c0,.21.05.36.15.46.1.09.27.14.51.14h.77Z""/>
                        </g>
                        <path fill=""#141d28"" d=""m8.55,23.63c-.1,0-.19-.01-.29-.03-.52-.11-.93-.53-1.03-1.05-.05-.28-.02-.56.09-.81.48-1.08.72-2.33.72-3.81v-5.22l-3.31-1.5c-.34-.15-.55-.48-.55-.86,0-.37.21-.7.55-.86l8.34-3.8c.42-.19.87-.29,1.34-.29s.91.1,1.34.29l8.34,3.8c.34.15.55.48.55.86,0,.37-.21.7-.55.86l-2.53,1.15v5.72c0,.21-.12.4-.31.48l-5.68,2.48c-.21.1-.41.19-.61.2h-.02c-.05,0-.08,0-.11,0-.25-.04-.48-.15-.73-.26-.13-.06-.25-.11-.38-.16l-2.42-.91c-.28-.1-.44-.4-.35-.66.07-.21.27-.36.49-.36.06,0,.12.01.18.03.99.37,2.03.56,3.09.56,1.22,0,2.4-.25,3.52-.73,1.4-.61,2.31-2,2.31-3.53v-2.4l-4.78,2.18c-.42.19-.87.29-1.34.29s-.91-.1-1.34-.29l-4.01-1.82v4.83c0,1.14.24,2.35.76,3.83.05.14.08.29.08.44,0,.74-.6,1.35-1.35,1.35Z""/>
                    </g>
                </svg>
                <div class=""brand-name"">{_appName}</div>
            </div>
            <h1>Reset Your Password</h1>
        </div>
        
        <div class=""content"">
            <p>Hello!</p>
            <p>You recently requested to reset your password for your {_appName} account. Click the button below to reset it:</p>
            
            <div style=""text-align: center; margin: 30px 0;"">
                <a href=""{resetUrl}"" class=""reset-button"">Reset My Password</a>
            </div>
            
            <div class=""alternative-link"">
                <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
                <code>{resetUrl}</code>
            </div>
            
            <div class=""security-info"">
                <h3>🔒 Security Information</h3>
                <p>This password reset link will expire in <strong>24 hours</strong> for your security.</p>
            </div>
            
            <p>If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.</p>
        </div>
        
        <div class=""footer"">
            <p>This email was sent by {_appName}</p>
            <p>Need help? Contact us at <a href=""mailto:{_supportEmail}"">{_supportEmail}</a></p>
        </div>
    </div>
</body>
</html>";
        }

        public string GetEmailVerificationTemplate(string verificationToken)
        {
            var verificationUrl = $"{_frontendUrl}/verify-email?token={verificationToken}";
            
            return $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Verify Your Email - {_appName}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }}
        .container {{
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            text-align: center;
            margin-bottom: 40px;
        }}
        .logo-container {{
            text-align: center;
            margin-bottom: 30px;
        }}
        .logo {{
            width: 80px;
            height: auto;
            margin: 0 auto;
        }}
        .brand-name {{
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(135deg, #a1cd40, #38c0c5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-top: 10px;
        }}
        h1 {{
            color: #1e293b;
            margin: 0 0 20px;
            font-size: 28px;
            font-weight: 700;
        }}
        .content {{
            margin-bottom: 40px;
        }}
        .verify-button {{
            display: inline-block;
            background: linear-gradient(135deg, #a1cd40, #38c0c5);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s;
        }}
        .verify-button:hover {{
            transform: translateY(-2px);
        }}
        .alternative-link {{
            background-color: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #a1cd40;
        }}
        .alternative-link code {{
            background-color: #e2e8f0;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            word-break: break-all;
        }}
        .footer {{
            text-align: center;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
            padding-top: 30px;
            margin-top: 40px;
        }}
        .welcome-info {{
            background-color: #dcfdf7;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 16px;
            margin: 20px 0;
        }}
        .welcome-info h3 {{
            margin: 0 0 8px;
            color: #047857;
            font-size: 16px;
        }}
        .welcome-info p {{
            margin: 0;
            color: #047857;
            font-size: 14px;
        }}
        @media (max-width: 600px) {{
            body {{ padding: 10px; }}
            .container {{ padding: 20px; }}
            h1 {{ font-size: 24px; }}
            .logo {{ width: 60px; }}
            .brand-name {{ font-size: 20px; }}
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <div class=""logo-container"">
                <svg class=""logo"" viewBox=""0 0 90.64 28.32"" xmlns=""http://www.w3.org/2000/svg"">
                    <defs>
                        <linearGradient id=""linear-gradient-verify"" x1=""4.66"" y1=""8.27"" x2=""20.81"" y2=""24.07"" gradientUnits=""userSpaceOnUse"">
                            <stop offset=""0"" stop-color=""#a1cd40""/>
                            <stop offset="".18"" stop-color=""#93cb51""/>
                            <stop offset="".53"" stop-color=""#6ec67f""/>
                            <stop offset="".99"" stop-color=""#38c0c5""/>
                        </linearGradient>
                    </defs>
                    <g>
                        <path fill=""url(#linear-gradient-verify)"" d=""m14.4,0C6.58,0,.24,6.34.24,14.16c0,2.07.45,4.02,1.25,5.79l-1.49,7.21,5.66-1.87c2.41,1.9,5.44,3.04,8.74,3.04,7.82,0,14.16-6.34,14.16-14.16S22.23,0,14.4,0Z""/>
                        <g>
                            <path fill=""#a1cd40"" d=""m36.17,5.71c.38-.69.91-1.23,1.59-1.61.68-.38,1.45-.58,2.31-.58,1.06,0,1.96.28,2.71.84s1.25,1.32,1.51,2.28h-2.38c-.18-.37-.43-.65-.75-.85-.33-.19-.69-.29-1.11-.29-.67,0-1.21.23-1.62.7-.41.46-.62,1.09-.62,1.86s.21,1.4.62,1.86c.41.46.95.7,1.62.7.41,0,.78-.1,1.11-.29s.58-.48.75-.85h2.38c-.25.96-.76,1.72-1.51,2.27s-1.66.83-2.71.83c-.86,0-1.63-.19-2.31-.58-.68-.38-1.21-.92-1.59-1.6-.38-.68-.57-1.47-.57-2.34s.19-1.66.57-2.35Z""/>
                            <path fill=""#a1cd40"" d=""m45.61,7.06c.27-.55.65-.97,1.12-1.27.47-.3,1-.44,1.58-.44.5,0,.94.1,1.31.3.38.2.67.47.87.8v-1h2.17v7.07h-2.17v-1c-.21.33-.51.6-.88.8-.38.2-.81.3-1.31.3-.57,0-1.1-.15-1.57-.45-.47-.3-.85-.73-1.12-1.28s-.41-1.19-.41-1.92.14-1.36.41-1.91Zm4.44.65c-.3-.31-.67-.47-1.1-.47s-.8.15-1.1.46c-.3.31-.45.73-.45,1.27s.15.97.45,1.29.67.48,1.1.48.8-.16,1.1-.47c.3-.31.45-.74.45-1.28s-.15-.97-.45-1.28Z""/>
                            <path fill=""#a1cd40"" d=""m65.35,6.17c.52.53.78,1.27.78,2.22v4.13h-2.15v-3.84c0-.46-.12-.81-.36-1.06s-.57-.37-.99-.37-.75.12-1,.37-.36.6-.36,1.06v3.84h-2.15v-3.84c0-.46-.12-.81-.36-1.06s-.57-.37-1-.37-.75.12-.99.37-.36.6-.36,1.06v3.84h-2.17v-7.07h2.17v.89c.22-.3.51-.53.86-.7.35-.17.76-.26,1.2-.26.53,0,1.01.11,1.43.34.42.23.75.55.98.98.25-.39.58-.71,1-.95s.88-.37,1.38-.37c.88,0,1.58.27,2.1.8Z""/>
                            <path fill=""#a1cd40"" d=""m70.69,5.65c.37-.2.81-.3,1.31-.3.58,0,1.11.15,1.58.44.47.3.85.72,1.12,1.27.27.55.41,1.19.41,1.91s-.14,1.37-.41,1.92c-.27.55-.65.98-1.12,1.28-.47.3-1,.45-1.58.45-.49,0-.92-.1-1.3-.3-.38-.2-.67-.46-.88-.79v4.36h-2.17V5.45h2.17v1c.21-.33.5-.6.87-.8Zm1.77,2.05c-.3-.31-.67-.46-1.11-.46s-.8.16-1.1.47c-.3.31-.45.74-.45,1.28s.15.97.45,1.28c.3.31.67.47,1.1.47s.8-.16,1.1-.48.46-.75.46-1.29-.15-.97-.45-1.27Z""/>
                            <path fill=""#a1cd40"" d=""m83.24,5.45v7.07h-2.17v-.96c-.22.31-.52.56-.89.75-.38.19-.79.29-1.25.29-.54,0-1.02-.12-1.43-.36-.41-.24-.74-.59-.96-1.05-.23-.46-.34-.99-.34-1.61v-4.13h2.15v3.84c0,.47.12.84.37,1.1s.57.39.99.39.76-.13,1-.39.37-.63.37-1.1v-3.84h2.17Z""/>
                            <path fill=""#a1cd40"" d=""m86.03,12.31c-.48-.21-.86-.5-1.14-.87s-.44-.78-.47-1.24h2.14c.03.25.14.44.34.6.2.15.45.23.75.23.27,0,.48-.05.63-.16.15-.11.22-.24.22-.41,0-.2-.11-.35-.32-.45-.21-.1-.55-.2-1.03-.32-.51-.12-.93-.24-1.27-.37s-.63-.34-.87-.62-.37-.67-.37-1.15c0-.41.11-.77.34-1.11.22-.33.55-.6.99-.79s.95-.29,1.55-.29c.89,0,1.59.22,2.1.66.51.44.8,1.02.88,1.75h-2c-.03-.24-.14-.44-.32-.58-.18-.14-.42-.22-.72-.22-.25,0-.45.05-.58.15-.14.1-.2.23-.2.4,0,.2.11.35.32.46.22.1.55.2,1.01.3.52.14.95.27,1.28.4s.62.34.87.63c.25.29.38.68.39,1.17,0,.41-.12.78-.35,1.11-.23.33-.57.58-1,.77-.44.19-.94.28-1.51.28-.62,0-1.17-.11-1.65-.32Z""/>
                        </g>
                        <g>
                            <path fill=""#38c0c5"" d=""m36.61,17.89c.38-.69.91-1.23,1.59-1.61.68-.38,1.45-.58,2.31-.58,1.06,0,1.96.28,2.71.84s1.25,1.32,1.51,2.28h-2.38c-.18-.37-.43-.65-.75-.85-.33-.19-.69-.29-1.11-.29-.67,0-1.21.23-1.62.7-.41.46-.62,1.09-.62,1.86s.21,1.4.62,1.86c.41.46.95.7,1.62.7.41,0,.78-.1,1.11-.29s.58-.48.75-.85h2.38c-.25.96-.76,1.72-1.51,2.27s-1.66.83-2.71.83c-.86,0-1.63-.19-2.31-.58-.68-.38-1.21-.92-1.59-1.6-.38-.68-.57-1.47-.57-2.34s.19-1.66.57-2.35Z""/>
                            <path fill=""#38c0c5"" d=""m47.42,24.36c-.55-.3-.99-.72-1.31-1.27s-.48-1.19-.48-1.93.16-1.37.48-1.92c.32-.55.76-.98,1.32-1.27.56-.3,1.18-.44,1.88-.44s1.32.15,1.88.44c.56.3,1,.72,1.32,1.27.32.55.48,1.19.48,1.92s-.16,1.37-.49,1.92-.77.98-1.33,1.27c-.56.3-1.19.44-1.88.44s-1.32-.15-1.87-.44Zm2.93-1.89c.29-.3.44-.74.44-1.31s-.14-1-.42-1.31c-.28-.3-.63-.46-1.05-.46s-.77.15-1.05.45-.42.74-.42,1.31.14,1,.41,1.31.62.46,1.03.46.77-.15,1.06-.46Z""/>
                            <path fill=""#38c0c5"" d=""m60.43,18.36c.49.54.74,1.27.74,2.21v4.13h-2.15v-3.84c0-.47-.12-.84-.37-1.1-.25-.26-.57-.39-.99-.39s-.74.13-.99.39-.37.63-.37,1.1v3.84h-2.17v-7.07h2.17v.94c.22-.31.52-.56.89-.74.37-.18.79-.27,1.25-.27.83,0,1.49.27,1.98.8Z""/>
                            <path fill=""#38c0c5"" d=""m68.97,18.36c.49.54.74,1.27.74,2.21v4.13h-2.15v-3.84c0-.47-.12-.84-.37-1.1-.25-.26-.57-.39-.99-.39s-.74.13-.99.39-.37.63-.37,1.1v3.84h-2.17v-7.07h2.17v.94c.22-.31.52-.56.89-.74.37-.18.79-.27,1.25-.27.83,0,1.49.27,1.98.8Z""/>
                            <path fill=""#38c0c5"" d=""m77.85,21.68h-4.9c.03.44.18.78.42,1.01.25.23.56.35.92.35.54,0,.92-.23,1.13-.68h2.31c-.12.46-.33.88-.64,1.25-.31.37-.69.66-1.16.87-.46.21-.98.32-1.56.32-.69,0-1.31-.15-1.85-.44-.54-.3-.96-.72-1.27-1.27s-.46-1.19-.46-1.93.15-1.38.45-1.93.72-.97,1.26-1.27c.54-.3,1.16-.44,1.86-.44s1.29.14,1.82.43c.53.29.95.7,1.25,1.23.3.53.45,1.15.45,1.86,0,.2-.01.41-.04.63Zm-2.18-1.2c0-.37-.13-.67-.38-.89-.25-.22-.57-.33-.95-.33s-.67.11-.92.32c-.25.21-.4.51-.46.9h2.71Z""/>
                            <path fill=""#38c0c5"" d=""m79.05,19.24c.3-.55.72-.97,1.25-1.27.54-.3,1.15-.44,1.84-.44.89,0,1.63.23,2.22.7.6.46.99,1.12,1.17,1.96h-2.31c-.19-.54-.57-.81-1.13-.81-.4,0-.71.15-.95.46-.24.31-.35.75-.35,1.32s.12,1.02.35,1.32c.24.31.55.46.95.46.56,0,.93-.27,1.13-.81h2.31c-.19.83-.58,1.48-1.18,1.95-.6.47-1.34.71-2.22.71-.69,0-1.31-.15-1.84-.44-.54-.3-.96-.72-1.25-1.27s-.45-1.19-.45-1.93.15-1.38.45-1.93Z""/>
                            <path fill=""#38c0c5"" d=""m90.64,22.86v1.84h-1.1c-.79,0-1.4-.19-1.84-.58-.44-.38-.66-1.01-.66-1.88v-2.81h-.86v-1.8h.86v-1.72h2.17v1.72h1.42v1.8h-1.42v2.84c0,.21.05.36.15.46.1.09.27.14.51.14h.77Z""/>
                        </g>
                        <path fill=""#141d28"" d=""m8.55,23.63c-.1,0-.19-.01-.29-.03-.52-.11-.93-.53-1.03-1.05-.05-.28-.02-.56.09-.81.48-1.08.72-2.33.72-3.81v-5.22l-3.31-1.5c-.34-.15-.55-.48-.55-.86,0-.37.21-.7.55-.86l8.34-3.8c.42-.19.87-.29,1.34-.29s.91.1,1.34.29l8.34,3.8c.34.15.55.48.55.86,0,.37-.21.7-.55.86l-2.53,1.15v5.72c0,.21-.12.4-.31.48l-5.68,2.48c-.21.1-.41.19-.61.2h-.02c-.05,0-.08,0-.11,0-.25-.04-.48-.15-.73-.26-.13-.06-.25-.11-.38-.16l-2.42-.91c-.28-.1-.44-.4-.35-.66.07-.21.27-.36.49-.36.06,0,.12.01.18.03.99.37,2.03.56,3.09.56,1.22,0,2.4-.25,3.52-.73,1.4-.61,2.31-2,2.31-3.53v-2.4l-4.78,2.18c-.42.19-.87.29-1.34.29s-.91-.1-1.34-.29l-4.01-1.82v4.83c0,1.14.24,2.35.76,3.83.05.14.08.29.08.44,0,.74-.6,1.35-1.35,1.35Z""/>
                    </g>
                </svg>
                <div class=""brand-name"">{_appName}</div>
            </div>
            <h1>Welcome to {_appName}!</h1>
        </div>
        
        <div class=""content"">
            <p>Hello!</p>
            <p>Thank you for joining {_appName}! To complete your registration and start connecting with your campus community, please verify your email address:</p>
            
            <div style=""text-align: center; margin: 30px 0;"">
                <a href=""{verificationUrl}"" class=""verify-button"">Verify My Email</a>
            </div>
            
            <div class=""alternative-link"">
                <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
                <code>{verificationUrl}</code>
            </div>
            
            <div class=""welcome-info"">
                <h3>🎉 What's Next?</h3>
                <p>Once verified, you can start exploring events, connecting with associations, and customizing your profile!</p>
            </div>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
        
        <div class=""footer"">
            <p>This email was sent by {_appName}</p>
            <p>Need help? Contact us at <a href=""mailto:{_supportEmail}"">{_supportEmail}</a></p>
        </div>
    </div>
</body>
</html>";
        }

        public string GetWelcomeEmailTemplate(string username)
        {
            var loginUrl = $"{_frontendUrl}/login";
            var exploreUrl = $"{_frontendUrl}/events";
            
            return $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Welcome to {_appName}!</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }}
        .container {{
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            text-align: center;
            margin-bottom: 40px;
        }}
        .logo-container {{
            text-align: center;
            margin-bottom: 30px;
        }}
        .logo {{
            width: 100px;
            height: auto;
            margin: 0 auto;
        }}
        .brand-name {{
            font-size: 26px;
            font-weight: bold;
            background: linear-gradient(135deg, #a1cd40, #38c0c5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-top: 12px;
        }}
        h1 {{
            color: #1e293b;
            margin: 0 0 20px;
            font-size: 28px;
            font-weight: 700;
        }}
        .content {{
            margin-bottom: 40px;
        }}
        .cta-button {{
            display: inline-block;
            background: linear-gradient(135deg, #a1cd40, #38c0c5);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 10px;
            transition: transform 0.2s;
        }}
        .cta-button:hover {{
            transform: translateY(-2px);
        }}
        .cta-button.secondary {{
            background: #f1f5f9;
            color: #a1cd40;
            border: 2px solid #a1cd40;
        }}
        .features {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }}
        .feature {{
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }}
        .feature-icon {{
            font-size: 32px;
            margin-bottom: 10px;
        }}
        .footer {{
            text-align: center;
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
            padding-top: 30px;
            margin-top: 40px;
        }}
        @media (max-width: 600px) {{
            body {{ padding: 10px; }}
            .container {{ padding: 20px; }}
            h1 {{ font-size: 24px; }}
            .features {{ grid-template-columns: 1fr; }}
            .logo {{ width: 80px; }}
            .brand-name {{ font-size: 22px; }}
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <div class=""logo-container"">
                <svg class=""logo"" viewBox=""0 0 90.64 28.32"" xmlns=""http://www.w3.org/2000/svg"">
                    <defs>
                        <linearGradient id=""linear-gradient-welcome"" x1=""4.66"" y1=""8.27"" x2=""20.81"" y2=""24.07"" gradientUnits=""userSpaceOnUse"">
                            <stop offset=""0"" stop-color=""#a1cd40""/>
                            <stop offset="".18"" stop-color=""#93cb51""/>
                            <stop offset="".53"" stop-color=""#6ec67f""/>
                            <stop offset="".99"" stop-color=""#38c0c5""/>
                        </linearGradient>
                    </defs>
                    <g>
                        <path fill=""url(#linear-gradient-welcome)"" d=""m14.4,0C6.58,0,.24,6.34.24,14.16c0,2.07.45,4.02,1.25,5.79l-1.49,7.21,5.66-1.87c2.41,1.9,5.44,3.04,8.74,3.04,7.82,0,14.16-6.34,14.16-14.16S22.23,0,14.4,0Z""/>
                        <g>
                            <path fill=""#a1cd40"" d=""m36.17,5.71c.38-.69.91-1.23,1.59-1.61.68-.38,1.45-.58,2.31-.58,1.06,0,1.96.28,2.71.84s1.25,1.32,1.51,2.28h-2.38c-.18-.37-.43-.65-.75-.85-.33-.19-.69-.29-1.11-.29-.67,0-1.21.23-1.62.7-.41.46-.62,1.09-.62,1.86s.21,1.4.62,1.86c.41.46.95.7,1.62.7.41,0,.78-.1,1.11-.29s.58-.48.75-.85h2.38c-.25.96-.76,1.72-1.51,2.27s-1.66.83-2.71.83c-.86,0-1.63-.19-2.31-.58-.68-.38-1.21-.92-1.59-1.6-.38-.68-.57-1.47-.57-2.34s.19-1.66.57-2.35Z""/>
                            <path fill=""#a1cd40"" d=""m45.61,7.06c.27-.55.65-.97,1.12-1.27.47-.3,1-.44,1.58-.44.5,0,.94.1,1.31.3.38.2.67.47.87.8v-1h2.17v7.07h-2.17v-1c-.21.33-.51.6-.88.8-.38.2-.81.3-1.31.3-.57,0-1.1-.15-1.57-.45-.47-.3-.85-.73-1.12-1.28s-.41-1.19-.41-1.92.14-1.36.41-1.91Zm4.44.65c-.3-.31-.67-.47-1.1-.47s-.8.15-1.1.46c-.3.31-.45.73-.45,1.27s.15.97.45,1.29.67.48,1.1.48.8-.16,1.1-.47c.3-.31.45-.74.45-1.28s-.15-.97-.45-1.28Z""/>
                            <path fill=""#a1cd40"" d=""m65.35,6.17c.52.53.78,1.27.78,2.22v4.13h-2.15v-3.84c0-.46-.12-.81-.36-1.06s-.57-.37-.99-.37-.75.12-1,.37-.36.6-.36,1.06v3.84h-2.15v-3.84c0-.46-.12-.81-.36-1.06s-.57-.37-1-.37-.75.12-.99.37-.36.6-.36,1.06v3.84h-2.17v-7.07h2.17v.89c.22-.3.51-.53.86-.7.35-.17.76-.26,1.2-.26.53,0,1.01.11,1.43.34.42.23.75.55.98.98.25-.39.58-.71,1-.95s.88-.37,1.38-.37c.88,0,1.58.27,2.1.8Z""/>
                            <path fill=""#a1cd40"" d=""m70.69,5.65c.37-.2.81-.3,1.31-.3.58,0,1.11.15,1.58.44.47.3.85.72,1.12,1.27.27.55.41,1.19.41,1.91s-.14,1.37-.41,1.92c-.27.55-.65.98-1.12,1.28-.47.3-1,.45-1.58.45-.49,0-.92-.1-1.3-.3-.38-.2-.67-.46-.88-.79v4.36h-2.17V5.45h2.17v1c.21-.33.5-.6.87-.8Zm1.77,2.05c-.3-.31-.67-.46-1.11-.46s-.8.16-1.1.47c-.3.31-.45.74-.45,1.28s.15.97.45,1.28c.3.31.67.47,1.1.47s.8-.16,1.1-.48.46-.75.46-1.29-.15-.97-.45-1.27Z""/>
                            <path fill=""#a1cd40"" d=""m83.24,5.45v7.07h-2.17v-.96c-.22.31-.52.56-.89.75-.38.19-.79.29-1.25.29-.54,0-1.02-.12-1.43-.36-.41-.24-.74-.59-.96-1.05-.23-.46-.34-.99-.34-1.61v-4.13h2.15v3.84c0,.47.12.84.37,1.1s.57.39.99.39.76-.13,1-.39.37-.63.37-1.1v-3.84h2.17Z""/>
                            <path fill=""#a1cd40"" d=""m86.03,12.31c-.48-.21-.86-.5-1.14-.87s-.44-.78-.47-1.24h2.14c.03.25.14.44.34.6.2.15.45.23.75.23.27,0,.48-.05.63-.16.15-.11.22-.24.22-.41,0-.2-.11-.35-.32-.45-.21-.1-.55-.2-1.03-.32-.51-.12-.93-.24-1.27-.37s-.63-.34-.87-.62-.37-.67-.37-1.15c0-.41.11-.77.34-1.11.22-.33.55-.6.99-.79s.95-.29,1.55-.29c.89,0,1.59.22,2.1.66.51.44.8,1.02.88,1.75h-2c-.03-.24-.14-.44-.32-.58-.18-.14-.42-.22-.72-.22-.25,0-.45.05-.58.15-.14.1-.2.23-.2.4,0,.2.11.35.32.46.22.1.55.2,1.01.3.52.14.95.27,1.28.4s.62.34.87.63c.25.29.38.68.39,1.17,0,.41-.12.78-.35,1.11-.23.33-.57.58-1,.77-.44.19-.94.28-1.51.28-.62,0-1.17-.11-1.65-.32Z""/>
                        </g>
                        <g>
                            <path fill=""#38c0c5"" d=""m36.61,17.89c.38-.69.91-1.23,1.59-1.61.68-.38,1.45-.58,2.31-.58,1.06,0,1.96.28,2.71.84s1.25,1.32,1.51,2.28h-2.38c-.18-.37-.43-.65-.75-.85-.33-.19-.69-.29-1.11-.29-.67,0-1.21.23-1.62.7-.41.46-.62,1.09-.62,1.86s.21,1.4.62,1.86c.41.46.95.7,1.62.7.41,0,.78-.1,1.11-.29s.58-.48.75-.85h2.38c-.25.96-.76,1.72-1.51,2.27s-1.66.83-2.71.83c-.86,0-1.63-.19-2.31-.58-.68-.38-1.21-.92-1.59-1.6-.38-.68-.57-1.47-.57-2.34s.19-1.66.57-2.35Z""/>
                            <path fill=""#38c0c5"" d=""m47.42,24.36c-.55-.3-.99-.72-1.31-1.27s-.48-1.19-.48-1.93.16-1.37.48-1.92c.32-.55.76-.98,1.32-1.27.56-.3,1.18-.44,1.88-.44s1.32.15,1.88.44c.56.3,1,.72,1.32,1.27.32.55.48,1.19.48,1.92s-.16,1.37-.49,1.92-.77.98-1.33,1.27c-.56.3-1.19.44-1.88.44s-1.32-.15-1.87-.44Zm2.93-1.89c.29-.3.44-.74.44-1.31s-.14-1-.42-1.31c-.28-.3-.63-.46-1.05-.46s-.77.15-1.05.45-.42.74-.42,1.31.14,1,.41,1.31.62.46,1.03.46.77-.15,1.06-.46Z""/>
                            <path fill=""#38c0c5"" d=""m60.43,18.36c.49.54.74,1.27.74,2.21v4.13h-2.15v-3.84c0-.47-.12-.84-.37-1.1-.25-.26-.57-.39-.99-.39s-.74.13-.99.39-.37.63-.37,1.1v3.84h-2.17v-7.07h2.17v.94c.22-.31.52-.56.89-.74.37-.18.79-.27,1.25-.27.83,0,1.49.27,1.98.8Z""/>
                            <path fill=""#38c0c5"" d=""m68.97,18.36c.49.54.74,1.27.74,2.21v4.13h-2.15v-3.84c0-.47-.12-.84-.37-1.1-.25-.26-.57-.39-.99-.39s-.74.13-.99.39-.37.63-.37,1.1v3.84h-2.17v-7.07h2.17v.94c.22-.31.52-.56.89-.74.37-.18.79-.27,1.25-.27.83,0,1.49.27,1.98.8Z""/>
                            <path fill=""#38c0c5"" d=""m77.85,21.68h-4.9c.03.44.18.78.42,1.01.25.23.56.35.92.35.54,0,.92-.23,1.13-.68h2.31c-.12.46-.33.88-.64,1.25-.31.37-.69.66-1.16.87-.46.21-.98.32-1.56.32-.69,0-1.31-.15-1.85-.44-.54-.3-.96-.72-1.27-1.27s-.46-1.19-.46-1.93.15-1.38.45-1.93.72-.97,1.26-1.27c.54-.3,1.16-.44,1.86-.44s1.29.14,1.82.43c.53.29.95.7,1.25,1.23.3.53.45,1.15.45,1.86,0,.2-.01.41-.04.63Zm-2.18-1.2c0-.37-.13-.67-.38-.89-.25-.22-.57-.33-.95-.33s-.67.11-.92.32c-.25.21-.4.51-.46.9h2.71Z""/>
                            <path fill=""#38c0c5"" d=""m79.05,19.24c.3-.55.72-.97,1.25-1.27.54-.3,1.15-.44,1.84-.44.89,0,1.63.23,2.22.7.6.46.99,1.12,1.17,1.96h-2.31c-.19-.54-.57-.81-1.13-.81-.4,0-.71.15-.95.46-.24.31-.35.75-.35,1.32s.12,1.02.35,1.32c.24.31.55.46.95.46.56,0,.93-.27,1.13-.81h2.31c-.19.83-.58,1.48-1.18,1.95-.6.47-1.34.71-2.22.71-.69,0-1.31-.15-1.84-.44-.54-.3-.96-.72-1.25-1.27s-.45-1.19-.45-1.93.15-1.38.45-1.93Z""/>
                            <path fill=""#38c0c5"" d=""m90.64,22.86v1.84h-1.1c-.79,0-1.4-.19-1.84-.58-.44-.38-.66-1.01-.66-1.88v-2.81h-.86v-1.8h.86v-1.72h2.17v1.72h1.42v1.8h-1.42v2.84c0,.21.05.36.15.46.1.09.27.14.51.14h.77Z""/>
                        </g>
                        <path fill=""#141d28"" d=""m8.55,23.63c-.1,0-.19-.01-.29-.03-.52-.11-.93-.53-1.03-1.05-.05-.28-.02-.56.09-.81.48-1.08.72-2.33.72-3.81v-5.22l-3.31-1.5c-.34-.15-.55-.48-.55-.86,0-.37.21-.7.55-.86l8.34-3.8c.42-.19.87-.29,1.34-.29s.91.1,1.34.29l8.34,3.8c.34.15.55.48.55.86,0,.37-.21.7-.55.86l-2.53,1.15v5.72c0,.21-.12.4-.31.48l-5.68,2.48c-.21.1-.41.19-.61.2h-.02c-.05,0-.08,0-.11,0-.25-.04-.48-.15-.73-.26-.13-.06-.25-.11-.38-.16l-2.42-.91c-.28-.1-.44-.4-.35-.66.07-.21.27-.36.49-.36.06,0,.12.01.18.03.99.37,2.03.56,3.09.56,1.22,0,2.4-.25,3.52-.73,1.4-.61,2.31-2,2.31-3.53v-2.4l-4.78,2.18c-.42.19-.87.29-1.34.29s-.91-.1-1.34-.29l-4.01-1.82v4.83c0,1.14.24,2.35.76,3.83.05.14.08.29.08.44,0,.74-.6,1.35-1.35,1.35Z""/>
                    </g>
                </svg>
                <div class=""brand-name"">{_appName}</div>
            </div>
            <h1>Welcome to {_appName}!</h1>
        </div>
        
        <div class=""content"">
            <p>Hello {username},</p>
            <p>Welcome to {_appName}! We're thrilled to have you join our vibrant campus community platform. You're now part of a network that connects students, associations, and campus life like never before.</p>
            
            <div class=""features"">
                <div class=""feature"">
                    <div class=""feature-icon"">📅</div>
                    <h3>Discover Events</h3>
                    <p>Find exciting campus events, workshops, and activities happening around you.</p>
                </div>
                <div class=""feature"">
                    <div class=""feature-icon"">🏛️</div>
                    <h3>Connect with Associations</h3>
                    <p>Explore student organizations and find communities that match your interests.</p>
                </div>
                <div class=""feature"">
                    <div class=""feature-icon"">🤝</div>
                    <h3>Build Networks</h3>
                    <p>Connect with like-minded students and expand your campus network.</p>
                </div>
            </div>
            
            <div style=""text-align: center; margin: 30px 0;"">
                <a href=""{exploreUrl}"" class=""cta-button"">Start Exploring</a>
                <a href=""{loginUrl}"" class=""cta-button secondary"">Login to Your Account</a>
            </div>
            
            <p>Ready to dive in? Start by exploring upcoming events, discovering associations that match your interests, and connecting with your campus community!</p>
        </div>
        
        <div class=""footer"">
            <p>This email was sent by {_appName}</p>
            <p>Need help? Contact us at <a href=""mailto:{_supportEmail}"">{_supportEmail}</a></p>
        </div>
    </div>
</body>
</html>";
        }
    }
} 