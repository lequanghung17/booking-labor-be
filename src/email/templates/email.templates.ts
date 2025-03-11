export const welcomeEmailTemplate = (username: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: white; border-radius: 10px; padding: 40px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://res.cloudinary.com/dthbthntj/image/upload/v1734862405/favicon_ra5h2z.png" alt="Logo" style="max-width: 150px;">
            </div>
            
            <!-- Heading -->
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; text-align: center;">
                Welcome to Our Platform!
            </h1>
            
            <!-- Welcome Message -->
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Hi ${username},
            </p>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                We're excited to have you on board! Your account has been successfully created and you're ready to start exploring all the features our platform has to offer.
            </p>
            
            <!-- Call to Action Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://booking-labor-fe.vercel.app/" 
                   style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Get Started
                </a>
            </div>
            
            <!-- Features List -->
            <div style="margin: 30px 0;">
                <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 15px;">What you can do now:</h2>
                <ul style="color: #4a4a4a; font-size: 16px; line-height: 1.6; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">Complete your profile</li>
                    <li style="margin-bottom: 10px;">Explore our features</li>
                    <li style="margin-bottom: 10px;">Connect with others</li>
                    <li style="margin-bottom: 10px;">Check out our tutorials</li>
                </ul>
            </div>
            
            <!-- Help Section -->
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Need help getting started? Our support team is always here to help!
            </p>
            
            <!-- Contact Support Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://booking-labor-fe.vercel.app/" 
                   style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Contact Support
                </a>
            </div>
            
            <!-- Social Media Links -->
            <div style="text-align: center; margin-top: 30px;">
                <a href="YOUR_FACEBOOK_URL" style="margin: 0 10px; text-decoration: none;">
                    <img src="FACEBOOK_ICON_URL" alt="Facebook" style="width: 24px;">
                </a>
                <a href="YOUR_TWITTER_URL" style="margin: 0 10px; text-decoration: none;">
                    <img src="TWITTER_ICON_URL" alt="Twitter" style="width: 24px;">
                </a>
                <a href="YOUR_LINKEDIN_URL" style="margin: 0 10px; text-decoration: none;">
                    <img src="LINKEDIN_ICON_URL" alt="LinkedIn" style="width: 24px;">
                </a>
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
                <p style="font-size: 14px; margin-bottom: 10px;">
                    © 2024 Booking Labor.
                </p>
                <p style="font-size: 12px;">
                    Cầu Giấy, Hà Nội, Việt Nam
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;
