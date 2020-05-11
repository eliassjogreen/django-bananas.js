"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = _interopRequireDefault(require("@date-io/date-fns"));

var _pickers = require("@material-ui/pickers");

var _finalForm = require("final-form");

var _finalFormArrays = _interopRequireDefault(require("final-form-arrays"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactFinalForm = require("react-final-form");

var _context = _interopRequireDefault(require("../context"));

var _FormContext = _interopRequireDefault(require("./FormContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { if (i % 2) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } else { Object.defineProperties(target, Object.getOwnPropertyDescriptors(arguments[i])); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/*
Turn this:
    {"detail": "User already exists"}

And this:
    {"__all__": "User already exists"}

Also this:
    {"non_field_errors": ["User already exists"]}

Into this, with `FORM_ERROR` from final-form:
    {[FORM_ERROR]: ["Passwords must match"], "<field_name>": ["This field is required"]}
*/
function normalizeFormErrorData(data) {
  var normalizedData = data;

  if (data != null && typeof data === "object") {
    var {
      non_field_errors = [],
      __all__ = [],
      detail
    } = data,
        errors = _objectWithoutProperties(data, ["non_field_errors", "__all__", "detail"]);

    normalizedData = _objectSpread({
      [_finalForm.FORM_ERROR]: non_field_errors.concat(__all__).concat(detail).filter(Boolean)
    }, errors);
  }

  return normalizedData;
}

class Form extends _react.default.Component {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "handleSubmit", values => {
      var {
        route,
        params,
        onSubmit,
        onSuccess
      } = this.props;

      var endpoint = function endpoint(data) {
        var passedParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return _this.context.api[route](_objectSpread({}, params, {}, passedParams, {
          data: data || values
        }));
      };

      var promise = onSubmit ? Promise.resolve(onSubmit({
        endpoint,
        values
      })) : endpoint().then(() => {
        // TODO: store data from server in the form
        if (onSuccess !== undefined) {
          onSuccess();
        } else {
          this.context.admin.success("Changes have been saved!");
        }

        return false;
      });
      return promise.catch((_ref) => {
        var {
          response: {
            statusText,
            status,
            obj
          }
        } = _ref;
        var errorMessages = {
          400: "Please correct the errors on this form."
        };
        this.context.admin.error(errorMessages[status] || "".concat(status, " : ").concat(statusText));
        return normalizeFormErrorData(obj);
      });
    });
  }

  getSchema(route) {
    var {
      schema
    } = this.context.api[route];
    return schema && schema.data ? schema.data : undefined;
  }

  render() {
    var _this$props = this.props,
        {
      route,
      children,
      formProps,
      mutators
    } = _this$props,
        props = _objectWithoutProperties(_this$props, ["route", "children", "formProps", "mutators"]);

    return _react.default.createElement(_pickers.MuiPickersUtilsProvider, {
      utils: _dateFns.default
    }, _react.default.createElement(_reactFinalForm.Form, _extends({}, props, {
      mutators: _objectSpread({}, _finalFormArrays.default, {}, mutators),
      onSubmit: this.handleSubmit
    }), (_ref2) => {
      var {
        handleSubmit
      } = _ref2,
          childProps = _objectWithoutProperties(_ref2, ["handleSubmit"]);

      return _react.default.createElement("form", _extends({
        onSubmit: handleSubmit
      }, formProps), _react.default.createElement(_FormContext.default.Provider, {
        value: {
          schema: this.getSchema(route)
        }
      }, typeof children === "object" ? children : children(_objectSpread({
        handleSubmit
      }, childProps))));
    }));
  }

}

_defineProperty(Form, "contextType", _context.default);

Form.propTypes = {
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.node), _propTypes.default.node, _propTypes.default.func]).isRequired,
  route: _propTypes.default.string.isRequired,
  params: _propTypes.default.object,
  onSubmit: _propTypes.default.func,
  onSuccess: _propTypes.default.func,
  formProps: _propTypes.default.object
};
Form.defaultProps = {
  onSubmit: undefined,
  onSuccess: undefined,
  params: {},
  formProps: {}
};
var _default = Form;
exports.default = _default;