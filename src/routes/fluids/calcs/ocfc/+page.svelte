<script>
	import "./global.scss";
	import NavButton from "./components/NavButton.svelte";
	import Rectangular from "./components/Rectangular.svelte";
	import Triangular from "./components/Triangular.svelte";
	import Trapezoidal from "./components/Trapezoidal.svelte";
	import Circular from "./components/Circular.svelte";

	let current = "rectangular";
</script>

<div class="container">
	<nav class="nav">
		<h1 class="nav-title">open channel flow calculator</h1>
		<div class="nav-links">
			<NavButton bind:current name="rectangular">rectangular</NavButton>
			<NavButton bind:current name="triangular">triangular</NavButton>
			<NavButton bind:current name="trapezoidal">trapezoidal</NavButton>
			<NavButton bind:current name="circular">circular</NavButton>
		</div>
	</nav>

	<main>
		<div class:hide={current !== "rectangular"}>
			<Rectangular />
		</div>
		<div class:hide={current !== "triangular"}>
			<Triangular />
		</div>
		<div class:hide={current !== "trapezoidal"}>
			<Trapezoidal />
		</div>
		<div class:hide={current !== "circular"}>
			<Circular />
		</div>
	</main>


</div>
