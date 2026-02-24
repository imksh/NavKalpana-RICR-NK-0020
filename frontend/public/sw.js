self.addEventListener("install", () => {
  console.log("✅ Service Worker Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker Activated");
  event.waitUntil(self.clients.claim());
});

const toAbsoluteUrl = (maybeUrl) => {
  try {
    return new URL(maybeUrl || "/", self.location.origin).href;
  } catch {
    return new URL("/", self.location.origin).href;
  }
};

/**
 * PUSH EVENT
 */
self.addEventListener("push", (event) => {
  let data = {};

  try {
    if (event.data) {
      try {
        data = event.data.json();
      } catch {
        data = JSON.parse(event.data.text());
      }
    }
  } catch {
    data = {};
  }

  const title = data.title || "New Notification";
  const tagValue =
    typeof data.tag === "string" && data.tag.trim().length > 0
      ? data.tag
      : `gradify-${Date.now()}`;

  const options = {
    body: data.body || "You have a new notification",
    icon: data.icon || "/logo.png",
    badge: data.badge || data.icon || "/logo.png",
    tag: tagValue,
    renotify: true,
    requireInteraction: data.critical === true,
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * CLICK EVENT
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = toAbsoluteUrl(event.notification?.data?.url);

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl || client.url.startsWith(targetUrl)) {
            if ("focus" in client) {
              return client.focus();
            }
          }
        }
        return clients.openWindow(targetUrl);
      }),
  );
});
