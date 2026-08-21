import { useEffect, useRef, useState } from "react";
import "./App.css";

const videos = {
  studio: "/background-studio.mp4",
  proyectos: "/background-projects.mp4",
  servicios: "/background-services.mp4",
  contacto: "/background-contact.mp4",
};

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
    title: "Diseño web y UI / UX",
    description:
      "Diseñamos webs modernas, atractivas e intuitivas, adaptadas a cualquier dispositivo y cuidando cada detalle de la experiencia de usuario.",
  },
  {
    id: "development",
    title: "Desarrollo web full-stack",
    description:
      "Desarrollamos webs y aplicaciones completas, desde la interfaz hasta el servidor, incluyendo bases de datos, APIs e integraciones a medida.",
  },
  {
    id: "ecommerce",
    title: "Tiendas online y eCommerce",
    description:
      "Creamos tiendas online rápidas, seguras y fáciles de gestionar, pensadas para vender y ofrecer una experiencia de compra sencilla y agradable.",
  },
  {
    id: "seo",
    title: "SEO y optimización web",
    description:
      "Mejoramos velocidad, rendimiento, estructura y SEO técnico para que tu web cargue mejor, sea más fácil de usar y gane visibilidad en buscadores.",
  },
];

const LENS_ZOOM = 1.16;

function TypewriterText() {
  const mainText = "Creamos\nexperiencias\ndigitales.";
  const claimText = "Diseño.\nCódigo.\nIdentidad.";

  const [mainVisible, setMainVisible] = useState("");
  const [claimVisible, setClaimVisible] = useState("");
  const [mainFinished, setMainFinished] = useState(false);
  const [claimFinished, setClaimFinished] = useState(false);

  useEffect(() => {
    let index = 0;
    let intervalId;

    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setMainVisible(mainText.slice(0, index));

        if (index >= mainText.length) {
          window.clearInterval(intervalId);
          setMainFinished(true);
        }
      }, 55);
    }, 300);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!mainFinished) return undefined;

    let index = 0;
    let intervalId;

    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setClaimVisible(claimText.slice(0, index));

        if (index >= claimText.length) {
          window.clearInterval(intervalId);
          setClaimFinished(true);
        }
      }, 55);
    }, 420);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [mainFinished]);

  return (
    <div className="typewriter-block">
      <h3 className="typewriter-title">
        {mainVisible}
        {!mainFinished && <span className="typing-cursor">|</span>}
      </h3>

      <p className={`typewriter-claim ${mainFinished ? "claim-visible" : ""}`}>
        {claimVisible}
        {mainFinished && !claimFinished && (
          <span className="claim-cursor">|</span>
        )}
      </p>
    </div>
  );
}

function App() {
  const heroRef = useRef(null);
  const mainVideoRef = useRef(null);
  const lensContainerRef = useRef(null);
  const lensCanvasRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const openingTimerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [section, setSection] = useState("studio");
  const [currentVideo, setCurrentVideo] = useState(videos.studio);
  const [previousVideo, setPreviousVideo] = useState(null);
  const [previewProject, setPreviewProject] = useState(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId;

    const animate = () => {
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      hero.style.setProperty("--x", currentX);
      hero.style.setProperty("--y", currentY);

      frameId = window.requestAnimationFrame(animate);
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
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const canvas = lensCanvasRef.current;
    const lens = lensContainerRef.current;
    if (!canvas || !lens) return undefined;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return undefined;

    canvas.classList.remove("lens-ready");

    let frameId;
    let firstFrameDrawn = false;

    const drawLens = () => {
      const video = mainVideoRef.current;

      if (
        video &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        const videoRect = video.getBoundingClientRect();
        const lensRect = lens.getBoundingClientRect();
        const cssWidth = Math.max(1, lensRect.width);
        const cssHeight = Math.max(1, lensRect.height);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const pixelWidth = Math.round(cssWidth * dpr);
        const pixelHeight = Math.round(cssHeight * dpr);

        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth;
          canvas.height = pixelHeight;
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, cssWidth, cssHeight);

        const coverScale = Math.max(
          videoRect.width / video.videoWidth,
          videoRect.height / video.videoHeight,
        );

        const visibleSourceWidth = videoRect.width / coverScale;
        const visibleSourceHeight = videoRect.height / coverScale;
        const sourceOffsetX = (video.videoWidth - visibleSourceWidth) / 2;
        const sourceOffsetY = (video.videoHeight - visibleSourceHeight) / 2;
        const lensCenterX = lensRect.left + lensRect.width / 2;
        const lensCenterY = lensRect.top + lensRect.height / 2;
        const relativeCenterX = lensCenterX - videoRect.left;
        const relativeCenterY = lensCenterY - videoRect.top;
        const sourceCenterX = sourceOffsetX + relativeCenterX / coverScale;
        const sourceCenterY = sourceOffsetY + relativeCenterY / coverScale;

        let sourceWidth = cssWidth / coverScale / LENS_ZOOM;
        let sourceHeight = cssHeight / coverScale / LENS_ZOOM;

        sourceWidth = Math.min(sourceWidth, video.videoWidth);
        sourceHeight = Math.min(sourceHeight, video.videoHeight);

        let sourceX = sourceCenterX - sourceWidth / 2;
        let sourceY = sourceCenterY - sourceHeight / 2;

        sourceX = Math.max(
          0,
          Math.min(sourceX, video.videoWidth - sourceWidth),
        );
        sourceY = Math.max(
          0,
          Math.min(sourceY, video.videoHeight - sourceHeight),
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
          cssHeight,
        );

        if (!firstFrameDrawn) {
          firstFrameDrawn = true;
          window.requestAnimationFrame(() => canvas.classList.add("lens-ready"));
        }
      }

      frameId = window.requestAnimationFrame(drawLens);
    };

    drawLens();

    return () => window.cancelAnimationFrame(frameId);
  }, [open, currentVideo]);

  useEffect(() => {
    return () => {
      window.clearTimeout(transitionTimerRef.current);
      window.clearTimeout(openingTimerRef.current);
    };
  }, []);

  const openStudio = () => {
    if (open || opening) return;

    setOpening(true);
    window.clearTimeout(openingTimerRef.current);

    openingTimerRef.current = window.setTimeout(() => {
      setOpen(true);

      openingTimerRef.current = window.setTimeout(() => {
        setOpening(false);
      }, 1000);
    }, 145);
  };

  const closeStudio = () => {
    window.clearTimeout(openingTimerRef.current);
    openingTimerRef.current = null;

    setOpening(false);
    setPreviewProject(null);
    setOpen(false);
  };

  const changeSection = (nextSection) => {
    if (nextSection === section) return;

    setPreviewProject(null);
    window.clearTimeout(transitionTimerRef.current);

    setPreviousVideo(currentVideo);
    setSection(nextSection);
    setCurrentVideo(videos[nextSection]);

    transitionTimerRef.current = window.setTimeout(() => {
      setPreviousVideo(null);
    }, 1250);
  };

  const ProjectPreview = ({ project }) => {
    const visible = previewProject?.id === project.id;

    return (
      <div
        className={`project-preview ${visible ? "project-preview-visible" : ""}`}
        aria-hidden="true"
      >
        {project.previewUrl ? (
          <div className="project-preview-browser">
            <iframe
              src={project.previewUrl}
              title={`Preview ${project.title}`}
              loading="lazy"
              tabIndex="-1"
            />
          </div>
        ) : (
          <div className="project-preview-empty">
            <span>PRÓXIMAMENTE</span>
            <strong>{project.title}</strong>
            <small>Preview pendiente</small>
          </div>
        )}
      </div>
    );
  };

  const renderProjects = () => (
    <div className="project-list">
      {projects.map((project) => (
        <div key={project.id} className="project-item">
          <ProjectPreview project={project} />

          {project.enabled && project.url ? (
            <a
              className="project-row"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setPreviewProject(project)}
              onMouseLeave={() => setPreviewProject(null)}
              onFocus={() => setPreviewProject(project)}
              onBlur={() => setPreviewProject(null)}
              onClick={(event) => event.stopPropagation()}
            >
              <span className="row-name">{project.title}</span>
              <small className="row-meta">{project.meta}</small>
            </a>
          ) : (
            <button
              type="button"
              className="project-row project-placeholder"
              onMouseEnter={() => setPreviewProject(project)}
              onMouseLeave={() => setPreviewProject(null)}
              onFocus={() => setPreviewProject(project)}
              onBlur={() => setPreviewProject(null)}
            >
              <span className="row-name">{project.title}</span>
              <small className="row-meta">{project.meta}</small>
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const renderServices = () => (
    <div className="services-list">
      {services.map((service) => (
        <div key={service.id} className="service-item">
          <button
            type="button"
            className="service-card"
            aria-label={`${service.title}. ${service.description}`}
          >
            <span className="service-title">{service.title}</span>
            <span className="service-description">{service.description}</span>
          </button>
        </div>
      ))}
    </div>
  );

  const content = {
    studio: (
      <>
        <span className="section-number">01 / STUDIO</span>
        <h2>
          Estudio
          <br />
          digital web.
        </h2>
        <br />
  
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
          Nuestro
          <br />
          Trabajo.
        </h2>
        {renderProjects()}
      </>
    ),
    servicios: (
      <>
        <span className="section-number">03 / SERVICIOS</span>
        <h2>
          ¿Qué
          <br />
          hacemos?
        </h2>
        {renderServices()}
      </>
    ),
    contacto: (
      <>
        <span className="section-number">04 / CONTACTO</span>
        <h2>
          Comienza ya 
          <br />
          yu proyecto.
        </h2>
        <p>
          ¿Tienes una idea?
          <br />
          Vamos a hacerla realidad. Escríbenos sin compromiso.
        </p>
        <a
          className="contact-link"
          href="mailto:yo@daovez.com"
          onClick={(event) => event.stopPropagation()}
        >
          <span>yo@daovez.com</span>
          <span aria-hidden="true">↗</span>
        </a>
      </>
    ),
  };

  return (
    <main
      ref={heroRef}
      className={`hero ${open ? "hero-open" : ""}`}
    >
      <div className="video-background" aria-hidden="true">
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
          ref={mainVideoRef}
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

      <article
        className={`studio-card ${opening ? "opening" : ""} ${open ? "open" : ""}`}
        role={open ? undefined : "button"}
        tabIndex={open ? -1 : 0}
        aria-label={open ? undefined : "Abrir Daovez Studio"}
        onClick={() => {
          if (!open) openStudio();
        }}
        onKeyDown={(event) => {
          if (!open && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openStudio();
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
          </div>
        ) : (
          <div className="interface">
            <section className="interface-left">
              <button
                type="button"
                className="close"
                aria-label="Cerrar"
                onClick={(event) => {
                  event.stopPropagation();
                  closeStudio();
                }}
              >
                ×
              </button>

              <a
                className="portfolio-pill"
                href="https://daovez.dev"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                daovez.dev
              </a>

              <img
                src="/logo.png"
                alt="Studio Web"
                className="studio-logo expanded-logo"
              />

              <div className="left-bottom">
                <TypewriterText />
                <div className="location">
                  <span>MÁLAGA</span>
                  <span>SPAIN</span>
                </div>
              </div>
            </section>

            <section
              ref={lensContainerRef}
              className={`interface-content section-${section}`}
            >
              <canvas
                ref={lensCanvasRef}
                className="lens-canvas"
                aria-hidden="true"
              />
              <div className="lens-glass" aria-hidden="true" />

              <div
                key={section}
                className={`content-inner content-${section}`}
              >
                {content[section]}
              </div>
            </section>

            <nav
              className="navigation"
              aria-label="Secciones"
              onClick={(event) => event.stopPropagation()}
            >
              {[
                ["studio", "01", "Studio"],
                ["proyectos", "02", "Proyectos"],
                ["servicios", "03", "Servicios"],
                ["contacto", "04", "Contacto"],
              ].map(([id, number, label]) => (
                <button
                  key={id}
                  type="button"
                  className={section === id ? "active" : ""}
                  onClick={() => changeSection(id)}
                >
                  <small>{number}</small>
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </article>
    </main>
  );
}

export default App;
