export const FETCH_ATTENDANCE = `
SELECT login_status, emailid, DATE_FORMAT(current_date, '%Y-%m-%d') AS date
FROM tbtemp
`;