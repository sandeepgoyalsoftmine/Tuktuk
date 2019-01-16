export const FETCH_USER_DETAIL = `
  SELECT u.userid, u.name, u.emailID, driver_assigned  FROM tbuser AS u
  WHERE u.userid =:userID
`;

export const FETCH_DRIVERS_ID = `
SELECT userid from tbusers where user_type = 2
`;

export const FETCH_USER_BY_USERID = ` Select tbusers.userid, tbusers.name, tbusers.emailid, tbusers.gender,driving_licence_number, pan_card_number,
certificate_of_registration_number, motor_insurence_number, police_verification_number, aadhar_card_number,  
 tbusers.dob, tbusers.mobile_no, user_type, city, DATE_FORMAT(tbusers.created_on, '%Y-%m-%d %H:%i:%s') AS created_on,
 tbusers.vehicle_type, tbusers.status, tbusers.driver_assigned, password
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
Select u.userid, u.emailid, u.driver_duty_status,DATE_FORMAT(in_time, '%Y-%m-%d %H:%i:%s') AS in_time ,DATE_FORMAT(out_time, '%Y-%m-%d %H:%i:%s') AS out_time  from tbusers As u
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

export const FETCH_DRIVERS = `Select tbusers.userid,concat(tbusers.name ,' (',tbusers.mobile_no,')') as details, tbusers.name, tbusers.emailid, tbusers.gender, tbusers.status, driver_assigned,
 tbusers.dob, tbusers.mobile_no, tbuser_type.user_type, tbvehicletypes.vehicle_type, DATE_FORMAT(tbusers.created_on, '%Y-%m-%d') AS created_on
FROM tbusers
LEFT OUTER JOIN tbuser_type on tbusers.user_type = tbuser_type.type_id
LEFT OUTER JOIN tbvehicletypes on tbusers.vehicle_type = tbvehicletypes.vehicle_id
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
Select userid, name, emailid, gender, dob, mobile_no, driver_assigned, tbvehicletypes.vehicle_type
from tbusers
LEFT OUTER JOIN tbvehicletypes on tbusers.vehicle_type = tbvehicletypes.vehicle_id
where token =:token
`;

export const FETCH_UNASSIGNED_DRIVERS = `
SELECT tbusers.userid, concat(tbusers.name ,' (',tbusers.mobile_no,')') as name, emailid from tbusers where user_type = 2 AND driver_assigned = 0
`;

export const FETCH_ATTENDANCE_DETAILS_BY_TOKEN = `
    Select u.userid, u.emailid, u.in_time, u.out_time, u.login_status from tbusers As u
    WHERE u.token =:token
`;

export const fetchUserIDByMobileNumber = `
SELECT userid
FROM tbusers
WHERE mobile_no =:mobile_no
`;

export const fetchUserMobileNumberByIDANdStatus = `
SELECT customer_id, id 
FROM tb_ride_details 
where driver_id =:driver_id and status =:status  ;
`;

export const FETCH_MOBILE_NO_BY_USER_ID = `
SELECT mobile_no
FROM tbusers
WHERE userid =:userid`;

export const FETCH_DRIVER_RIDE_HISTORY = `
SELECT id as ride_id,tbinvoice.source_lat, tbinvoice.source_lng, tbinvoice.destination_lat, tbinvoice.destination_lng, 
tb_ride_details.status, created_at, tbvehicle.make as Company, tbvehicle.model, tbvehicle.vehicle_number, 
tbinvoice.source_address, tbinvoice.destination_address,tbinvoice.source_time, tbinvoice.destination_time, 
tbcustomers.name ,tb_ride_details.customer_rating as Rating, extra_charges, gst
FROM tb_ride_details
LEFT OUTER JOIN tbvehicle on tb_ride_details.driver_id = tbvehicle.assigned_driver_id
LEFT OUTER JOIN tbinvoice on tb_ride_details.id = tbinvoice.ride_id
LEFT OUTER JOIN tbcustomers on tb_ride_details.customer_id = tbcustomers.customer_id
where tb_ride_details.driver_id =:userid AND tb_ride_details.status between 2 AND 4
ORDER BY tb_ride_details.created_at desc
`;
