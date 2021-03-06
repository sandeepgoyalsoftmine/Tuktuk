export const FETCH_CUSTOMER_DETAIL_BY_USERID = `
SELECT customer_id, email_id, user_id, name, mobile_no, photo_url, gender 
FROM tbcustomers
WHERE tbcustomers.user_id =:userID OR email_id =:email
`;

export const FETCH_CUSTOMER_DETAIL_BY_CUSTOMERID = `
SELECT customer_id, email_id, user_id, name, mobile_no, photo_url, gender 
FROM tbcustomers
WHERE tbcustomers.customer_id =:customer_id
`;

export const FETCH_ALL_CUSTOMERS = `
SELECT customer_id, email_id, name, mobile_no, gender 
FROM tbcustomers order by created_on desc
`;