<script lang="ts">
  import viteLogo from '/vite.svg'
  import { Router, Route, Link } from 'svelte-routing';  
  import Booking from './routes/Booking.svelte';  
  import Catalog from './routes/Catalog.svelte';  
  import { frontRoutes } from './../../routes/frontend_routes'

  let name = 'world';  
</script>

<main>
  <div>
    
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
  </div>
  <Router>
    <nav>  
      <Link to="/catalog">Каталог</Link>  
      <Link to="/booking">Записаться</Link>  
    </nav>  
    <Route path={frontRoutes['/booking']}>
      <Booking />
    </Route>
    <Route path={frontRoutes['/catalog']}>
      <Catalog name={name} />
    </Route>
  </Router>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
</style>
