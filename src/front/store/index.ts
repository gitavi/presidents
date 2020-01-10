import Vue from "vue";
import Vuex from "vuex";
import router from '../router'
import { create_game_module, EVENTS } from '../utils'
import axios from 'axios'
import io from 'socket.io-client'

// import { server_browser_plugin, server_plugin } from './plugins'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: "",
    servers: [],
    alert: '',
    testing_sids: []

  },

  mutations: {
    set_username(state, payload) {
      state.username = payload.username;
    }
  },

  actions: {
    create_game ({ dispatch }, payload) {
      axios.post('http://0.0.0.0:8001/create_game', {
        name: payload.name
      }).then(response => {
        // adding a server auto joins it
        dispatch('join_game', {game_id: response.data.game_id})
      })
    },

    join_game ({ state, commit }, payload) {
      const game_id = payload.game_id
      return axios.put('http://0.0.0.0:8001/join_game', {
        game_id: game_id,
        username: state.username
      }).then(response => {
        const socket = io('/', {
          forceNew: true,
          transportOptions: {
            polling: {
              extraHeaders: {
                'game_id': game_id,
                'game_key': response.data.game_key
              }
            }
          }
        })
        // if connection is succesful
        socket.once('connect', _ => {
          // game id is used as a vuex namespace because
          // I plan to support playing multiple games at the
          // same time TODO
          // for testing, the sid is used
          const sid = socket.io.engine.id
          const namespace = payload.testing ? sid : game_id
          // need to do this because otherwise game views cannot use the sid
          // as the vuex namespace
          if (payload.testing) {
            state.testing_sids.push(sid)
          }
          this.registerModule(namespace, create_game_module())
          commit(`${namespace}/set_socket`, {socket: socket})
          // register presidents event listeners
          EVENTS.forEach(event => {
            socket.on(event, payload => {
              commit(`${namespace}/${event}`, payload)
            })
          })

          if (!payload.testing) {
            router.push('presidents')
          }
        })
      }).catch(err => {
        // console.log(err)
        // state.alert = err.response.detail
      })
      
    }
  }

  // actions: {
  //   plugin_server_browser (context, payload) {
  //     server_browser_plugin(payload.rbnsp)(this)
  //   },

  //   plugin_server (context, payload) {
  //     server_plugin(payload)(this)
  //   },
  // }
});
