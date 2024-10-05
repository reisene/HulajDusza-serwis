"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// sticky-header.js
var StickyHeader = /*#__PURE__*/function () {
  function StickyHeader() {
    _classCallCheck(this, StickyHeader);
    this.stickyHeader = $('header');
    this.stickyMenu = $('nav.menu');
    this.logo = $('.header-left img');
  }
  return _createClass(StickyHeader, [{
    key: "makeSticky",
    value: function makeSticky() {
      var sticky = this.stickyHeader.offset().top;
      var scrollTop = $(window).scrollTop();
      var stickyClass = scrollTop > sticky ? 'sticky' : '';
      this.stickyHeader.addClass(stickyClass);
      this.stickyMenu.addClass(stickyClass);

      // Logo and header scaling
      var maxLogoScale = 150; // Original width
      var minLogoScale = 100; // Reduced width in sticky state
      var maxScroll = 300; // Adjust this value to set when the scaling stops

      var logoWidth = maxLogoScale - scrollTop / maxScroll * (maxLogoScale - minLogoScale);
      logoWidth = Math.max(logoWidth, minLogoScale);
      this.logo.css('width', logoWidth + 'px');
      var maxPadding = 10; // Original padding top/bottom
      var minPadding = 5; // Reduced padding in sticky state

      var headerPadding = maxPadding - scrollTop / maxScroll * (maxPadding - minPadding);
      headerPadding = Math.max(headerPadding, minPadding);
      this.stickyHeader.css('padding', headerPadding + 'px 20px');
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;
      $(window).scroll(function () {
        return _this.makeSticky();
      });
    }
  }]);
}();
var _default = exports["default"] = function _default() {
  return new StickyHeader().init();
};
//# sourceMappingURL=sticky-header.js.map
