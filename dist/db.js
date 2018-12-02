'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

var _knexfile = require('./knexfile');

var _knexfile2 = _interopRequireDefault(_knexfile);

var _bookshelf = require('bookshelf');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Database connection.
 */
var knex = (0, _knex2.default)(_knexfile2.default);
var bookshelf = (0, _bookshelf2.default)(knex);

bookshelf.plugin(['virtuals', 'pagination', 'visibility', 'bookshelf-camelcase']);

exports.default = bookshelf;