export const FETCH_ALL_DISCOUNTS = `
SELECT discount_id, discount_ride_km, status, DATE_FORMAT(created_on, '%Y-%m-%d') AS date 
FROM tbdiscount
`;

export const FETCH_DISCOUNT_BY_KM = `
SELECT discount_id, discount_ride_km, status 
FROM tbdiscount
WHERE discount_ride_km =:km
`;