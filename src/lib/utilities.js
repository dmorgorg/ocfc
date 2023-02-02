import katex from 'katex';

export const ki = (tex) => {
	return katex.renderToString(tex);
};
export const kd = (tex) => {
	return katex.renderToString(tex, { displayMode: true });
};

export const utils = {
	rad: (degrees) => {
		return degrees * Math.PI / 180;
	},
	deg: (radians) => {
		return radians / Math.PI * 180;
	},
	// num is a string, sigDigs an integer, returns string with the specified number of sig digs
	sd: function (num, sigDigs) {
		return parseFloat(num).toPrecision(sigDigs);
	},
};
