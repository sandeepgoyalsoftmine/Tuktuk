export const FETCH_RIDE_DETAILS_BY_RIDE_ID = `
SELECT customer_id, driver_id, date_format(ride_start_time,'%Y-%m-%d %H:%i:%s') as ride_start_time,
date_format(ride_completed_time,'%Y-%m-%d %H:%i:%s') as ride_completed_time, source_lat, source_long, 
destination_lat, destination_long 
FROM tb_ride_details
WHERE id =:ride_id
`;