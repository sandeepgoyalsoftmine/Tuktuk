export const FETCH_USER_DETAIL = `
  SELECT u.userid, u.name, u.emailID  FROM tbuser AS u
  WHERE u.userid =:userID
`;

export const FETCH_USER_BY_USERID = ` Select u.userid, u.emailid from tbusers As u
    WHERE u.userid =:userID
`;

export const FETCH_USER_BY_TOKEN = `
    Select u.userid, u.emailid, u.in_time, u.out_time, u.status from tbusers As u
    WHERE u.token =:token
`;

export const CHECK_LOGIN = `    Select userid, emailid, password, user_type from tbusers where emailid =:userid and user_type = :usertype
`;

export const FETCH_ALL_USER = ` Select userid, name, emailid, gender, dob, mobile_no from tbusers
`;

export const FETCH_USER_BY_EMAIL = 'Select emailid, password, user_type from tbusers where emailid = :email';

export const FETCH_LOGIN_DETAILS = `
SELECT emailid, DATE_FORMAT(current_date, '%Y-%m-%d') AS date, in_time, out_time  FROM tuktuk.tbloginhistory where Date(in_time) = current_date() OR Date(out_time) = curdate()
order by emailid, loginhistory_id ;
`;
