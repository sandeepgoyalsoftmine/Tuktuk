export const FETCH_ALL_BANKS= `
SELECT bank_id, bank_name, short_name, DATE_FORMAT(created_on, '%Y-%m-%d') AS date 
FROM tbbank
`;

export const FETCH_BANK_BY_BANK_NAME = `
SELECT bank_id, bank_name, short_name, created_on 
FROM tbbank
WHERE bank_name =:bank_name
`;