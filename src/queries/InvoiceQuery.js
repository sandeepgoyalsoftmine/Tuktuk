export const FETCH_RIDE_DETAILS_BY_RIDE_ID = `
SELECT customer_id, driver_id, ride_start_time,ride_completed_time 
FROM tb_ride_details
WHERE id =:ride_id
`;