export const FETCH_ALL_DISCOUNTS = `
SELECT discount_id, discount_ride_km, status, DATE_FORMAT(created_on, '%Y-%m-%d') AS date 
FROM tbdiscount
`;

export const FETCH_DISCOUNT_BY_KM = `
SELECT discount_id, discount_ride_km, status 
FROM tbdiscount
WHERE discount_ride_km =:km
`;

export const FETCH_DISCOUNT_BY_DISCOUNT_ID = `
SELECT discount_id, discount_ride_km, status 
FROM tbdiscount
WHERE discount_id =:discount_id
`;

export const DEACTIVATE_ALL_EXCEPT_DISCOUNT_ID = `
UPDATE tbdiscount
set status = 'Deactivate' where discount_id <>:discount_id
`

export const FETCH_ACTIVE_DISCOUNT = `
SELECT discount_id
FROM tbdiscount
WHERE status = 'Activate'
`;