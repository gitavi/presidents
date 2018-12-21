export default function getters () {
  return {
    cards (state) {
      return state.cards
    },
  
    cards_array (state) {
      return state.cards_array
    },
  
    cards_selected_array (state) {
      return state.cards_selected_array
    },
  
    current_hand_desc (state) {
      return state.current_hand_desc
    },
  
    current_hand (state) {
      return state.current_hand
    },
  
    stored_hands (state) {
      return state.stored_hands
    },
  
    play_unlocked (state) {
      return state.unlocked
    },
  
    alert (state) {
      return state.alert
    },
    
    // snackbar (state) {
    //   return state.snackbar
    // },
  
    current_hand_str (state) {
      return state.current_hand_str
    }
  }
}