import { writable, type Subscriber, type Writable } from 'svelte/store';  

class RootStore {  
  state: Writable<{ count: number, name: string }>
  constructor() {
    this.state = writable({  
      count: 0,  
      name: 'world',  
    });  
  }  

  setCount(value: number) {  
    this.state.update(state => {  
      return { ...state, count: value };  
    });  
  }  

  incrementCount() {  
    this.state.update(state => {  
      return { ...state, count: state.count + 1 };  
    });  
  }  
  setName(newName: string) {  
    this.state.update(state => {  
      return { ...state, name: newName };  
    });  
  }  

  subscribe(run: Subscriber<{ count: number ,name: string }>) {  
    return this.state.subscribe(run);  
  }  
}  

export const rootStore = new RootStore();