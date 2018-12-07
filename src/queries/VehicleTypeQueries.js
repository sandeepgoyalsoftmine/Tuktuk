export const FETCH_VEHICLE_TYPES = `
SELECT vehicle_id, vehicle_type, DATE_FORMAT(created_on, '%Y-%m-%d %H:%i:%s') AS created_on FROM tbvehicletypes
`;

export const FETCH_VEHICLE_TYPES_BY_VEHICLE_TYPE_ID = `
SELECT vehicle_id, vehicle_type, DATE_FORMAT(created_on, '%Y-%m-%d %H:%i:%s') AS created_on FROM tbvehicletypes
WHERE vehicle_id =:vehicle_id
`;

export const FETCH_VEHICLE_TYPES_BY_VEHICLE_TYPE = `
SELECT vehicle_id, vehicle_type, DATE_FORMAT(created_on, '%Y-%m-%d %H:%i:%s') AS created_on FROM tbvehicletypes
WHERE vehicle_type =:vehicleType
`;