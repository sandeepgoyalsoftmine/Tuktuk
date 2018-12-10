export const FETCH_ALL_VEHICLE = `
SELECT tbvehicle.vehicle_id, tbvehicletypes.vehicle_type, make, model, vehicle_number, rc_no, permit_no, insurance_no, 
DATE_FORMAT(tbvehicle.created_on, '%Y-%m-%d %H:%i:%s') AS created_on, tbvehicle.status, tbusers.name
FROM tbvehicle
LEFT OUTER JOIN tbvehicletypes on tbvehicle.vehicle_type = tbvehicletypes.vehicle_id
LEFT OUTER JOIN tbusers on tbvehicle.assigned_driver_id = tbusers.userid
`;