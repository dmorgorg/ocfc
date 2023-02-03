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