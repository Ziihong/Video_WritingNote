export default function({ store, redirect, route }) {
  if (!store.state.user && route.path !== '/login') {
    if (route.path == '/auth') {
      return
    } else {
      return redirect('/login')
    }
  }
}
