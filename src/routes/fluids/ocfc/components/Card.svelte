<script>
	import { fade } from "svelte/transition";
	export let answer = "";
	export let solution = "";
	let displayCalc = false;
	// let card;

	// function scroll() {
	// 	if (displayCalc) {
	// 		card.scrollIntoView({
	// 			alignToTop: false,
	// 		});
	// 	}
	// }

	function toggle() {
		displayCalc = !displayCalc;
		// if (displayCalc) {
		// 	let dropdown = document.querySelector(".solution");
		// 	dropdown.scrollIntoView({ behavior: "smooth"});
		// }
	}
</script>


<!-- <article class="card" on:click={toggle} on:keydown={toggle} tabindex="0" role="button" bind:this={card}> -->
<article class="card" on:click={toggle} on:keydown={toggle} tabindex="0" role="button">
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
			<div>{@html solution}</div>
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

		&:hover {
			box-shadow: var(--medShadow);
		}

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
