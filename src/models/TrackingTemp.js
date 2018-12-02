import bookshelf from '../db';


const TABLE_NAME = 'tbtemp';
class TrackingTemp extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
    static fetchLocations(email){
        return bookshelf.knex('tbtemp').where('emailid',email)
            .select('lat', 'lng', 'created_on', 'emailid');
    }
}
export default TrackingTemp;