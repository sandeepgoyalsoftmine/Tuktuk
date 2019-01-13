export const FETCH_RIDE_DETAILS_BY_RIDE_ID = `
SELECT customer_id, driver_id, date_format(convert_tz(ride_start_time, '+0:00', '+05:30'),'%Y-%m-%d %H:%i:%s') as ride_start_time,
date_format(convert_tz(ride_completed_time,'+0:00', '+05:30' ),'%Y-%m-%d %H:%i:%s') as ride_completed_time, source_lat, source_long, 
destination_lat, destination_long, tb_ride_details.status, tbusers.vehicle_type  
FROM tb_ride_details
LEFT OUTER JOIN tbusers on tb_ride_details.driver_id = tbusers.userid
WHERE id =:ride_id
`;

export const FETCH_INVOICE_BY_RIDE_ID = `
SELECT final_cost, distance, total_minutes, distance_cost, cost_per_km, cost_per_minute, time_cost, gst, base_fare 
FROM tbinvoice where ride_id =:ride_id
`;