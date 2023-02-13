<script>
	import Intro from "./Intro.svelte";
	import YorQ from "./YorQ.svelte";
	import TriangularY from "./TriangularY.svelte";
	import TriangularQ from "./TriangularQ.svelte";

	let typeOfChannel = "triangular";
	let specifyView = "triangularY";
</script>

<article>
	<section>
		<Intro {typeOfChannel} />
	</section>
</article>

<YorQ bind:specifyView {typeOfChannel}/>

<div class:hide={specifyView !== 'triangularY'}>
	<TriangularY />
</div>
<div class:hide={specifyView !== 'triangularQ'}>
	<TriangularQ />
</div>


