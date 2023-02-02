<script>
	export let name;
	export let current;
</script>

<button class:active={current === name} on:click={() => (current = name)} class="nav-link">
	<slot />
</button>

<style lang="scss">
	button {
		/* font-size: 80%; */
		background: none;
		border: none;
		/* border: 1px solid black; */
		
		/* margin-left: 1em; */
		cursor: pointer;
		outline: none;
		
		&.active {
			text-shadow: var(--textShadow);
		}
	}
</style>
