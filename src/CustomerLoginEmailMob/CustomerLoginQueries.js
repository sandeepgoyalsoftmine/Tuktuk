export  const FETCH_CUSTOMER_DETAIL_BY_ID = `
SELECT customer_id, user_id, email_id, name, password, mobile_no 
FROM tbcustomers
WHERE email_id =:id OR mobile_no =:id
`;

export const FETCH_CUSTOMER_BY_TOKEN = `
SELECT customer_id, user_id, email_id, name, mobile_no, photo_url, gender, mobile_verified, email_verified
FROM tbcustomers
WHERE token =:token
`;