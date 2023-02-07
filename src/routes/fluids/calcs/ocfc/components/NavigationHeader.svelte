<script>
    import NavButton from "./NavButton.svelte";
    export let channelType;
</script>


<nav class="nav">
		<h1 class="nav-title">open channel flow calculator</h1>
		<div class="nav-links">
			<NavButton bind:channelType name="rectangular">rectangular</NavButton>
			<NavButton bind:channelType name="triangular"><s>triangular</s></NavButton>
			<NavButton bind:channelType name="trapezoidal"><s>trapezoidal</s></NavButton>
			<NavButton bind:channelType name="circular"><s>circular</s></NavButton>
		</div>
		
	</nav>