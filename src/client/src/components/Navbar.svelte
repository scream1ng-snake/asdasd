<script lang="ts">
  import { frontRoutes } from '../../../routes/frontend_routes'
  import { Link } from 'svelte-routing'; 
  import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from '@sveltestrap/sveltestrap';
  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
  }
</script>
<Navbar color="light" class="mb-2">
  <NavbarBrand href="/" class="me-auto">Lapa</NavbarBrand>
  <NavbarToggler on:click={toggle} />
  <Collapse {isOpen} navbar>
    <Nav navbar>
      <NavItem>
        <Link onclick={toggle} to={frontRoutes['/booking']}>Записаться</Link>
      </NavItem>
      <NavItem>
        <Link onclick={toggle} to={frontRoutes['/catalog']}>Каталог</Link>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>