"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _LinearProgress = _interopRequireDefault(require("@material-ui/core/LinearProgress"));

var _styles = require("@material-ui/core/styles");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = () => ({
  root: {
    position: "absolute",
    zIndex: 3000,
    width: "100%",
    backgroundColor: "transparent"
  },
  bar: {}
});

var ProgressBar = (_ref) => {
  var {
    classes,
    color,
    loading
  } = _ref;
  return loading && _react.default.createElement(_LinearProgress.default, {
    color: color,
    classes: {
      root: classes.root,
      bar: classes.bar
    }
  });
};

ProgressBar.propTypes = {
  classes: _propTypes.default.object.isRequired,
  loading: _propTypes.default.bool,
  color: _propTypes.default.string
};
ProgressBar.defaultProps = {
  loading: true,
  color: "secondary"
};
var BananasProgressBar = (0, _styles.withStyles)(styles, {
  name: "BananasProgressBar"
})(ProgressBar);
var _default = BananasProgressBar;
exports.default = _default;