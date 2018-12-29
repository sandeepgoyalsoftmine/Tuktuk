export  const FETCH_BANK_DETAILS_WITH_DRIVER = `
SELECT bankid,bank_name, account_holder, account, ifsc_code, DATE_FORMAT(tbbank.created_on, '%Y-%m-%d') AS date 
, tbusers.name, tbusers.emailid
FROM tbcustomerbank
LEFT OUTER JOIN tbusers on tbbank.driver_id = tbusers.userid
`;

export const FETCH_BANK_DETAILS_BY_BANK_ID = `
SELECT bankid,bank_name, account_holder, account, ifsc_code, DATE_FORMAT(tbcustomerbank.created_on, '%Y-%m-%d') AS date 
, tbusers.name, tbusers.emailid, tbusers.mobile_no
FROM tbbank
LEFT OUTER JOIN tbusers on tbcustomerbank.driver_id = tbusers.userid
where bankid =:bank_id
`;