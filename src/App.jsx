import { useEffect, useRef, useState } from "react";
import "./App.css";

const videos = {
  studio: "/background-studio.mp4",
  proyectos: "/background-projects.mp4",
  servicios: "/background-services.mp4",
  contacto: "/background-contact.mp4",
};

function App() {
  const heroRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("studio");

  const [currentVideo, setCurrentVideo] = useState(videos.studio);
  const [previousVideo, setPreviousVideo] = useState(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrame;

    const animate = () => {
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      hero.style.setProperty("--x", currentX);
      hero.style.setProperty("--y", currentY);

      animationFrame = requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const resetPosition = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("mouseleave", resetPosition);

    animate();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", resetPosition);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const changeSection = (nextSection) => {
    if (nextSection === section) return;

    setPreviousVideo(currentVideo);
    setSection(nextSection);
    setCurrentVideo(videos[nextSection]);

    window.setTimeout(() => {
      setPreviousVideo(null);
    }, 1400);
  };

  const content = {
    studio: (
      <>
        <span className="section-number">01 / STUDIO</span>

        <h2>
          Digital
          <br />
          Studio.
        </h2>

        <p>
          Creamos experiencias digitales donde diseño, desarrollo y tecnología
          trabajan juntos para construir productos con identidad propia.
        </p>
      </>
    ),

    proyectos: (
      <>
        <span className="section-number">02 / PROYECTOS</span>

        <h2>
          Selected
          <br />
          Work.
        </h2>

        <div className="project-list">
          <button type="button">
            <span>Daovez.dev</span>
            <small>Portfolio · 2026</small>
          </button>

          <button type="button">
            <span>Proyecto 02</span>
            <small>Digital Experience</small>
          </button>

          <button type="button">
            <span>Proyecto 03</span>
            <small>Coming soon</small>
          </button>
        </div>
      </>
    ),

    servicios: (
      <>
        <span className="section-number">03 / SERVICIOS</span>

        <h2>
          What
          <br />
          we do.
        </h2>

        <div className="services-list">
          <span>Web Design</span>
          <span>Development</span>
          <span>UI / UX</span>
          <span>Creative Development</span>
        </div>
      </>
    ),

    contacto: (
      <>
        <span className="section-number">04 / CONTACTO</span>

        <h2>
          Start a
          <br />
          project.
        </h2>

        <p>
          ¿Tienes una idea?
          <br />
          Hablemos y construyámosla.
        </p>

        <a className="contact-link" href="mailto:hello@daovez.com">
          <span>hello@daovez.com</span>
          <span>↗</span>
        </a>
      </>
    ),
  };

  return (
    <main ref={heroRef} className="hero">
      {/* =========================
          VIDEOS DE FONDO
      ========================== */}

      <div className="video-background">
        {previousVideo && (
          <video
            key={`previous-${previousVideo}`}
            className="background-video video-out"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={previousVideo} type="video/mp4" />
          </video>
        )}

        <video
          key={currentVideo}
          className="background-video video-in"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={currentVideo} type="video/mp4" />
        </video>
      </div>

      {/* =========================
          EFECTOS
      ========================== */}

      <div className="color-layer" />
      <div className="orbital-lines" />

      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />
      <div className="background-glow glow-three" />

      <div className="vignette" />
      <div className="grain" />

      {/* =========================
          CABECERA
      ========================== */}

      <header className="top-info">
        <span>DAOVEZ®</span>
        <span>INDEPENDENT DIGITAL STUDIO</span>
      </header>

      {/* =========================
          TARJETA
      ========================== */}

      <article
        className={`studio-card ${open ? "open" : ""}`}
        onClick={() => {
          if (!open) setOpen(true);
        }}
      >
        {!open ? (
          <div className="intro">
            <div className="label-pill">STUDIO</div>

            <img
              src="/logo.png"
              alt="Daovez Studio"
              className="studio-logo"
            />

            <div className="intro-bottom">
              <span className="label">INDEPENDENT DIGITAL STUDIO</span>

              <h1>
                Modern
                <br />
                digital
                <br />
                experiences.
              </h1>

              <div className="decorative-lines" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <p>
                Diseño y desarrollo de experiencias digitales con una dirección
                visual limpia, tecnológica y experimental.
              </p>

              <div className="enter">
                <span>ENTRAR</span>
                <span className="enter-arrow">↗</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="interface">
            {/* IZQUIERDA — CRISTAL */}

            <section className="interface-left">
              <button
                type="button"
                className="close"
                aria-label="Cerrar"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen(false);
                }}
              >
                ×
              </button>

              <div className="label-pill">DAOVEZ</div>

              <img
                src="/logo.png"
                alt="Daovez Studio"
                className="studio-logo expanded-logo"
              />

              <div className="left-bottom">
                <span className="label">
                  INDEPENDENT
                  <br />
                  DIGITAL STUDIO
                </span>

                <h3>
                  We create
                  <br />
                  digital
                  <br />
                  experiences.
                </h3>

                <div className="location">
                  <span>MÁLAGA</span>
                  <span>SPAIN</span>
                </div>
              </div>
            </section>

            {/* CENTRO — 100% TRANSPARENTE */}

            <section className="interface-content">
              <div key={section} className="content-inner">
                {content[section]}
              </div>

              <div className="content-footer">
                <span>DAOVEZ STUDIO</span>
                <span>2026</span>
              </div>
            </section>

            {/* DERECHA — CRISTAL */}

            <nav
              className="navigation"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className={section === "studio" ? "active" : ""}
                onClick={() => changeSection("studio")}
              >
                <small>01</small>
                Studio
              </button>

              <button
                type="button"
                className={section === "proyectos" ? "active" : ""}
                onClick={() => changeSection("proyectos")}
              >
                <small>02</small>
                Proyectos
              </button>

              <button
                type="button"
                className={section === "servicios" ? "active" : ""}
                onClick={() => changeSection("servicios")}
              >
                <small>03</small>
                Servicios
              </button>

              <button
                type="button"
                className={section === "contacto" ? "active" : ""}
                onClick={() => changeSection("contacto")}
              >
                <small>04</small>
                Contacto
              </button>
            </nav>
          </div>
        )}
      </article>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="bottom-info">
        <span>CREATIVE DEVELOPMENT</span>
        <span>© DAOVEZ 2026</span>
      </footer>
    </main>
  );
}

export default App;
