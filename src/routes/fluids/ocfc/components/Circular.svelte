<script>
  import Intro from "./Intro.svelte";
  import YorQ from "./YorQ.svelte";
  import CircularY from "./CircularY.svelte";
  import CircularQ from "./CircularQ.svelte";

  let typeOfChannel = "circular";
  let specifyView = "circularY";
</script>

<article>
  <section>
    <Intro {typeOfChannel} />
  </section>
</article>

<YorQ bind:specifyView {typeOfChannel} />

<div class:hide={specifyView !== "circularY"}>
  <CircularY />
</div>
<div class:hide={specifyView !== "circularQ"}>
  <CircularQ />
</div>
