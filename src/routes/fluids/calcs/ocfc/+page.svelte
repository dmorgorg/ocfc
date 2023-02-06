<script>
	import NavButton from "./components/NavButton.svelte";
	import Rectangular from "./components/Rectangular.svelte";
	import Triangular from "./components/Triangular.svelte";
	import Trapezoidal from "./components/Trapezoidal.svelte";
	import Circular from "./components/Circular.svelte";

	let channelType = "rectangular";
</script>

<div class="container">
	<nav class="nav">
		<h1 class="nav-title">open channel flow calculator</h1>
		<div class="nav-links">
			<NavButton bind:channelType name="rectangular">rectangular</NavButton>
			<NavButton bind:channelType name="triangular">triangular</NavButton>
			<NavButton bind:channelType name="trapezoidal">trapezoidal</NavButton>
			<NavButton bind:channelType name="circular">circular</NavButton>
		</div>
	</nav>

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
