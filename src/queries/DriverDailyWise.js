export const FETCH_DAILY_WISE_ID_BY_DRIVER_ID_AND_TODAY_DATE = `
SELECT daily_wise_id, distance, cash_amount, paytm_amount, number_of_rides, number_mins_on_ride, number_of_mins_on 
FROM tbdriverdailywise
Where driver_id =:driver_id AND Date(created_on) = current_date()
`;