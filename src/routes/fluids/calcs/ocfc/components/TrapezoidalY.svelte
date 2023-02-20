<script>
  import Card from "./Card.svelte";
  import { fade } from "svelte/transition";
  import { ki, kd, fluids, trap, utils } from "$lib/utilities";

  let sdigs = 3,
    wdigs = 6,
    validS = true,
    extraDig = true,
    extraWorkingDig = true;

  // needs access to n, b, s so has to be in this file?
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
      return mid;
    }
    // search
    if (getNFfromY(mid) > 1) {
      return getYCfromQ(mid, high);
    } else {
      return getYCfromQ(low, mid);
    }
  };

  let sd = utils.sd;
  const sds = (num) => {
    return utils.sd(num, sdigs, extraDig);
  };
  const sdw = (num) => {
    return utils.sd(num, wdigs, extraWorkingDig);
  };

  // variables ending in s are string inputs, bound to numerical input fields
  let bs = 3,
    ys = 1.2,
    zls = 1.5,
    zrs = 1,
    ss = 0.1,
    ns = 0.02,
    gs = 9.81;
  // inputs
  $: b = sds(bs);
  $: y = sds(ys);
  $: zl = sds(zls);
  $: zr = sds(zrs);
  $: n = Number(sds(ns));
  $: s = Number(sds(ss));
  $: g = Number(sds(gs));
  // calculations for y specified
  $: A = sdw(trap.getArea(y, zl, b, zr));
  $: P = sdw(trap.getP(y, zl, b, zr));
  $: R = sdw(fluids.getR(A, P));
  $: v = sdw(fluids.getV(n, R, s));
  $: Q = sdw(fluids.getQfromAandV(A, v));
  $: E = sdw(fluids.getE(y, v, g));
  $: T = sds(trap.getT(y, zl, b, zr));
  $: NF = sdw(fluids.getNF(v, A, T, g));
  $: yc = sdw(getYCfromQ());
  $: Ac = sdw(trap.getArea(yc, zl, b, zr));
  $: vc = sdw(fluids.getVfromQandA(Q, Ac));
  $: Emin = sdw(fluids.getE(yc, vc, g));
  $: Pc = sdw(trap.getP(yc, zl, b, zr));
  $: Rc = sdw(fluids.getR(Ac, Pc));
  $: Sc = sdw(fluids.getCriticalSlope(n, vc, Rc));
</script>

<article>
  <section class="fig">
    <div>
      <img
        src="/ocfc/trapezoidalChannelSectionQ.png"
        alt="trapezoidal channel section"
      />
      <img
        class="super"
        src="/ocfc/trapezoidalChannelSectionY.png"
        alt="trapezoidal channel section by depth"
      />
    </div>
    <form>
      <label class="b">
        {@html ki(`\\large b=`)}
        <input type="number" step="any" bind:value={bs} />
        {@html ki(`\\textsf{m}`)}
      </label>

      <label class="y">
        {@html ki(`\\large y=`)}
        <input type="number" step="any" bind:value={ys} />
        {@html ki(`\\textsf{m}`)}
      </label>

      <label class="zl">
        {@html ki(`\\large z_L=`)}
        <input type="number" step="any" bind:value={zls} />
      </label>
      <label class="zr">
        {@html ki(`\\large z_R=`)}
        <input type="number" step="any" bind:value={zrs} />
      </label>
    </form>

    <form>
      <div class="lower-inputs">
        <label class="slope">
          {@html ki(`\\large S=`)}
          <input type="number" step="any" required bind:value={ss} />
          {@html ki(`\\small\\%`)}
        </label>

        <label class="n">
          Manning's {@html ki(`\\large n=`)}
          <input type="number" step="any" required bind:value={ns} />
        </label>

        <label class="g">
          {@html ki(`\\large g=`)}
          <input type="number" step="any" required bind:value={gs} />
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
          answer="Flow Area: {ki(`A = ${sds(A)}\\, \\mathsf{m^2}`)}"
          solution={kd(`
                            \\begin{aligned}
                                A &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right)\\cdot y\\right)\\cdot y \\\\
                                &= \\left(${b}\\, \\mathsf{m}+\\left(\\frac{${zl}\\, \\mathsf{m}+${zr}\\, \\mathsf{m}}{2}\\right)\\cdot ${y}\\, \\mathsf{m}\\right)\\cdot ${y}\\, \\mathsf{m} \\\\
                                &= ${A}\\, \\mathsf{m^2}
                            \\end{aligned}
                        `)}
        />

        <Card
          answer="Wetted Perimeter: {ki(`P = ${sds(P)}\\, \\mathsf{m}`)}"
          solution={kd(`
                            \\begin{aligned}
                                P &= b+\\left( \\sqrt{1+z_L^2}+\\sqrt{1+z_R^2}\\right)\\cdot y \\\\
                                P &= ${b}\\, \\mathsf{m}+\\left( \\sqrt{1+\\left(${zl}\\, \\mathsf{m}\\right)^2}+\\sqrt{1+\\left(${zr} \\, \\mathsf{m}\\right)^2}\\right)\\cdot ${y}\\, \\mathsf{m} \\\\                                
                                &= ${P}\\, \\mathsf{m}
                            \\end{aligned}
                        `)}
        />
        <Card
          answer="Hydraulic Radius: {ki(`R = ${sds(R)}\\, \\mathsf m`)}  "
          solution={kd(`
                            \\begin{aligned}
                                R &= A/P \\\\
                                &= ${A}\\, \\mathsf{m^2} / ${P}\\, \\mathsf{m} \\\\
                                &= ${R}\\, \\mathsf{m}
                            \\end{aligned}
                        `)}
        />
        <Card
          answer="Average Flow Velocity: {ki(
            `v = ${sds(v)}\\, \\mathsf{m/s}`
          )}  "
          solution={kd(`
                            \\begin{aligned}
                               v &= \\frac 1n R^{2/3} S^{1/2} \\\\
							   &= \\frac{1}{${n}} \\left(${R}\\right)^{2/3} \\left(${
            s / 100
          }\\right)^{1/2} \\\\
							   &= ${v} \\, \\mathsf{m/s}
                            \\end{aligned}
                        `)}
        />
        <Card
          answer="Flow Rate: {ki(`Q = ${sds(Q)}\\, \\mathsf{m^3/s}`)}  "
          solution={kd(`
                            \\begin{aligned}
                               Q &= Av \\\\
							   &= ${A}\\, \\mathsf{m^2}\\times ${v}\\, \\mathsf{m/s} \\\\
							   &= ${Q} \\, \\mathsf{m^3/s}
                            \\end{aligned}
                        `)}
        />
        <Card
          answer="Specific Energy: {ki(`E = ${sds(E)}\\, \\mathsf{m}`)}  "
          solution={kd(`
                            \\begin{aligned}
                               E &= y+\\frac{v^2}{2g} \\\\
							   &= ${y}\\, \\mathsf{m}+\\frac{(${v} \\, \\mathsf{m/s)^2} }
							   		{2(${g}\\, \\mathsf{m/s^2}) } \\\\
							   &= ${E}\\,\\mathsf{m}
                            \\end{aligned}
                        `)}
        />
        <Card
          answer="Free Surface: {ki(`T = ${sds(T)}\\, \\mathsf{m}`)}  "
          solution={kd(`
                            \\begin{aligned}
                               T &= b + \\left(z_L+z_R\\right)\\cdot y \\\\
                               T &= ${b}\\, \\mathsf{m} + \\left(${zl}+${zr}\\right)\\cdot ${y} \\, \\mathsf{m} \\\\
							   &= ${sdw(T)}\\, \\mathsf{m} \\\\
							   
                            \\end{aligned}
                        `)}
        />
        <Card
          answer="Froude Number: {ki(`N_F = ${sds(NF)}`)}  "
          solution={kd(`
                            \\begin{aligned}
                               N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
							   &=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${sdw(
            A,
            wdigs,
            extraWorkingDig
          )}\\, \\mathsf{m^2}/${sds(T)}\\, \\mathsf{m})}} \\\\
							   &= ${sdw(NF)}
                            \\end{aligned}
                        `)}
        />
      </section>
      <section>
        <h1>Critical Flow</h1>

        <Card
          answer="For the {ki(
            `Q=${Q} \\, \\mathsf{m^3\\!/s}`
          )} above, Critical Depth {ki(`y_c=${sds(yc)} \\, \\mathsf{m}`)}"
          solution="{kd(`
                            \\begin{aligned}
                               	N_F &= 1 \\\\
								\\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
								\\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
								\\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\
								&= \\frac{\\left(\\left(b+\\left(\\frac{z_L+z_R}{2}\\right)\\cdot y_c\\right)\\cdot y_c\\right)^3}{b + \\left(z_L+z_R\\right)\\cdot y} \\\\
								\\Rightarrow \\frac{\\left(${Q} \\, \\mathsf{m^3\\!/s}\\right)^2}{${g} \\, \\mathsf{m/s^2}}&= \\frac{\\left(\\left(${b}\\, \\mathsf{m}+\\left(\\large\\frac{${sds(
            +zl + +zr
          )}}{2}\\right)\\cdot y_c \\, \\mathsf{m}\\right)\\cdot y_c \\, \\mathsf{m}\\right)^3}{${b}\\, \\mathsf{m} + \\left(${sds(
            +zl + +zr
          )}\\right)\\cdot y_c\\, \\mathsf{m}} 									
                            \\end{aligned}`)}
							<div style='width: 85%; margin-left: 7.5%; '>The expression above cannot be solved directly (analytically) for {ki(
            `y_c`
          )}. It may be solved using trial-and-error methods but it is generally more convenient to solve it, without further simplification, using a numerical solver on a scientific calculator or in a spreadsheet app. (This calculator uses an automated type of trial-and-error called a binary search, probably similar to how your scientific calculator does it.)</div>
							{kd(`y_c=${yc}\\, \\mathsf{m}`)}
						"
        />
        <Card
          answer="Critical Velocity: {ki(
            ` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`
          )}  "
          solution={kd(`
							\\begin{aligned}
								A_c &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right)\\cdot y\\right)\\cdot y \\\\
								A_c &= \\left(${b}\\, \\mathsf{m}+\\left(\\frac{${sdw(
            +zl + +zr
          )}}{2}\\right)\\cdot ${yc}\\, \\mathsf{m}\\right)\\cdot ${yc}\\, \\mathsf{m} \\\\
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
								A_c &= \\left(b+\\left(\\frac{z_L+z_R}{2}\\right)\\cdot y\\right)\\cdot y \\\\
								&= \\left(${b}\\, \\mathsf{m}+\\left(\\frac{${sds(
            +zl + +zr,
            sdigs,
            extraDig
          )}}{2}\\right)\\cdot ${yc}\\, \\mathsf{m}\\right)\\cdot ${yc}\\, \\mathsf{m} \\\\
								&= ${Ac} \\,\\mathsf{m^2} \\\\ \\\\

								P_c &= b+\\left( \\sqrt{1+z_L^2}+\\sqrt{1+z_R^2}\\right)\\cdot y_c \\\\
                                &= ${b}\\, \\mathsf{m}+\\left( \\sqrt{1+\\left(${zl}\\, \\mathsf{m}\\right)^2}+\\sqrt{1+\\left(${zr} \\, \\mathsf{m}\\right)^2}\\right)\\cdot ${y}\\, \\mathsf{m} \\\\ 
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
    {/if}
  </section>
</article>

<style lang="scss">
  section.fig form {
    input {
      width: 4.25rem;
      font-size: 0.9rem;
      padding-left: 0.1rem;
      padding-right: 0.1rem;
      cursor: pointer;
    }

    label {
      // font-size: 90%;
      position: absolute;
      padding: 0 0.25em;

      &.y {
        color: white;
        padding: 0.25em;
        top: 37%;
        left: 50%;
        background-color: #088;
      }

      &.b {
        top: 68%;
        left: 47%;
        background-color: #ccc;
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
</style>
