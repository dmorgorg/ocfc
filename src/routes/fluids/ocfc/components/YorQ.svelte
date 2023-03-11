<script>
	import { ki } from "$lib/utilities";
	export let typeOfChannel;
	export let specifyView;

	let y = typeOfChannel + "Y";
	let q = typeOfChannel + "Q";
</script>

<section class="radios">
	<label class="yQlayout">
		<input type="radio" bind:group={specifyView} value={y} />
		<span class="radio__label">Specify {@html ki(`y`)}</span>
	</label>
	<label class="yQlayout">
		<input type="radio" bind:group={specifyView} value={q} />
		<span class="radio__label">Specify {@html ki(`Q`)}</span>
	</label>
</section>


