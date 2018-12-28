import distanceMatrix from 'google-distance-matrix';
import timeDiffer from 'moment';
import * as HttpStatus from "http-status-codes/index";
import * as EstimationDao from "../dao/EstimationDao";
import * as InvoiceDao from "../dao/InvoiceDao";
import bookshelf from "../db";
import Users from '../models/Users';

distanceMatrix.key('AIzaSyC2zwzwJP1SFBRGVt80SroTm-7ga-z1lcA');
const TIME_COST = 1.5;
const BASE_FARE_PERCENTAGE = 14;
const GST_PERCENTAGE = 5;
const MINI_DISTANCE =3;

export async function matrixDistance(origins, destinations) {
    return new Promise((resolve, reject) => {
        distanceMatrix.matrix(origins, destinations, function (err, distances) {
            if (err) {
                return console.log(err);
            }
            if (!distances) {
                return console.log('no distances');
            }
            console.log("siatnceeeee   " + distances.status);
            if (distances.status === 'OK') {
                console.log("distance ok")
                for (var i = 0; i < origins.length; i++) {
                    for (var j = 0; j < destinations.length; j++) {
                        var origin = distances.origin_addresses[i];
                        var destination = distances.destination_addresses[j];
                        if (distances.rows[0].elements[j].status === 'OK') {
                            var distance = distances.rows[i].elements[j].distance.value;
                        } else {
                        }
                        if (distances.rows[0].elements[j].status === 'OK') {
                            var time = distances.rows[i].elements[j].duration.value;
                            console.log('time from ' + origin + ' to ' + destination + ' is ' + time / 60.0);
                        }
                    }
                }
            }
            let obj = {
                distance: (distance/1000).toFixed(2),
                time: (time/60.0).toFixed(2)
            };
            return resolve(obj);
        });
    })
}

export async function getDistanceAndDuration(origin, desti){
    var origins = [origin];
    var destinations = [desti];
    console.log("in duistance"+ destinations[0]);
    let a = await matrixDistance(origins, destinations);
    console.log("valuessssv    "+a);
    let distance = parseFloat(a.distance);
    let duration = parseFloat(a.time);
    return {
        distance : distance,
        duration: duration
    };


}
export async function getTimeDifferenceInMinutes(sourceTime, destinationTime){
    let minutes  = timeDiffer(sourceTime).diff(destinationTime, 'minutes');
    return minutes;
}

export async function getEstimatedFare(reqData){
    console.log("reqData   "+ JSON.stringify(reqData));
    if(isNaN(reqData.sourceLat))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'source latitude should be double type value.'};
    }
    if(isNaN(reqData.sourceLng))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'source longitude should be double type value.'};
    }
    if(isNaN(reqData.destinationLat))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'destination latitude should be double type value.'};
    }
    if(isNaN(reqData.destinationLng))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'destination longitude should be double type value.'};
    }
    let origin = ''+reqData.sourceLat+','+reqData.sourceLng;
    let desti = ''+reqData.destinationLat+','+reqData.destinationLng;
    let distance = await getDistanceAndDuration(origin, desti);
    let finalCost = (14.0*distance.distance).toFixed(2);
    let baseFare = (finalCost*(BASE_FARE_PERCENTAGE/100.0)).toFixed(2);
    if(parseFloat(baseFare)<42.0){
        baseFare = 42.00;
    }
    let timeCost = (TIME_COST*distance.duration).toFixed(2);
    let distanceCost = finalCost-baseFare-timeCost;
    let costPerKM = (distanceCost/(distance.distance-MINI_DISTANCE)).toFixed(2);
    let gstCost = (finalCost*(GST_PERCENTAGE/100)).toFixed(2);
    let totalCost = finalCost;
    finalCost = parseFloat(finalCost)+ parseFloat(gstCost);
    let currentDate = new Date();
    console.log("current date   "+currentDate);
    let returnDate =  timeDiffer(currentDate).add(distance.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    console.log("returen date  "+ returnDate);
    let newEstimateID = await bookshelf.transaction(async(t) => {
        let newEstaimate = await EstimationDao.createRow({
            source_lat : reqData.sourceLat,
            source_lng: reqData.sourceLng,
            destination_lat:reqData.destinationLat,
            destination_lng:reqData.destinationLng,
            source_time:currentDate,
            destination_time:returnDate,
            total_minutes:distance.duration,
            cost_per_minute:TIME_COST,
            time_cost:timeCost,
            total_cost:totalCost,
            distance:distance.distance,
            cost_per_km:costPerKM,
            distance_cost:distanceCost,
            base_fare: baseFare,
            extra_charges:0,
            discount:0,
            gst_percentage:GST_PERCENTAGE,
            gst:gstCost,
            final_cost:finalCost,
            created_on: new Date()
        }, t);
        return newEstaimate.id;
    });
    return {
        totalCost : finalCost,
        distance: distance.distance,
        estimated_Time: distance.duration
    }
}

export async function startRide(reqData, token){
    console.log("reqData   "+ JSON.stringify(reqData)+"    token  "+ token);
    if(isNaN(reqData.sourceLat))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'source latitude should be double type value.'};
    }
    if(isNaN(reqData.sourceLng))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'source longitude should be double type value.'};
    }
    if(isNaN(reqData.destinationLat))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'destination latitude should be double type value.'};
    }
    if(isNaN(reqData.destinationLng))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'destination longitude should be double type value.'};
    }
    let driver = await Users.fetchDriverByToken(token);
    console.log(JSON.stringify(driver[0]));
    let origin = ''+reqData.sourceLat+','+reqData.sourceLng;
    let desti = ''+reqData.destinationLat+','+reqData.destinationLng;
    let distance = await getDistanceAndDuration(origin, desti);
    let finalCost = (14.0*distance.distance).toFixed(2);
    let baseFare = (finalCost*(BASE_FARE_PERCENTAGE/100.0)).toFixed(2);
    if(parseFloat(baseFare)<42.0){
        baseFare = 42.00;
    }
    let timeCost = (TIME_COST*distance.duration).toFixed(2);
    let distanceCost = finalCost-baseFare-timeCost;
    let costPerKM = (distanceCost/(distance.distance-MINI_DISTANCE)).toFixed(2);
    let gstCost = (finalCost*(GST_PERCENTAGE/100)).toFixed(2);
    let totalCost = finalCost;
    finalCost = parseFloat(finalCost)+ parseFloat(gstCost);
    let currentDate = new Date();
    console.log("current date   "+currentDate);
    let returnDate =  timeDiffer(currentDate).add(distance.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    console.log("returen date  "+ returnDate);
    let newInvoiceID = await bookshelf.transaction(async(t) => {
        let newInvoice = await InvoiceDao.createRow({
            driver_id: driver[0][0].userid,
            customer_id: reqData.customer_id,
            source_lat : reqData.sourceLat,
            source_lng: reqData.sourceLng,
            destination_lat:reqData.destinationLat,
            destination_lng:reqData.destinationLng,
            source_time:currentDate,
            destination_time:returnDate,
            total_minutes:distance.duration,
            cost_per_minute:TIME_COST,
            time_cost:timeCost,
            total_cost:totalCost,
            distance:distance.distance,
            cost_per_km:costPerKM,
            distance_cost:distanceCost,
            base_fare: baseFare,
            extra_charges:0,
            discount:0,
            gst_percentage:GST_PERCENTAGE,
            gst:gstCost,
            final_cost:finalCost,
            created_on: new Date()
        }, t);
        return newInvoice.id;
    });
    return {
        // ride_id: newInvoiceID,
        // message:"Ride is on the way"
        totalCost : finalCost,
        distance: distance.distance,
        timeTaken: distance.duration,
        distance_cost: distanceCost,
        costPerKm: costPerKM,
        costPerMinute: TIME_COST,
        timeCost: timeCost,
        gst: gstCost,
        estimated_Time: distance.duration,
        baseFare: baseFare

    }
}