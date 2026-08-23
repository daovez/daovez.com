import { useEffect, useRef, useState } from "react";
import "./App.css";

/* =========================================================
   NAVEGACIÓN
========================================================= */

const navigationItems = [
  { id: "proyectos", label: "Proyectos" },
  { id: "servicios", label: "Servicios" },
  { id: "contacto", label: "Contacto" },
];

/* =========================================================
   PROYECTOS
========================================================= */

const projects = [
  {
    id: "daovez-dev",
    title: "Daovez.dev",
    meta: "Portfolio · 2026",
    url: "https://daovez.dev",
  },
  {
    id: "proyecto-02",
    title: "Proyecto 02",
    meta: "Digital experience",
    url: "",
  },
  {
    id: "proyecto-03",
    title: "Proyecto 03",
    meta: "Coming soon",
    url: "",
  },
  {
    id: "proyecto-04",
    title: "Proyecto 04",
    meta: "Coming soon",
    url: "",
  },
];

/* =========================================================
   SERVICIOS
========================================================= */

const services = [
  {
    id: "diseno",
    title: "Diseño web & UI / UX",
    meta: "Diseño digital",
    description:
      "Diseñamos interfaces modernas, limpias e intuitivas, cuidando la identidad visual, la experiencia de usuario y cada detalle de interacción. Creamos sistemas visuales adaptados a escritorio, tablet y móvil.",
  },
  {
    id: "desarrollo",
    title: "Desarrollo web",
    meta: "Frontend & Backend",
    description:
      "Desarrollamos webs y aplicaciones digitales rápidas, escalables y modernas. Trabajamos desde la interfaz hasta la lógica del servidor, APIs, bases de datos e integraciones necesarias para cada proyecto.",
  },
  {
    id: "ecommerce",
    title: "eCommerce",
    meta: "Tiendas online",
    description:
      "Creamos tiendas online rápidas, seguras y sencillas de utilizar. Diseñamos todo el proceso de compra para reducir fricción, mejorar la conversión y facilitar posteriormente la gestión del catálogo.",
  },
  {
    id: "seo",
    title: "SEO & optimización",
    meta: "Performance",
    description:
      "Optimizamos rendimiento, velocidad, estructura, accesibilidad y SEO técnico. El objetivo es conseguir una web más rápida, mejor posicionada y preparada para ofrecer una experiencia excelente.",
  },
];

/* =========================================================
   APP
========================================================= */

function App() {
  const pageRef = useRef(null);
  const openingTimerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);

  const [section, setSection] = useState(null);

  const [previewProject, setPreviewProject] = useState(null);
  const [previewService, setPreviewService] = useState(null);

  /* =====================================================
     MOVIMIENTO SUAVE HERO
  ===================================================== */

  useEffect(() => {
    const page = pageRef.current;

    if (!page) {
      return undefined;
    }

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let animationId;

    const animate = () => {
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;

      page.style.setProperty("--x", currentX);
      page.style.setProperty("--y", currentY);

      animationId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      targetX =
        (event.clientX / window.innerWidth - 0.5) * 2;

      targetY =
        (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    document.documentElement.addEventListener(
      "mouseleave",
      handlePointerLeave
    );

    animate();

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      document.documentElement.removeEventListener(
        "mouseleave",
        handlePointerLeave
      );

      window.cancelAnimationFrame(animationId);
    };
  }, []);

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      window.clearTimeout(
        openingTimerRef.current
      );
    };
  }, []);

  /* =====================================================
     RESET PREVIEWS
  ===================================================== */

  useEffect(() => {
    setPreviewProject(null);
    setPreviewService(null);
  }, [section]);

  /* =====================================================
     ABRIR STUDIO
  ===================================================== */

  const openStudio = () => {
    if (open || opening) {
      return;
    }

    setOpening(true);

    window.clearTimeout(
      openingTimerRef.current
    );

    openingTimerRef.current =
      window.setTimeout(() => {
        setOpen(true);

        openingTimerRef.current =
          window.setTimeout(() => {
            setOpening(false);
          }, 850);
      }, 120);
  };

  /* =====================================================
     HOME
  ===================================================== */

  const goHome = () => {
    setSection(null);
    setPreviewProject(null);
    setPreviewService(null);
  };

  /* =====================================================
     CAMBIAR SECCIÓN
  ===================================================== */

  const changeSection = (nextSection) => {
    setSection(nextSection);

    setPreviewProject(null);
    setPreviewService(null);
  };

  /* =====================================================
     CERRAR TARJETA
  ===================================================== */

  const closeCard = (event) => {
    event.stopPropagation();

    setSection(null);
    setPreviewProject(null);
    setPreviewService(null);
  };

  /* =====================================================
     TOUCH
  ===================================================== */

  const isTouchDevice = () => {
    return window.matchMedia(
      "(hover: none)"
    ).matches;
  };

  /* =====================================================
     PROYECTOS
  ===================================================== */

  const renderProjects = () => (
    <>
      <header className="section-card-header">
        <h2>Proyectos</h2>
      </header>

      <div className="projects-layout">
        <div className="projects-list">
          {projects.map((project) => {
            const isActive =
              previewProject?.id === project.id;

            return (
              <button
                key={project.id}
                type="button"
                className={`project-row ${
                  isActive
                    ? "is-previewing"
                    : ""
                } ${
                  !project.url
                    ? "is-disabled"
                    : ""
                }`}
                onMouseEnter={() => {
                  if (project.url) {
                    setPreviewProject(project);
                  }
                }}
                onMouseLeave={() => {
                  setPreviewProject(null);
                }}
                onFocus={() => {
                  if (project.url) {
                    setPreviewProject(project);
                  }
                }}
                onBlur={() => {
                  setPreviewProject(null);
                }}
                onClick={() => {
                  if (
                    isTouchDevice() &&
                    project.url
                  ) {
                    setPreviewProject(
                      isActive
                        ? null
                        : project
                    );
                  }
                }}
              >
                <span className="row-title">
                  {project.title}
                </span>

                <span className="row-meta">
                  {project.meta}
                </span>
              </button>
            );
          })}
        </div>

        {previewProject?.url && (
          <div
            key={previewProject.id}
            className="hover-preview-area project-preview-area"
          >
            <div className="project-preview">

              <div className="project-preview-toolbar">
                <div className="preview-dots">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="preview-address">
                  {previewProject.url
                    .replace("https://", "")
                    .replace("http://", "")}
                </div>

                <span className="preview-live">
                  LIVE
                </span>
              </div>

              <div className="project-preview-window">
                <iframe
                  src={previewProject.url}
                  title={`Vista previa de ${previewProject.title}`}
                  className="project-preview-frame"
                  loading="lazy"
                />
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );

  /* =====================================================
     SERVICIOS
  ===================================================== */

  const renderServices = () => (
    <>
      <header className="section-card-header">
        <h2>Servicios</h2>
      </header>

      <div className="services-layout">

        <div className="services-list">
          {services.map((service) => {
            const isActive =
              previewService?.id === service.id;

            return (
              <button
                key={service.id}
                type="button"
                className={`service-row ${
                  isActive
                    ? "is-previewing"
                    : ""
                }`}
                onMouseEnter={() => {
                  setPreviewService(service);
                }}
                onMouseLeave={() => {
                  setPreviewService(null);
                }}
                onFocus={() => {
                  setPreviewService(service);
                }}
                onBlur={() => {
                  setPreviewService(null);
                }}
                onClick={() => {
                  if (isTouchDevice()) {
                    setPreviewService(
                      isActive
                        ? null
                        : service
                    );
                  }
                }}
              >
                <span className="row-title">
                  {service.title}
                </span>

                <span className="row-meta">
                  {service.meta}
                </span>
              </button>
            );
          })}
        </div>

        {previewService && (
          <div
            key={previewService.id}
            className="hover-preview-area service-preview-area"
          >
            <div className="service-preview-content">

              <span className="service-preview-label">
                SERVICIO
              </span>

              <h3>
                {previewService.title}
              </h3>

              <p>
                {previewService.description}
              </p>

              <div className="service-preview-bottom">

                <span>
                  {previewService.meta}
                </span>

                <span aria-hidden="true">
                  ↗
                </span>

              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );

  /* =====================================================
     CONTACTO
  ===================================================== */

  const renderContact = () => (
    <div className="contact-circle-content">

      {/* ===============================================
          VIDEO
          SIN LOOP:
          se reproduce una vez y queda en último frame
      =============================================== */}

      <div className="contact-circle-video-wrap">

        <video
          className="contact-circle-video"
          autoPlay
          muted
          playsInline
          preload="auto"
        >
          <source
            src="/contact-card.mp4"
            type="video/mp4"
          />
        </video>

        <div className="contact-circle-video-overlay" />

      </div>

      {/* ===============================================
          CONTENIDO
      =============================================== */}

      <div className="contact-circle-inner">

        <span className="contact-circle-label">
          CONTACTO
        </span>

        <h2>
          Hablemos
        </h2>

        <p>
          ¿Tienes una idea?
          <br />
          Vamos a crear algo especial.
        </p>

        <a
          href="mailto:yo@daovez.com"
          className="contact-circle-email"
        >
          yo@daovez.com
        </a>

        <a
          href="https://daovez.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-circle-link"
        >
          daovez.dev ↗
        </a>

      </div>

    </div>
  );

  /* =====================================================
     RENDER SECCIÓN
  ===================================================== */

  const renderSectionCard = () => {
    if (section === "proyectos") {
      return renderProjects();
    }

    if (section === "servicios") {
      return renderServices();
    }

    if (section === "contacto") {
      return renderContact();
    }

    return null;
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <main
      ref={pageRef}
      className="page"
    >
      <article
        className={`studio-shell ${
          open ? "is-open" : ""
        } ${
          opening ? "is-opening" : ""
        }`}
        role={
          open ? undefined : "button"
        }
        tabIndex={
          open ? -1 : 0
        }
        aria-label={
          open
            ? undefined
            : "Abrir Art & Tech Studio"
        }
        onClick={() => {
          if (!open) {
            openStudio();
          }
        }}
        onKeyDown={(event) => {
          if (
            !open &&
            (
              event.key === "Enter" ||
              event.key === " "
            )
          ) {
            event.preventDefault();
            openStudio();
          }
        }}
      >
        {!open ? (

          <div className="studio-entry">
            <img
              src="/logo.png"
              alt="DAO Studio"
              className="studio-entry-logo"
            />
          </div>

        ) : (

          <div className="studio-interface">

            {/* ===========================================
                NAVBAR
            =========================================== */}

            <header className="topbar">

              <button
                type="button"
                className="topbar-brand"
                onClick={goHome}
                aria-label="Volver a portada"
              >
                <img
                  src="/logo.png"
                  alt="DAO Studio"
                  className="topbar-logo"
                />
              </button>

              <nav
                className="topbar-nav"
                aria-label="Navegación principal"
              >
                {navigationItems.map(
                  (item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`topbar-link ${
                        section === item.id
                          ? "is-active"
                          : ""
                      }`}
                      onClick={() =>
                        changeSection(
                          item.id
                        )
                      }
                    >
                      {item.label}
                    </button>
                  )
                )}
              </nav>

            </header>

            {/* ===========================================
                HERO
            =========================================== */}

            <div className="hero-area">

              <section className="hero-left">

                <h1 className="background-title">

                  <span className="art-tech-title">
                    Art & Tech
                  </span>

                  <span className="studio-title">
                    Studio
                  </span>

                </h1>

              </section>

              <section className="hero-right">

                {section && (
                  <div
                    key={section}
                    className={`section-card section-card-${section}`}
                  >
                    <button
                      type="button"
                      className="section-card-close"
                      aria-label="Cerrar tarjeta"
                      onClick={closeCard}
                    >
                      ×
                    </button>

                    {renderSectionCard()}
                  </div>
                )}

              </section>

            </div>

          </div>
        )}
      </article>
    </main>
  );
}

export default App;