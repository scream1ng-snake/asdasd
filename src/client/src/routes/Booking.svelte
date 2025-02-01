<script lang="ts">
  import { Button, Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardText, CardTitle, Container, Image } from '@sveltestrap/sveltestrap';
  import { onDestroy } from 'svelte';  
  import { slotsStore } from '../store/slots.store';
  import type { LoadState } from '../utils/request';
  import { fade } from 'svelte/transition';
  import type { IUser, User } from '../../../entities/user.entity';
  import { authStore } from '../store/auth.store';
  import type { Optional } from '../../../utils/types';
  import type Booking from '../../../entities/booking.entity';
    import moment from 'moment';
  
  let masters: User[]
  const unsubscribeMasters = slotsStore.masters.subscribe(data => {  
    masters = data
  })


  
  let queryState: LoadState
  const unsubscribeState = slotsStore.loadMasters.state.subscribe(data => {
    queryState = data
  })

  let currentUser: Optional<User>
  let plannedBookings: Booking[] = []
  let pastBookings: Booking[] = []
  const unsubscribeAuthUser = authStore.user.subscribe(data => {
    currentUser = data
    data?.bookings.forEach(book => {
      Date.now() < new Date(book.date).getTime()
        ? plannedBookings.push(book)
        : pastBookings.push(book)
    })
  })
  onDestroy(unsubscribeAuthUser);
  onDestroy(unsubscribeMasters);  
  onDestroy(unsubscribeState);  
</script>  

<Container>
  {#if queryState === 'COMPLETED'}
    <h3>Запланированные</h3>
    {#if !plannedBookings.length}
      <div class="alert alert-info">
        У вас нет записей <a href="#" class="alert-link">Записаться?</a>
      </div>
    {:else}
      {#each plannedBookings as plannedBooking}  
        <Card>
          <CardBody>
            <div class="master">
              <div class="avatar">
                <Image class="avatar" />
              </div>
              <div class="username">
                {plannedBooking.master.firstName}
              </div>
            </div>
            <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
          </CardBody>
        </Card>
      {/each} 
    {/if}
    <h3>Прошедшие</h3>
    {#if !pastBookings.length}
      <div class="alert alert-info">
        Прошедших записей нет
      </div>
    {:else}
      {#each pastBookings as pastBooking}  
        <Card>
          <CardBody class="p-3">
            <div class="master">
              <div class="avatar">
                <Image class="avatar" />
              </div>
              <div class="username">
                {pastBooking.master.firstName + " " + pastBooking.master.lastName}
              </div>
            </div>
            <CardText>
              <br>
              {moment(pastBooking.date).format("DD MM YYYY")} — вы не пришли
            </CardText>
          </CardBody>
        </Card>
      {/each} 
    {/if}
  {/if}
  
  
  

</Container>
<style>
  .master {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .username {
    margin-left: 18px;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 100px;
    overflow: hidden;
    background: var(--bs-info-bg-subtle);
    
  }
</style>