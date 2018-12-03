import LoginHistory from '../models/LoginHistory';
/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
export async function createRow(newUser, transaction) {
    return await new LoginHistory(newUser).save(null, {transacting: transaction});
}
