<script lang="ts">
  import { Button, Modal, ModalBody, ModalFooter } from "@sveltestrap/sveltestrap";
  import { adminStore } from "../../store/admin.store";
  import type { Slot } from "../../../../entities/schedule.entity";
  import { v4 } from "uuid"
  let show: boolean
  adminStore.addSlot.show.subscribe(val => { show = val })

  let from = '';
  let to = '';

  let previousFromLength = 0
  let previousToLength = 0

  // ввод с маской
  function inputFrom(event: any) {  
    let value: string = event.target.value.replace(/[^\d:]/g, '')
    const parts = value.split(':')
    if (parts[0]) parts[0] = parts[0].slice(0, 2)
    if (parts[1]) parts[1] = parts[1].slice(0, 2)
    if((value.length === 2) && (value.length > previousFromLength)) {
      from = `${parts.join(':')}:`
    } else {
      from = parts.join(':')
    }
    previousFromLength = value.length
  }  

  function inputTo(event: any) {  
    let value: string = event.target.value.replace(/[^\d:]/g, '')
    const parts = value.split(':')
    
    if (parts[0]) parts[0] = parts[0].slice(0, 2)
    if (parts[1]) parts[1] = parts[1].slice(0, 2)
    to = parts.join(':');
    if((value.length === 2) && (value.length > previousToLength)) {
      to = `${parts.join(':')}:`
    } else {
      to = parts.join(':')
    }
    previousToLength = value.length
  }

  function onCLose() {
    adminStore.addSlot.close()
    to = ""
    from = ""
    previousFromLength = 0
    previousToLength = 0
  }

  export let confirm: (slot: Slot) => void
  function onConfirm() {
    const slot = { id: v4(), from, to }
    confirm(slot)
    onCLose()
  }
</script>
<Modal isOpen={show}>
  <ModalBody>
    <h3>Создать слот</h3>
    <div class="form-floating mb-3">
      <input 
        type="tel"
        class="form-control" 
        id="floatingInput" 
        bind:value={from}   
        on:input={inputFrom}  
        maxlength="5"   
        placeholder="00:00"  
      >
      <label for="floatingInput">Начало</label>
    </div>
    <div class="form-floating">
      <input 
        type="tel" 
        class="form-control" 
        id="floatingPassword" 
        bind:value={to}   
        on:input={inputTo}  
        maxlength="5"   
        placeholder="00:00"  
      >
      <label for="floatingPassword">Завершение</label>
    </div>
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={onCLose}>
      Закрыть
    </Button>
    <Button color="primary" on:click={onConfirm}>
      Создать
    </Button>
  </ModalFooter>
</Modal>