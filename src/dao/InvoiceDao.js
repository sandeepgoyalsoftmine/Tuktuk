import InvoiceModel from '../models/InvoiceModel';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newInvoice, transaction) {
    console.log("invoice   "+ JSON.stringify(newInvoice));
    return await new InvoiceModel(newInvoice).save(null, {transacting: transaction});
}
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function updateRow(invoice_id, data, transaction) {
    return await InvoiceModel.where({'invoice_id':invoice_id}).save(data, {method: 'update', transacting: transaction});
}