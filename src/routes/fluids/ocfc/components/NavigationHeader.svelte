<script>
  import NavButton from "./NavButton.svelte";
  export let channelType;
</script>

<nav class="nav">
  <h1 class="nav-title">open channel flow calculator</h1>
  <div class="nav-links">
    <NavButton bind:channelType name="rectangular">rectangular</NavButton>
    <NavButton bind:channelType name="triangular">triangular</NavButton>
    <NavButton bind:channelType name="trapezoidal">trapezoidal</NavButton>
    <NavButton bind:channelType name="circular">circular</NavButton>
  </div>
</nav>
