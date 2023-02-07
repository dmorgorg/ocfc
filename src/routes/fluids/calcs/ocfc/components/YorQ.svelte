<script>
    import { ki } from "$lib/utilities";
    export let specifyView;
</script>

<section class="radios">
	<label class="yQlayout">
		<input type="radio" bind:group={specifyView} value='rectangularY' />
		<span class="radio__label">Specify {@html ki(`y`)}</span>
	</label>
	<label class="yQlayout">
		<input type="radio" bind:group={specifyView} value='rectangularQ' />
		<span class="radio__label">Specify {@html ki(`Q`)}</span>
	</label>
</section>