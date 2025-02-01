<script lang="ts">
  import { Button, Card, CardBody, CardHeader, CardText, CardTitle, Col, Container, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Row, TabContent, TabPane } from '@sveltestrap/sveltestrap'  
  import { _weekDays, rusWeekDays, weekDays, type WeekDay } from '../../../utils/time';

  import { adminStore } from '../store/admin.store';
  import { authStore } from '../store/auth.store';
  import type { User } from '../../../entities/user.entity';
  import type { Optional } from '../../../utils/types';
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
    import EditSchedule from '../components/popups/EditSchedule.svelte';

  let currentUser: Optional<User>
  const unsubscribeAuthUser = authStore.user.subscribe(data => {
    currentUser = data
  })
  onDestroy(unsubscribeAuthUser)
  
</script>  

<Container>
  <TabContent>
    <TabPane tabId="schedule" tab="Расписание" active>
      <EditSchedule />
      {#if !currentUser?.schedule}
        <div class="alert alert-info" in:fade out:fade>
          Вы еще не создали расписание 
          <a href="#" class="alert-link" on:click={adminStore.createEmptySchedule}>
            Создать?
          </a>
        </div>
      {:else}
        <Row>
          {#each weekDays as dayOfWeek}  
            <Col>
              <Card color='info' class="mt-3" on:click={() => adminStore.editScheduleDay(dayOfWeek)}>
                <CardBody>
                  <CardTitle>{rusWeekDays[dayOfWeek]}</CardTitle>
                </CardBody>
                <ListGroup class="list-group-flush">
                  {#if !currentUser.schedule[dayOfWeek].length}
                    <ListGroupItem>Пусто</ListGroupItem>
                  {/if}
                  {#each currentUser.schedule[dayOfWeek] as slot}
                    <ListGroupItem>{slot.from + " - " + slot.to}</ListGroupItem>
                  {/each}
                </ListGroup>
              </Card>
            </Col>
          {/each} 
        </Row>
      {/if}
    </TabPane>
    <TabPane tabId="bookings" tab="Брони">
    </TabPane>
    <TabPane tabId="stats" tab="Статистика">
     </TabPane>
  </TabContent>
</Container>

<style>
  .flexBetween {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  }
</style>