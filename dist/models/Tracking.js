'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TABLE_NAME = 'tbtrackingdata';

var Tracking = function (_bookshelf$Model) {
    (0, _inherits3.default)(Tracking, _bookshelf$Model);

    function Tracking() {
        (0, _classCallCheck3.default)(this, Tracking);
        return (0, _possibleConstructorReturn3.default)(this, (Tracking.__proto__ || (0, _getPrototypeOf2.default)(Tracking)).apply(this, arguments));
    }

    (0, _createClass3.default)(Tracking, [{
        key: 'tableName',
        get: function get() {
            return TABLE_NAME;
        }
    }, {
        key: 'hasTimestamps',
        get: function get() {
            return false;
        }
    }]);
    return Tracking;
}(_db2.default.Model);

exports.default = Tracking;