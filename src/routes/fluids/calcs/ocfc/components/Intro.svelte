<script>
	import { fade, fly } from "svelte/transition";
	import { ki } from "$lib/utilities";
	export let typeOfChannel = "rectangular";
	let isVisible = false;

	const toggle = () => {
		isVisible = !isVisible;
	};
</script>

{#if isVisible}
	<section in:fly={{ y: -200 }} out:fly={{ y: -200, delay:100}}>
		This calculator on this page is for <span style="font-weight: bold; letter-spacing: -0.03em">normal</span> (uniform) flow and 
		<span style="font-weight: bold; letter-spacing: -0.03em">critical</span> flow in an open channel with a
		<span style="font-weight: bold; letter-spacing: -0.03em">{typeOfChannel}</span> cross-section.
		<p />
		Clicking on a result panel will display the associated calculations for each result. Clicking again
		will close the panel.
		<p />
		Either flow depth, {@html ki(`y`)}, in metres ({@html ki(`\\mathsf{m}`)}) or volume flow,
		{@html ki(`Q`)}, in cubic metres per second ({@html ki(`\\mathsf{m^3\\!/s}`)}) must be
		specified. But not both.
		<p />
		If {@html ki(`y`)} is specified, then the corresponding {@html ki(`Q`)} will be calculated.<br />If
		{@html ki(`Q`)} is specified, then the corresponding flow depth {@html ki(`y`)} will be calculated.
		<p />
		{#if typeOfChannel !== "triangular"}
			<span style="font-weight: bold; letter-spacing: -0.05em">Note</span> that, for a {typeOfChannel}
			channel, {@html ki(`y`)} cannot be determined analytically from {@html ki(`Q`)} and is found using
			an iterative method.
		{/if}
		<p />
	</section>
{/if}
<button on:click={toggle}>
	{#if isVisible}
		<div>Hide Instructions Above</div>
	{:else}
		<div>Show Instructions</div>
	{/if}
</button>
<style lang="scss">
	section {
		width: 80%;
		margin: 0 auto;
	}
	button {
		background: var(--primaryColor);
		border: 1px solid black;
		border-radius: 0.25em;
		color: white;
		cursor: pointer;
		font-size: 1rem;
		outline: none;
		padding: 0.25em 0.75em;
		text-shadow: var(--textShadow);

		&:hover {
			background-color: var(--midGrey);
			color: var(--primaryDDark);
			text-shadow: none;
		}
	}
</style>
