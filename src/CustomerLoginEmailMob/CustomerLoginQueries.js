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

export const FETCH_CUSTOMER_RIDE_HISTORY = `
SELECT id as ride_id,tbinvoice.source_lat, tbinvoice.source_lng, tbinvoice.destination_lat, tbinvoice.destination_lng, 
tb_ride_details.status, payment_method
, tbvehicle.make as Company, tbvehicle.model, tbvehicle.vehicle_number , tbinvoice.final_cost, tbinvoice.total_cost
, tbinvoice.discount, tbinvoice.source_address, tbinvoice.destination_address,tbinvoice.source_time,
tbinvoice.destination_time, tbusers.name, 
tbusers.driver_pic, tbusers.userid, '2' as Rating
FROM tb_ride_details
LEFT OUTER JOIN tbvehicle on tb_ride_details.driver_id = tbvehicle.assigned_driver_id
LEFT OUTER JOIN tbinvoice on tb_ride_details.id = tbinvoice.ride_id
LEFT OUTER JOIN tbusers on tb_ride_details.driver_id = tbusers.userid
where tb_ride_details.customer_id =:customer_id AND tb_ride_details.status between 2 AND 4
`;

export const FETCH_CALLER_DETAIL_BY_CALL_ID = `
SELECT call_id
FROM tb_ride_details
WHERE call_id = call_id
`;