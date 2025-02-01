<script lang="ts">
  import { Button, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter } from "@sveltestrap/sveltestrap";
  import { adminStore } from "../../store/admin.store";
  import { rusWeekDays } from "../../../../utils/time";
  import type { ISchedule, Slot } from "../../../../entities/schedule.entity";
  import AddSlot from "./AddSlot.svelte";
  import type { UUID } from "../../../../utils/types";

  let show: boolean
  adminStore.editScheduleDayPopup.show.subscribe(val => {
    show = val
  })

  let editingSchedule: ISchedule | null
  adminStore.editingSchedule.subscribe(val => {
    editingSchedule = val
  })

  function onAdd(slot: Slot) {
    if(!editingSchedule) return
    if(!adminStore.selectedDay) return

    editingSchedule[adminStore.selectedDay].push(slot)
    adminStore.editingSchedule.update(() => editingSchedule)
    console.log("Слот создан")
  }

  function deleteSlot(slotId: UUID) {
    if(!editingSchedule) return
    if(!adminStore.selectedDay) return

    const slots = editingSchedule[adminStore.selectedDay]
    const targetSlot = slots.find(slot => slot.id === slotId)

    if(targetSlot) {
      const index = slots.indexOf(targetSlot)
      if(index >= 0) {
        slots.splice(index, 1)
        adminStore.editingSchedule.update(() => editingSchedule)
        console.log("Слот удален")
      }
    }
  }
</script>

<Modal isOpen={show}>
  <AddSlot confirm={onAdd} />
  <ModalBody>
    <h3>{adminStore.selectedDay && rusWeekDays[adminStore.selectedDay]}</h3>
  </ModalBody>
  <ListGroup>
    {#if editingSchedule && adminStore.selectedDay}
      {#each editingSchedule[adminStore.selectedDay] as slot}
        <ListGroupItem>
          <div class="atata">
            {slot.from + " - " + slot.to}
            <div on:click={() => deleteSlot(slot.id)}>❌</div>
          </div>
        </ListGroupItem>
      {/each}
      {#if !editingSchedule[adminStore.selectedDay].length}
        <div class="alert alert-success">
          Пусто
        </div>
      {/if}
      <Button on:click={adminStore.addSlot.open} size="lg">Добавить слот</Button>
    {/if}
  </ListGroup>
  <ModalFooter>
    <Button color="secondary" on:click={adminStore.editScheduleDayPopup.close}>
      Закрыть
    </Button>
    <Button color="primary" on:click={adminStore.saveSchedule}>
      Сохранить
    </Button>
  </ModalFooter>
</Modal>

<style>
  .atata {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>