export const FETCH_USER_DETAIL = `
  SELECT u.userid, u.name, u.emailID, driver_assigned  FROM tbuser AS u
  WHERE u.userid =:userID
`;

export const FETCH_USER_BY_USERID = ` Select tbusers.userid, tbusers.name, tbusers.emailid, tbusers.gender,driving_licence_number, pan_card_number,
certificate_of_registration_number, motor_insurence_number, police_verification_number, aadhar_card_number,  
 tbusers.dob, tbusers.mobile_no, user_type, city, DATE_FORMAT(tbusers.created_on, '%Y-%m-%d %H:%i:%s') AS created_on,
 tbusers.vehicle_type, tbusers.status, tbusers.driver_assigned
FROM tbusers
WHERE tbusers.userid =:userID
`;

export const FETCH_DRIVER_DOCUMENTS_TOKEN = `Select tbusers.userid, tbusers.name, ifnull(driving_licence_front,'') as driving_licence_front ,ifnull(pancard,'') as pancard ,
ifnull(registration_certificate, '') as registration_certificate,ifnull(motor_insurence,'') as motor_insurence, 
ifnull(police_verification,'') as police_verification, ifnull(adhar_card,'') as adhar_card
FROM tbusers
WHERE tbusers.token =:token
`;

export const FETCH_USER_DOCUMENT_BY_USERID = `
Select userid,user_type, driver_pic, driving_licence_front, pancard, registration_certificate, motor_insurence,
police_verification, adhar_card
FROM tbusers
WHERE tbusers.userid =:userID
`;

export const FETCH_USER_BY_TOKEN = `
    Select u.userid, u.emailid, u.in_time, u.out_time, u.login_status from tbusers As u
    WHERE u.token =:token
`;

export const FETCH_DRIVER_BY_TOKEN = `
Select u.userid, u.emailid, u.driver_duty_status from tbusers As u
    WHERE u.token =:token AND user_type = 2
`;

export const FETCH_USERSTATUS_BY_TOKEN = `
SELECT status from tbusers where token =:token`;



export const CHECK_LOGIN = `    Select userid, emailid, password, user_type from tbusers where emailid =:userid and user_type = :usertype
`;

export const FETCH_ALL_USER = ` Select userid, name, emailid, gender, dob, mobile_no from tbusers where user_type = 3
`;

export  const  FETCH_ALL_EMPLOYEES = `
Select tbusers.userid, tbusers.name, tbusers.emailid, tbusers.gender,  
 tbusers.dob, tbusers.mobile_no, tbuser_type.user_type, DATE_FORMAT(tbusers.created_on, '%Y-%m-%d %H:%i:%s') AS created_on
FROM tbusers
LEFT OUTER JOIN tbuser_type on tbusers.user_type = tbuser_type.type_id
 Where tbusers.user_type = 3
 order by tbusers.created_on desc
`;

export const FETCH_DRIVERS = `Select tbusers.userid, tbusers.name, tbusers.emailid, tbusers.gender, tbusers.status, driver_assigned,
 tbusers.dob, tbusers.mobile_no, tbuser_type.user_type, DATE_FORMAT(tbusers.created_on, '%Y-%m-%d %H:%i:%s') AS created_on
FROM tbusers
LEFT OUTER JOIN tbuser_type on tbusers.user_type = tbuser_type.type_id
 Where tbusers.user_type = 2
 order by tbusers.created_on desc
`;
export const FETCH_DRIVERS_LIST = `Select tbusers.userid, tbusers.name, tbusers.emailid, tbusers.mobile_no
FROM tbusers
 Where tbusers.user_type = 2
`;

export const FETCH_USER_BY_EMAIL = 'Select userid, emailid, password, user_type from tbusers where emailid = :email';

export const FETCH_LOGIN_DETAILS = `
SELECT emailid, DATE_FORMAT(current_date, '%Y-%m-%d') AS date, in_time, out_time  FROM tuktuk.tbloginhistory where Date(in_time) = current_date() OR Date(out_time) = curdate()
order by emailid, loginhistory_id ;
`;

export const FETCH_USER_BY_EMAIL_AND_USERID = `
Select userid, name, emailid, gender, dob, mobile_no from tbusers where emailid = :emailid' AND  tbusers.userid =:userID
`;


export const FETCH_USER_DETAILS_BY_TOKEN = `
Select userid, name, emailid, gender, dob, mobile_no, driver_assigned from tbusers where token =:token
`;

export const FETCH_UNASSIGNED_DRIVERS = `
SELECT userid, name, emailid from tbusers where user_type = 2 AND driver_assigned = 0
`;

export const FETCH_ATTENDANCE_DETAILS_BY_TOKEN = `
    Select u.userid, u.emailid, u.in_time, u.out_time, u.login_status from tbusers As u
    WHERE u.token =:token
`;
