import distanceMatrix from 'google-distance-matrix';
import timeDiffer from 'moment';
import * as HttpStatus from "http-status-codes/index";
import * as EstimationDao from "../dao/EstimationDao";
import * as InvoiceDao from "../dao/InvoiceDao";
import bookshelf from "../db";
import Users from '../models/Users';
import InvoiceModel from "../models/InvoiceModel";
import Tracking from '../models/Tracking';
import DriverDailyWiseModel from "../models/DriverDailyWiseModel";
import * as DriverDailyWiseDao from "../dao/DriverDailyWiseDao";

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
            var totaldi = 0;
            var totalti = 0;
            if (distances.status === 'OK') {
                for (var i = 0; i < origins.length; i++) {
                    for (var j = i; j < i+1; j++) {
                        var origin = distances.origin_addresses[i];
                        var destination = distances.destination_addresses[j];
                        if (distances.rows[0].elements[j].status === 'OK') {
                            var distance = distances.rows[i].elements[j].distance.value;
                            totaldi= totaldi+ distance;
                        } else {
                        }
                        if (distances.rows[0].elements[j].status === 'OK') {
                            var time = distances.rows[i].elements[j].duration.value;
                            totalti= totalti+ time;
                        }
                    }
                }
            }
            let obj = {
                distance: (totaldi/1000).toFixed(2),
                time: (totalti/60.0).toFixed(2)
            };
            return resolve(obj);
        });
    })
}

export async function getDistanceAndDuration(origins, destinations){
    console.log("in duistance"+ origins.length, destinations.length);
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
    let minutes  = timeDiffer(destinationTime).diff(sourceTime, 'minutes');
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

    let origins = [];
    let destinations = [];
    origins.push(origin);
    destinations.push(desti);
    let carEstimation = await estimation(reqData, origins, destinations, 1);
    let array = [];
    array.push(carEstimation);
    let bikeEstimation = await estimation(reqData,origins, destinations, 2);
    array.push(bikeEstimation);
    return array;
}
export async function estimation(reqData,origin, desti, vehicle_type) {
    let finalCost;
    console.log("origins    "+ origin+"    destinationssss    "+ desti);
    let distance = await getDistanceAndDuration(origin, desti);
    if(vehicle_type==1)
        finalCost = Math.round(14.0*distance.distance);
    else
        finalCost = Math.round(7.0*distance.distance);
    let baseFare = (finalCost*(BASE_FARE_PERCENTAGE/100.0)).toFixed(2);
    if(parseFloat(baseFare)<42.0){
        baseFare = 42.00;
    }
    let timeCost = (TIME_COST*distance.duration).toFixed(2);
    let distanceCost = finalCost-baseFare-timeCost;
    let costPerKM = (distanceCost/(distance.distance-MINI_DISTANCE)).toFixed(2);
    let gstCost = (finalCost*(GST_PERCENTAGE/100)).toFixed(2);
    let totalCost = finalCost;
    finalCost = Math.round(parseFloat(finalCost)+ parseFloat(gstCost));
    let currentDate = new Date();
    let returnDate =  timeDiffer(currentDate).add(distance.duration, 'minutes').format('YYYY-MM-DD HH:mm:ss');
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
        estimated_Time: Math.round(distance.duration),
        vehicle_type: vehicle_type
    }
}

export async function getInvoice(reqData){
    console.log("reqData   "+ JSON.stringify(reqData));
    if(isNaN(reqData.ride_id))
    {
        return {errorCode: HttpStatus.BAD_REQUEST, message: 'Ride id should be integer.'};
    }
    let rideDetails = await InvoiceModel.fetchRideDetails(reqData.ride_id);
    if (rideDetails[0].length < 1) {
        return {errorCode: HttpStatus.UNAUTHORIZED, message : 'Invalid ride id'};
    }
    let locations = await Tracking.fetchLocationAccordingToTimeAndUserId(rideDetails[0][0].driver_id,rideDetails[0][0].ride_start_time, rideDetails[0][0].ride_completed_time);
    let destination= [];
    let origin = [];
    for(let i=0;i< locations[0].length;i++){
        let latlng = ''+locations[0][i].lat+','+locations[0][i].lng;
        if(i!==locations[0].length-1){
            origin.push(latlng);
        }
        if(i!==0){
            destination.push(latlng);
        }
    }
    let timediff = await getTimeDifferenceInMinutes(rideDetails[0][0].ride_start_time, rideDetails[0][0].ride_completed_time);
    let distance = await getDistanceAndDuration(origin, destination);
    let finalCost = (14.0*distance.distance).toFixed(0);
    let baseFare = (finalCost*(BASE_FARE_PERCENTAGE/100.0)).toFixed(2);
    if(parseFloat(baseFare)<42.0){
        baseFare = 42.00;
    }
    let timeCost = (TIME_COST*timediff).toFixed(2);
    let distanceCost = finalCost-baseFare-timeCost;
    let costPerKM = (distanceCost/(distance.distance-MINI_DISTANCE)).toFixed(2);
    let gstCost = (finalCost*(GST_PERCENTAGE/100)).toFixed(2);
    let totalCost = finalCost;
    let todayDate = new Date();
    finalCost = parseFloat(finalCost)+ parseFloat(gstCost);
    let newInvoiceID = await bookshelf.transaction(async(t) => {
        let newInvoice = await InvoiceDao.createRow({
            driver_id: rideDetails[0][0].driver_id,
            customer_id: rideDetails[0][0].customer_id,
            source_lat : rideDetails[0][0].source_lat,
            source_lng: rideDetails[0][0].source_long,
            destination_lat:rideDetails[0][0].destination_lat,
            destination_lng:rideDetails[0][0].destination_long,
            source_time:rideDetails[0][0].ride_start_time,
            destination_time:rideDetails[0][0].ride_completed_time,
            total_minutes:timediff,
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
            created_on: todayDate
        }, t);
        return newInvoice.id;
    });
    let driverDaily = await DriverDailyWiseModel.fetchDailyWiseID(rideDetails[0][0].driver_id);
    await bookshelf.transaction(async (t) => {
        let updateBankDetails = await DriverDailyWiseDao.updateRow(driverDaily[0][0].daily_wise_id,
            {
                distance : driverDaily[0][0].distance + distance.distance,
                number_of_rides : driverDaily[0][0].number_of_rides + 1,
                cash_amount: driverDaily[0][0].cash_amount + finalCost,
                number_mins_on_ride :driverDaily[0][0].number_mins_on_ride + timediff,
                updated_on: new Date()
            }, t);
    });
    return {
        totalCost : finalCost,
        distance: distance.distance,
        timeTaken: timediff,
        distance_cost: distanceCost,
        costPerKm: costPerKM,
        costPerMinute: TIME_COST,
        timeCost: timeCost,
        gst: gstCost,
        baseFare: baseFare
    }
}