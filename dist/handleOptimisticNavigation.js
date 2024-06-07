var U = {}, I = {};
(function(e) {
  Object.defineProperty(e, "__esModule", {
    value: !0
  });
  function o(t, c) {
    for (var h in c)
      Object.defineProperty(t, h, {
        enumerable: !0,
        get: c[h]
      });
  }
  o(e, {
    DecodeError: function() {
      return P;
    },
    MiddlewareNotFoundError: function() {
      return j;
    },
    MissingStaticPage: function() {
      return M;
    },
    NormalizeError: function() {
      return y;
    },
    PageNotFoundError: function() {
      return m;
    },
    SP: function() {
      return g;
    },
    ST: function() {
      return v;
    },
    WEB_VITALS: function() {
      return u;
    },
    execOnce: function() {
      return n;
    },
    getDisplayName: function() {
      return r;
    },
    getLocationOrigin: function() {
      return a;
    },
    getURL: function() {
      return f;
    },
    isAbsoluteUrl: function() {
      return i;
    },
    isResSent: function() {
      return s;
    },
    loadGetInitialProps: function() {
      return p;
    },
    normalizeRepeatedSlashes: function() {
      return d;
    },
    stringifyError: function() {
      return A;
    }
  });
  const u = [
    "CLS",
    "FCP",
    "FID",
    "INP",
    "LCP",
    "TTFB"
  ];
  function n(t) {
    let c = !1, h;
    return function() {
      for (var O = arguments.length, _ = new Array(O), E = 0; E < O; E++)
        _[E] = arguments[E];
      return c || (c = !0, h = t(..._)), h;
    };
  }
  const l = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/, i = (t) => l.test(t);
  function a() {
    const { protocol: t, hostname: c, port: h } = window.location;
    return t + "//" + c + (h ? ":" + h : "");
  }
  function f() {
    const { href: t } = window.location, c = a();
    return t.substring(c.length);
  }
  function r(t) {
    return typeof t == "string" ? t : t.displayName || t.name || "Unknown";
  }
  function s(t) {
    return t.finished || t.headersSent;
  }
  function d(t) {
    const c = t.split("?");
    return c[0].replace(/\\/g, "/").replace(/\/\/+/g, "/") + (c[1] ? "?" + c.slice(1).join("?") : "");
  }
  async function p(t, c) {
    if (process.env.NODE_ENV !== "production") {
      var h;
      if ((h = t.prototype) != null && h.getInitialProps) {
        const E = '"' + r(t) + '.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.';
        throw new Error(E);
      }
    }
    const O = c.res || c.ctx && c.ctx.res;
    if (!t.getInitialProps)
      return c.ctx && c.Component ? {
        pageProps: await p(c.Component, c.ctx)
      } : {};
    const _ = await t.getInitialProps(c);
    if (O && s(O))
      return _;
    if (!_) {
      const E = '"' + r(t) + '.getInitialProps()" should resolve to an object. But found "' + _ + '" instead.';
      throw new Error(E);
    }
    return process.env.NODE_ENV !== "production" && Object.keys(_).length === 0 && !c.ctx && console.warn("" + r(t) + " returned an empty object from `getInitialProps`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps"), _;
  }
  const g = typeof performance < "u", v = g && [
    "mark",
    "measure",
    "getEntriesByName"
  ].every((t) => typeof performance[t] == "function");
  class P extends Error {
  }
  class y extends Error {
  }
  class m extends Error {
    constructor(c) {
      super(), this.code = "ENOENT", this.name = "PageNotFoundError", this.message = "Cannot find module for page: " + c;
    }
  }
  class M extends Error {
    constructor(c, h) {
      super(), this.message = "Failed to load static file for page: " + c + " " + h;
    }
  }
  class j extends Error {
    constructor() {
      super(), this.code = "ENOENT", this.message = "Cannot find the middleware module";
    }
  }
  function A(t) {
    return JSON.stringify({
      message: t.message,
      stack: t.stack
    });
  }
})(I);
var N = { exports: {} }, L = {}, R = {};
(function(e) {
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), Object.defineProperty(e, "parsePath", {
    enumerable: !0,
    get: function() {
      return o;
    }
  });
  function o(u) {
    const n = u.indexOf("#"), l = u.indexOf("?"), i = l > -1 && (n < 0 || l < n);
    return i || n > -1 ? {
      pathname: u.substring(0, i ? l : n),
      query: i ? u.substring(l, n > -1 ? n : void 0) : "",
      hash: n > -1 ? u.slice(n) : ""
    } : {
      pathname: u,
      query: "",
      hash: ""
    };
  }
})(R);
(function(e) {
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), Object.defineProperty(e, "pathHasPrefix", {
    enumerable: !0,
    get: function() {
      return u;
    }
  });
  const o = R;
  function u(n, l) {
    if (typeof n != "string")
      return !1;
    const { pathname: i } = (0, o.parsePath)(n);
    return i === l || i.startsWith(l + "/");
  }
})(L);
(function(e, o) {
  Object.defineProperty(o, "__esModule", {
    value: !0
  }), Object.defineProperty(o, "hasBasePath", {
    enumerable: !0,
    get: function() {
      return l;
    }
  });
  const u = L, n = process.env.__NEXT_ROUTER_BASEPATH || "";
  function l(i) {
    return (0, u.pathHasPrefix)(i, n);
  }
  (typeof o.default == "function" || typeof o.default == "object" && o.default !== null) && typeof o.default.__esModule > "u" && (Object.defineProperty(o.default, "__esModule", { value: !0 }), Object.assign(o.default, o), e.exports = o.default);
})(N, N.exports);
var B = N.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", {
    value: !0
  }), Object.defineProperty(e, "isLocalURL", {
    enumerable: !0,
    get: function() {
      return n;
    }
  });
  const o = I, u = B;
  function n(l) {
    if (!(0, o.isAbsoluteUrl)(l))
      return !0;
    try {
      const i = (0, o.getLocationOrigin)(), a = new URL(l, i);
      return a.origin === i && (0, u.hasBasePath)(a.pathname);
    } catch {
      return !1;
    }
  }
})(U);
var T = {}, b = {};
function q(e) {
  if (typeof WeakMap != "function")
    return null;
  var o = /* @__PURE__ */ new WeakMap(), u = /* @__PURE__ */ new WeakMap();
  return (q = function(n) {
    return n ? u : o;
  })(e);
}
b._ = b._interop_require_wildcard = W;
function W(e, o) {
  if (!o && e && e.__esModule)
    return e;
  if (e === null || typeof e != "object" && typeof e != "function")
    return { default: e };
  var u = q(o);
  if (u && u.has(e))
    return u.get(e);
  var n = { __proto__: null }, l = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var i in e)
    if (i !== "default" && Object.prototype.hasOwnProperty.call(e, i)) {
      var a = l ? Object.getOwnPropertyDescriptor(e, i) : null;
      a && (a.get || a.set) ? Object.defineProperty(n, i, a) : n[i] = e[i];
    }
  return n.default = e, u && u.set(e, n), n;
}
var w = {}, S;
function D() {
  return S || (S = 1, function(e) {
    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    function o(a, f) {
      for (var r in f)
        Object.defineProperty(a, r, {
          enumerable: !0,
          get: f[r]
        });
    }
    o(e, {
      assign: function() {
        return i;
      },
      searchParamsToUrlQuery: function() {
        return u;
      },
      urlQueryToSearchParams: function() {
        return l;
      }
    });
    function u(a) {
      const f = {};
      return a.forEach((r, s) => {
        typeof f[s] > "u" ? f[s] = r : Array.isArray(f[s]) ? f[s].push(r) : f[s] = [
          f[s],
          r
        ];
      }), f;
    }
    function n(a) {
      return typeof a == "string" || typeof a == "number" && !isNaN(a) || typeof a == "boolean" ? String(a) : "";
    }
    function l(a) {
      const f = new URLSearchParams();
      return Object.entries(a).forEach((r) => {
        let [s, d] = r;
        Array.isArray(d) ? d.forEach((p) => f.append(s, n(p))) : f.set(s, n(d));
      }), f;
    }
    function i(a) {
      for (var f = arguments.length, r = new Array(f > 1 ? f - 1 : 0), s = 1; s < f; s++)
        r[s - 1] = arguments[s];
      return r.forEach((d) => {
        Array.from(d.keys()).forEach((p) => a.delete(p)), d.forEach((p, g) => a.append(g, p));
      }), a;
    }
  }(w)), w;
}
(function(e) {
  Object.defineProperty(e, "__esModule", {
    value: !0
  });
  function o(r, s) {
    for (var d in s)
      Object.defineProperty(r, d, {
        enumerable: !0,
        get: s[d]
      });
  }
  o(e, {
    formatUrl: function() {
      return i;
    },
    formatWithValidation: function() {
      return f;
    },
    urlObjectKeys: function() {
      return a;
    }
  });
  const n = /* @__PURE__ */ b._(D()), l = /https?|ftp|gopher|file/;
  function i(r) {
    let { auth: s, hostname: d } = r, p = r.protocol || "", g = r.pathname || "", v = r.hash || "", P = r.query || "", y = !1;
    s = s ? encodeURIComponent(s).replace(/%3A/i, ":") + "@" : "", r.host ? y = s + r.host : d && (y = s + (~d.indexOf(":") ? "[" + d + "]" : d), r.port && (y += ":" + r.port)), P && typeof P == "object" && (P = String(n.urlQueryToSearchParams(P)));
    let m = r.search || P && "?" + P || "";
    return p && !p.endsWith(":") && (p += ":"), r.slashes || (!p || l.test(p)) && y !== !1 ? (y = "//" + (y || ""), g && g[0] !== "/" && (g = "/" + g)) : y || (y = ""), v && v[0] !== "#" && (v = "#" + v), m && m[0] !== "?" && (m = "?" + m), g = g.replace(/[?#]/g, encodeURIComponent), m = m.replace("#", "%23"), "" + p + y + g + m + v;
  }
  const a = [
    "auth",
    "hash",
    "host",
    "hostname",
    "href",
    "path",
    "pathname",
    "port",
    "protocol",
    "query",
    "search",
    "slashes"
  ];
  function f(r) {
    return process.env.NODE_ENV === "development" && r !== null && typeof r == "object" && Object.keys(r).forEach((s) => {
      a.includes(s) || console.warn("Unknown key passed via urlObject into url.format: " + s);
    }), i(r);
  }
})(T);
const Q = (e, o, u) => {
  const n = typeof e == "string" ? e : T.formatWithValidation(e);
  if (!U.isLocalURL(n) || n.startsWith("#"))
    return;
  u && u();
  const i = o == null ? void 0 : o.router;
  !i || !i.getRouteInfoOnly || (i.getRouteInfo = i.getRouteInfoOnly);
};
export {
  Q as handleOptimisticNavigation
};
