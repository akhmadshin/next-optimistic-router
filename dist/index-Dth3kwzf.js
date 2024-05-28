function ae(n, l) {
  for (var c = 0; c < l.length; c++) {
    const s = l[c];
    if (typeof s != "string" && !Array.isArray(s)) {
      for (const a in s)
        if (a !== "default" && !(a in n)) {
          const f = Object.getOwnPropertyDescriptor(s, a);
          f && Object.defineProperty(n, a, f.get ? f : {
            enumerable: !0,
            get: () => s[a]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
function ie(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var P = { exports: {} }, t = {};
/**
 * @license React
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var O;
function ce() {
  if (O)
    return t;
  O = 1;
  var n = Symbol.for("react.element"), l = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), f = Symbol.for("react.provider"), d = Symbol.for("react.context"), T = Symbol.for("react.server_context"), m = Symbol.for("react.forward_ref"), E = Symbol.for("react.suspense"), p = Symbol.for("react.suspense_list"), v = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), R = Symbol.for("react.offscreen"), _;
  _ = Symbol.for("react.module.reference");
  function i(e) {
    if (typeof e == "object" && e !== null) {
      var S = e.$$typeof;
      switch (S) {
        case n:
          switch (e = e.type, e) {
            case c:
            case a:
            case s:
            case E:
            case p:
              return e;
            default:
              switch (e = e && e.$$typeof, e) {
                case T:
                case d:
                case m:
                case y:
                case v:
                case f:
                  return e;
                default:
                  return S;
              }
          }
        case l:
          return S;
      }
    }
  }
  return t.ContextConsumer = d, t.ContextProvider = f, t.Element = n, t.ForwardRef = m, t.Fragment = c, t.Lazy = y, t.Memo = v, t.Portal = l, t.Profiler = a, t.StrictMode = s, t.Suspense = E, t.SuspenseList = p, t.isAsyncMode = function() {
    return !1;
  }, t.isConcurrentMode = function() {
    return !1;
  }, t.isContextConsumer = function(e) {
    return i(e) === d;
  }, t.isContextProvider = function(e) {
    return i(e) === f;
  }, t.isElement = function(e) {
    return typeof e == "object" && e !== null && e.$$typeof === n;
  }, t.isForwardRef = function(e) {
    return i(e) === m;
  }, t.isFragment = function(e) {
    return i(e) === c;
  }, t.isLazy = function(e) {
    return i(e) === y;
  }, t.isMemo = function(e) {
    return i(e) === v;
  }, t.isPortal = function(e) {
    return i(e) === l;
  }, t.isProfiler = function(e) {
    return i(e) === a;
  }, t.isStrictMode = function(e) {
    return i(e) === s;
  }, t.isSuspense = function(e) {
    return i(e) === E;
  }, t.isSuspenseList = function(e) {
    return i(e) === p;
  }, t.isValidElementType = function(e) {
    return typeof e == "string" || typeof e == "function" || e === c || e === a || e === s || e === E || e === p || e === R || typeof e == "object" && e !== null && (e.$$typeof === y || e.$$typeof === v || e.$$typeof === f || e.$$typeof === d || e.$$typeof === m || e.$$typeof === _ || e.getModuleId !== void 0);
  }, t.typeOf = i, t;
}
var o = {};
/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var x;
function fe() {
  return x || (x = 1, process.env.NODE_ENV !== "production" && function() {
    var n = Symbol.for("react.element"), l = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), f = Symbol.for("react.provider"), d = Symbol.for("react.context"), T = Symbol.for("react.server_context"), m = Symbol.for("react.forward_ref"), E = Symbol.for("react.suspense"), p = Symbol.for("react.suspense_list"), v = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), R = Symbol.for("react.offscreen"), _ = !1, i = !1, e = !1, S = !1, F = !1, M;
    M = Symbol.for("react.module.reference");
    function I(r) {
      return !!(typeof r == "string" || typeof r == "function" || r === c || r === a || F || r === s || r === E || r === p || S || r === R || _ || i || e || typeof r == "object" && r !== null && (r.$$typeof === y || r.$$typeof === v || r.$$typeof === f || r.$$typeof === d || r.$$typeof === m || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      r.$$typeof === M || r.getModuleId !== void 0));
    }
    function u(r) {
      if (typeof r == "object" && r !== null) {
        var C = r.$$typeof;
        switch (C) {
          case n:
            var b = r.type;
            switch (b) {
              case c:
              case a:
              case s:
              case E:
              case p:
                return b;
              default:
                var g = b && b.$$typeof;
                switch (g) {
                  case T:
                  case d:
                  case m:
                  case y:
                  case v:
                  case f:
                    return g;
                  default:
                    return C;
                }
            }
          case l:
            return C;
        }
      }
    }
    var L = d, h = f, Y = n, N = m, D = c, j = y, z = v, V = l, q = a, U = s, W = E, k = p, $ = !1, A = !1;
    function X(r) {
      return $ || ($ = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 18+.")), !1;
    }
    function G(r) {
      return A || (A = !0, console.warn("The ReactIs.isConcurrentMode() alias has been deprecated, and will be removed in React 18+.")), !1;
    }
    function H(r) {
      return u(r) === d;
    }
    function Z(r) {
      return u(r) === f;
    }
    function B(r) {
      return typeof r == "object" && r !== null && r.$$typeof === n;
    }
    function J(r) {
      return u(r) === m;
    }
    function K(r) {
      return u(r) === c;
    }
    function Q(r) {
      return u(r) === y;
    }
    function ee(r) {
      return u(r) === v;
    }
    function re(r) {
      return u(r) === l;
    }
    function te(r) {
      return u(r) === a;
    }
    function oe(r) {
      return u(r) === s;
    }
    function ne(r) {
      return u(r) === E;
    }
    function se(r) {
      return u(r) === p;
    }
    o.ContextConsumer = L, o.ContextProvider = h, o.Element = Y, o.ForwardRef = N, o.Fragment = D, o.Lazy = j, o.Memo = z, o.Portal = V, o.Profiler = q, o.StrictMode = U, o.Suspense = W, o.SuspenseList = k, o.isAsyncMode = X, o.isConcurrentMode = G, o.isContextConsumer = H, o.isContextProvider = Z, o.isElement = B, o.isForwardRef = J, o.isFragment = K, o.isLazy = Q, o.isMemo = ee, o.isPortal = re, o.isProfiler = te, o.isStrictMode = oe, o.isSuspense = ne, o.isSuspenseList = se, o.isValidElementType = I, o.typeOf = u;
  }()), o;
}
process.env.NODE_ENV === "production" ? P.exports = ce() : P.exports = fe();
var w = P.exports;
const ue = /* @__PURE__ */ ie(w), le = /* @__PURE__ */ ae({
  __proto__: null,
  default: ue
}, [w]);
export {
  le as i
};
