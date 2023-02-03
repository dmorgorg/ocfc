<script>
	import { fade } from "svelte/transition";
	export let answer = "";
	export let solution = "";
	let displayCalc = false;

	function toggleDisplay(event) {
		displayCalc = !displayCalc;
	}
</script>

<article class="card" on:click={toggleDisplay}>
	<section class="answer">
		<div>{@html answer}</div>
		<button class="display-btn">
			{#if displayCalc}
				<div class="triangle-up" />
			{:else}<div class="triangle-down" />
			{/if}
		</button>
	</section>

	{#if displayCalc}
		<section class="solution" transition:fade={{ duration: 500 }}>
			{@html solution}
		</section>
	{/if}
</article>

<style lang="scss">
	.card {
		background-color: white;
		box-shadow: var(--lightShadow);
		border: 1px solid #ccc;
		margin: 0.75em auto;
		padding: 0.25rem 1rem;
		cursor: pointer;
		text-align: left;

		

		& > .answer {
			display: flex;
			justify-content: space-between;
			text-align: left;
		}
		button.display-btn {
			font-size: 2rem;
			background: transparent;
			border: none;
			cursor: pointer;
			color: var(--primaryColor);
			// vertical-align: middle;
			outline: none;
		}
	}
</style>
