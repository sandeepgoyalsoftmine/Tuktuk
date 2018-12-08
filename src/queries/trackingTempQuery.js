export const  FETCH_PRESENT_EMPLOYEE = `
SELECT login_status, emailid, DATE_FORMAT(current_date, '%Y-%m-%d') AS date
FROM tbtemp
where date(created_on) = current_date()
`;

export const FETCH_ATTENDANCE = `
SELECT 'Absent' as login_status, emailid, DATE_FORMAT(current_date, '%Y-%m-%d') AS date, datetime
FROM tbtemp where date(created_on) <> current_date()
UNION
SELECT 'Present' as login_status, emailid, DATE_FORMAT(current_date, '%Y-%m-%d') AS date, datetime
FROM tbtemp where date(created_on) = current_date();
`;

export const FETCH_LOCATION = `
SELECT lat, lng, emailid, DATE_FORMAT(created_on, '%Y-%m-%d %H:%i:%s') AS created_on from tbtemp
WHERE emailid =:email
`;