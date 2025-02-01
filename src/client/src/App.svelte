<script lang="ts">
  import { Router, Route } from 'svelte-routing';  
  import Booking from './routes/Booking.svelte';  
  import Catalog from './routes/Catalog.svelte';  
  import { frontRoutes } from './../../routes/frontend_routes'
  import Admin from './routes/Admin.svelte';
  import Navbar from './components/Navbar.svelte';
  import Toasts from './components/Toasts.svelte';
  import { authStore } from './store/auth.store';
  import { onDestroy } from 'svelte';  
  import type { Optional } from '../../utils/types';
  import type { User } from '../../entities/user.entity';
  import { rootStore } from './store/root.store';
  let user: Optional<User>
  const unsubscribe = authStore.user.subscribe(data => {  
    user = data
  })
  rootStore
  onDestroy(unsubscribe);
</script>

<main class="wrapper">
  <Router>
    <Navbar />
    <Toasts /> 
    <Route path={frontRoutes['/booking']}>
      <Booking />
    </Route>
    <Route path={frontRoutes['/catalog']}>
      <Catalog />
    </Route>
    {#if user?.role === 'master'}
      <Route path={frontRoutes['/admin']}>
        <Admin />
      </Route>
    {/if}
  </Router>
</main>

<style>
  .wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>
