<script>
    import { ki } from "$lib/utilities";
    export let specifyY;
</script>

<section class="radios">
	<label class="yQlayout">
		<input type="radio" bind:group={specifyY} value={true} />
		<span class="radio__label">Specify {@html ki(`y`)}</span>
	</label>
	<label class="yQlayout">
		<input type="radio" bind:group={specifyY} value={false} />
		<span class="radio__label">Specify {@html ki(`Q`)}</span>
	</label>
</section>