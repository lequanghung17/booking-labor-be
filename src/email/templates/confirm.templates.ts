import { User } from 'src/users/entities/user.entity';

export const confirmEmailTemplate = (url: string, user: User) => `
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
                    Xác nhận thanh toán
                </h1>
                <p
                    style="
                        color: #4a4a4a;
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 25px;
                        text-align: center;
                    "
                >
                    Người dùng ${user.profile.first_name + ' ' + user.profile.last_name} đã chuyển khoản cho bạn. Vui lòng xác nhận
                </p>

                <!-- Confirmation Button -->
                <div style="text-align: center; margin: 30px 0">
                    <a
                        href="${url}"
                        style="
                            background-color: #4caf50;
                            color: white;
                            padding: 12px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            display: inline-block;
                        "
                    >
                        Xác nhận đã chuyển khoản
                    </a>
                </div>

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
                    Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email hoặc
                    hotline.
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
