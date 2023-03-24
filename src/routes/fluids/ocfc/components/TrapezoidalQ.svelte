<script>
  import Card from "./Card.svelte";
  import { sigdigs } from "../stores.js";
  import { ki, kd, utils } from "$lib/utilities";
  import { common, trap } from "$lib/fluids";

  let sdigs = $sigdigs.sdigs,
    wdigs = $sigdigs.wdigs,
    extraDig = $sigdigs.extraDig,
    extraWorkingDig = $sigdigs.extraWorkingDig,
    validS = true,
    initB = 3,
    initZL = 1.5,
    initZR = 0.75,
    initQ = 1.2,
    initS = 0.1,
    initN = 0.013,
    initG = 9.81;

  // needs access to n, b, s so has to be in this file?
  $: getQfromY = (y) => {
    var A = trap.getArea(y, zl, b, zr);
    let v = common.getV(n, common.getR(A, trap.getP(y, zl, b, zr)), s);
    return A * v;
  };
  $: getYfromQ = (low = 0, high = 100) => {
    let delta = 1 / 10 ** (wdigs + 1),
      mid = (low + high) / 2;
    // console.log(delta+', '+low+', '+high);
    if (Math.abs(low - high) < delta) {
      return (low + high) * 0.5;
    }
    // search
    if (getQfromY(mid) < Q) {
      return getYfromQ(mid, high);
    } else {
      return getYfromQ(low, mid);
    }
  };
  $: getNFfromY = (y) => {
    let A = trap.getArea(y, zl, b, zr);
    let T = trap.getT(y, zl, b, zr);
    let v = Q / A;
    return v / ((g * A) / T) ** 0.5;
  };
  $: getYCfromQ = (low = 0, high = 100) => {
    let delta = 1 / 10 ** (wdigs + 1),
      mid = (low + high) / 2;
    if (Math.abs(low - high) < delta) {
      return (low + high) * 0.5;
    }
    // search
    if (getNFfromY(mid) > 1) {
      return getYCfromQ(mid, high);
    } else {
      return getYCfromQ(low, mid);
    }
  };

  const sdw = (num) => {
    return utils.sd(num, wdigs, extraWorkingDig);
  };

  const sds = (num) => {
    return utils.sd(num, sdigs, extraDig);
  };

  const sd = utils.sd;

  const processChange = utils.debounce((e) => {
    if (e.target.id === "zl") {
      if (e.target.value === "") {
        zls = sds(initZL);
      }
      zls = sds(Math.abs(Number(zls)));
      zl = Number(zls);
    }
    if (e.target.id === "zr") {
      if (e.target.value === "") {
        zrs = sds(initZR);
      }
      zrs = sds(Math.abs(Number(zrs)));
      zr = Number(zrs);
    }
    if (e.target.id === "base") {
      if (e.target.value === "") {
        bs = sds(initB);
      }
      bs = sds(Math.abs(Number(bs)));
      b = Number(bs);
    }
    if (e.target.id === "flowrate") {
      if (e.target.value === "") {
        Qs = sds(initQ);
      }
      Qs = sds(Math.abs(Number(Qs)));
      Q = Number(Qs);
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
        // allow g = 9.806
        gs = sd(Number(gs), 4);
      } else {
        gs = sds(gs);
      }
      g = Number(gs);
    }
  });

  // variables ending in s are string inputs, bound to numerical input fields
  $: bs = sds(initB);
  $: zls = sds(initZL);
  $: zrs = sds(initZR);
  $: Qs = sds(initQ);
  $: ss = sds(initS);
  $: ns = sds(initN);
  $: gs = sds(initG);
  // inputs
  $: b = initB;
  $: Q = initQ;
  $: zl = initZL;
  $: zr = initZR;
  $: s = initS;
  $: n = initN;
  $: g = initG;
  // calculations for Q specified
  $: y = sdw(getYfromQ());
  $: A = sdw(trap.getArea(y, zl, b, zr));
  $: v = sdw(common.getVfromQandA(Q, A));
  $: E = sdw(common.getE(y, v, g));
  $: T = sdw(trap.getT(y, zl, b, zr));
  $: NF = sdw(common.getNF(v, A, T, g));
  $: yc = sdw(getYCfromQ());
  $: Ac = sdw(trap.getArea(yc, zl, b, zr));
  $: vc = sdw(common.getVfromQandA(Q, Ac));
  $: Emin = sdw(common.getE(yc, vc, g));
  $: Pc = sdw(trap.getP(yc, zl, b, zr));
  $: Rc = sdw(common.getR(Ac, Pc));
  $: Sc = sdw(common.getCriticalSlope(n, vc, Rc));
</script>

<article>
  <section class="fig">
    <div>
      <img
        src="/ocfc/trapezoidalChannelSectionQ.png"
        alt="trapezoidal channel section"
      />
    </div>
    <form>
      <label class="b">
        {@html ki(`\\large b`)} =
        <input
          type="number"
          step="any"
          id="base"
          bind:value={bs}
          on:input={processChange}
        />
        {@html ki(`\\textsf{m}`)}
      </label>

      <label class="Q">
        {@html ki(`\\large Q`)} =
        <input
          type="number"
          step="any"
          id="flowrate"
          bind:value={Qs}
          on:input={processChange}
        />
        {@html ki(`\\mathsf{m^3\\!/s}`)}
      </label>

      <label class="zl">
        {@html ki(`\\large z_L`)} =
        <input
          type="number"
          step="any"
          id="zl"
          bind:value={zls}
          on:input={processChange}
        />
      </label>

      <label class="zr">
        {@html ki(`\\large z_R`)} =
        <input
          type="number"
          step="any"
          id="zr"
          bind:value={zrs}
          on:input={processChange}
        />
      </label>
    </form>

    <form>
      <div class="lower-inputs">
        <label class="slope">
          {@html ki(`\\large S`)} =
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
          Manning's {@html ki(`\\large n`)} =
          <input
            type="number"
            step="any"
            id="n"
            bind:value={ns}
            on:input={processChange}
          />
        </label>

        <label class="g">
          {@html ki(`\\large g`)} =
          <input
            type="number"
            step="any"
            id="g"
            bind:value={gs}
            on:input={processChange}
          />
          {@html ki(`\\small \\mathsf{ m/s^2 }`)}
        </label>
      </div>
    </form>
  </section>

  <section class="results">
    {#if !validS}
      need a slope
    {:else}
      <section class="normal">
        <h1>Normal (Uniform) Flow</h1>
        <Card
          answer="Depth of flow: {ki(`${sds(y)}\\, \\mathsf{m}`)}"
          solution="{kd(`
						\\begin{aligned}
							A &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right) y\\right)y \\\\
							&= \\left(${b}\\, \\mathsf{m}+${sdw(zl / 2 + zr / 2)} y\\right) y \\\\\\\\
							P &= b+\\left( \\sqrt{1+z_L^2}+\\sqrt{1+z_R^2}\\right) y \\\\
							&= ${b}\\, \\mathsf{m}+\\left( \\sqrt{1+${zl}^2}+\\sqrt{1+${zr}^2}\\right) y \\\\
							\\\\\\\\
							
							Q &= \\frac 1n AR^{2/3}S^{1/2}
							= \\frac 1n A(A/P)^{2/3}S^{1/2} \\\\
							 &= \\frac 1n \\cdot\\frac{A^{5/3}}{P^{2/3}}\\cdot S^{1/2} \\\\
							${Q}\\, \\mathsf{m^3\\!/s} &= \\frac{1}{${n}}  \\cdot\\frac{\\left(\\left(${b}\\, \\mathsf{m}\\!+\\!${sdw(
            zl / 2 + zr / 2
          )} y\\right) y\\right)^{5/3}}{\\left(${b}\\, \\mathsf{m}\\!+\\!\\left( \\sqrt{1\\!+\\!${zl}^2}\\!+\\!\\sqrt{1\\!+\\!${zr}^2}\\right) y\\right)^{2/3}}\\!\\cdot\\! (${
            s / 100
          })^{1/2} \\\\
							
						\\end{aligned}`)}
						<div style='width: 85%; margin-left: 7.5%; '>This expression cannot be solved directly (analytically) for {ki(
            `y`
          )}. It may be solved using trial-and-error methods but it is generally more convenient to solve it using a numerical solver on a scientific calculator or to use a spreadsheet app. (This calculator uses an automated type of trial-and-error called a binary search.)</div>
						{kd(`
						y=${y}\\, \\mathsf{m}
						`)}"
        />
        <Card
          answer="Flow Area: {ki(`${sds(A)}\\, \\mathsf{m^2}`)} "
          solution={kd(`
						\\begin{aligned}
							A &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right) y\\right)y \\\\
							&= \\left(${b}\\, \\mathsf{m}+${sds(
            zl / 2 + zr / 2
          )}\\times ${y}\\, \\mathsf{m}\\right) ${y}\\, \\mathsf{m} \\\\							
							&= ${A} \\, \\mathsf{m^2}
						\\end{aligned}
					`)}
        />
        <Card
          answer="Average Flow Velocity: {ki(`${sds(v)}\\, \\mathsf{m/s} `)}"
          solution={kd(`
						\\begin{aligned} 
							v &= Q/A \\\\
						 	&= \\frac{${Q}\\, \\mathsf{m^3\\!/s}}{${A}\\, \\mathsf{m^2}} \\\\					
							&= ${v} \\, \\mathsf{m/s}
						\\end{aligned}`)}
        />
        <Card
          answer="Specific Energy: {ki(`E=${sds(E)}\\, \\mathsf{m} `)}"
          solution={kd(`
						\\begin{aligned} 
							E &= y+\\frac{v^2}{g} \\\\
						 	&= ${y}\\, \\mathsf{m}+\\frac{(${v}\\, \\mathsf{m/s})^2}{${g}\\, \\mathsf{m/s^2}} \\\\					
							&= ${E} \\, \\mathsf{m}
						\\end{aligned}`)}
        />
        <Card
          answer="Free Surface: {ki(`T = ${sds(T)}\\, \\mathsf{m}`)}  "
          solution={kd(`
						\\begin{aligned}
							T &=  b+ \\left(z_L+z_R\\right)y \\\\
							&=  ${b}\\, \\mathsf{m} + \\left(${zl}+${zr}\\right)${y}\\, \\mathsf{m} \\\\
							&= ${T}\\, \\mathsf{m} \\\\							
						\\end{aligned}
				`)}
        />
        <Card
          answer="Froude Number: {ki(`N_F = ${sds(NF)}`)}  "
          solution={kd(`
						\\begin{aligned}
							N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
							&=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sdw(
            A
          )}\\, \\mathsf{m^2}/${sdw(T)}\\, \\mathsf{m})}} \\\\
							&= ${sdw(NF)}
						\\end{aligned}
				`)}
        />
        <section>
          <h1>Critical Flow</h1>

          <Card
            answer="For the {ki(
              `Q=${sds(Q)} \\, \\mathsf{m^3\\!/s}`
            )} above, Critical Depth {ki(`yc=${sds(yc)} \\, \\mathsf{m}`)}"
            solution="{kd(`
                            \\begin{aligned}
                               	N_F &= 1 \\\\
								\\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
								\\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
								\\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\								
								&= \\frac{\\left(\\left(b+\\left(\\frac{z_L+z_R}{2}\\right) y_c\\right)y_c\\right)^3}{b+ \\left(z_L+z_R\\right)y_c}	\\\\
								&= \\frac{\\left(\\left(${b}\\, \\mathsf{m}+${sdw(
              zl / 2 + zr / 2
            )} y_c\\right)y_c\\right)^3}{${b}\\, \\mathsf{m}+ \\left(${sdw(
              zl / 1 + zr / 1
            )}\\right)y_c}	\\\\
							\\end{aligned}`)}
							<div style='width: 85%; margin-left: 7.5%; '>This expression cannot be solved directly (analytically) for {ki(
              `y_c`
            )}. It may be solved using trial-and-error methods but it is generally more convenient to solve it using a numerical solver on a scientific calculator or to use a spreadsheet app. (This calculator uses an automated type of trial-and-error called a binary search.)</div>
							{kd(`y_c=${yc}\\, \\mathsf{m}`)}"
          />
          <Card
            answer="Critical Velocity: {ki(
              ` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`
            )}  "
            solution={kd(`
							\\begin{aligned}
								A_c &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right) y_c\\right)y_c \\\\
							&= \\left(${b}\\, \\mathsf{m}+${sdw(
              zl / 2 + zr / 2
            )} \\times ${yc}\\, \\mathsf{m}\\right)\\cdot ${yc}\\, \\mathsf{m} \\\\
								&= ${Ac}\\, \\mathsf{m^2}\\\\\\\\

								v_c &= Q/A_c \\\\
								&= \\frac{${Q}\\, \\mathsf{m^3\\!/s}}{${Ac}\\, \\mathsf{m^2}} \\\\
								&= ${vc} \\,\\mathsf{m/s}
							\\end{aligned}	`)}
          />
          <Card
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
          />
          <Card
            answer="Slope for Critical Flow: {ki(`S_c = ${sds(Sc)}\\%`)}"
            solution={kd(`
							\\begin{aligned}
								A_c &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right) y_c\\right)y_c \\\\
								&= \\left(${b}\\, \\mathsf{m}+${sdw(
              zl / 2 + zr / 2
            )} \\times ${yc}\\, \\mathsf{m}\\right)\\cdot ${yc}\\, \\mathsf{m} \\\\
								&= ${Ac}\\, \\mathsf{m^2}\\\\\\\\

								P_c &= b + \\left( \\sqrt{1+z_L^2} + \\sqrt{1+z_R^2} \\right)\\cdot y_c \\\\
								P_c &= ${b}\\, \\mathsf{m} + \\left( \\sqrt{1+(${zl})^2} + \\sqrt{1+(${zr})^2} \\right)\\cdot y_c \\\\
								
								&= ${Pc}\\, \\mathsf{m}\\\\\\\\

								R_c &= A_c/P_c \\\\
								&= \\frac{${Ac}\\, \\mathsf{m^2}}{${Pc}\\, \\mathsf{m}} \\\\
								&= ${Rc}\\,\\mathsf{m}\\\\\\\\

								\\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
								&= \\left(\\frac{${n}\\times ${vc}\\, \\mathsf{m/s} }{ (${Rc}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
								&= ${Sc / 100} \\\\
								&= ${Sc}\\% 								
							\\end{aligned}
						`)}
          />
        </section>
      </section>
    {/if}
  </section>
</article>

<style lang="scss">
  form {
    label {
      &.b {
        top: 68%;
        left: 47%;
        background-color: #ccc;
      }

      &.Q {
        top: 37%;
        left: 45%;
        background-color: #088;
        padding: 0;
        color: white;
      }
      &.zl {
        top: 55%;
        left: 13%;
        background-color: transparent;
        font-size: 90%;
      }
      &.zr {
        top: 55%;
        left: 78%;
        background-color: transparent;
        font-size: 90%;
      }
    }
    .lower-inputs {
      display: flex;
      justify-content: space-between;
      margin-top: -1em;

      label {
        position: relative;
        padding: 0 0.25em;
      }
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
