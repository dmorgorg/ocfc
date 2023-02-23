<script>
	import Card from "./Card.svelte";
	// import { fade } from "svelte/transition";
	import { ki, kd, fluids, utils, circ } from "$lib/utilities";

	let sdigs = 3,
		wdigs = 6,
		validS = true,
		extraDig = true,
		extraWorkingDig = true;

	const sdw = (num) => {
		return utils.sd(num, wdigs, extraWorkingDig);
	};
	const sds = (num) => {
		return utils.sd(num, sdigs, extraDig);
	};
	// variables ending in s are string inputs, bound to numerical input fields
	let Ds = 1.5,
		ys = 0.75,
		ss = 0.2,
		ns = 0.013,
		gs = 9.81;
	// inputs
	$: D = sds(Ds);
	$: y = sds(ys);
	$: n = sds(ns);
	$: s = sds(ss);
	$: g = sds(gs);
</script>

<article>
	<section class="fig">
		<div>
			<div class:hide={!(y < D / 2)}>
				<img src="/ocfc/circularChannelSectionUnderHalf.png" alt="circular channel section by depth under half full" />
			</div>
			<div class:hide={!(y == D / 2)}>
				<img src="/ocfc/circularChannelSectionHalf.png" alt="circular channel section by depth half full" />
			</div>
			<div class:hide={!(y > D / 2 && y < D)}>
				<img src="/ocfc/circularChannelSectionOverHalf.png" alt="circular channel section by depth over half full" />
			</div>
			<div class:hide={!(y == D)}>
				<img src="/ocfc/circularChannelSectionFull.png" alt="circular channel section by depth full" />
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
