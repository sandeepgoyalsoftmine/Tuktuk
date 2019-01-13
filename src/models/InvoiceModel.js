import bookshelf from '../db';
import * as queries from "../queries/InvoiceQuery";

const TABLE_NAME = 'tbinvoice';

class InvoiceModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchRideDetails(ride_id){
        console.log("ride id "+ ride_id);
        return bookshelf.knex.raw(queries.FETCH_RIDE_DETAILS_BY_RIDE_ID, {
            'ride_id': ride_id
        })
    }
    static fetchInvoiceDetailsByRideID(ride_id){
        return bookshelf.knex.raw(queries.FETCH_INVOICE_BY_RIDE_ID, {
            'ride_id': ride_id
        })
    }
}
export default InvoiceModel;