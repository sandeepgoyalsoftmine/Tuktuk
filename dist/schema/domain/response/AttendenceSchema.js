'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _schemaObject = require('schema-object');

var _schemaObject2 = _interopRequireDefault(_schemaObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AttendenceSchema = new _schemaObject2.default({
    emailid: String,
    status: Number,
    time: String
}, {
    constructors: {
        // Override default constructor
        default: function _default(values) {
            // Will call this.populate
            this.emailid = values.emailid;
            this.attendance = values.status;
            this.time = values.status == 1 ? values.in_time : values.out_time;
        }
    }
});

exports.default = AttendenceSchema;