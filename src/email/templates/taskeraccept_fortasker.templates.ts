import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';

export const sendUserProfileForTasker = (
    task: Task,
    user: User,
    viewTaskDetailsUrl: string

) =>
    `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Contact Information</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div
            style="background-color: white; border-radius: 10px; padding: 40px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://res.cloudinary.com/dthbthntj/image/upload/v1734862405/favicon_ra5h2z.png" alt="Logo" style="max-width: 150px;">
            </div>

            <!-- Heading -->
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; text-align: center;">
                Bạn đã nhận công việc thành công
            </h1>

            <!-- Task Details -->
            <div style="background-color: #f8f9fa; border-radius: 5px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 10px;">${task.title}</h2>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                    ${task.description}
                </p>
            </div>

            <!-- User Information -->
            <div style="background-color: #eef5fc; border-radius: 5px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 10px;">Thông Tin Người Tạo Task</h2>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                    <strong>Tên:</strong> ${user.profile.first_name} ${user.profile.last_name}<br>
                    <strong>Số điện thoại:</strong> ${user.profile.phone_number}<br>
                    <strong>Email:</strong> ${user.email}<br>
                </p>
            </div>

            <!-- Notification -->
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
                Vui lòng sử dụng thông tin trên để liên hệ với người dùng và bắt đầu công việc. Chúng tôi khuyến khích
                bạn
                liên lạc sớm nhất có thể để đảm bảo tiến độ công việc.
            </p>

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${viewTaskDetailsUrl}"
                    style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-right: 10px;">
                    Xem Chi Tiết Công Việc
                </a>
               
            </div>

            <!-- Footer -->
            <div
                style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
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
