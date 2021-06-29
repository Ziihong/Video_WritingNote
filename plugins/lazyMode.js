export default async (context) => {
  await context.$fire.firestoreReady()
  await context.$fire.storageReady()
  await context.$fire.functionsReady()
  console.log('!!!!', context.$fireModule.storage.TaskState.RUNNING);
  if (process.client) {
    await context.$fire.authReady()
    await context.$fireAuthStore.subscribe()
    await context.$fire.performanceReady()
  }
}
