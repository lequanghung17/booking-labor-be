import { Task } from "src/tasks/entities/task.entity";


export const taskForTasker = (
    task: Task,
    url: string,
    applyUrl: string,

) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Task Notification</title>
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
                Có Công Việc Gần Khu Vực Của Bạn
            </h1>

            <!-- Task Details -->
            <div style="
                                    background-color: #f8f9fa;
                                    border-radius: 5px;
                                    padding: 20px;
                                    margin: 20px 0;
                                ">
                <h2 style="color: #1a1a1a; font-size: 18px; margin-bottom: 15px">
                    Chi tiết công việc:
                </h2>
                <p style="color: #4a4a4a; margin: 5px 0;">Tiêu đề: ${task.title}</p>
                <p style="color: #4a4a4a; margin: 5px 0;">Mô tả: ${task.description}</p>
            </div>

            <!-- View Details Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${url}"
                    style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Xem Chi Tiết Công Việc
                </a>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${applyUrl}"
                    style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-right: 10px;">
                    Đăng Ký Ngay
                </a>
               
            </div>

            <!-- Tasker Information -->


            <!-- Footer -->
            <div
                style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
                <p style="font-size: 14px; margin-bottom: 10px;">
                    © 2024 Booking Labor. Bảo Lưu Mọi Quyền.
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