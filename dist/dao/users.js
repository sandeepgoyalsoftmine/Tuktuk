'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRow = exports.createRow = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Add new users.
 *
 * @param newUser
 * @returns {Promise.<*>}
 */
var createRow = exports.createRow = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(newUser, transaction) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new _Users2.default(newUser).save(null, { transacting: transaction });

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
/**
 * Update users.
 *
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */


var updateRow = exports.updateRow = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(userid, data, transaction) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _Users2.default.where({ 'userid': userid }).save(data, { method: 'update', transacting: transaction });

          case 2:
            return _context2.abrupt('return', _context2.sent);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function updateRow(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var _Users = require('../models/Users');

var _Users2 = _interopRequireDefault(_Users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }