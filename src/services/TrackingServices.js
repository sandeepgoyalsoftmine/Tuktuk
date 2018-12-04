import bookshelf from "../db";
import * as TrackingDao from "../dao/TrackingDao";
import * as TrackingTempDao from "../dao/TrackingTempDao";
import Users from "../models/Users";
import TrackingTemp from "../models/TrackingTemp";

export async function createLocation(token, reqData){
    let userID = await Users.fetchUserByToken(token);
    console.log(userID[0][0].emailid, JSON.stringify(reqData));
    let trackingID = await bookshelf.transaction(async(t) =>
    {
        let newLocation = await TrackingDao.createRow(
            {
                emailid : userID[0][0].emailid,
                lat : reqData.latitude,
                lng : reqData.longitude,
                datetime: reqData.dateTime,
                tracking_type : reqData.trackingType,
                created_on: new Date()
            }, t);
    });
    console.log("email    "+ userID[0][0].emailid);
    if(reqData.trackingType == 'L') {
        await bookshelf.transaction(async (t) => {
            let newTrackingTempID = await TrackingTempDao.updateRow(userID[0][0].emailid,
                {
                    lat: reqData.latitude,
                    lng: reqData.longitude,
                    datetime: reqData.dateTime,
                    created_on: new Date()
                }, t);
        });
    }
    return ({
        message : 'location saved successfully.'
    });
}

export async function getTrackingData(userid, req){
    console.log("userid   "+ userid);
    let userID = await Users.fetchUserByUserID(userid);
    console.log("in Services"+ userID[0][0].emailid);
    let locations = await TrackingTemp.fetchLocations(userID[0][0].emailid);
    return ({
        message : '',
        locations : locations[0][0]
    });
}
export async function getAreaType(req){

}