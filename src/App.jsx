import { useEffect, useRef, useState } from "react";
import "./App.css";

const videos = {
  studio: "/background-studio.mp4",
  proyectos: "/background-projects.mp4",
  servicios: "/background-services.mp4",
  contacto: "/background-contact.mp4",
};

const LENS_ZOOM = 1.16;

const projects = [
  {
    id: "daovez-dev",
    title: "Daovez.dev",
    meta: "Portafolio personal · 2026",
    url: "https://daovez.dev",
    previewUrl: "https://daovez.dev",
    enabled: true,
  },
  {
    id: "project-02",
    title: "Proyecto 02",
    meta: "Digital Experience",
    url: "",
    previewUrl: "",
    enabled: false,
  },
  {
    id: "project-03",
    title: "Proyecto 03",
    meta: "Coming soon",
    url: "",
    previewUrl: "",
    enabled: false,
  },
  {
    id: "project-04",
    title: "Proyecto 04",
    meta: "Coming soon",
    url: "",
    previewUrl: "",
    enabled: false,
  },
];

const services = [
  {
    id: "web-design",
    title: "Web Design",
    meta: "Diseño digital",
  },
  {
    id: "development",
    title: "Development",
    meta: "Desarrollo web",
  },
  {
    id: "ui-ux",
    title: "UI / UX",
    meta: "Interfaces",
  },
  {
    id: "creative-development",
    title: "Creative Development",
    meta: "Experiencias digitales",
  },
];

function App() {
  const heroRef = useRef(null);
  const mainVideoRef = useRef(null);
  const lensContainerRef = useRef(null);
  const lensCanvasRef = useRef(null);
  const transitionTimerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("studio");

  const [currentVideo, setCurrentVideo] = useState(
    videos.studio
  );

  const [previousVideo, setPreviousVideo] =
    useState(null);

  const [previewProject, setPreviewProject] =
    useState(null);

  /* =========================================
     NUEVO
     EL NEGRO DESAPARECE PARA SIEMPRE
     DESPUÉS DEL PRIMER HOVER
  ========================================= */

  const [backgroundRevealed, setBackgroundRevealed] =
    useState(false);

  /* =========================================
     PARALLAX

     IMPORTANTE:
     ESTO SOLO MUEVE EL VIDEO.
     LA TARJETA NO USA --x NI --y.
  ========================================= */

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let animationFrame;

    const animate = () => {
      currentX +=
        (targetX - currentX) * 0.055;

      currentY +=
        (targetY - currentY) * 0.055;

      hero.style.setProperty(
        "--x",
        currentX
      );

      hero.style.setProperty(
        "--y",
        currentY
      );

      animationFrame =
        requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      targetX =
        (event.clientX /
          window.innerWidth -
          0.5) *
        2;

      targetY =
        (event.clientY /
          window.innerHeight -
          0.5) *
        2;
    };

    const resetPosition = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    document.documentElement.addEventListener(
      "mouseleave",
      resetPosition
    );

    animate();

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      document.documentElement.removeEventListener(
        "mouseleave",
        resetPosition
      );

      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);

  /* =========================================
     LUPA REAL DEL VIDEO
  ========================================= */

  useEffect(() => {
    if (!open) return;

    const canvas =
      lensCanvasRef.current;

    const lens =
      lensContainerRef.current;

    if (!canvas || !lens) return;

    const context =
      canvas.getContext("2d", {
        alpha: false,
      });

    if (!context) return;

    canvas.classList.remove(
      "lens-ready"
    );

    let animationFrame;
    let firstFrameDrawn = false;

    const drawLens = () => {
      const video =
        mainVideoRef.current;

      if (
        video &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        const videoRect =
          video.getBoundingClientRect();

        const lensRect =
          lens.getBoundingClientRect();

        const cssWidth = Math.max(
          1,
          lensRect.width
        );

        const cssHeight = Math.max(
          1,
          lensRect.height
        );

        const dpr = Math.min(
          window.devicePixelRatio || 1,
          2
        );

        const pixelWidth =
          Math.round(
            cssWidth * dpr
          );

        const pixelHeight =
          Math.round(
            cssHeight * dpr
          );

        if (
          canvas.width !== pixelWidth ||
          canvas.height !== pixelHeight
        ) {
          canvas.width =
            pixelWidth;

          canvas.height =
            pixelHeight;
        }

        context.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0
        );

        context.clearRect(
          0,
          0,
          cssWidth,
          cssHeight
        );

        const coverScale =
          Math.max(
            videoRect.width /
              video.videoWidth,

            videoRect.height /
              video.videoHeight
          );

        const visibleSourceWidth =
          videoRect.width /
          coverScale;

        const visibleSourceHeight =
          videoRect.height /
          coverScale;

        const sourceOffsetX =
          (video.videoWidth -
            visibleSourceWidth) /
          2;

        const sourceOffsetY =
          (video.videoHeight -
            visibleSourceHeight) /
          2;

        const lensCenterX =
          lensRect.left +
          lensRect.width / 2;

        const lensCenterY =
          lensRect.top +
          lensRect.height / 2;

        const relativeCenterX =
          lensCenterX -
          videoRect.left;

        const relativeCenterY =
          lensCenterY -
          videoRect.top;

        const sourceCenterX =
          sourceOffsetX +
          relativeCenterX /
            coverScale;

        const sourceCenterY =
          sourceOffsetY +
          relativeCenterY /
            coverScale;

        let sourceWidth =
          cssWidth /
          coverScale /
          LENS_ZOOM;

        let sourceHeight =
          cssHeight /
          coverScale /
          LENS_ZOOM;

        sourceWidth = Math.min(
          sourceWidth,
          video.videoWidth
        );

        sourceHeight = Math.min(
          sourceHeight,
          video.videoHeight
        );

        let sourceX =
          sourceCenterX -
          sourceWidth / 2;

        let sourceY =
          sourceCenterY -
          sourceHeight / 2;

        sourceX = Math.max(
          0,
          Math.min(
            sourceX,
            video.videoWidth -
              sourceWidth
          )
        );

        sourceY = Math.max(
          0,
          Math.min(
            sourceY,
            video.videoHeight -
              sourceHeight
          )
        );

        context.drawImage(
          video,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          cssWidth,
          cssHeight
        );

        if (!firstFrameDrawn) {
          firstFrameDrawn = true;

          requestAnimationFrame(
            () => {
              canvas.classList.add(
                "lens-ready"
              );
            }
          );
        }
      }

      animationFrame =
        requestAnimationFrame(
          drawLens
        );
    };

    drawLens();

    return () => {
      cancelAnimationFrame(
        animationFrame
      );
    };
  }, [open, currentVideo]);

  /* =========================================
     LIMPIAR TIMER
  ========================================= */

  useEffect(() => {
    return () => {
      if (
        transitionTimerRef.current
      ) {
        clearTimeout(
          transitionTimerRef.current
        );
      }
    };
  }, []);

  /* =========================================
     CAMBIO DE SECCIÓN
  ========================================= */

  const changeSection = (
    nextSection
  ) => {
    if (
      nextSection === section
    ) {
      return;
    }

    setPreviewProject(null);

    if (
      transitionTimerRef.current
    ) {
      clearTimeout(
        transitionTimerRef.current
      );
    }

    setPreviousVideo(
      currentVideo
    );

    setSection(
      nextSection
    );

    setCurrentVideo(
      videos[nextSection]
    );

    transitionTimerRef.current =
      setTimeout(() => {
        setPreviousVideo(null);
      }, 1400);
  };

  /* =========================================
     PREVIEW PROYECTO
  ========================================= */

  const ProjectPreview = ({
    project,
  }) => {
    const visible =
      previewProject?.id ===
      project.id;

    return (
      <div
        className={`project-preview ${
          visible
            ? "project-preview-visible"
            : ""
        }`}
        aria-hidden="true"
      >
        <div className="project-preview-header">
          <div className="preview-dots">
            <span />
            <span />
            <span />
          </div>

          <span className="project-preview-title">
            {project.title}
          </span>
        </div>

        {project.previewUrl ? (
          <div className="project-preview-browser">
            <iframe
              src={
                project.previewUrl
              }
              title={`Preview ${project.title}`}
              loading="lazy"
              tabIndex="-1"
            />
          </div>
        ) : (
          <div className="project-preview-empty">
            <span>
              PRÓXIMAMENTE
            </span>

            <strong>
              {project.title}
            </strong>

            <small>
              Preview pendiente
            </small>
          </div>
        )}
      </div>
    );
  };

  /* =========================================
     PROYECTOS
  ========================================= */

  const renderProjects = () => (
    <div className="content-grid-list project-list">
      {projects.map(
        (project) => (
          <div
            key={project.id}
            className="project-item"
          >
            <ProjectPreview
              project={project}
            />

            {project.enabled &&
            project.url ? (
              <a
                className="content-row project-link"
                href={
                  project.url
                }
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() =>
                  setPreviewProject(
                    project
                  )
                }
                onMouseLeave={() =>
                  setPreviewProject(
                    null
                  )
                }
                onFocus={() =>
                  setPreviewProject(
                    project
                  )
                }
                onBlur={() =>
                  setPreviewProject(
                    null
                  )
                }
                onClick={(
                  event
                ) => {
                  event.stopPropagation();
                }}
              >
                <span className="row-name">
                  {
                    project.title
                  }
                </span>

                <small className="row-meta">
                  {
                    project.meta
                  }
                </small>
              </a>
            ) : (
              <button
                type="button"
                className="content-row project-placeholder"
                onMouseEnter={() =>
                  setPreviewProject(
                    project
                  )
                }
                onMouseLeave={() =>
                  setPreviewProject(
                    null
                  )
                }
              >
                <span className="row-name">
                  {
                    project.title
                  }
                </span>

                <small className="row-meta">
                  {
                    project.meta
                  }
                </small>
              </button>
            )}
          </div>
        )
      )}
    </div>
  );

  /* =========================================
     SERVICIOS
  ========================================= */

  const renderServices = () => (
    <div className="content-grid-list services-list">
      {services.map(
        (service) => (
          <button
            key={service.id}
            type="button"
            className="content-row service-row"
          >
            <span className="row-name">
              {
                service.title
              }
            </span>

            <small className="row-meta">
              {
                service.meta
              }
            </small>
          </button>
        )
      )}
    </div>
  );

  /* =========================================
     CONTENIDO
  ========================================= */

  const content = {
    studio: (
      <>
        <span className="section-number">
          01 / STUDIO
        </span>

        <h2>
          Digital
          <br />
          Studio.
        </h2>

        <p>
          Creamos experiencias
          digitales donde diseño,
          desarrollo y tecnología
          trabajan juntos para
          construir productos con
          identidad propia.
        </p>
      </>
    ),

    proyectos: (
      <>
        <span className="section-number">
          02 / PROYECTOS
        </span>

        <h2>
          Selected
          <br />
          Work.
        </h2>

        {renderProjects()}
      </>
    ),

    servicios: (
      <>
        <span className="section-number">
          03 / SERVICIOS
        </span>

        <h2>
          What
          <br />
          we do.
        </h2>

        {renderServices()}
      </>
    ),

    contacto: (
      <>
        <span className="section-number">
          04 / CONTACTO
        </span>

        <h2>
          Start a
          <br />
          project.
        </h2>

        <p>
          ¿Tienes una idea?
          <br />
          Vamos hacerla realidad.
          Háblame sin compromiso.
        </p>

        <a
          className="contact-link"
          href="mailto:yo@daovez.com"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <span>
            yo@daovez.com
          </span>

          <span>↗</span>
        </a>
      </>
    ),
  };

  return (
    <main
      ref={heroRef}
      className={`hero ${
        backgroundRevealed
          ? "background-revealed"
          : ""
      }`}
    >
      {/* =====================================
          VIDEOS
      ====================================== */}

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
            <source
              src={
                previousVideo
              }
              type="video/mp4"
            />
          </video>
        )}

        <video
          ref={mainVideoRef}
          key={currentVideo}
          className="background-video video-in"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src={currentVideo}
            type="video/mp4"
          />
        </video>
      </div>

      {/* =====================================
          TARJETA
      ====================================== */}

      <article
        className={`studio-card ${
          open ? "open" : ""
        }`}

        onPointerEnter={() => {
          setBackgroundRevealed(
            true
          );
        }}

        onClick={() => {
          setBackgroundRevealed(
            true
          );

          if (!open) {
            setOpen(true);
          }
        }}
      >
        {!open ? (
          <div className="intro">
            <img
              src="/logo.png"
              alt="Studio Web"
              className="studio-logo intro-logo"
            />

            <div className="intro-bottom">
              <h1>
                Experiencias
                <br />
                digitales
                <br />
                modernas.
              </h1>

              <span className="intro-pulse">
                Pulse
              </span>
            </div>
          </div>
        ) : (
          <div className="interface">
            {/* IZQUIERDA */}

            <section className="interface-left">
              <button
                type="button"
                className="close"
                aria-label="Cerrar"
                onClick={(
                  event
                ) => {
                  event.stopPropagation();

                  setOpen(false);
                }}
              >
                ×
              </button>

              <a
                className="portfolio-pill"
                href="https://daovez.dev"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(
                  event
                ) => {
                  event.stopPropagation();
                }}
              >
                daovez.dev
              </a>

              <img
                src="/logo.png"
                alt="Studio Web"
                className="studio-logo expanded-logo"
              />

              <div className="left-bottom">
                <span className="label">
                  INDEPENDENT
                  <br />
                  DIGITAL STUDIO
                </span>

                <h3>
                  Creamos
                  <br />
                  experiencias
                  <br />
                  digitales.
                </h3>

                <div className="location">
                  <span>
                    MÁLAGA
                  </span>

                  <span>
                    SPAIN
                  </span>
                </div>
              </div>
            </section>

            {/* CENTRO */}

            <section
              ref={
                lensContainerRef
              }
              className={`interface-content section-${section}`}
            >
              <canvas
                ref={
                  lensCanvasRef
                }
                className="lens-canvas"
                aria-hidden="true"
              />

              <div
                className="lens-glass"
                aria-hidden="true"
              />

              <div
                key={section}
                className={`content-inner content-${section}`}
              >
                {
                  content[
                    section
                  ]
                }
              </div>
            </section>

            {/* DERECHA */}

            <nav
              className="navigation"
              onClick={(
                event
              ) => {
                event.stopPropagation();
              }}
            >
              <button
                type="button"
                className={
                  section ===
                  "studio"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  changeSection(
                    "studio"
                  )
                }
              >
                <small>
                  01
                </small>

                <span>
                  Studio
                </span>
              </button>

              <button
                type="button"
                className={
                  section ===
                  "proyectos"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  changeSection(
                    "proyectos"
                  )
                }
              >
                <small>
                  02
                </small>

                <span>
                  Proyectos
                </span>
              </button>

              <button
                type="button"
                className={
                  section ===
                  "servicios"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  changeSection(
                    "servicios"
                  )
                }
              >
                <small>
                  03
                </small>

                <span>
                  Servicios
                </span>
              </button>

              <button
                type="button"
                className={
                  section ===
                  "contacto"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  changeSection(
                    "contacto"
                  )
                }
              >
                <small>
                  04
                </small>

                <span>
                  Contacto
                </span>
              </button>
            </nav>
          </div>
        )}
      </article>
    </main>
  );
}

export default App;