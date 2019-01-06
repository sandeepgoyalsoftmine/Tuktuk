export const FETCH_RIDE_BY_RIDE_ID = `
SELECT id
from tb_ride_details
WHERE id=:ride_id 
`;