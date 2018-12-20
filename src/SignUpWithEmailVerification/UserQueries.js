export const FETCH_USER_WITH_EMAIL_MOBILE = `
SELECT customer_id, email_id, user_id, name, mobile_no, photo_url, gender 
FROM tbcustomers
WHERE mobile_no =:mobile_no OR email_id =:email
`;

export  const FETCH_OTP_WITH_token= `
Select customer_id, email_id, user_id, name, mobile_no, photo_url, gender 
FROM tbcustomers
WHERE token =:token AND email_otp =:email_otp
`;

export  const FETCH_CUSTOMER_WITH_token= `
Select customer_id, email_id, user_id, name, mobile_no, photo_url, gender 
FROM tbcustomers
WHERE token =:token
`;