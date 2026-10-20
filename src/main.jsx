import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { stickers } from './data.js';
import './styles.css';

function OceanScene() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="sky" />
      <div className="stars" />
      <div className="distant-islands"><i /><i /><i /></div>
      <div className="main-island"><i className="island-light" /></div>
      <div className="sea">
        <div className="wave wave-back" />
        <div className="wave wave-middle" />
        <div className="wave wave-front" />
      </div>
      <div className="horizon-glow" />
    </div>
  );
}

function Stone({ sticker, active, blocked, opening, origin, onOpen, onClose, setCloseButton }) {
  const titleId = `${sticker.id}-title`;
  const style = active && origin ? {
    '--origin-center-x': `${origin.left + origin.width / 2}px`,
    '--origin-center-y': `${origin.top + origin.height / 2}px`,
    '--origin-width': `${origin.width}px`,
    '--origin-height': `${origin.height}px`,
  } : undefined;

  return (
    <article
      className={`stone ${active ? 'stone-active' : ''} ${active && opening ? 'stone-open' : ''}`}
      style={style}
      role={active ? 'dialog' : undefined}
      aria-modal={active ? 'true' : undefined}
      aria-labelledby={active ? titleId : undefined}
      aria-hidden={blocked || undefined}
      inert={blocked}
    >
      <div className="stone-inner">
        <button
          className="stone-face stone-front"
          type="button"
          aria-label={`Abrir ${sticker.number}: ${sticker.title}`}
          tabIndex={active ? -1 : 0}
          onClick={(event) => onOpen(sticker.id, event)}
        >
          <span className="stone-number">{sticker.number}</span>
          <span className="stone-shine" />
        </button>

        <section className="stone-face stone-reveal" aria-labelledby={titleId} inert={!active || !opening} aria-hidden={!active || !opening}>
          <button className="close-panel" type="button" ref={active ? setCloseButton : null} onClick={onClose} aria-label="Cerrar y volver a las seis piedras">
            <span aria-hidden="true">×</span><span className="close-label">Volver a las piedras</span>
          </button>
          <div className="reveal-content">
            <p className="reveal-kicker">UNA CIFRA · UNA HISTORIA</p>
            <p className="reveal-number">{sticker.number}</p>
            <h2 id={titleId}>{sticker.title}</h2>
            <p className="reveal-description">{sticker.description}</p>
            <div className="reveal-meta">
              <span><b>Periodo</b>{sticker.year}</span>
              <span><b>Registro</b>{sticker.sourceType}</span>
            </div>
            <div className="reveal-source">
              <span className="source-name">{sticker.sourceName} · {sticker.year}</span>
              <a href={sticker.sourceUrl} target="_blank" rel="noopener noreferrer">Consultar fuente oficial <span aria-hidden="true">↗</span></a>
            </div>
            <blockquote>{sticker.reflection}</blockquote>
          </div>
        </section>
      </div>
    </article>
  );
}

function App() {
  const [activeId, setActiveId] = useState(null);
  const [opening, setOpening] = useState(false);
  const [origin, setOrigin] = useState(null);
  const closeRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const timerRef = useRef(null);

  function openStone(id, event) {
    if (activeId) return;
    window.clearTimeout(timerRef.current);
    const rect = event.currentTarget.getBoundingClientRect();
    restoreFocusRef.current = event.currentTarget;
    setOrigin({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    setActiveId(id);
    setOpening(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setOpening(true)));
  }

  function closeStone() {
    if (!activeId) return;
    window.clearTimeout(timerRef.current);
    setOpening(false);
    const closeDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900;
    timerRef.current = window.setTimeout(() => {
      setActiveId(null);
      setOrigin(null);
      requestAnimationFrame(() => restoreFocusRef.current?.focus());
    }, closeDelay);
  }

  useEffect(() => {
    if (!activeId) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeys(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeStone();
        return;
      }
      if (event.key === 'Tab') {
        const dialog = document.querySelector('.stone-active');
        const focusable = dialog?.querySelectorAll('a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeys);
    };
  }, [activeId]);

  useEffect(() => {
    if (opening) closeRef.current?.focus({ preventScroll: true });
  }, [opening]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const activeSticker = stickers.find((sticker) => sticker.id === activeId);

  return (
    <main className="experience">
      <OceanScene />

      <div className="page-shell">
        <div className={`scene-dimmer ${activeId ? 'is-visible' : ''}`} onClick={closeStone} aria-hidden="true" />
        <header className="site-header" inert={Boolean(activeId)}>
          <a className="wordmark" href="#inicio" aria-label="Manchari, inicio">MANCHARI</a>
          <span className="header-note">MEMORIA · VOZ · DIGNIDAD</span>
        </header>

        <section className="intro" id="inicio" aria-labelledby="page-title" inert={Boolean(activeId)}>
          <p className="eyebrow">UNA HISTORIA QUE SIGUE VIVA</p>
          <h1 id="page-title">Lo que la historia<br /><em>no borra.</em></h1>
          <p className="intro-copy">Hay historias que permanecen bajo la superficie. Elige una piedra, descubre lo que guarda y escucha aquello que no debería olvidarse.</p>
        </section>

        <section className="collection" aria-label="Colección de seis piedras con estadísticas verificadas">
        <div className="stone-grid">
          {stickers.map((sticker) => (
            <div className="stone-slot" key={sticker.id}>
              <Stone
                sticker={sticker}
                active={activeId === sticker.id}
                blocked={Boolean(activeId) && activeId !== sticker.id}
                opening={opening && activeId === sticker.id}
                origin={origin}
                onOpen={openStone}
                onClose={closeStone}
                setCloseButton={closeRef}
              />
            </div>
          ))}
          </div>
          <p className="interaction-hint" inert={Boolean(activeId)}><span aria-hidden="true">✧</span> Elige una piedra para escuchar lo que guarda</p>
        </section>

        <footer className="site-footer" inert={Boolean(activeId)}>
          <span>Made by <a href="https://theglitchgirls.vercel.app" target="_blank" rel="noopener noreferrer">Glitch Girls</a> with &lt;3</span>
        </footer>
      </div>
      {activeSticker && <span className="sr-only" aria-live="polite">Abriendo {activeSticker.number}: {activeSticker.title}</span>}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
