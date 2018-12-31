import bookshelf from '../db';
import * as queries from "../queries/RefferalQuery";


const TABLE_NAME = 'tbdiscount';
class RefferalModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }

    static fetchAllDiscount(){
        return bookshelf.knex.raw(queries.FETCH_ALL_DISCOUNTS);
    }
    static fetchDiscountByRideKm(km){
        return bookshelf.knex.raw(queries.FETCH_DISCOUNT_BY_KM, {
            km:km
        })
    }
    static fetchRefferalByDiscountID(discount_id){
        return bookshelf.knex.raw(queries.FETCH_DISCOUNT_BY_DISCOUNT_ID, {
            discount_id:discount_id
        })
    }
    static deactivateAll(discount_id){
        console.log("in model");
        return bookshelf.knex.raw(queries.DEACTIVATE_ALL_EXCEPT_DISCOUNT_ID, {
            discount_id:discount_id
        })
    }
}
export default RefferalModel;