<script>
	export let name;
	export let channelType;
</script>

<button class:active={channelType === name} on:click={() => (channelType = name)} class="nav-link">
	<slot />
</button>

<style lang="scss">
	button {
		background: none;
		border: none;
		cursor: pointer;
		outline: none;
		
		&.active {
			text-shadow: var(--textShadow);
		}
	}
</style>
