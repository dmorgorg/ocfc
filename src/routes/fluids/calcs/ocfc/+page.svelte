<script>
  import NavigationHeader from "./components/NavigationHeader.svelte";
  import Rectangular from "./components/Rectangular.svelte";
  import Triangular from "./components/Triangular.svelte";
  import Trapezoidal from "./components/Trapezoidal.svelte";
  import Circular from "./components/Circular.svelte";

<<<<<<< HEAD
	let channelType = "circular";
=======
  let channelType = "circular";
>>>>>>> 08c8687855c8cb3e85ad30a279fcb74dbf5012dc
</script>

<div class="container">
  <NavigationHeader bind:channelType />

  <main>
    <div class:hide={channelType !== "rectangular"}>
      <Rectangular />
    </div>
    <div class:hide={channelType !== "triangular"}>
      <Triangular />
    </div>
    <div class:hide={channelType !== "trapezoidal"}>
      <Trapezoidal />
    </div>
    <div class:hide={channelType !== "circular"}>
      <Circular />
    </div>
  </main>
</div>
