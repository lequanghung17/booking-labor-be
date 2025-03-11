export const otpEmailTemplate = (otp: string, email: string) => `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f6f9fc;
      font-family: Arial, sans-serif;
    "
  >
    <div style="max-width: 600px; margin: 0 auto; padding: 20px">
      <div
        style="
          background-color: white;
          border-radius: 10px;
          padding: 40px;
          margin-top: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        "
      >
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 30px">
          <img src="https://res.cloudinary.com/dthbthntj/image/upload/v1734862405/favicon_ra5h2z.png" alt="Logo" style="max-width: 150px" />
        </div>

        <!-- Heading -->
        <h1
          style="
            color: #1a1a1a;
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
          "
        >
          Xác Thực OTP
        </h1>

        <!-- Main Content -->
        <p
          style="
            color: #4a4a4a;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            text-align: center;
          "
        >
          Xin chào, ${email || 'người dùng'}!<br />
          Mã OTP của bạn để hoàn tất quá trình đăng nhập hoặc xác minh tài khoản là:
        </p>

        <!-- OTP Code -->
        <div
          style="
            background-color: #f8f9fa;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #4caf50;
            margin: 20px 0;
          "
        >
          ${otp}
        </div>

        <!-- Note -->
        <p
          style="
            color: #4a4a4a;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            text-align: center;
          "
        >
          Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.
        </p>

        <!-- Help Section -->
        <p
          style="
            color: #4a4a4a;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            text-align: center;
          "
        >
          Nếu bạn không yêu cầu OTP này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi để được hỗ trợ.
        </p>

        <!-- Footer -->
        <div
          style="
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #666;
          "
        >
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
