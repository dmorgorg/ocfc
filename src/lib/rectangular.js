export const rect = {
	A: (b, y) => {
		return b * y;
	},
	WP: (b, y) => {
		return b + 2 * y;
	},
	R: (a, wp) => {
		return a / wp;
	},
};
