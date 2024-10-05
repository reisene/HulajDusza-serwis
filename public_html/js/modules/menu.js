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
/**
 * @description Handles menu interactions and animations, including toggling the menu,
 * handling outside clicks, window resizing, and adding an 'active' class to the
 * current menu item based on the URL.
 */
var Menu = /*#__PURE__*/function () {
  /**
   * @description Initializes the object's properties by selecting and storing DOM
   * elements using jQuery. The properties are:
   * - `menu`: a list of menu items within a navigation bar,
   * - `menuToggle`: an element to toggle the menu,
   * - `menuIcon`: an icon related to the menu,
   * - `closeIcon`: an icon to close the menu.
   */
  function Menu() {
    _classCallCheck(this, Menu);
    this.menu = $('nav.menu ul');
    this.menuToggle = $('.menu-toggle');
    this.menuIcon = $('.menu-icon');
    this.closeIcon = $('.close-icon');
  }

  /**
   * @description Handles the initialization of the menu functionality, including
   * toggling the menu, handling click events outside the menu, resizing the menu, and
   * adding an 'active' class to the current menu item based on the current URL.
   */
  return _createClass(Menu, [{
    key: "init",
    value: function init() {
      this.handleMenuToggle();
      this.handleDocumentClick();
      this.handleWindowResize();
      this.addActiveClassToMenuItem();
    }
  }, {
    key: "handleMenuToggle",
    value: function handleMenuToggle() {
      var _this = this;
      this.menuToggle.click(function () {
        if (!_this.menu.hasClass('active')) {
          _this.menu.addClass('active').css('animation', 'menu-opacityup 0.2s ease-in-out forwards');
        } else {
          _this.menu.css('animation', 'menu-opacitydown 0.2s ease-in-out forwards');
          setTimeout(function () {
            _this.menu.removeClass('active');
          }, 200); // Adjust to animation duration
        }
        _this.menuIcon.toggle();
        _this.closeIcon.toggle();
      });
    }
  }, {
    key: "handleDocumentClick",
    value: function handleDocumentClick() {
      var _this2 = this;
      $(document).click(function (event) {
        if (!_this2.menu.is(event.target) && _this2.menu.has(event.target).length === 0 && !_this2.menuToggle.is(event.target) && _this2.menuToggle.has(event.target).length === 0 && _this2.menu.hasClass('active')) {
          _this2.menu.css('animation', 'menu-opacitydown 0.2sease-in-out forwards');
          setTimeout(function () {
            _this2.menu.removeClass('active');
            _this2.closeIcon.hide();
            if ($(window).width() <= 768) {
              _this2.menuIcon.show();
            }
          }, 200); // Adjust to animation duration
        }
      });
    }
  }, {
    key: "handleWindowResize",
    value: function handleWindowResize() {
      var _this3 = this;
      $(window).resize(function () {
        if ($(window).width() > 768) {
          _this3.menuIcon.hide();
          _this3.closeIcon.hide();
        } else if (!_this3.menu.hasClass('active')) {
          _this3.menuIcon.show();
        }
      });
    }
  }, {
    key: "addActiveClassToMenuItem",
    value: function addActiveClassToMenuItem() {
      var currentUrl = window.location.href;
      var baseUrl = window.location.origin; // Get thebase URL

      $('nav.menu ul li a').each(function (index, element) {
        var linkUrl = element.href;

        // Check if the link is to the homepage
        if (linkUrl === currentUrl || linkUrl === "".concat(baseUrl, "/") && currentUrl === "".concat(baseUrl, "/") || linkUrl === "".concat(baseUrl, "/index.html") && (currentUrl === "".concat(baseUrl, "/") || currentUrl === "".concat(baseUrl, "/index.html"))) {
          $(element).parent().addClass('active');
        }
      });
    }
  }]);
}();
var _default = exports["default"] = Menu;
//# sourceMappingURL=menu.js.map
