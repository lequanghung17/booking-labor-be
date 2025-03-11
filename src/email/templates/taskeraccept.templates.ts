import { Tasker } from 'src/taskers/entities/tasker.entity';
import { Task } from 'src/tasks/entities/task.entity';

export const taskerAcceptTask = (
    task: Task,
    tasker: Tasker,
    viewTaskDetailsUrl: string

) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Accepted Notification</title>
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
                Thông Báo Tasker Đã Xác Nhận Công Việc
            </h1>

            <!-- Task Details -->
            <div style="background-color: #f8f9fa; border-radius: 5px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 10px;">${task.title}</h2>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                    ${task.description}
                </p>
            </div>

            <!-- Tasker Information -->
            <div style="background-color: #eef5fc; border-radius: 5px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 10px;">Thông Tin Tasker</h2>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                    <strong>Tên:</strong> ${tasker.user.profile.first_name} ${tasker.user.profile.last_name}<br>
                    <strong>Kinh nghiệm:</strong> ${tasker.experience}<br>
                    <strong>Công việc đã hoàn thành:</strong> ${tasker.completed_tasks}<br>
                    <strong>Xếp hạng trung bình:</strong> ${tasker.rating_sum / tasker.rating_count || 'Chưa có đánh giá'}<br>
    < strong > Kỹ năng: </strong> ${tasker.skills.map((skill) => skill.name).join(', ')}
        </p>
        </div>

        < !--Acceptance Notification-- >
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;" >
                Chúng tôi vui mừng thông báo rằng Tasker bạn đã chọn để thực hiện công việc này đã chấp nhận.Tasker sẽ
                sớm liên hệ với bạn để bắt đầu công việc.
            </p>

    < !--Action Buttons-- >
        <div style="text-align: center; margin: 30px 0;" >
            <a href="${viewTaskDetailsUrl}"
style = "background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-right: 10px;" >
    Xem Chi Tiết Công Việc
        </a>
        </div>

        < !--Footer -->
            <div
                style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;" >
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
