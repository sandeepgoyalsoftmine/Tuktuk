export const FETCH_CUSTOMER_DETAIL_BY_USERID = `
SELECT customer_id, email_id, user_id, name, mobile_no, photo_url, gender 
FROM tbcustomers
WHERE tbcustomers.user_id =:userID
`;