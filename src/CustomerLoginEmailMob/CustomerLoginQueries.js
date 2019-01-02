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

export const FETCH_CUSTOMER_ID_BY_MOBILE_NUMBER = `
SELECT customer_id 
FROM tbcustomers
WHERE mobile_no =:mobile_no
`;

export const FETCH_RIDE_ID_FROM_RIDE_DETAILS_BY_CUSTOMER_ID = `
SELECT driver_id, id 
FROM tb_ride_details 
where customer_id =:customer_id and status =:status  ;

`;

export const FETCH_MOBILE_NO_BY_CUSTOMER_ID = `
SELECT mobile_no 
FROM tbcustomers
WHERE customer_id =:customer_id
`;