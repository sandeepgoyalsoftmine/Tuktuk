export const FETCH_RIDE_BY_RIDE_ID = `
SELECT id
from tb_ride_details
WHERE id=:ride_id 
`;

export const FETCH_ALL_TODAYS_RIDE = `
SELECT tbusers.name as driver_name, tbcustomers.name as customer_name,tb_ride_details.source_lat, tb_ride_details.source_long, tb_ride_details.destination_lat, 
tb_ride_details.destination_long, tb_ride_details.status, DATE_FORMAT(tb_ride_details.created_at, '%Y-%m-%d') AS date 
From tb_ride_details
LEFT OUTER JOIN tbcustomers on tb_ride_details.customer_id = tbcustomers.customer_id
LEFT OUTER JOIN tbusers on tb_ride_details.driver_id = tbusers.userid
WHERE Date(tb_ride_details.created_at) = curdate();
`;