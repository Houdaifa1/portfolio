useEffect(() => {
  const observers = {};
  const threshold = window.innerWidth < 768 ? 0.2 : 0.45;
  Object.keys(cardRefs.current).forEach(id => {
    const el = cardRefs.current[id];
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleId(id);
    }, { threshold });
    obs.observe(el);
    observers[id] = obs;
  });
  return () => Object.values(observers).forEach(o => o.disconnect());
}, []);