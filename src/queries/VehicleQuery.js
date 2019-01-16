export const FETCH_ALL_VEHICLE = `
SELECT tbvehicle.vehicle_id, tbvehicletypes.vehicle_type, make, model, vehicle_number, rc_no, permit_no, insurance_no, 
DATE_FORMAT(tbvehicle.created_on, '%Y-%m-%d %H:%i:%s') AS created_on, tbvehicle.status, tbusers.name,tbusers.mobile_no
FROM tbvehicle
LEFT OUTER JOIN tbvehicletypes on tbvehicle.vehicle_type = tbvehicletypes.vehicle_id
LEFT OUTER JOIN tbusers on tbvehicle.assigned_driver_id = tbusers.userid
`;

export const FETCH_VEHICLE_DETAILS_BY_USER_ID = `
SELECT tbvehicle.vehicle_id, tbvehicletypes.vehicle_type, make, model, vehicle_number, rc_no, permit_no, insurance_no, 
DATE_FORMAT(tbvehicle.created_on, '%Y-%m-%d %H:%i:%s') AS created_on, tbvehicle.status
FROM tbvehicle
LEFT OUTER JOIN tbvehicletypes on tbvehicle.vehicle_type = tbvehicletypes.vehicle_id
WHERE assigned_driver_id =:userid
`;

export const FETCH_VEHICLE_DETAILS_BY_VEHICLE_ID = `
SELECT tbusers.name, tbvehicle.vehicle_id, tbvehicle.vehicle_type, make, model, vehicle_number, rc_no, permit_no, insurance_no, 
DATE_FORMAT(tbvehicle.created_on, '%Y-%m-%d %H:%i:%s') AS created_on, tbvehicle.status, assigned_driver_id
FROM tbvehicle
LEFT OUTER JOIN tbusers on tbvehicle.assigned_driver_id = tbusers.userid
WHERE tbvehicle.vehicle_id =:vehiceleId
`;