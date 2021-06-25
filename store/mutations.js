import initialState from './state'

export default {
  RESET_STORE: state => Object.assign(state, initialState()),
  SET_AUTH_USER: (state, { authUser }) => {
    state.authUser = {
      name: authUser.displayName,
      uid: authUser.uid,
      email: authUser.email
    }
  }
}
