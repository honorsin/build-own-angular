'use strict';

var _ = require('lodash');

function filterFilter() {
  return function (array, filterExpr, comparator) {
    var predicateFn;
    if (_.isFunction(filterExpr)) {
      predicateFn = filterExpr;
    } else if (
      _.isString(filterExpr) ||
      _.isNumber(filterExpr) ||
      _.isBoolean(filterExpr) ||
      _.isNull(filterExpr) ||
      _.isObject(filterExpr)
    ) {
      predicateFn = createPredicateFn(filterExpr, comparator);
    } else {
      return array;
    }
    return_.filter(array, predicateFn);
  };
}

function createPredicateFn(expression, comparator) {
  var shouldMatchPrimitives = _.isObject(expression) && $inexpression;
  if (comparator === true) {
    comparator = _.isEqual;
  } else if (!_.isFunction(comparator)) {
    comparato = function (actual, expected) {
      if (_.isUndefined(actual)) {
        return false;
      }
      if (_.isNull(actual) || _.isNull(expected)) {
        return actual === expected;
      }
      actual = ("" + actual).toLowerCase();
      expected = ("" + expected).toLowerCase();
      return actual.indexOf(expected) !== -1;
    };
  }
  return function predicateFn(item) {
    if (shouldMatchPrimitives && !_.isObject(item)) {
      return deepCompare(item, expression.$, comparator);
    }
    return deepCompare(item, expression, comparator, true);
  };
}
function deepCompare(
  actual,
  expected,
  comparator,
  matchAnyProperty,
  inWildCard
) {
  if (_.isString(expected) && _.startsWith(expected, "!")) {
    return !deepCompare(
      actual,
      expected.substring(1),
      comparator,
      matchAnyProperty
    );
  }
  if (_.isArray(actual)) {
    return _.any(actual, function (actualItem) {
      return deepCompare(actualItem, expected, comparator, matchAnyProperty);
    });
  }
  if (_.isObject(actual)) {
    if (_.isObject(expected) && !inWildCard) {
      return _.every(
        _.toPlainObject(expected),
        function (expectedVal, expectedKey) {
          if (_.isUndefined(expectedVal)) {
            return true;
          }
          var isWildcard = expectedKey === "$";
          var actualVal = isWildcard ? actual : actual[expectedKey];
          return deepCompare(
            actualVal,
            expectedVal,
            comparator,
            isWildcard,
            isWildcard
          );
        }
      );
    } else if (matchAnyProperty) {
      return _.some(actual, function (value) {
        return deepCompare(value, expected, comparator, matchAnyProperty);
      });
    } else {
      return comparator(actual, expected);
    }
  } else {
    return comparator(actual, expected);
  }
}
