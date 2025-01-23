<script lang="ts">
  import { Router, Route } from 'svelte-routing';  
  import Booking from './routes/Booking.svelte';  
  import Catalog from './routes/Catalog.svelte';  
  import { frontRoutes } from './../../routes/frontend_routes'
  import Admin from './routes/Admin.svelte';
  import Navbar from './components/Navbar.svelte';
    import Toasts from './components/Toasts.svelte';
 
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
    <Route path={frontRoutes['/admin']}>
      <Admin />
    </Route>
  </Router>
</main>

<style>
  .wrapper {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>
