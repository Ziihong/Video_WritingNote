import initialState from './state'

export default {
  RESET_STORE: state => Object.assign(state, initialState()),
  SET_AUTH_USER: (state, { authUser }) => {
    authUser.mmmm = undefined;
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email,
      nickname: authUser.displayName,
      ppp : authUser.mmmm
    }
  }
}
