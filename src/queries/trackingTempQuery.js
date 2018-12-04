export const FETCH_ATTENDANCE = `
SELECT login_status, emailid, DATE_FORMAT(current_date, '%Y-%m-%d') AS date
FROM tbtemp
`;

export const FETCH_LOCATION = `
SELECT lat, lng, emailid, DATE_FORMAT(created_on, '%Y-%m-%d %H:%i:%s') AS created_on from tbtemp
WHERE emailid =:email
`;