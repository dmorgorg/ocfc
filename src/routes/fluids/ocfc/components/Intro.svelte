<script>
  import { fly } from "svelte/transition";
  import { ki } from "$lib/utilities";
  export let typeOfChannel = "rectangular";
  $: isVisible = false;
  const defaultSdigs = 3;
  const defaultWdigs = 6;
  $: sdigs = defaultSdigs;
  $: wdigs = defaultWdigs;

  $: minWdigs = sdigs;
  wdigs = Math.max(wdigs, minWdigs);

  let extraDig = true;
  let extraWorkingDig = true;

  const toggle = () => {
    isVisible = !isVisible;
  };
</script>

{#if isVisible}
  <section in:fly={{ y: -200 }} out:fly={{ y: -200, delay: 100 }}>
    This calculator on this page is for <span
      style="font-weight: bold; letter-spacing: -0.03em">normal</span
    >
    (uniform) flow and
    <span style="font-weight: bold; letter-spacing: -0.03em">critical</span>
    flow in an open channel with a
    <span style="font-weight: bold; letter-spacing: -0.03em"
      >{typeOfChannel}</span
    >
    cross-section.
    <p />
    Clicking on a result panel will display the associated calculations for each
    result. Clicking again will close the panel.
    <p />
    Either flow depth, {@html ki(`y`)}, in metres ({@html ki(`\\mathsf{m}`)}) or
    volume flow,
    {@html ki(`Q`)}, in cubic metres per second ({@html ki(
      `\\mathsf{m^3\\!/s}`
    )}) must be specified. But not both.
    <p />
    If {@html ki(`y`)} is specified, then the corresponding {@html ki(`Q`)} will
    be calculated.<br />If
    {@html ki(`Q`)} is specified, then the corresponding flow depth {@html ki(
      `y`
    )} will be calculated.

    {#if typeOfChannel !== "triangular"}
      <p />
      <span style="font-weight: bold; letter-spacing: -0.05em">Note</span> that,
      for a {typeOfChannel}
      channel, {@html ki(`y`)} cannot be determined analytically from {@html ki(
        `Q`
      )} and is found using an iterative method.
    {/if}
    <!-- <p />
    <br /> -->
    <!-- By default, this calculator uses {@html ki(`3`)} significant digits for input
    values and answers (or {@html ki(`4`)}
    significant digits if the first non-zero digit is a {@html ki(`1`)}, e.g.{@html ki(
      `0.234`
    )} but {@html ki(`0.1234`)}). Interim calculations are to {@html ki(`6`)} significant
    digits (or {@html ki(`7`)} in the case of a leading {@html ki(`1`)}) to
    avoid the accumulation of rounding errors. You can alter these default
    values here:
    <p />
    {extraDig}
    <div class="digs">
      <div class="sdigs">
        <label>
          Digits for inputs/answers (2-6):
          <input type="number" bind:value={sdigs} min="2" max="6" />
          <input type="range" bind:value={sdigs} min="2" max="6" />
        </label>

        <label>
          Extra digit for leading {@html ki(`1`)}:
          <input type="checkbox" bind:checked={extraDig} />
          {#if extraDig}
            Yes
          {:else}
            No
          {/if}
        </label>
      </div>
      <br />
      <div class="wdigs">
        <label>
          Digits for interim calculations ({sdigs}-10):
          <input type="number" bind:value={wdigs} min={sdigs} max="10" />
          <input type="range" bind:value={wdigs} min={sdigs} max="10" />
        </label>

        <label>
          Extra digit for leading {@html ki(`1`)}:
          <input type="checkbox" bind:checked={extraWorkingDig} />
          {#if extraWorkingDig}
            Yes
          {:else}
            No
          {/if}
        </label> -->
    <!-- </div> -->
    <!-- </div> -->
    <p />
  </section>
{/if}
<button on:click={toggle}>
  {#if isVisible}
    <div>Hide Instructions</div>
  {:else}
    <div>Show Instructions</div>
  {/if}
</button>

<style lang="scss">
  section {
    width: 80%;
    margin: 0 auto;
    border: 1px solid black;
    padding: 1em;
  }
  button {
    background: var(--primaryColor);
    border: 1px solid black;
    border-radius: 0.25em;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    outline: none;
    padding: 0.25em 0.75em;
    text-shadow: var(--textShadow);
    margin-bottom: 1em;
    margin-top: 1em;

    &:hover {
      background-color: var(--midGrey);
      color: var(--primaryDDark);
      text-shadow: none;
    }
  }
  .sdigs,
  .wdigs {
    display: flex;
    justify-content: center;
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    cursor: pointer;
  }
</style>
