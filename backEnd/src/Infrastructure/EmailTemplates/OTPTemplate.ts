export const OTPMailTemplate = (otp: string )=> `<!DOCTYPE html>
<html lang= "eng>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>OTP Verification</title>
</head>
<body>
<p>your otp is: ${otp}</p>
</body>
</html>
`;