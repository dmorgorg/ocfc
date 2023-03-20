<script>
  import Card from "./Card.svelte";
  import { sigdigs } from "../stores.js";
  import { ki, kd, utils } from "$lib/utilities";
  import { common, circ } from "$lib/fluids";

  let sdigs = $sigdigs.sdigs,
    wdigs = $sigdigs.wdigs,
    extraDig = $sigdigs.extraDig,
    extraWorkingDig = $sigdigs.extraWorkingDig,
    validS = true,
    initY = 0.938,
    initD = 1,
    initS = 0.1,
    initN = 0.013,
    initG = 9.81;

  // needs access to n, b, s so has to be in this file?

  $: getQfromAll = (y, diam = D, slope = s, mannings = n, gravity = g) => {
    const alpha = sdw(circ.getAlphaDegrees(y, diam / 2));
    const thetaRad = sdw(circ.getThetaRadians(y, diam / 2));
    const A = sdw(circ.getArea(thetaRad, diam));
    const P = sdw(circ.getP(thetaRad, diam));
    const R = sdw(common.getR(A, P));
    const v = sdw(common.getV(mannings, R, slope));
    const Q = sdw(common.getQfromAandV(A, v));
    return Q;
  };
  // just run this once when coding to find numerical value for y_max
  // $: getMax = () => {
  //   //start at 90%
  //   let y = 0.9 * D,
  //     Q = 0;
  //   for (; ; y = +y + 1 / 10 ** 5) {
  //     let q = getQfromAll(y);
  //     console.log(y + ", " + q);
  //     if (q >= Q) {
  //       Q = q;
  //     } else {
  //       console.log(y + ", " + q);
  //       break;
  //     }
  //   }
  //   return [y / D, Q];
  // };

  $: getNFfromY = (y) => {
    const r = D / 2;
    const thetaRad = circ.getThetaRadians(y, r);
    const alpha = circ.getAlphaDegrees(y, r);
    const T = circ.getT(alpha, D);
    const A = circ.getArea(thetaRad, D);
    const v = Q / A;
    return common.getNF(v, A, T, g);
  };

  $: getYc = (shallow = 0, deep = D) => {
    const delta = 1 / 10 ** wdigs,
      mid = (deep + shallow) / 2;

    if (Math.abs(deep - shallow) < delta) {
      return mid;
    }

    // do the search
    if (getNFfromY(mid) < 1) {
      return getYc(shallow, mid);
    } else {
      return getYc(mid, deep);
    }
  };
  $: getYfromQ = (shallow = 0, deep = D) => {
    const delta = 1 / 10 ** wdigs,
      mid = (deep + shallow) / 2;

    if (Math.abs(deep - shallow) < delta) {
      return mid;
    }

    // do the search
    if (getNFfromY(mid) < 1) {
      return getYc(shallow, mid);
    } else {
      return getYc(mid, deep);
    }
  };

  $: Qfull = getQfromAll(D);
  // $: max = getMax();
  // $: yMax = max[0];
  // $: QMax = max[1];
  $: QMax = getQfromAll(0.9381 * D);
  $: yMax = 0.9381 * D;

  const sdw = (num) => {
    return utils.sd(num, wdigs, extraWorkingDig);
  };
  const sds = (num) => {
    return utils.sd(num, sdigs, extraDig);
  };
  const sd = utils.sd;

  const processChange = utils.debounce((e) => {
    if (e.target.id === "diam") {
      if (e.target.value === "") {
        Ds = sds(Math.max(y, initD));
      }
      Ds = sds(Ds < ys ? ys : Ds);
      D = Number(Ds);
    }
    if (e.target.id === "depth") {
      if (e.target.value === "") {
        ys = Math.min(initY, D);
      }
      ys = Math.abs(ys);
      ys = sds(ys > Ds ? Ds : ys);
      y = Number(ys);
    }
    if (e.target.id === "slope") {
      if (e.target.value === "") {
        ss = sds(initS);
      }
      ss = sds(Math.abs(Number(ss)));
      validS = s === 0 ? false : true;
      s = Number(ss);
    }
    if (e.target.id === "n") {
      if (e.target.value === "") {
        ns = sds(initN);
      }
      ns = sds(Math.abs(Number(ns)));
      n = Number(ns);
    }
    if (e.target.id === "g") {
      if (e.target.value === "") {
        gs = sds(initG);
      }
      gs = Math.abs(Number(gs)).toString();
      if (gs.length > 4) {
        gs = sd(Number(gs), 4);
      } else {
        gs = sds(gs);
      }
      g = Number(gs);
    }
  });

  // variables ending in s are string inputs, bound to numerical input fields
  $: Ds = sds(initD);
  $: ys = sds(initY);
  $: ss = sds(initS);
  $: ns = sds(initN);
  $: gs = sds(initG);

  // I'm not sure why but if I initialise these to string values, debounce doesn't delay update of calculations
  $: D = initD;
  $: y = initY;
  $: s = initS;
  $: n = initN;
  $: g = initG;

  $: r = sds(D / 2);
  // $: alphaRad = sdw(circ.getAlphaRadians(y, r));
  $: alpha = sdw(circ.getAlphaDegrees(y, r));
  $: thetaRad = sdw(circ.getThetaRadians(y, r));
  $: theta = sdw(circ.getThetaDegrees(y, r));
  $: A = sdw(circ.getArea(thetaRad, D));
  $: P = sdw(circ.getP(thetaRad, D));
  $: R = sdw(common.getR(A, P));
  $: v = sdw(common.getV(n, R, s));
  $: Q = sdw(common.getQfromAandV(A, v));
  $: E = sdw(common.getE(y, v, g));
  $: T = sdw(circ.getT(alpha, D));
  $: NF = sdw(common.getNF(v, A, T, g));
  $: thetaCriticalCoeff = sdw((512 * Q * Q) / D ** 5 / g);
  $: yc = sdw(getYc());
  $: thetaCrad = sdw(circ.getThetaRadians(yc, r));
  $: thetaC = sdw(circ.getThetaDegrees(yc, r));
  $: alphaC = sdw(circ.getAlphaDegrees(yc, r));
  $: alphaCrad = sdw(circ.getAlphaRadians(yc, r));
  $: Ac = sdw(circ.getArea(thetaCrad, D));
  $: Pc = sdw(circ.getP(thetaCrad, D));
  $: Rc = sdw(common.getR(Ac, Pc));
  $: vc = sdw(common.getVfromQandA(Q, Ac));
  $: Emin = sdw(common.getE(yc, vc, g));
  $: Sc = sdw(common.getCriticalSlope(n, vc, Rc));
</script>

<article>
  <section class="fig">
    <div class="width90">
      <div class:hide={!(y === D)} class:show={y === D}>
        <img src="/ocfc/circ10.png" alt="full circular pipe" />
      </div>
      <div
        class:hide={!(y >= 0.925 * D && y < D)}
        class:show={y >= 0.925 * D && y < D}
      >
        <img src="/ocfc/circMax.png" alt="max flow depth circular pipe" />
      </div>
      <div
        class:hide={!(y >= 0.85 * D && y < 0.925 * D)}
        class:show={y >= 0.85 * D && y < 0.925 * D}
      >
        <img src="/ocfc/circ9.png" alt="90% flow depth circular pipe" />
      </div>
      <div
        class:hide={!(y >= 0.75 * D && y < 0.85 * D)}
        class:show={y >= 0.75 * D && y < 0.85 * D}
      >
        <img src="/ocfc/circ8.png" alt="80% flow depth circular pipe" />
      </div>
      <div
        class:hide={!(y >= 0.65 * D && y < 0.75 * D)}
        class:show={y >= 0.65 * D && y < 0.75 * D}
      >
        <img src="/ocfc/circ7.png" alt="70% flow depth circular pipe" />
      </div>
      <div
        class:hide={!(y > 0.5 * D && y < 0.65 * D)}
        class:show={y > 0.5 * D && y < 0.65 * D}
      >
        <img src="/ocfc/circ6.png" alt="60% flow depth circular pipe" />
      </div>
      <div class:hide={!(y === 0.5 * D)} class:show={y === 0.5 * D}>
        <img src="/ocfc/circ5.png" alt="50% flow depth circular pipe" />
      </div>
      <div
        class:hide={!(y >= 0.35 * D && y < 0.5 * D)}
        class:show={y >= 0.35 * D && y < 0.5 * D}
      >
        <img src="/ocfc/circ4.png" alt="40% flow depth circular pipe" />
      </div>
      <div
        class:hide={!(y >= 0.25 * D && y < 0.35 * D)}
        class:show={y >= 0.25 * D && y < 0.35 * D}
      >
        <img src="/ocfc/circ3.png" alt="30% flow depth circular pipe" />
      </div>
      <div
        class:hide={!(y >= 0.15 * D && y < 0.25 * D)}
        class:show={y >= 0.15 * D && y < 0.25 * D}
      >
        <img src="/ocfc/circ2.png" alt="20% flow depth circular pipe" />
      </div>
      <div
        class:hide={!(y > 0 && y < 0.15 * D)}
        class:show={y > 0 && y < 0.15 * D}
      >
        <img src="/ocfc/circ1.png" alt="10% flow depth circular pipe" />
      </div>
      <div class:hide={!(y === 0)} class:show={!(y === 0)}>
        <img src="/ocfc/circ0.png" alt="empty circular pipe" />
      </div>
    </div>

    <form>
      <label class="diam">
        {@html ki(`\\large D`)} =
        <input
          type="number"
          step="any"
          id="diam"
          bind:value={Ds}
          on:input={processChange}
        />
        {@html ki(`\\textsf{m}`)}
      </label>
      <br />
      {#if D}
        <label class="y">
          {@html ki(`\\large y=`)}
          <input
            type="number"
            step="any"
            id="depth"
            bind:value={ys}
            on:input={processChange}
          />
          {@html ki(`\\textsf{m}`)}
        </label>
      {/if}
    </form>
    <form>
      <div class="lower-inputs">
        <label class="slope">
          {@html ki(`\\large S=`)}
          <input
            type="number"
            step="any"
            id="slope"
            bind:value={ss}
            on:input={processChange}
          />
          {@html ki(`\\small\\%`)}
        </label>

        <label class="n">
          Mannings {@html ki(`\\large n =`)}
          <input
            type="number"
            step="any"
            id="n"
            bind:value={ns}
            on:input={processChange}
          />
        </label>

        <label class="g">
          {@html ki(`\\large g=`)}
          <input
            type="number"
            step="any"
            id="g"
            bind:value={gs}
            on:input={processChange}
          />
          {@html ki(`\\mathsf{m/s^2}`)}
        </label>
      </div>
    </form>
  </section>

  <div class="width90">
    <br /><br />
    <strong>Note</strong>: The <strong>maximum</strong> possible flow for this
    configuration of:
    <br />
    diameter {@html ki(`D=${sds(D)}\\,\\mathsf{m}`)}, slope {@html ki(
      `s=${sds(s)}\\%`
    )},
    <br />
    Manning's {@html ki(`n=${sds(n)}`)}
    and gravity {@html ki(`g=${sds(g)}\\,\\mathsf{m/s^2}`)} is
    {@html kd(`\\large\\bm{Q_{\\mathsf{max}}=${sds(QMax)}\\,\\mathsf{m^3/s}}`)}.
  </div>

  <section class="results">
    <h1>Normal (Uniform) Flow</h1>
    Coming soon!
    <!-- {#if y === D / 2} -->
    <!-- <Card
          answer="Flow Area: {ki(`A = ${sds(A)}\\, \\mathsf{m^2}`)}"
          solution={kd(`
						\\begin{aligned}
							A &= \\frac{\\pi r^2}{2}  \\\\
							&= \\frac{\\pi (D/2)^2}{2}  \\\\
							&= \\frac{\\pi (${r}\\, \\mathsf{m})^2}{2}  \\\\\\\\
							A &= ${A}\\, \\mathsf{m^2}
						\\end{aligned}
				`)}
        /> -->
    <!-- <Card
          answer="Wetted Perimeter: {ki(`P = ${sds(P)}\\, \\mathsf m`)}  "
          solution={kd(`
						\\begin{aligned}
							P &= \\frac{2\\pi r}{2} \\\\
							 &= \\frac{\\pi D}{2} \\\\
							 &= \\frac{\\pi (${sds(D)}\\, \\mathsf{m})}{2} \\\\\\\\
							P &= ${P}\\, \\mathsf{m}
						\\end{aligned}
				`)}
        /> -->
    <!-- {:else if y === D} -->
    <!-- <Card
          answer="Flow Area: {ki(`A = ${sds(A)}\\, \\mathsf{m^2}`)}"
          solution={kd(`
						\\begin{aligned}
							A &= \\pi r^2  \\\\
							&= \\pi (D/2)^2 \\\\
							&= \\pi (${r}\\, \\mathsf{m})^2 \\\\\\\\
							A &= ${A}\\, \\mathsf{m^2}
						\\end{aligned}
				`)}
        /> -->
    <!-- <Card
          answer="Wetted Perimeter: {ki(`P = ${sds(P)}\\, \\mathsf m`)}  "
          solution={kd(`
						\\begin{aligned}
							P &= 2\\pi r \\\\
							 &= \\pi D \\\\
							 &= \\pi (${sds(D)}\\, \\mathsf{m})\\\\\\\\
							P &= ${P}\\, \\mathsf{m}
						\\end{aligned}
				`)}
        /> -->
    <!-- {:else if y < D / 2} -->
    <!-- <Card
          answer={ki(`\\alpha = ${sdw(alpha)}^\\circ`)}
          solution={kd(`
						\\begin{aligned}
							\\alpha &= \\cos^{-1} \\left(\\frac{OA}{OB} \\right)\\\\
							&= \\cos^{-1} \\left(\\frac{D/2-y}{D/2} \\right)\\\\
							&= \\cos^{-1} \\left(\\frac{${r}\\, \\mathsf{m}-${sds(
            y
          )}\\, \\mathsf{m}}{${r}\\, \\mathsf{m}} \\right)\\\\\\\\
							\\alpha &= ${sdw(alpha)}^\\circ
						\\end{aligned}
					`)}
        /> -->
    <!-- <Card
          answer={ki(
            `\\theta = ${sdw(
              theta
            )}^\\circ\\quad (=${thetaRad}\\;\\mathsf{rad})`
          )}
          solution={kd(`
						\\begin{aligned}
							\\theta &= 2 \\alpha \\\\
							&= 2 \\left(${alpha}^\\circ \\right)\\\\
							&= ${2 * alpha}^\\circ \\\\\\\\
							
							\\theta_\\mathsf{rad} &= \\theta\\cdot\\frac{\\pi}{180^\\circ} \\\\
							&= ${theta}\\cdot\\frac{\\pi}{180^\\circ} \\\\\\\\
							\\theta_\\mathsf{rad} &= ${sdw(thetaRad)}
						\\end{aligned}
					`)}
        /> -->
    <!-- {:else if y > D / 2} -->
    <!-- <Card
          answer={ki(`\\alpha = ${sdw(alpha)}^\\circ`)}
          solution={kd(`
				\\begin{aligned}
					\\alpha &= \\cos^{-1} \\left(\\frac{OA}{OB} \\right)\\\\
					&= \\cos^{-1} \\left(\\frac{y-D/2}{D/2} \\right)\\\\
					&= \\cos^{-1} \\left(\\frac{${sds(
            y
          )}\\, \\mathsf{m}-${r}\\, \\mathsf{m}}{${r}\\, \\mathsf{m}} \\right)\\\\\\\\
					\\alpha &= ${sdw(alpha)}^\\circ
				\\end{aligned}
			`)}
        /> -->
    <!-- <Card
          answer={ki(
            `\\theta = ${sdw(
              theta
            )}^\\circ\\quad (=${thetaRad}\\;\\mathsf{rad})`
          )}
          solution={kd(`
					\\begin{aligned}
						\\theta &= 360^\\circ - 2 \\alpha \\\\
						&= 360^\\circ - 2 \\left(${alpha}^\\circ \\right)\\\\
						&= ${theta}^\\circ \\\\\\\\
						
						\\theta_\\mathsf{rad} &= \\theta\\cdot\\frac{\\pi}{180^\\circ} \\\\
						&= ${theta}^\\circ \\cdot\\frac{\\pi}{180^\\circ} \\\\\\\\
						\\theta_\\mathsf{rad} &= ${sdw(thetaRad)}
					\\end{aligned}
				`)}
        /> -->
    <!-- {/if}

      {#if y == D / 2 || y == D} -->
    <!-- <Card
          answer="Hydraulic Radius: {ki(`R = ${sds(R)}\\, \\mathsf m`)}  "
          solution={kd(`
				\\begin{aligned}
					R &= A/P \\\\
					&= \\frac{${A}\\, \\mathsf{m^2}}{ ${P}\\, \\mathsf{m}} \\\\\\\\
					R &= ${R} \\mathsf{m}
				\\end{aligned}
			`)}
        /> -->
    <!-- {:else} -->
    <!-- <Card
          answer="Flow Area: {ki(`A = ${sds(A)}\\, \\mathsf{m^2}`)}"
          solution="{kd(`
						\\begin{aligned}
							A &= \\frac{(\\theta-\\sin\\theta)D^2}{8}
						\\end{aligned}
						`)}
						<div style='width: 85%; margin-left: 7.5%; '>This area formula requires {ki(
            `\\theta`
          )} to be in radians. Rather than switching my calculator to radian mode (and possibly forgetting to change it back...), I choose to use {ki(
            `\\sin(${theta}^\\circ)`
          )} with {ki(
            `\\theta`
          )} in degrees and my calculator in degree mode, noting that {ki(
            `\\sin\\theta_{\\mathsf{rad}}`
          )} in radian mode has the same value as {ki(
            `\\sin\\theta`
          )} in degree mode.</div>
							{kd(`
							\\begin{aligned}                               
								A &= \\frac{(${thetaRad}-\\sin ${theta}^\\circ)\\cdot (${Ds}\\, \\mathsf{m})^2}{8} \\\\\\\\
								A &= ${A}\\, \\mathsf{m^2}
							\\end{aligned}
						`)}"
        /> -->
    <!-- <Card
          answer="Wetted Perimeter: {ki(`P = ${sds(P)}\\, \\mathsf m`)}  "
          solution={kd(`
						\\begin{aligned}
							P &= \\theta_{\\mathsf{rad}}\\cdot\\frac{D}{2}\\\\
							&= ${thetaRad}\\cdot\\frac{${Ds}\\, \\mathsf{m}}{2} \\\\\\\\
							P &= ${P}\\, \\mathsf{m}
						\\end{aligned}
				`)}
        /> -->
    <!-- <Card
          answer="Hydraulic Radius: {ki(`R = ${sds(R)}\\, \\mathsf m`)}  "
          solution="{kd(`
				\\begin{aligned}
					R &= A/P \\\\
					&= \\frac{${A}\\, \\mathsf{m^2}}{ ${P}\\, \\mathsf{m}} \\\\\\\\
					R &= ${R} \\mathsf{m}
				\\end{aligned}
			`)} 
			<div style='width: 85%; margin-left: 7.5%; '>Alternatively, use this formula that calculates the hydraulic radius directly without first calculating the wetted perimeter:</div>
			{kd(`
				\\begin{aligned}
					R &= \\left[\\frac{\\theta_{\\mathsf{rad}}-\\sin\\theta}{\\theta_\\mathsf{rad}} \\right] \\cdot \\frac D4 \\\\
					&= \\left[\\frac{${thetaRad}-\\sin ${theta}^\\circ}{${thetaRad}} \\right] \\cdot \\frac{${D}\\, \\mathsf{m}}{4} \\\\\\\\
					R &= ${R} \\mathsf{m}
				\\end{aligned}
			`)}"
        /> -->
    <!-- {/if} -->
    <!-- <Card
        answer="Average Flow Velocity: {ki(`v = ${sds(v)}\\, \\mathsf{m/s}`)}  "
        solution={kd(`
					\\begin{aligned}
						v &= \\frac 1n R^{2/3} S^{1/2} \\\\
						&= \\frac{1}{${n}} \\left(${R}\\right)^{2/3} \\left(${
          s / 100
        }\\right)^{1/2} \\\\\\\\
						v &= ${v} \\, \\mathsf{m/s}
					\\end{aligned}
				`)}
      /> -->
    <!-- <Card
        answer="Flow Rate: {ki(`Q = ${sds(Q)}\\, \\mathsf{m^3/s}`)}  "
        solution={kd(`
					\\begin{aligned}
						Q &= Av \\\\
						&= ${A}\\, \\mathsf{m^2}\\times ${v}\\, \\mathsf{m/s} \\\\\\\\
						Q &= ${Q} \\, \\mathsf{m^3/s}
					\\end{aligned}
				`)}
      /> -->
    <!-- <Card
        answer="Specific Energy: {ki(`E = ${sds(E)}\\, \\mathsf{m}`)}  "
        solution={kd(`
					\\begin{aligned}
						E &= y+\\frac{v^2}{2g} \\\\
						&= ${sds(y)}\\, \\mathsf{m}+\\frac{(${v} \\, \\mathsf{m/s)^2} }
								{2(${g}\\, \\mathsf{m/s^2}) } \\\\\\\\
						E &= ${E}\\,\\mathsf{m}
					\\end{aligned}
				`)}
      /> -->
    <!-- <Card
        answer="Free Surface: {ki(`T = ${sds(T)}\\, \\mathsf{m}`)}  "
        solution={kd(`
					\\begin{aligned}
						T &= 2AB \\\\
						&= 2(OB\\cdot\\sin\\alpha) \\\\
						&= D\\sin \\alpha \\\\
						&= ${sds(D)}\\, \\mathsf{m}\\cdot\\sin ${alpha}^\\circ \\\\\\\\
						T &= ${T}\\, \\mathsf{m}							
					\\end{aligned}
				`)}
      /> -->
    <!-- <Card
        answer="Froude Number: {ki(`N_F = ${sds(NF)}`)}  "
        solution={kd(`
					\\begin{aligned}
						N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
						&=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${A}\\, \\mathsf{m^2}/${T}\\, \\mathsf{m})}} \\\\\\\\
						N_F &= ${NF}
					\\end{aligned}
				`)}
      /> -->

    <!-- <h1>Critical Flow</h1> -->

    <!-- {#if thetaC < 180} -->
    <!-- <Card
          answer="For the {ki(
            `Q=${sdw(Q)} \\, \\mathsf{m^3\\!/s}`
          )} above, Critical Depth {ki(`yc=${sds(yc)} \\, \\mathsf{m}`)}"
          solution="{kd(`
						\\begin{aligned}
							N_F &= 1 \\\\
							\\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
							\\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
							\\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\
							&= \\frac{\\left((\\theta_c-\\sin \\theta_c)D^2/8\\right)^3}{D\\sin(\\theta_c/2)} \\\\
							&= \\frac{(\\theta_c-\\sin \\theta_c)^3\\cdot D^5}{512\\sin(\\theta_c/2)} \\\\
							\\frac{(\\theta_c-\\sin \\theta_c)^3}{\\sin(\\theta_c/2)} &= \\frac{512Q^2}{D^5g} \\\\
							&= \\frac{512(${Q}\\, \\mathsf{m^3\\!/s})^2}{(${D}\\, \\mathsf{m})^5(${g}\\, \\mathsf{m/s^2})} \\\\\\\\
							\\frac{(\\theta_c-\\sin \\theta_c)^3}{\\sin(\\theta_c/2)}&= ${thetaCriticalCoeff}
						\\end{aligned}
					`)} 
					<div style='width: 85%; margin-left: 7.5%; '>This equation in {ki(
            `\\theta_c`
          )} can not be solved analytically. It must be solved for {ki(
            `\\theta_c`
          )} numerically (iteratively), using either trial and error, a solver in a calculator (in radian mode!) or by using a function in a spreadsheet. </div>
					{kd(`\\begin{aligned}
						\\theta_c &= ${thetaCrad}\\;\\textsf{\\textcolor{black}{radians}} \\\\
						 &= ${thetaC}^\\circ
					\\end{aligned}`)}
					<div style='width: 55%; margin-left: 22.5%; '>Note that {ki(
            `\\theta_c<180^\\circ`
          )} and critical flow is at less than half depth so {ki(
            `\\theta_c~=~2\\alpha_c`
          )}:</div>
					{kd(`\\begin{aligned}
						\\Rightarrow \\alpha_c &= ${thetaC}^\\circ \\; \\textsf{\\textcolor{black}{radians}} \\\\
						&= ${alphaC}^\\circ \\\\\\\\
						OA_c &= OB\\cdot\\cos \\alpha_c \\\\
						&= ${sds(r)}\\, \\mathsf{m}\\cdot \\cos ${alphaC}^\\circ \\\\
						&= ${sdw(r * Math.cos(alphaCrad))}\\, \\mathsf{m} \\\\\\\\
						\\Rightarrow y_c &= \\frac{D}{2}-OA_c \\\\
						&= ${sds(D / 2)}\\, \\mathsf{m}-${sdw(
            r * Math.cos(alphaCrad)
          )}\\, \\mathsf{m} \\\\\\\\
						\\Rightarrow y_c &= ${yc}\\, \\mathsf{m}
					\\end{aligned}`)}"
        /> -->
    <!-- {:else if thetaC > 180} -->
    <!-- <Card
          answer="For the {ki(
            `Q=${sdw(Q)} \\, \\mathsf{m^3\\!/s}`
          )} above, Critical Depth {ki(`yc=${sds(yc)} \\, \\mathsf{m}`)}"
          solution="{kd(`
				\\begin{aligned}
					N_F &= 1 \\\\
					\\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
					\\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
					\\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\
					&= \\frac{\\left((\\theta_c-\\sin \\theta_c)D^2/8\\right)^3}{D\\sin(\\theta_c/2)} \\\\
					&= \\frac{(\\theta_c-\\sin \\theta_c)^3\\cdot D^5}{512\\sin(\\theta_c/2)} \\\\
					\\frac{(\\theta_c-\\sin \\theta_c)^3}{\\sin(\\theta_c/2)} &= \\frac{512Q^2}{D^5g} \\\\
					&= \\frac{512(${Q}\\, \\mathsf{m^3\\!/s})^2}{(${D}\\, \\mathsf{m})^5(${g}\\, \\mathsf{m/s^2})} \\\\\\\\
					\\frac{(\\theta_c-\\sin \\theta_c)^3}{\\sin(\\theta_c/2)}&= ${thetaCriticalCoeff}
				\\end{aligned}
				`)} 
			<div style='width: 85%; margin-left: 7.5%; '>This equation in {ki(
            `\\theta_c`
          )} can not be solved analytically. It must be solved for {ki(
            `\\theta_c`
          )} numerically (iteratively), using either trial and error, a solver in a calculator (in radian mode!) or by using a function in a spreadsheet. </div>
					{kd(`
					\\begin{aligned}
						\\theta_c &= ${thetaCrad}\\;\\textsf{\\textcolor{black}{radians}} \\\\
						 &= ${thetaC}^\\circ 
					\\end{aligned}
					`)}
					<div style='width: 55%; margin-left: 22.5%; '>Note that {ki(
            `\\theta_c>180^\\circ`
          )} and critical flow is at more than half depth so {ki(
            `\\theta_c=2\\pi-2\\alpha_c`
          )}:</div>
					{kd(`
					\\begin{aligned}	
						\\Rightarrow \\alpha_c &= \\pi-\\theta_c/2 \\\\
						&= ${alphaC}\\; \\textsf{\\textcolor{black}{radians}} \\\\
						&= ${alphaCrad}\\cdot \\frac{180^\\circ}{\\pi} \\\\
						&= ${alphaC}^\\circ \\\\\\\\
						OA_c &= OB\\cdot\\cos \\alpha_c \\\\
						&= ${sds(r)}\\, \\mathsf{m}\\cdot \\cos ${alphaC}^\\circ \\\\
						&= ${sdw(r * Math.cos(alphaCrad))}\\, \\mathsf{m} \\\\\\\\
						\\Rightarrow y_c &= \\frac{D}{2}-OA_c \\\\
					&= ${sds(D / 2)}\\, \\mathsf{m}-${sdw(
            r * Math.cos(alphaCrad)
          )}\\, \\mathsf{m} \\\\\\\\
					\\Rightarrow y_c &= ${yc}\\, \\mathsf{m}
					\\end{aligned}`)}"
        /> -->
    <!-- {/if} -->
    <!-- <Card
        answer="Critical Velocity: {ki(
          ` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`
        )}  "
        solution={kd(`
					\\begin{aligned}         
						A_c &= \\frac{(\\theta_c-\\sin\\theta_c)D^2}{8} \\\\
						&= \\frac{(${thetaCrad}-\\sin ${thetaC}^\\circ)${sds(D)}\\,\\mathsf{m}}{8} \\\\								
										A_c &= ${Ac} \\,\\mathsf{m^2}\\\\\\\\
						v_c &= Q/A_c \\\\
						&= \\frac{${Q}\\,\\mathsf{m^3\\!/s}}{${Ac}\\,\\mathsf{m^2}}\\\\\\\\
						v_c &= ${vc}\\,\\mathsf{m/s}
					\\end{aligned}	`)}
      /> -->
    <!-- <Card
        answer="Minimum Specific Energy: {ki(
          `E_{min} = ${sds(Emin)}\\, \\mathsf{m}`
        )}"
        solution={kd(`
						\\begin{aligned}
							E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
							&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\
							&= ${Emin} \\,\\mathsf{m}
						\\end{aligned}
					`)}
      /> -->
    <!-- <Card
        answer="Slope for Critical Flow: {ki(
          `S_c = ${sds(Sc, sdigs, extraDig)}\\%`
        )}"
        solution={kd(`
					\\begin{aligned}
						A_c &= \\frac{(\\theta_c-\\sin\\theta_c)D^2}{8} \\\\
						&= \\frac{(${thetaCrad}-\\sin ${thetaC}^\\circ)${sds(D)}\\,\\mathsf{m}}{8} \\\\								
						A_c &= ${Ac} \\,\\mathsf{m^2}\\\\\\\\

						P &= \\theta_{\\mathsf{rad}}\\cdot\\frac{D}{2}\\\\
						&= ${thetaCrad}\\cdot\\frac{${sds(D)}\\, \\mathsf{m}}{2} \\\\
						P &= ${P}\\, \\mathsf{m} \\\\ \\\\

						R_c &= A_c/P_c \\\\
						&= \\frac{${Ac}\\, \\mathsf{m^2}}{${Pc}\\, \\mathsf{m}} \\\\
						&= ${Rc}\\,\\mathsf{m}\\\\\\\\

						\\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
						&= \\left(\\frac{${n}\\times ${vc}\\, \\mathsf{m/s} }{ (${Rc}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
						&= ${sdw(Sc / 100)} \\\\\\\\
						S_c &= ${Sc}\\% 								
					\\end{aligned}
				`)}
      /> -->
  </section>
</article>

<style lang="scss">
  section.fig {
    position: relative;

    form {
      input {
        width: 4.25rem;
        font-size: 0.9rem;
        padding-left: 0.1rem;
        padding-right: 0.1rem;
        cursor: pointer;

        &:invalid {
          color: red;
          font-weight: bold;
        }
      }

      label {
        // font-size: 90%;
        position: absolute;
        padding: 0 0.25em;

        &.y {
          padding: 0.1em;
          top: 74.5%;
          left: 6%;
          background-color: white;
        }

        &.diam {
          padding: 0.1em;
          top: 43%;
          left: 74%;
          background-color: white;
        }
      }
      .lower-inputs {
        display: flex;
        justify-content: space-between;
        margin-top: -2.5em;

        label {
          position: relative;
          padding: 0 0.25em;
        }
      }
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
