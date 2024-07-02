"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = render;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactRedux = require("react-redux");

var _defaults = require("./defaults");

var _model = require("./model");

var _store = require("./store");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var started = false;
var Root;

function render(component, container, callback) {
  var initialState = _defaults.options.initialState,
      middlewares = _defaults.options.middlewares,
      reducers = _defaults.options.reducers;

  if (started) {
    (0, _store.replaceReducer)(_store.store, _model.models, reducers);

    if (arguments.length === 0) {
      return Root;
    }
  } else {
    (0, _store.createStore)(_model.models, reducers, initialState, middlewares);
  }

  Root = function Root() {
    return _react.default.createElement(_reactRedux.Provider, {
      store: _store.store
    }, component);
  };

  started = true;
  global.document && _reactDom.default.render(_react.default.createElement(Root, null), container, callback);
  return Root;
}