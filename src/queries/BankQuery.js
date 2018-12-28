export  const FETCH_BANK_DETAILS_WITH_DRIVER = `
SELECT bankid,bank_name, account_holder, account, ifsc_code, DATE_FORMAT(tbbank.created_on, '%Y-%m-%d') AS date 
, tbusers.name, tbusers.emailid
FROM tbbank
LEFT OUTER JOIN tbusers on tbbank.driver_id = tbusers.userid
`;