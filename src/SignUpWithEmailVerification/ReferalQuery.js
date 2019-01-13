export const FETCH_COUNT_BY_CUSTOMER_ID = `
SELECT COUNT(refferedby) from tbrefferalhistory
WHERE refferedby =:refferedby AND status='Activate'
`;