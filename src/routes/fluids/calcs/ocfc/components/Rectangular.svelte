<script>
	import Intro from "./Intro.svelte";
	import YorQ from "./YorQ.svelte";
	import RectangularY from "./RectangularY.svelte";
	import RectangularQ from "./RectangularQ.svelte";

	let typeOfChannel = "rectangular";
	let specifyY = true;
</script>

<article>
	<section>
		<Intro {typeOfChannel} />
	</section>
</article>

<YorQ bind:specifyY />

<div class:hide={!specifyY}>
	<RectangularY />
</div>
<div class:hide={specifyY}>
	<RectangularQ />
</div>
