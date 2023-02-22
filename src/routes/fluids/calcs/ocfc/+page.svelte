<script>
    import NavigationHeader from "./components/NavigationHeader.svelte";
	import Rectangular from "./components/Rectangular.svelte";
	import Triangular from "./components/Triangular.svelte";
	import Trapezoidal from "./components/Trapezoidal.svelte";
	import Circular from "./components/Circular.svelte";

	let channelType = "circular";
</script>

<div class="container">
	
    <NavigationHeader bind:channelType />

	<main>
		<div class:hide={channelType !== "rectangular"}>
			<Rectangular />
		</div>
		<div class:hide={channelType !== "triangular"}>
			<Triangular />
		</div>
		<div class:hide={channelType !== "trapezoidal"}>
			<Trapezoidal />
		</div>
		<div class:hide={channelType !== "circular"}>
			<Circular />
		</div>
	</main>
</div>
