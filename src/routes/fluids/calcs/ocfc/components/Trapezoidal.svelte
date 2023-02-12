<script>
	import Intro from "./Intro.svelte";
	import YorQ from "./YorQ.svelte";
	import TrapezoidalY from "./TrapezoidalY.svelte";
	import TrapezoidalQ from "./TrapezoidalQ.svelte";

	let typeOfChannel = "trapezoidal";
	let specifyView = "trapezoidalQ";
</script>

<article>
	<section>
		<Intro {typeOfChannel} />
	</section>
</article>

<YorQ bind:specifyView {typeOfChannel}/>

<div class:hide={specifyView !== 'trapezoidalY'}>
	<TrapezoidalY />
</div>
<div class:hide={specifyView !== 'trapezoidalQ'}>
	<TrapezoidalQ />
</div>


