
export const OTPMailTemplate = (otp: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodeCrush - OTP Verification</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f7fb;
    font-family: Arial, Helvetica, sans-serif;
">

    <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color: #f4f7fb; padding: 40px 15px;">
        <tr>
            <td align="center">

                <!-- Main Card -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="
                        max-width: 520px;
                        background-color: #ffffff;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
                    ">

                    <!-- Header -->
                    <tr>
                        <td align="center"
                            style="
                                background-color: #6366f1;
                                padding: 30px 20px;
                            ">

                            <h1 style="
                                margin: 0;
                                color: #ffffff;
                                font-size: 30px;
                                font-weight: 700;
                            ">
                                CodeCrush 🎮
                            </h1>

                            <p style="
                                margin: 8px 0 0;
                                color: #e0e7ff;
                                font-size: 14px;
                            ">
                                Learn. Play. Crush.
                            </p>

                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 35px;">

                            <h2 style="
                                margin: 0 0 15px;
                                color: #1f2937;
                                font-size: 24px;
                                text-align: center;
                            ">
                                Verify Your Email
                            </h2>

                            <p style="
                                margin: 0 0 25px;
                                color: #6b7280;
                                font-size: 15px;
                                line-height: 1.6;
                                text-align: center;
                            ">
                                Use the verification code below to complete
                                your CodeCrush verification.
                            </p>

                            <!-- OTP Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center"
                                        style="
                                            background-color: #eef2ff;
                                            border: 2px dashed #6366f1;
                                            border-radius: 12px;
                                            padding: 20px;
                                        ">

                                        <p style="
                                            margin: 0 0 8px;
                                            color: #6b7280;
                                            font-size: 12px;
                                            text-transform: uppercase;
                                            letter-spacing: 1.5px;
                                        ">
                                            Your OTP
                                        </p>

                                        <div style="
                                            color: #4338ca;
                                            font-size: 36px;
                                            font-weight: 700;
                                            letter-spacing: 8px;
                                        ">
                                            ${otp} 
                                        </div>

                                    </td>
                                </tr>
                            </table>

                            <p style="
                                margin: 25px 0 0;
                                color: #6b7280;
                                font-size: 14px;
                                line-height: 1.6;
                                text-align: center;
                            ">
                                ⏱️ This OTP is valid for a limited time.
                                Please do not share this code with anyone.
                            </p>

                            <hr style="
                                border: none;
                                border-top: 1px solid #e5e7eb;
                                margin: 30px 0;
                            " />

                            <p style="
                                margin: 0;
                                color: #9ca3af;
                                font-size: 12px;
                                line-height: 1.5;
                                text-align: center;
                            ">
                                If you did not request this verification code,
                                you can safely ignore this email.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center"
                            style="
                                background-color: #f9fafb;
                                padding: 20px;
                            ">

                            <p style="
                                margin: 0;
                                color: #9ca3af;
                                font-size: 12px;
                            ">
                                © ${new Date().getFullYear()} CodeCrush
                            </p>

                            <p style="
                                margin: 6px 0 0;
                                color: #9ca3af;
                                font-size: 11px;
                            ">
                                This is an automated email. Please do not reply.
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`;

