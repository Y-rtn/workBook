"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEffect = exports.effects = void 0;
var effects = {};
exports.effects = effects;

var addEffect = function addEffect(effects) {
  return function (name, handler) {
    effects[name] = handler;
  };
};

exports.addEffect = addEffect;