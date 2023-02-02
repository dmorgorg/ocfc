<script>
    import { fade } from "svelte/transition";
	import { ki, kd } from "$lib/utilities";
	import Intro from "./Intro.svelte";
	let typeOfChannel = "rectangular";
	let specifyY = true;

	let num = 42;
	let den = 21;
</script>

<article>
	<section>
		<Intro {typeOfChannel} />
	</section>

	<section class="radios">
		<label class="yQlayout">
			<input type="radio" bind:group={specifyY} value={true} />
			<span class="radio__label">Specify {@html ki(`y`)}</span>
		</label>
		<label class="yQlayout">
			<input type="radio" bind:group={specifyY} value={false} />
			<span class="radio__label">Specify {@html ki(`Q`)}</span>
		</label>
	</section>

	<section class="fig">
		<div class="width75">
			<img src="/ocfc/rectangularChannelSectionQ.png" alt="rectangular channel section" />

            {#if specifyY}
				<img
					class="super"
					in:fade={{ duration: 750 }}
					out:fade={{ duration: 500 }}
					src="/ocfc/rectangularChannelSectionY.png"
					alt="rectangular channel section by depth" />
			{/if}
		</div>
	</section>

	{@html kd(`\\frac{${num}}{${den}}`)}

	{specifyY}
</article>

<style lang="scss">
	form {
		& label.y {
			color: white;
			padding: 0.25em;
			top: 40%;
			left: 50%;
			background-color: #088;
		}
		& label.b {
			top: 75%;
			left: 40%;
			background-color: #ccc;
		}
		& label.Q {
			top: 41%;
			left: 38%;
			background-color: #088;
			padding: 0;
		}
	}
</style>
