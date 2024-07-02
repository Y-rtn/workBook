"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMiddleware;
exports.getState = exports.dispatch = void 0;

var _effects = require("./effects");

var _hook = require("./hook");

function warning() {
  throw new Error('You are calling "dispatch" or "getState" without applying mirrorMiddleware! ' + 'Please create your store with mirrorMiddleware first!');
}

var dispatch = warning;
exports.dispatch = dispatch;
var getState = warning;
exports.getState = getState;

function createMiddleware() {
  return function (middlewareAPI) {
    exports.dispatch = dispatch = middlewareAPI.dispatch;
    exports.getState = getState = middlewareAPI.getState;
    return function (next) {
      return function (action) {
        var result = next(action);

        if (typeof _effects.effects[action.type] === 'function') {
          result = _effects.effects[action.type](action.data, getState);
        }

        _hook.hooks.forEach(function (hook) {
          return hook(action, getState);
        });

        return result;
      };
    };
  };
}