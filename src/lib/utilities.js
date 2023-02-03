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
	sd: function (num, sigDigs) {
		return parseFloat(num).toPrecision(sigDigs);
	},
	sds: (num, digs = sdigs) => {
		let n = num,
			d = digs;

		if (extraDig) {
			n = num.toString();
			while (n[0] === "0" || n[0] === ".") {
				n = n.slice(1);
			}
		}
		if (n[0] == "1") {
			d++;
		}
		return parseFloat(n).toPrecision(d);
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
	getV: (n, R, S) => {
		return (1 / n) * R ** (2 / 3) * (S / 100) ** 0.5;
	},
	getNF: (v, A, T, g) =>{
		return v / ((g * A) / T) ** 0.5;
	},
	getE: (y, v, g) => {
		return y + v ** 2 / 2 / g;
	},
	getCriticalSlope: (n, vc, Rc) => {
		return (((n * vc) / Rc ** (2 / 3)) ** 2 * 100);
	},
};
