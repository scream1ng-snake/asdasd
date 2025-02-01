<script lang="ts">
  import { Container } from '@sveltestrap/sveltestrap';
  import { toastsStore, type Toast } from '../store/toasts.store';
  import { onDestroy } from 'svelte';  
  import { fade } from 'svelte/transition';  
  let toasts: Toast[]
  const classes = {
    'success': 'alert-success',
    'danger': 'alert-danger',
    'info': 'alert-info',
  }
  const unsubscribe = toastsStore.messages.subscribe(state => {  
    toasts = state
  })
  onDestroy(unsubscribe)
</script>

<Container>
  {#each toasts as toast}  
    <div class="alert {classes[toast.type]}" in:fade out:fade>
      {toast.message}
    </div>
  {/each} 
</Container>