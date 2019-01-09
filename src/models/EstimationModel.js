import bookshelf from '../db';

const TABLE_NAME = 'tbestimation';

class EstimationModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
}
export default EstimationModel;