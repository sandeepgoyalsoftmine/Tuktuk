'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRow = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Add new Products.
 *
 * @param newProduct
 * @returns {Promise.<*>}
 */
var createRow = exports.createRow = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(newLocation, transaction) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new _Tracking2.default(newLocation).save(null, { transacting: transaction });

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createRow(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _Tracking = require('../models/Tracking');

var _Tracking2 = _interopRequireDefault(_Tracking);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }