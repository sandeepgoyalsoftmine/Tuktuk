import distanceMatrix from 'google-distance-matrix';
import timeDiffer from 'moment';
import * as HttpStatus from "http-status-codes/index";
import * as EstimationDao from "../dao/EstimationDao";
import * as InvoiceDao from "../dao/InvoiceDao";
import bookshelf from "../db";
import InvoiceModel from "../models/InvoiceModel";
import Tracking from '../models/Tracking';
import RideModels from "../models/RideModels";


distanceMatrix.key('AIzaSyC2zwzwJP1SFBRGVt80SroTm-7ga-z1lcA');
const TIME_COST = 1.5;
const BASE_FARE_PERCENTAGE = 14;
const GST_PERCENTAGE = 5;
const MINI_DISTANCE =3;

export async function getEstimateWithoutGMap(origin){
    let rad = function(x) {
        return x * Math.PI / 180;
    };
    let R = 6378137; // Earth’s mean radius in meter
    let dLat, dLong, a, c,d, totalDistance=0.0;
    console.log("in estimate function");
    for(let i=0;i < origin.length-1; i++ ){
        dLat = rad(origin[i+1].lat - origin[i].lat);
        dLong = rad(origin[i+1].lng - origin[i].lng);
        a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(origin[i].lat)) * Math.cos(rad(origin[i+1].lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        d = (R * c)/1000;
        totalDistance= totalDistance+ d;
    }
    return totalDistance.toFixed(2); // returns the distance in meter

}

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
    let distance=0, time=0;
    if(reqData.distance===undefined || reqData.distance===0)
        distance=0
    else
        distance = reqData.distance;
    if(reqData.time===undefined || reqData.time===0)
        time=0
    else
        time = reqData.time;
    let origin = ''+reqData.sourceLat+','+reqData.sourceLng;
    let desti = ''+reqData.destinationLat+','+reqData.destinationLng;
    let origins = [];
    let destinations = [];
    origins.push(origin);
    destinations.push(desti);
    let carEstimation = await estimation(reqData, origins, destinations, 1, distance, time);
    let array = [];
    array.push(carEstimation);
    let bikeEstimation = await estimation(reqData,origins, destinations, 2, distance, time);
    array.push(bikeEstimation);
    return array;
}
export async function estimation(reqData,origin, desti, vehicle_type, dist, estimateTime) {
    let finalCost;
    let distanceApp = 0;
    let timeApp =0;
    console.log("origins    "+ origin+"    destinationssss    "+ desti);
    let distance = await getDistanceAndDuration(origin, desti);
    if(distance.distance==0){
        distanceApp = dist/1000.0;
        timeApp = estimateTime/60;
    }else{
        distanceApp = distance.distance;
        timeApp = distance.duration;
    }
    if(vehicle_type==1)
        finalCost = Math.round(14.0*distanceApp);
    else
        finalCost = Math.round(11.0*distanceApp);
    let baseFare = (finalCost*(BASE_FARE_PERCENTAGE/100.0)).toFixed(2);
    let timeCost ;
    let distanceCost ;
    let costPerKM ;
    console.log("base fare  "+ baseFare);
    if(parseFloat(baseFare)<42.0){
        if(finalCost< 42){
            baseFare = 42.00;
            finalCost = baseFare;
            timeCost = 0;
            distanceCost=0;
            costPerKM = 0;
        }else{
            baseFare = 42;
            timeCost = (TIME_COST*timeApp).toFixed(2);
            distanceCost = finalCost-baseFare-timeCost;
            costPerKM = (distanceCost/(distanceApp)).toFixed(2);
        }
        console.log("in condition "+ finalCost);
    }
    if(parseFloat(baseFare)<33.0){
        if(finalCost<33.0){
            baseFare = 33.00;
            finalCost = baseFare;
            timeCost = 0;
            distanceCost=0;
        }else{
            baseFare = 33.00;
            timeCost = (TIME_COST*timeApp).toFixed(2);
            distanceCost = finalCost-baseFare-timeCost;
            costPerKM = (distanceCost/(distanceApp-MINI_DISTANCE)).toFixed(2);
        }
        console.log("in condition "+ finalCost);
    }
    let totalCost = finalCost;
    let gstCost = (finalCost*(GST_PERCENTAGE/100)).toFixed(2);
    finalCost = Math.round(parseFloat(finalCost)+ parseFloat(gstCost));
    console.log("base fare after condition  "+ baseFare);
    let currentDate = new Date();
    let returnDate =  timeDiffer(currentDate).add(timeApp, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    let newEstimateID = await bookshelf.transaction(async(t) => {
        let newEstaimate = await EstimationDao.createRow({
            source_lat : reqData.sourceLat,
            source_lng: reqData.sourceLng,
            destination_lat:reqData.destinationLat,
            destination_lng:reqData.destinationLng,
            source_time:currentDate,
            destination_time:returnDate,
            total_minutes:timeApp,
            cost_per_minute:TIME_COST,
            time_cost:timeCost,
            total_cost:totalCost,
            distance:distanceApp,
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
        distance_cost: distanceCost,
        costPerKm: costPerKM,
        costPerMinute: TIME_COST,
        timeCost: timeCost,
        gst: gstCost,
        baseFare: baseFare,
        totalCost : finalCost,
        distance: distanceApp,
        estimated_Time: Math.round(timeApp),
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
    console.log("ride Details  "+ JSON.stringify(rideDetails[0]));
    if(rideDetails[0][0].status !==4)
        return {errorCode: HttpStatus.BAD_REQUEST, message : 'ride is not completed'};
    let locations = await Tracking.fetchLocationAccordingToTimeAndUserId(rideDetails[0][0].driver_id,rideDetails[0][0].ride_start_time, rideDetails[0][0].ride_completed_time);
    let destination= [];
    let origin = [];
    for(let i=0;i< locations[0].length;i++){
        let p1 = {
            lat : locations[0][i].lat,
            lng :locations[0][i].lng
        }
        origin.push(p1);
    }
    let timediff = await getTimeDifferenceInMinutes(rideDetails[0][0].ride_start_time, rideDetails[0][0].ride_completed_time);
    console.log("array of latlng "+ JSON.stringify(origin));
    let distanc = await getEstimateWithoutGMap(origin);
    let distance = parseFloat(distanc);
    console.log("distance     s s s s s s s s"+ distance);
    let finalCost = (14.0*distance).toFixed(0);
    let baseFare = (finalCost*(BASE_FARE_PERCENTAGE/100.0)).toFixed(2);
    let timeCost ;
    let distanceCost;
    let costPerKM ;
    if(parseFloat(baseFare)<42.0){
        if(finalCost< 42){
            baseFare = 42.00;
            finalCost = baseFare;
            timeCost = 0;
            distanceCost=0;
            costPerKM = 0;
        }else{
            baseFare = 42;
            timeCost = (TIME_COST*timediff).toFixed(2);
            distanceCost = finalCost-baseFare-timeCost;
            costPerKM = (distanceCost/(distance-MINI_DISTANCE)).toFixed(2);
        }
        console.log("in condition "+ finalCost);
    }
    if(parseFloat(baseFare)<33.0){
        if(finalCost<33.0){
            baseFare = 33.00;
            finalCost = baseFare;
            timeCost = 0;
            distanceCost=0;
        }else{
            baseFare = 33.00;
            timeCost = (TIME_COST*timediff).toFixed(2);
            distanceCost = finalCost-baseFare-timeCost;
            costPerKM = (distanceCost/(distance-MINI_DISTANCE)).toFixed(2);
        }
        console.log("in condition "+ finalCost);
    }
    let totalCost = finalCost;
    let gstCost = (finalCost*(GST_PERCENTAGE/100)).toFixed(2);
    finalCost = Math.round(parseFloat(finalCost)+ parseFloat(gstCost));
    let todayDate = new Date();
    let ride_id_exist = await InvoiceModel.fetchInvoiceDetailsByRideID(reqData.ride_id);
    if(ride_id_exist[0].length== 1){
        return {
            totalCost : ride_id_exist[0][0].final_cost,
            distance: ride_id_exist[0][0].distance,
            timeTaken: ride_id_exist[0][0].total_minutes,
            distance_cost: ride_id_exist[0][0].distance_cost,
            costPerKm: ride_id_exist[0][0].cost_per_km,
            costPerMinute: ride_id_exist[0][0].cost_per_minute+"",
            timeCost: ride_id_exist[0][0].time_cost+"",
            gst: ride_id_exist[0][0].gst+"",
            baseFare: ride_id_exist[0][0].base_fare
        }
    }
    let newInvoiceID = await bookshelf.transaction(async(t) => {
        let newInvoice = await InvoiceDao.createRow({
            ride_id: reqData.ride_id,
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
            distance:distance,
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
    // let driverDaily = await DriverDailyWiseModel.fetchDailyWiseID(rideDetails[0][0].driver_id);
    // await bookshelf.transaction(async (t) => {
    //     let updateBankDetails = await DriverDailyWiseDao.updateRow(driverDaily[0][0].daily_wise_id,
    //         {
    //             distance : driverDaily[0][0].distance + distance.distance,
    //             number_of_rides : driverDaily[0][0].number_of_rides + 1,
    //             cash_amount: driverDaily[0][0].cash_amount + finalCost,
    //             number_mins_on_ride :driverDaily[0][0].number_mins_on_ride + timediff,
    //             updated_on: new Date()
    //         }, t);
    // });

    return {
        totalCost : finalCost,
        distance: parseFloat(distance),
        timeTaken: timediff,
        distance_cost: distanceCost,
        costPerKm: costPerKM+"",
        costPerMinute: TIME_COST,
        timeCost: timeCost+"",
        gst: gstCost+"",
        baseFare: baseFare
    }
}