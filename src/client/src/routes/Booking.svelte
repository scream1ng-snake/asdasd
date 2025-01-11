<script>  
  import { rootStore } from './../store/root.store';  

  let count = 0;  

  // Подписка на изменения состояния  
  const unsubscribe = rootStore.subscribe(state => {  
    count = state.count;  
  });  

  // Очистка подписки при уничтожении компонента  
  import { onDestroy } from 'svelte';  
  onDestroy(unsubscribe);  
</script>  

<p>Counter Value: {count}</p>  
<button on:click={() => rootStore.incrementCount()}>  
  Increment from Counter  
</button>
<h1>About</h1>  
<p>This is the about page.</p>