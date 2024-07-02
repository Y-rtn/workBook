"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addActions = addActions;
exports.resolveReducers = resolveReducers;
exports.actions = void 0;

var _middleware = require("./middleware");

var _defaults = require("./defaults");

var SEP = '/';
var actions = {};
exports.actions = actions;

function addActions(modelName) {
  var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var effects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (Object.keys(reducers).length || Object.keys(effects).length) {
    actions[modelName] = actions[modelName] || {};
  }

  each(reducers, function (actionName) {
    actions[modelName][actionName] = actionCreator(modelName, actionName);
  });
  each(effects, function (effectName) {
    if (actions[modelName][effectName]) {
      throw new Error("Action name \"".concat(effectName, "\" has been used! Please select another name as effect name!"));
    }

    _defaults.options.addEffect("".concat(modelName).concat(SEP).concat(effectName), effects[effectName]);

    actions[modelName][effectName] = actionCreator(modelName, effectName);
    actions[modelName][effectName].isEffect = true;
  });
}

function resolveReducers(modelName) {
  var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.keys(reducers).reduce(function (acc, cur) {
    acc["".concat(modelName).concat(SEP).concat(cur)] = reducers[cur];
    return acc;
  }, {});
}

function each(obj, callback) {
  Object.keys(obj).forEach(callback);
}

function actionCreator(modelName, actionName) {
  return function (data) {
    return (0, _middleware.dispatch)({
      type: "".concat(modelName).concat(SEP).concat(actionName),
      data: data
    });
  };
}