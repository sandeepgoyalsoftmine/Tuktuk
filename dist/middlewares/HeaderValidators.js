'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkToken = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Check if header DRPEDIA_TOKEN exists.
 *
 * @param req
 * @param res
 * @param next
 */
var checkToken = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
        var token, user;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // console.log(req);
                        console.log(req.get('DRPEDIA_TOKEN'));
                        token = req.get('DRPEDIA_TOKEN');

                        if (token) {
                            _context.next = 8;
                            break;
                        }

                        req.session.destroy();
                        res.statusCode = _httpStatusCodes2.default.FORBIDDEN;
                        return _context.abrupt('return', res.json({ errors: { auth: ['Header DRPEDIA_TOKEN contains no data.'] } }));

                    case 8:
                        console.log(token + "   test");
                        _context.next = 11;
                        return _Users2.default.fetchUserByToken(token);

                    case 11:
                        user = _context.sent;

                        console.log(user[0][0]);

                        if (user[0][0]) {
                            _context.next = 17;
                            break;
                        }

                        req.session.destroy();
                        res.statusCode = _httpStatusCodes2.default.FORBIDDEN;
                        return _context.abrupt('return', res.json({ errors: { auth: ['Header DRPEDIA_TOKEN contains invalid Token.'] } }));

                    case 17:
                        next();

                    case 18:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function checkToken(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var _httpStatusCodes = require('http-status-codes');

var _httpStatusCodes2 = _interopRequireDefault(_httpStatusCodes);

var _Users = require('../models/Users');

var _Users2 = _interopRequireDefault(_Users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.checkToken = checkToken;