export const FETCH_COUNT_BY_CUSTOMER_ID = `
SELECT COUNT(refferedby) from tbrefferalhistory
WHERE refferedby =:refferedby AND refferal_status='Activate'
`;

export  const FETCH_REFERED_BY_CUSTOMER_ID = `
SELECT refferal_history_id,refferedby from tbrefferalhistory
WHERE (refferedby =:refferedby OR reffered =:refferedby) AND refferal_status='Activate'
`;