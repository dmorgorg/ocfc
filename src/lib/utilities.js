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
	sds: (num, digs = 3, extraDig = true) => {
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
		return +b + +y*(+zl + +zr);
	}
};
export const tri = {
	getArea: (b, y) => {
		return b * y;
	},
	getP: (b, y) => {
		return +b + 2 * y;
	},
};
export const circ = {
	getArea: (b, y) => {
		return b * y;
	},
	getP: (b, y) => {
		return +b + 2 * y;
	},
};
