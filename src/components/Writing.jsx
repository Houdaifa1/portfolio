const guides = [
  {
    title: 'Building an HTTP Server in C++ with Nonblocking I/O and epoll',
    summary: 'Follow an HTTP request through TCP, readiness notifications, parsing, buffered writes, and CGI. Includes a comparison of Linux epoll and macOS kqueue.',
    links: [
      ['DEV', 'https://dev.to/houdaifa_drahm/building-an-http-server-in-c-with-nonblocking-io-and-epoll-f84'],
      ['Medium', 'https://medium.com/@houdaifadrahm/building-an-http-server-in-c-with-nonblocking-i-o-and-epoll-7519c8b39233'],
      ['Hashnode', 'https://houdaifadrahm.hashnode.dev/building-an-http-server-in-c-with-nonblocking-i-o-and-epoll'],
    ],
  },
  {
    title: 'Building a Real-Time Multiplayer Game with NestJS and Socket.IO',
    summary: 'A guide to organizing a NestJS backend and taking a multiplayer match from authentication and matchmaking through game updates, reconnection, and match history.',
    links: [
      ['DEV', 'https://dev.to/houdaifa_drahm/building-a-real-time-multiplayer-game-with-nestjs-and-socketio-nmb'],
      ['Medium', 'https://medium.com/@houdaifadrahm/building-a-real-time-multiplayer-game-with-nestjs-and-socket-io-6b7762c32fa1'],
      ['Hashnode', 'https://houdaifadrahm.hashnode.dev/building-a-real-time-multiplayer-game-with-nestjs-and-socket-io'],
    ],
  },
];

export default function Writing() {
  return (
    <section id="writing" className="writing-section" aria-labelledby="writing-title">
      <h2 id="writing-title" className="reveal">Writing</h2>
      <div className="writing-grid">
        {guides.map(({ title, summary, links }) => (
          <article key={title} className="writing-card card reveal">
            <h3>{title}</h3>
            <p>{summary}</p>
            <ul className="writing-links">
              {links.map(([platform, href]) => (
                <li key={platform}>
                  <a href={href} aria-label={`Read ${title} on ${platform}`} data-h>{platform}</a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
