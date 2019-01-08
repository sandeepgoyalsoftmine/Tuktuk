import schedule from 'node-schedule';
import Users from "../models/Users";
import * as DriverDailyWiseDao from "../dao/DriverDailyWiseDao";
import bookshelf from "../db";
var rule = new schedule.RecurrenceRule();
rule.hour=23;
rule.minute = 59;
rule.second=55;
export async function a() {
    console.log("chal payi");
    var j = schedule.scheduleJob(rule, function () {
        console.log('before calling for insert driver daily wise'+ new Date());
        let a = createDriverDailyWise();
        console.log("job completed successfully");
    });
    return "schedule successfully";
}

export async function createDriverDailyWise(){
    let drivers = await Users.fetchDriverIds();
    for(let i=0;i< drivers[0].length;i++){
        let newdriverDaily = await bookshelf.transaction(async(t) => {
            let newCall = await DriverDailyWiseDao.createRow({
                driver_id :drivers[0][i].userid,
                distance : 0.0,
                cash_amount : 0.0,
                paytm_amount : 0.0,
                number_of_rides:0,
                number_of_ride_cancel: 0,
                number_of_hours: 0.0,
                created_on: new Date(),
                created_by: 'schedule'
            }, t);
            return newCall.id;
        });
    }
    return "Done";


}