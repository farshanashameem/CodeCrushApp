import { SubscriptionExpiryReminderDTO } from '@/Application/Cron/dto/SubscriptionReminder.dto';

export const SubscriptionExpiryReminderTemplate = (
    dto: SubscriptionExpiryReminderDTO
): string => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Subscription Reminder</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#eef4ff;
    font-family:Arial,Helvetica,sans-serif;
">

<div style="
    max-width:700px;
    margin:40px auto;
    background:#ffffff;
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 10px 30px rgba(0,0,0,.12);
">

    <div style="
        background:linear-gradient(135deg,#4f46e5,#06b6d4);
        color:white;
        text-align:center;
        padding:40px;
    ">
        <h1 style="margin:0;font-size:34px;">
            🎮 CodeCrush
        </h1>

        <p style="margin-top:12px;font-size:18px;">
            Subscription Reminder
        </p>
    </div>

    <div style="padding:35px;">

        <h2 style="color:#111827;">
            Hello ${dto.parentName}! 👋
        </h2>

        <p style="
            color:#4b5563;
            line-height:1.8;
            font-size:15px;
        ">
            We hope your child has been enjoying learning with
            <strong>CodeCrush Premium</strong>.
        </p>

        <div style="
            background:#fff7ed;
            border-left:6px solid #f59e0b;
            padding:20px;
            border-radius:12px;
            margin:25px 0;
        ">
            <h3 style="margin-top:0;">
                ⏰ Subscription Expiring Soon
            </h3>

            <p style="margin:10px 0;">
                Your Premium subscription will expire on
                <strong>${dto.expiryDate.toDateString()}</strong>.
            </p>

            <p style="margin:10px 0;">
                Renew your subscription to continue enjoying:
            </p>

            <ul style="line-height:1.8;">
                <li>📊 Weekly Progress Reports</li>
                <li>🎮 Premium Learning Games</li>
                <li>🚀 Uninterrupted Access</li>
                <li>⭐ Future Premium Features</li>
            </ul>
        </div>

        <p style="
            color:#4b5563;
            line-height:1.8;
        ">
            Renew before your subscription expires to ensure your child
            continues learning without interruption.
        </p>

    </div>

    <div style="
        background:#111827;
        color:#d1d5db;
        text-align:center;
        padding:24px;
        font-size:14px;
    ">
        <strong style="color:white;">
            Thank you for choosing CodeCrush ❤️
        </strong>

        <br><br>

        Keep learning. Keep playing. Keep growing. 🚀
    </div>

</div>

</body>
</html>
`;