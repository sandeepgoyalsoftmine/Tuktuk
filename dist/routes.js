'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _loginController = require('./controller/loginController');

var _loginController2 = _interopRequireDefault(_loginController);

var _trackingController = require('./controller/trackingController');

var _trackingController2 = _interopRequireDefault(_trackingController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Contains all API routes for the application.
 */
var router = (0, _express.Router)();

router.use('/', _loginController2.default);
router.use('/tracking', _trackingController2.default);

exports.default = router;