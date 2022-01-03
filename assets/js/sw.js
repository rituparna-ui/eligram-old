self.addEventListener('push', (e) => {
  console.log('an user unsubscribed');
  self.registration.showNotification(e.data.json().title);
});
