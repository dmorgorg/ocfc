<!-- <script>
    import Intro from './Intro.svelte';
    let typeOfChannel = 'trapezoidal';
</script>

<article>
    <section>
        <Intro {typeOfChannel} />
    </section>
</article> -->
<script>
	let show = false;

	function toggle(event) {
		if (event.type === "click" || event.key === "Enter") {
			show = !show;

			if (show) {
				let dropdown = document.querySelector(".dropdown-content");
				dropdown.scrollIntoView({ behavior: "smooth", block: "end" });
			}
		}
	}
</script>

<div class="card" on:click={toggle} on:keydown={toggle} tabindex="0" role="button">
	Card Title
	{#if show}
		<div class="dropdown-content show">Dropdown Content</div>
	{/if}
</div>

<style>
	.card {
		background-color: white;
		border: 1px solid gray;
		border-radius: 10px;
		padding: 20px;
		cursor: pointer;
	}

	.dropdown-content {
		display: none;
		background-color: white;
		border: 1px solid gray;
		border-radius: 10px;
		padding: 20px;
	}

	.show {
		display: block;
	}
</style>
