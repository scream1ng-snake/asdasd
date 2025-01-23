<script lang="ts">
  import { Container } from '@sveltestrap/sveltestrap';
import { toastsStore } from '../store/toasts.store';
  import { onDestroy } from 'svelte';  
  import { fade } from 'svelte/transition';  
  let toasts: string[]
  const unsubscribe = toastsStore.messages.subscribe(state => {  
    toasts = state
  })
  onDestroy(unsubscribe);
</script>

<Container>
  {#each toasts as toast}  
    <div class="alert alert-success" in:fade out:fade>
      {toast}
    </div>
  {/each} 
</Container>