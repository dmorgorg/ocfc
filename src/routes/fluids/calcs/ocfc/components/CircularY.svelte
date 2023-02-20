<script>
  import Card from "./Card.svelte";
  // import { fade } from "svelte/transition";
  import { ki, kd, fluids, utils, circ } from "$lib/utilities";

  let sdigs = 3,
    wdigs = 6,
    validS = true,
    extraDig = true,
    extraWorkingDig = true;

  // needs access to n, b, s so has to be in this file?
  $: getNFfromY = (y) => {
    const r = D / 2;
    const thetaRad = circ.getThetaRadians(y, r);
    const T = circ.getT(alpha, D);
    const A = circ.getArea(thetaRad, D);
    const v = Q / A;
    // console.log(v);
    return Number(fluids.getNF(v, A, T, g));
  };

  $: getYc = (shallow = 0, deep = D) => {
    const delta = 1 / 10 ** wdigs,
      mid = (deep + shallow) / 2;
    //   nf = getNFfromY(mid);
    // console.log("s: " + shallow + ", d: " + deep + ", NF: " + nf);

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
  const sdw = (num) => {
    return utils.sd(num, wdigs, extraWorkingDig);
  };

  const sds = (num) => {
    return utils.sd(num, sdigs, extraDig);
  };

  // variables ending in s are string inputs, bound to numerical input fields
  let Ds = 1.5,
    ys = 0.5,
    ss = 0.2,
    ns = 0.013,
    gs = 9.81;
  // inputs
  $: D = sds(Ds);
  $: y = sds(ys);
  $: n = Number(sds(ns));
  $: s = Number(sds(ss));
  $: g = Number(sds(gs));
  // calculations for y specified
  y = y < 0 ? 0 : y;
  y = y > D ? D : y;
  $: r = sds(D / 2);
  $: alpha = sdw(circ.getAlphaDegrees(y, r));
  // $: alphaRad = sdw(circ.getAlphaRadians(y, r));
  $: theta = sdw(circ.getThetaDegrees(y, r));
  $: thetaRad = sdw(circ.getThetaRadians(y, r));
  $: A = sdw(circ.getArea(thetaRad, D));
  $: P = sdw(circ.getP(thetaRad, D));
  $: R = sdw(fluids.getR(A, P));
  $: v = sdw(fluids.getV(n, R, s));
  $: Q = sdw(fluids.getQfromAandV(A, v));
  $: E = sdw(fluids.getE(y, v, g));
  $: T = sdw(circ.getT(alpha, D));
  $: NF = sdw(fluids.getNF(v, A, T, g));
  $: thetaCriticalCoeff = sdw((512 * Q * Q) / D ** 5 / g);
  $: yc = sdw(getYc());
  $: thetaCrad = sdw(circ.getThetaRadians(yc, r));
  $: thetaC = sdw(circ.getThetaDegrees(yc, r));
  $: alphaC = sdw(circ.getAlphaDegrees(yc, r));
  $: alphaCrad = sdw(circ.getAlphaRadians(yc, r));
  $: Ac = sdw(circ.getArea(thetaCrad, D));
  $: vc = sdw(fluids.getVfromQandA(Q, Ac));
  // $: Emin = sdw(fluids.getE(yc, vc, g));
  // $: Sc = sdw(fluids.getCriticalSlope(n, vc, Rc));
</script>

<article>
  <section class="fig">
    <div>
      <div class:hide={!(y < D / 2)}>
        <img
          src="/ocfc/circularChannelSectionUnderHalf.png"
          alt="circular channel section by depth under half full"
        />
      </div>
      <div class:hide={!(y == D / 2)}>
        <img
          src="/ocfc/circularChannelSectionHalf.png"
          alt="circular channel section by depth half full"
        />
      </div>
      <div class:hide={!(y > D / 2 && y < D)}>
        <img
          src="/ocfc/circularChannelSectionOverHalf.png"
          alt="circular channel section by depth over half full"
        />
      </div>
      <div class:hide={!(y == D)}>
        <img
          src="/ocfc/circularChannelSectionFull.png"
          alt="circular channel section by depth full"
        />
      </div>
    </div>
    <form>
      <label class="diam">
        {@html ki(`\\large D=`)}
        <input type="number" step="any" bind:value={Ds} />
        {@html ki(`\\textsf{m}`)}
      </label>

      <label class="y">
        {@html ki(`\\large y=`)}
        <input type="number" step="any" bind:value={ys} />
        {@html ki(`\\textsf{m}`)}
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
        {#if y < D / 2}
          <Card
            answer={ki(`\\alpha = ${sdw(alpha)}^\\circ`)}
            solution={kd(`
                            \\begin{aligned}
                                \\alpha &= \\cos^{-1} \\left(\\frac{OA}{OB} \\right)\\\\
								&= \\cos^{-1} \\left(\\frac{D/2-y}{D/2} \\right)\\\\
								&= \\cos^{-1} \\left(\\frac{${r}\\, \\mathsf{m}-${y}\\, \\mathsf{m}}{${r}\\, \\mathsf{m}} \\right)\\\\\\\\
								\\alpha &= ${sdw(alpha)}^\\circ
                            \\end{aligned}
                        `)}
          />
          <Card
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
          />
          <Card
            answer="Flow Area: {ki(`A = ${sds(A)}\\, \\mathsf{m^2}`)}"
            solution="{kd(`
                            \\begin{aligned}
                                A &= \\frac{(\\theta-\\sin\\theta)D^2}{8}
							\\end{aligned}
							`)}
							<div style='width: 85%; margin-left: 7.5%; '>This area formula requires {ki(
              `\\theta`
            )} to be in radians. Rather than switching my calculator to radian mode (and possibly forgetting to change it back...), I choose to use {ki(
              `\\sin(${theta})`
            )} with {ki(
              `\\theta`
            )} in degrees and my calculator in degree mode, noting that {ki(
              `\\sin\\theta_{\\mathsf{rad}}`
            )} in radian mode has the same value as {ki(
              `\\sin\\theta`
            )} in degree mode.</div>
							{kd(`
							\\begin{aligned}                               
                                A &= \\frac{(${thetaRad}-\\sin ${theta}^\\circ)\\cdot (${D}\\, \\mathsf{m})^2}{8} \\\\\\\\
                                A &= ${A}\\, \\mathsf{m^2}
                            \\end{aligned}
                        `)}"
          />
          <Card
            answer="Wetted Perimeter: {ki(`P = ${sds(P)}\\, \\mathsf m`)}  "
            solution={kd(`
								\\begin{aligned}
									P &= \\theta_{\\mathsf{rad}}\\cdot\\frac{D}{2}\\\\
									&= ${thetaRad}\\cdot\\frac{${D}\\, \\mathsf{m}}{2} \\\\\\\\
									P &= ${P}\\, \\mathsf{m}
								\\end{aligned}
                        `)}
          />
          <Card
            answer="Hydraulic Radius: {ki(`R = ${sds(R)}\\, \\mathsf m`)}  "
            solution="{kd(`
								\\begin{aligned}
									R &= A/P \\\\
									&= \\frac{${A}\\, \\mathsf{m^2}}{ ${P}\\, \\mathsf{m}} \\\\\\\\
									R &= ${R} \\mathsf{m}
								\\end{aligned}
                        `)} 
						<div style='width: 85%; margin-left: 7.5%; '>Alternatively, there is a well-known formula that calculates the hydraulic radius directly without first calculating the wetted perimeter:</div>
						{kd(`
								\\begin{aligned}
									R &= \\left[\\frac{\\theta_{\\mathsf{rad}}-\\sin\\theta}{\\theta_\\mathsf{rad}} \\right] \\cdot \\frac D4 \\\\
									&= \\left[\\frac{${thetaRad}-\\sin ${theta}^\\circ}{${thetaRad}} \\right] \\cdot \\frac{${D}\\, \\mathsf{m}}{4} \\\\\\\\
									R &= ${R} \\mathsf{m}
								\\end{aligned}
                        `)}"
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
            }\\right)^{1/2} \\\\\\\\
									v &= ${v} \\, \\mathsf{m/s}
								\\end{aligned}
                        `)}
          />
          <Card
            answer="Flow Rate: {ki(`Q = ${sds(Q)}\\, \\mathsf{m^3/s}`)}  "
            solution={kd(`
								\\begin{aligned}
									Q &= Av \\\\
									&= ${A}\\, \\mathsf{m^2}\\times ${v}\\, \\mathsf{m/s} \\\\\\\\
									Q &= ${Q} \\, \\mathsf{m^3/s}
								\\end{aligned}
                        `)}
          />
          <Card
            answer="Specific Energy: {ki(`E = ${sds(E)}\\, \\mathsf{m}`)}  "
            solution={kd(`
								\\begin{aligned}
									E &= y+\\frac{v^2}{2g} \\\\
									&= ${y}\\, \\mathsf{m}+\\frac{(${v} \\, \\mathsf{m/s)^2} }
											{2(${g}\\, \\mathsf{m/s^2}) } \\\\\\\\
									E &= ${E}\\,\\mathsf{m}
								\\end{aligned}
                        `)}
          />
          <Card
            answer="Free Surface: {ki(`T = ${sds(T)}\\, \\mathsf{m}`)}  "
            solution={kd(`
								\\begin{aligned}
									T &= 2AB \\\\
									&= D\\sin \\alpha \\\\
									&= ${D}\\, \\mathsf{m}\\cdot\\sin ${alpha}^\\circ \\\\\\\\
									T &= ${T}\\, \\mathsf{m}							
								\\end{aligned}
                        `)}
          />
          <Card
            answer="Froude Number: {ki(`N_F = ${sds(NF)}`)}  "
            solution={kd(`
                \\begin{aligned}
									N_F &=  \\frac{v}{\\sqrt{g(A/T)}} \\\\							   
									&=  \\frac{${v}\\, \\mathsf{m/s}}{\\sqrt{(${g}\\, \\mathsf{m/s^2})\\cdot(${A}\\, \\mathsf{m^2}/${T}\\, \\mathsf{m})}} \\\\\\\\
									N_F &= ${NF}
								\\end{aligned}
                        `)}
          />
        {/if}
      </section>
      <section>
        <h1>Critical Flow</h1>

        <Card
          answer="For the {ki(
            `Q=${sdw(Q, wdigs, extraWorkingDig)} \\, \\mathsf{m^3\\!/s}`
          )} above, Critical Depth {ki(`yc=${sds(yc)} \\, \\mathsf{m}`)}"
          solution="{kd(`
                \\begin{aligned}
                    N_F &= 1 \\\\
                    \\Rightarrow v_c &= \\sqrt{ g(A_c/T_c)} \\\\
                    \\Rightarrow \\left(\\frac{Q}{A_c}\\right)^2 &= g(A_c/T_c) \\\\
                    \\Rightarrow \\frac{Q^2}{g} &= \\frac{A_c^3}{T_c} \\\\
                    &= \\frac{\\left((\\theta_c-\\sin \\theta_c)D^2/8\\right)^3}{D\\sin\\alpha_c}\\\\
                    \\Rightarrow \\frac{\\left(\\theta_c-\\sin \\theta_c\\right)^3}{\\sin\\left(\\theta_c/2\\right)} &= \\frac{512Q^2}{D^5g}\\\\
                    &= \\frac{512( ${Q}\\,\\mathsf{m^3\\!/s})^2}{(${D}\\,\\mathsf{m})^5(${g}\\,\\mathsf{m/s^2})}\\\\
                    &= ${thetaCriticalCoeff}
                \\end{aligned}							
                `)}
						<div style='width: 85%; margin-left: 7.5%; '>This cannot be solved directly for {ki(
            `\\theta`
          )}; {ki(
            `\\theta`
          )} must be found using numerical (iterative) methods such as trial-and-error, by using an equation solver on a scientific calculator (in radian mode!) or by using a spreadsheet.<br/><br/>
          Using such a method, we find that {ki(
            `\\theta_c = ${thetaCrad}`
          )} in radians. Then, 
          {kd(`
            \\begin{aligned}
              \\alpha_c &= \\theta_c/2=${thetaCrad}/2=${thetaCrad / 2}\\\\
              &= ${thetaC}^\\circ/2 \\\\
              &= ${alphaC}^\\circ \\\\
              \\textsf{\\textcolor{black}{Then} }\\quad OA &= OB\\cdot \\cos \\alpha_c \\\\
              \\Rightarrow r-y_c &= OB\\cdot \\cos \\alpha_c \\\\
              \\Rightarrow y_c &= r-OB\\cdot \\cos \\alpha_c \\\\
              &= ${r}\\,\\mathsf{m}-${r}\\,\\mathsf{m}\\cdot \\cos ${alphaC}^\\circ \\\\\\\\
              y_c &= ${sdw(r * (1 - Math.cos(alphaCrad)))}\\,\\mathsf{m}
             
            \\end{aligned} 
          `)}</div>
					"
        />
        <Card
          answer="Critical Velocity: {ki(
            ` v_c = ${sds(vc)}  \\,\\mathsf{m/s}`
          )}  "
          solution={kd(`
							\\begin{aligned}         
                A_c &= \\frac{(\\theta_c-\\sin\\theta_c)D^2}{8} \\\\
                &= \\frac{(${thetaCrad}-\\sin ${thetaC}^\\circ)${D}\\,\\mathsf{m}}{8} \\\\								
								A_c &= ${Ac} \\,\\mathsf{m^2}\\\\\\\\
                v_c &= Q/A_c \\\\
                &= \\frac{${Q}\\,\\mathsf{m^3\\!/s}}{${Ac}\\,\\mathsf{m^2}}\\\\\\\\
                v_c &= ${vc}\\,\\mathsf{m/s}
							\\end{aligned}	`)}
        />
        <!-- <Card
					answer="Minimum Specific Energy: {ki(`E_{min} = ${sds(Emin)}\\, \\mathsf{m}`)}"
					solution={kd(`
							\\begin{aligned}
								E_{min} &= y_c+\\frac{ v_c^2 }{ 2g } \\\\
								&= ${yc}\\, \\mathsf{m}+\\frac{ (${vc}\\, \\mathsf{m/s})^2 }{ 2(${g}\\, \\mathsf{m/s^2}) } \\\\
								&= ${Emin} \\,\\mathsf{m}
							\\end{aligned}
						`)} /> -->
        <!-- <Card
					answer="Slope for Critical Flow: {ki(`S_c = ${sds(Sc, sdigs, extraDig)}\\%`)}"
					solution={kd(`
							\\begin{aligned}
								A_c &= by_c \\\\
								&= ${b}\\, \\mathsf{m}\\times ${yc}\\, \\mathsf{m} \\\\
								&= ${Ac} \\,\\mathsf{m^2} \\\\ \\\\

								P_c &= b + 2y_c \\\\
								&= ${b}\\, \\mathsf{m}+2(${yc}\\, \\mathsf{m}) \\\\
								&= ${Pc}\\, \\mathsf{m}\\\\\\\\

								R_c &= A_c/P_c \\\\
								&= \\frac{${Ac}\\, \\mathsf{m^2}}{${Pc}\\, \\mathsf{m}} \\\\
								&= ${Rc}\\,\\mathsf{m}\\\\\\\\

								\\Rightarrow S_c &= \\left(\\frac { nv_c }{ R_c^{2/3} }\\right)^2 \\\\
								&= \\left(\\frac{${n}\\times ${vc}\\, \\mathsf{m/s} }{ (${Rc}\\, \\mathsf{m})^{2/3} }\\right)^2\\\\
								&= ${Sc / 100} \\\\
								&= ${Sc}\\% 								
							\\end{aligned}
						`)} /> -->
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
        padding: 0.25em;
        top: 65%;
        left: 3%;
        background-color: white;
      }

      &.diam {
        padding: 0.25em;
        top: 43%;
        left: 75%;
        background-color: white;
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
