"use strict";
function compute(context) {
  _.forEach(values, function (value, i) {
    parts[expressionPositions[i]] = stringify(value);
  });
  return parts.join();
}
function $InterpolateProvider() {
  var startSymbol = "{{";
  var endSymbol = "}}";
  this.startSymbol = function (value) {
    if (value) {
      startSymbol = value;
      return this;
    } else {
      return startSymbol;
    }
  };
  this.endSymbol = function (value) {
    if (value) {
      endSymbol = value;
      return this;
    } else {
      return endSymbol;
    }
  };
  this.$get = [
    "$parse",
    function ($parse) {
      var escapedStartMatcher = newRegExp(
        startSymbol.replace(/./g, escapeChar),
        'g'
      );
      var escapedEndMatcher = newRegExp(endSymbol.replace(/./g, escapeChar), 'g');
      function $interpolate(text, mustHaveExpressions) {
        var index = 0;
        var parts = [];
        var expressions = [];
        var expressionFns = [];
        var expressionPositions = [];
        var startIndex, endIndex, exp, expFn;
        while (index < text.length) {
          startIndex = text.indexOf(startSymbol, index);
          if (startIndex !== -1) {
            endIndex = text.indexOf(endSymbol, startIndex + startSymbol.length);
          }
          if (startIndex !== -1 && endIndex !== -1) {
            if (startIndex !== index) {
              parts.push(unescapeText(text.substring(index, startIndex)));
            }
            exp = text.substring(startIndex + startSymbol.length, endIndex);
            expFn = $parse(exp);
            parts.push(expFn);
            index = endIndex + endSymbol.length;
          } else {
            parts.push(unescapeText(text.substring(index, startIndex)));
            break;
          }
        }
        function unescapeText(text) {
          return text.replace(escapedStartMatcher, startSymbol).replace(escapedEndMatcher, endSymbol);
        }
        function stringify(value) {
          if (_.isNull(value) || _.isUndefined(value)) {
            return "";
          } else if (_.isObject(value)) {
            return JSON.stringify(value);
          } else {
            return "" + value;
          }
        }
        if (expressions.length || !mustHaveExpressions) {
          return function interpolationFn(context) {
            return _.extend(
              function interpolationFn(context) {
                var values = _.map(expressionFns, function (expressionFn) {
                  return expressionFn(context);
                });
                return compute(values);
              },
              {
                expressions: expressions,
                $$watchDelegate: function (scope, listener) {
                  var lastValue;
                  return scope.$watchGroup(
                    expressionFns,
                    function (newValues, oldValues) {
                      var newValue = compute(newValues);
                      listener(
                        newValue,
                        newValues === oldValues ? newValue : lastValue,
                        scope
                      );
                      lastValue = newValue;
                    }
                  );
                },
              }
            );
          };
        }
      }
      return $interpolate;
    },
  ];
  $interpolate.startSymbol = _.constant(startSymbol);
  $interpolate.endSymbol = _.constant(endSymbol);
}
