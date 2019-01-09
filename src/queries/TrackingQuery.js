export const FETCH_LOCATIONS_BY_USERID_STARTTIME_ENDTIME = `
SELECT lat, lng 
FROM tbtrackingdata 
where user_id =:userid AND created_on between :startTime AND :endTime`;