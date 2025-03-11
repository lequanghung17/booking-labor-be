import { Task } from "src/tasks/entities/task.entity";
import { User } from "src/users/entities/user.entity";

export const userReviewTasker = (
    user: User,
    task: Task,
    platformUrl: string
) => {
    const queryParams = new URLSearchParams({
        taskId: task.id.toString(),
        title: task.title,
        district: task.district,
        ward: task.ward,
        detail_address: task.detail_address,
        start_date: new Date(task.start_date).toISOString(),
        end_date: new Date(task.end_date).toISOString(),
        fee_per_hour: task.fee_per_hour.toString(),
        estimated_duration: task.estimated_duration.toString(),
        description: task.description
    }).toString();

    return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông Báo Đánh Giá Công Việc</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div
            style="background-color: white; border-radius: 10px; padding: 40px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://res.cloudinary.com/dthbthntj/image/upload/v1734862405/favicon_ra5h2z.png" alt="Logo"
                    style="max-width: 150px;">
            </div>

            <!-- Heading -->
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px; text-align: center;">
                Công Việc Của Bạn Đã Được Đánh Giá
            </h1>

            <!-- Notification -->
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
                Người dùng <strong>${user.profile.first_name} ${user.profile.last_name}</strong> đã hoàn tất việc đánh
                giá công việc của bạn.
                Vui lòng nhấn vào nút bên dưới để xem chi tiết review.
            </p>

            <!-- Task Details -->
            <div style="background-color: #f8f9fa; border-radius: 5px; padding: 20px; margin: 20px 0;">
                <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 10px;">${task.title}</h2>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                    ${task.description}
                </p>
            </div>

            <!-- Button to view review -->
            <div style="text-align: center; margin-top: 30px;">
                <a href="${platformUrl + queryParams}"
                    style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                    Xem Đánh Giá
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
}
