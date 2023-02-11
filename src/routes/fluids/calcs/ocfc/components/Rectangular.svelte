<script>
	import Intro from "./Intro.svelte";
	import YorQ from "./YorQ.svelte";
	import RectangularY from "./RectangularY.svelte";
	import RectangularQ from "./RectangularQ.svelte";

	let typeOfChannel = "rectangular";
	let specifyView = "rectangularY";
</script>

<article>
	<section>
		<Intro {typeOfChannel} />
	</section>
</article>

<YorQ bind:specifyView {typeOfChannel}/>

<div class:hide={specifyView !== 'rectangularY'}>
	<RectangularY />
</div>
<div class:hide={specifyView !== 'rectangularQ'}>
	<RectangularQ />
</div>


