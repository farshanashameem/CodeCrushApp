import { SubscriptionExpiredNotificationDTO } from "@/Application/Cron/dto/SubscriptionReminder.dto";

export const SubscriptionExpiredTemplate = (
    dto: SubscriptionExpiredNotificationDTO
): string => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Subscription Expired</title>
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
        background:linear-gradient(135deg,#dc2626,#f97316);
        color:white;
        text-align:center;
        padding:40px;
    ">
        <h1 style="margin:0;font-size:34px;">
            🎮 CodeCrush
        </h1>

        <p style="margin-top:12px;font-size:18px;">
            Premium Subscription Expired
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
            We wanted to let you know that your
            <strong>CodeCrush Premium</strong> subscription expired on
            <strong>${dto.expiredDate.toDateString()}</strong>.
        </p>

        <div style="
            background:#fef2f2;
            border-left:6px solid #dc2626;
            padding:20px;
            border-radius:12px;
            margin:25px 0;
        ">
            <h3 style="margin-top:0;color:#b91c1c;">
                ❌ Premium Access Ended
            </h3>

            <p style="margin:10px 0;">
                Your premium benefits are no longer available.
            </p>

            <p style="margin:10px 0;">
                This includes:
            </p>

            <ul style="line-height:1.8;">
                <li>📊 Weekly Progress Reports</li>
                <li>🎮 Premium Learning Games</li>
                <li>⭐ Premium Features</li>
                <li>🚀 Early Access to New Content</li>
            </ul>
        </div>

        <div style="
            background:#eff6ff;
            border-left:6px solid #2563eb;
            padding:20px;
            border-radius:12px;
            margin:25px 0;
        ">
            <h3 style="margin-top:0;">
                🔄 Renew Anytime
            </h3>

            <p style="margin:10px 0;">
                Renew your subscription to restore all premium features and continue your child's learning journey without interruption.
            </p>
        </div>

        <p style="
            color:#4b5563;
            line-height:1.8;
        ">
            Thank you for being part of the CodeCrush family. We hope to welcome you back to Premium soon!
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