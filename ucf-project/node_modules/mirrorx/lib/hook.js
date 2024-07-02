"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hook;
exports.hooks = void 0;
var hooks = [];
exports.hooks = hooks;

function hook(subscriber) {
  if (typeof subscriber !== 'function') {
    throw new Error('Invalid hook, must be a function!');
  }

  hooks.push(subscriber);
  return function () {
    hooks.splice(hooks.indexOf(subscriber), 1);
  };
}