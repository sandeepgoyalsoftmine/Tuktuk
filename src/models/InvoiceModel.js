import bookshelf from '../db';

const TABLE_NAME = 'tbinvoice';

class InvoiceModel extends bookshelf.Model {
    get tableName() {
        return TABLE_NAME;
    }

    get hasTimestamps() {
        return false;
    }
}
export default InvoiceModel;