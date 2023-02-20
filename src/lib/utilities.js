import katex from "katex";

export const ki = (tex) => {
  return katex.renderToString(tex);
};
export const kd = (tex) => {
  return katex.renderToString(tex, { displayMode: true });
};

export const utils = {
  rad: (degrees) => {
    return (degrees * Math.PI) / 180;
  },
  deg: (radians) => {
    return (radians / Math.PI) * 180;
  },
  // num is a string, sigDigs an integer, returns string with the specified number of sig digs
  // sd: function (num, sigDigs) {
  // 	return parseFloat(num).toPrecision(sigDigs);
  // },
  sd: (num, digs = 3, extraDig = true) => {
    if (num && digs) {
      if (extraDig) {
        let n = num.toString();
        while (n[0] === "0" || n[0] === ".") {
          n = n.slice(1);
        }
        if (n[0] == "1") {
          digs++;
        }
      }
      return parseFloat(num).toPrecision(digs);
    }
  },

  // https://www.freecodecamp.org/news/javascript-debounce-example/
  debounce: function (func, timeout = 1500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  },
};

export const fluids = {
  getArea: (b, y) => {
    return b * y;
  },
  getP: (b, y) => {
    return +b + 2 * y;
  },
  getR: (A, P) => {
    return A / P;
  },
  getV: (n, R, s) => {
    return (1 / n) * R ** (2 / 3) * (s / 100) ** 0.5;
  },
  getQfromAandV: (A, v) => {
    return A * v;
  },
  getNF: (v, A, T, g) => {
    return v / ((g * A) / T) ** 0.5;
  },
  // variables are strings which convert fine with * and / but be careful with + to avoid concatenation!
  getE: (y, v, g) => {
    return v ** 2 / 2 / g + +y;
  },
  getCriticalSlope: (n, vc, Rc) => {
    return ((n * vc) / Rc ** (2 / 3)) ** 2 * 100;
  },

  getVfromQandA: (Q, A) => {
    return Q / A;
  },
  getCriticalSlope: (n, vc, Rc) => {
    return ((n * vc) / Rc ** (2 / 3)) ** 2 * 100;
  },
};

export const rect = {
  getArea: (b, y) => {
    return b * y;
  },
  getP: (b, y) => {
    return +b + 2 * y;
  },
  getT: (b) => {
    return b;
  },
  getYc: (Q, g, b) => {
    return ((Q * Q) / g / b / b) ** (1 / 3);
  },
};
export const trap = {
  getArea: (y, zl, b, zr) => {
    return b * y + +((y * y) / 2) * (+zl + +zr);
  },
  getP: (y, zl, b, zr) => {
    return +b + y * ((1 + zl ** 2) ** 0.5 + (1 + zr ** 2) ** 0.5);
  },
  getT: (y, zl, b, zr) => {
    return +b + +y * (+zl + +zr);
  },
};
export const tri = {
  getArea: (y, zl, zr) => {
    return y ** 2 * (zl / 2 + zr / 2);
  },
  getP: (y, zl, zr) => {
    return y * (1 + zl * zl) ** 0.5 + y * (1 + zr * zr) ** 0.5;
  },
  getT: (y, zl, zr) => {
    return y * zl + y * zr;
  },
  getYc: (Q, zl, zr, g) => {
    return ((8 * Q * Q) / g / (+zl / 1 + zr / 1) ** 2) ** 0.2;
  },
  getVc: (Q, y, zl, zr) => {
    return Q / tri.getArea(y, zl, zr);
  },
};
export const circ = {
  getAlphaRadians: (y, r) => {
    y = y > 2 * r ? 2 * r : y;
    return Math.acos(Math.abs(r - y) / r);
  },
  getAlphaDegrees: (y, r) => {
    return utils.deg(circ.getAlphaRadians(y, r));
  },
  getThetaRadians: (y, r) => {
    y = y > 2 * r ? 2 * r : y;
    if (y <= r) {
      return 2 * circ.getAlphaRadians(y, r);
    }
    return 2 * (Math.PI - circ.getAlphaRadians(y, r));
  },
  getThetaDegrees: (y, r) => {
    return utils.deg(circ.getThetaRadians(y, r));
  },
  getArea: (thetaR, D) => {
    return ((thetaR - Math.sin(thetaR)) * D ** 2) / 8;
  },
  getP: (thetaR, D) => {
    return (thetaR * D) / 2;
  },
  getT: (alpha, D) => {
    return D * Math.sin(utils.rad(alpha));
  },
};
