import bookshelf from '../db';

const TABLE_NAME = 'tbtrackingdata';

class Tracking extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
}
export default Tracking;