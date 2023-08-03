<script>
  import { page } from "$app/stores";
  import { fly } from "svelte/transition";
</script>

<!-- key: whenever the url changes, it will re-render this div-->
{#key $page.url}
  <div in:fly={{ x: "-100%", duration: 700 }}>
    <slot />
  </div>
{/key}
