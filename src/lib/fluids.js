export const fluid = {
  getV: function (n, R, S) {
    return Number(utils.sdw((1 / n) * R ** (2 / 3) * (S / 100) ** 0.5));
  },
  getNF: function (v, A, T, g) {
    return Number(utils.sdw(v / ((g * A) / T) ** 0.5));
  },
  getE: function (y, v, g) {
    return Number(utils.sdw(y + v ** 2 / 2 / g));
  },
  getCriticalSlope: function (n, vc, Rc) {
    return Number(utils.sdw(((n * vc) / Rc ** (2 / 3)) ** 2 * 100));
  },
};
export const processChange = utils.debounce((e) => {
  if (e.target.id === "diam") {
    if (e.target.value === "") {
      Ds = Math.max(y, initDiam);
    }
    Ds = Ds < ys ? ys : Ds;
    D = Number(Ds);
    Ds = sds(Ds);
  }
  if (e.target.id === "depth") {
    if (e.target.value === "") {
      ys = Math.min(initDepth, D);
    }
    ys = ys > Ds ? Ds : ys;
    y = Number(ys);
    ys = sds(ys);
  }
  if (e.target.id === "slope") {
    if (e.target.value === "") {
      ss = sds(initSlope);
    }
    ss = ss < 0 ? -ss : ss;
    validS = s === 0 ? false : true;
    s = Number(ss);
    ss = sds(ss);
  }
  if (e.target.id === "n") {
    if (e.target.value === "") {
      ss = sds(initN);
    }
    ns = ns < 0 ? -ns : ns;
    n = Number(ns);
    ss = sds(ns);
  }
  if (e.target.id === "g") {
    if (e.target.value === "") {
      ss = sds(initG);
    }
    gs = gs < 0 ? -gs : gs;
    g = Number(gs);
    ss = sds(gs);
  }
}, 2000);
