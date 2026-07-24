const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const dropdown = document.querySelector('.nav-dropdown');
const dropdownTrigger = document.querySelector('.dropdown-trigger');
const views = document.querySelectorAll('[data-page]');
const links = document.querySelectorAll('[data-view]');
const noticeFeed = document.querySelector('[data-notice-feed]');
const noticesUrl = 'https://raw.githubusercontent.com/VagoAx89/SilvestreWeb/refs/heads/main/Comunicados/index.json';
const projectGrid = document.querySelector('[data-project-grid]');
const projectsUrl = 'https://raw.githubusercontent.com/VagoAx89/SilvestreWeb/refs/heads/main/Images/Dev/index.json';
const projectImagesBaseUrl = 'https://raw.githubusercontent.com/VagoAx89/SilvestreWeb/main/Images/Dev/';
const developmentOrbits = document.querySelectorAll('.development-orbit');
const techFeed = document.querySelector('[data-tech-projects]');
const techProjectsUrl = 'https://raw.githubusercontent.com/VagoAx89/SilvestreWeb/refs/heads/main/Proyectos/index.json';
const techProjectsContentBaseUrl = 'https://raw.githubusercontent.com/VagoAx89/SilvestreWeb/refs/heads/main/Proyectos/';
const techProjectsImagesBaseUrl = 'https://raw.githubusercontent.com/VagoAx89/SilvestreWeb/main/Images/Proyectos/';
const solutionsFeed = document.querySelector('[data-tech-solutions]');
const solutionsUrl = 'https://raw.githubusercontent.com/VagoAx89/SilvestreWeb/refs/heads/main/Soluciones/index.json';
const solutionsContentBaseUrl = 'https://raw.githubusercontent.com/VagoAx89/SilvestreWeb/refs/heads/main/Soluciones/';
const solutionsImagesBaseUrl = 'https://raw.githubusercontent.com/VagoAx89/SilvestreWeb/main/Images/Soluciones/';
const topicView = document.querySelector('[data-page="topic"]');
const imageLightbox = document.querySelector('[data-image-lightbox]');
const imageLightboxImage = document.querySelector('[data-image-lightbox-image]');
const imageLightboxCaption = document.querySelector('[data-image-lightbox-caption]');
const imageLightboxClose = document.querySelector('[data-image-lightbox-close]');
let lightboxTrigger = null;
const articleSources = {
    proyectos: {
        listUrl: techProjectsUrl,
        contentBaseUrl: techProjectsContentBaseUrl,
        imagesBaseUrl: techProjectsImagesBaseUrl,
        label: 'Proyectos técnicos'
    },
    soluciones: {
        listUrl: solutionsUrl,
        contentBaseUrl: solutionsContentBaseUrl,
        imagesBaseUrl: solutionsImagesBaseUrl,
        label: 'Soluciones'
    }
};
let noticesLoaded = false;
let projectsLoaded = false;
let techProjectsLoaded = false;
let solutionsLoaded = false;

function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = `<span aria-hidden="true">${theme === 'dark' ? '☾' : '☼'}</span>`;
    themeToggle.setAttribute('aria-label', `Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`);
}

const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

if (developmentOrbits.length && window.matchMedia('(hover: hover)').matches) {
    developmentOrbits.forEach((developmentOrbit) => {
        developmentOrbit.addEventListener('pointermove', (event) => {
            const bounds = developmentOrbit.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - .5;
            const y = (event.clientY - bounds.top) / bounds.height - .5;
            developmentOrbit.style.setProperty('--orbit-x', `${y * -9}deg`);
            developmentOrbit.style.setProperty('--orbit-y', `${x * 10}deg`);
        });
        developmentOrbit.addEventListener('pointerleave', () => {
            developmentOrbit.style.setProperty('--orbit-x', '0deg');
            developmentOrbit.style.setProperty('--orbit-y', '0deg');
        });
    });
}

function formatNoticeDate(date) {
    return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
        .format(new Date(`${date}T12:00:00`));
}

function createNotice(notice) {
    const article = document.createElement('article');
    article.className = `notice-card${notice.fijado ? ' notice-card--featured' : ''}`;

    const meta = document.createElement('div');
    meta.className = 'notice-meta';
    const category = document.createElement('span');
    category.className = `notice-tag${notice.categoria === 'Importante' ? ' notice-tag--alert' : notice.categoria === 'Actualización' ? ' notice-tag--update' : ''}`;
    category.textContent = notice.categoria || 'Comunicado';
    const time = document.createElement('time');
    time.dateTime = notice.fecha;
    time.textContent = formatNoticeDate(notice.fecha);
    meta.append(category, time);

    const title = document.createElement('h2');
    title.textContent = notice.titulo;
    const body = document.createElement('p');
    body.textContent = notice.texto;
    article.append(meta, title, body);

    if (notice.youtube) {
        const videoLink = document.createElement('a');
        videoLink.className = 'text-link';
        videoLink.href = notice.youtube;
        videoLink.target = '_blank';
        videoLink.rel = 'noreferrer';
        videoLink.append('Ver el video ', Object.assign(document.createElement('span'), { textContent: '→', ariaHidden: 'true' }));
        article.append(videoLink);
    }
    return article;
}

async function loadNotices() {
    if (noticesLoaded || !noticeFeed) return;
    try {
        const response = await fetch(noticesUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const notices = await response.json();
        if (!Array.isArray(notices)) throw new Error('Formato no válido');
        notices.sort((a, b) => Number(b.fijado) - Number(a.fijado) || new Date(b.fecha) - new Date(a.fecha));
        noticeFeed.replaceChildren(...notices.map(createNotice));
        //noticesLoaded = true;
        console.log(`Se cargaron ${notices.length} comunicados`);
    } catch (error) {
        noticeFeed.replaceChildren(Object.assign(document.createElement('p'), {
            className: 'feed-status feed-status--error',
            textContent: 'No fue posible cargar los comunicados por ahora. Intenta de nuevo más tarde.'
        }));
    }
}

function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    const visual = document.createElement('div');
    visual.className = 'project-visual';
    const imageName = Array.isArray(project.imagenes) ? project.imagenes[0] : null;

    if (imageName) {
        const image = document.createElement('img');
        image.src = `${projectImagesBaseUrl}${encodeURIComponent(imageName)}`;
        image.alt = project.titulo || 'Proyecto de desarrollo';
        image.loading = 'lazy';
        image.addEventListener('error', () => {
            image.remove();
            visual.append(Object.assign(document.createElement('span'), { className: 'project-visual__empty', textContent: 'IMAGEN NO DISPONIBLE' }));
        }, { once: true });
        visual.append(image);
    } else {
        visual.append(Object.assign(document.createElement('span'), { className: 'project-visual__empty', textContent: 'PROYECTO IOT' }));
    }

    const body = document.createElement('div');
    body.className = 'project-body';
    const index = document.createElement('span');
    index.className = 'notice-tag notice-tag--update';
    index.textContent = `Proyecto ${String(project.id || '').padStart(2, '0')}`;
    const title = document.createElement('h3');
    title.textContent = project.titulo || 'Proyecto de desarrollo';
    const description = document.createElement('p');
    description.textContent = project.descripcion || '';
    const technologies = document.createElement('div');
    technologies.className = 'project-tech';
    (Array.isArray(project.tecnologias) ? project.tecnologias : []).forEach((technology) => {
        const tag = document.createElement('span');
        tag.textContent = technology;
        technologies.append(tag);
    });
    body.append(index, title, description, technologies);
    card.append(visual, body);
    return card;
}

async function loadProjects() {
    if (projectsLoaded || !projectGrid) return;
    try {
        const response = await fetch(projectsUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const projects = await response.json();
        if (!Array.isArray(projects)) throw new Error('Formato no válido');
        projectGrid.replaceChildren(...projects.map(createProjectCard));
        projectsLoaded = true;
    } catch (error) {
        projectGrid.replaceChildren(Object.assign(document.createElement('p'), {
            className: 'feed-status feed-status--error',
            textContent: 'No fue posible cargar las muestras de desarrollo por ahora. Intenta de nuevo más tarde.'
        }));
    }
}

const mdImagePattern = /^!\[([^\]]*)\]\(([^)]+)\)$/;

function getMarkdownImages(markdown, imagesBaseUrl) {
    return markdown.split(/\r?\n/)
        .map((line) => line.trim().match(mdImagePattern))
        .filter(Boolean)
        .map((match) => ({
            alt: match[1],
            src: `${imagesBaseUrl}${encodeURIComponent(match[2].split('/').pop())}`
        }));
}

function appendMarkdownBody(container, markdown, imagesBaseUrl) {
    const lines = markdown.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    lines.forEach((line) => {
        const imageMatch = line.match(mdImagePattern);
        if (imageMatch) {
            const figure = document.createElement('figure');
            figure.className = 'tech-figure';
            const image = document.createElement('img');
            const fileName = imageMatch[2].split('/').pop();
            image.src = `${imagesBaseUrl}${encodeURIComponent(fileName)}`;
            image.alt = imageMatch[1] || '';
            image.loading = 'lazy';
            image.addEventListener('error', () => figure.remove(), { once: true });
            figure.append(image);
            if (imageMatch[1]) {
                figure.append(Object.assign(document.createElement('figcaption'), { textContent: imageMatch[1] }));
            }
            container.append(figure);
        } else {
            container.append(Object.assign(document.createElement('p'), { textContent: line }));
        }
    });
}

function enableTopicImageZoom(container) {
    container.querySelectorAll('.tech-figure').forEach((figure) => {
        const image = figure.querySelector('img');
        if (!image) return;
        figure.classList.add('tech-figure--zoomable');
        figure.tabIndex = 0;
        figure.setAttribute('role', 'button');
        figure.setAttribute('aria-label', `Ampliar imagen${image.alt ? `: ${image.alt}` : ''}`);
    });
}

function openImageLightbox(figure) {
    const image = figure.querySelector('img');
    if (!image || !imageLightbox) return;
    lightboxTrigger = figure;
    imageLightboxImage.src = image.currentSrc || image.src;
    imageLightboxImage.alt = image.alt;
    imageLightboxCaption.textContent = image.alt;
    imageLightboxCaption.hidden = !image.alt;
    imageLightbox.showModal();
    imageLightboxClose.focus();
}

function closeImageLightbox() {
    if (!imageLightbox?.open) return;
    imageLightbox.close();
}

imageLightboxClose?.addEventListener('click', closeImageLightbox);
imageLightbox?.addEventListener('click', (event) => {
    if (event.target === imageLightbox) closeImageLightbox();
});
imageLightbox?.addEventListener('close', () => {
    imageLightboxImage.removeAttribute('src');
    lightboxTrigger?.focus();
    lightboxTrigger = null;
});

function getArticleExcerpt(markdown) {
    const text = markdown.split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !mdImagePattern.test(line) && !line.startsWith('#'))
        .join(' ')
        .replace(/[*_`>#-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    return text.length > 200 ? `${text.slice(0, 197).trimEnd()}…` : text;
}

function createArticleCard(entry, markdown, section, imagesBaseUrl) {
    const link = document.createElement('a');
    link.className = 'article-preview';
    link.href = `#topic?section=${encodeURIComponent(section)}&article=${encodeURIComponent(entry.archivo_contenido)}`;
    link.dataset.topicLink = 'true';

    const copy = document.createElement('div');
    copy.className = 'article-preview__copy';
    copy.append(Object.assign(document.createElement('h2'), { textContent: entry.titulo || 'Entrada' }));
    if (entry.subtitulo) copy.append(Object.assign(document.createElement('p'), { className: 'article-preview__subtitle', textContent: entry.subtitulo }));
    copy.append(Object.assign(document.createElement('p'), { className: 'article-preview__excerpt', textContent: getArticleExcerpt(markdown) || 'Lee el artículo completo.' }));
    copy.append(Object.assign(document.createElement('span'), { className: 'article-preview__more', textContent: 'Leer más →' }));

    const visual = document.createElement('div');
    visual.className = 'article-preview__visual';
    const firstImage = getMarkdownImages(markdown, imagesBaseUrl)[0];
    if (firstImage) {
        const image = document.createElement('img');
        image.src = firstImage.src;
        image.alt = firstImage.alt || entry.titulo || 'Imagen del artículo';
        image.loading = 'lazy';
        image.addEventListener('error', () => {
            image.remove();
            visual.classList.add('article-preview__visual--empty');
            visual.textContent = 'IMAGEN NO DISPONIBLE';
        }, { once: true });
        visual.append(image);
    } else {
        visual.classList.add('article-preview__visual--empty');
        visual.textContent = 'SIN IMAGEN';
    }
    link.append(copy, visual);
    return link;
}

async function loadArticleFeed({ feed, listUrl, contentBaseUrl, imagesBaseUrl, section, isLoaded, setLoaded, errorMessage, itemErrorMessage }) {
    if (isLoaded() || !feed) return;
    try {
        const response = await fetch(listUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const entries = await response.json();
        if (!Array.isArray(entries)) throw new Error('Formato no válido');

        feed.replaceChildren();
        for (const entry of entries) {
            if (!entry.archivo_contenido) continue;
            try {
                const contentResponse = await fetch(`${contentBaseUrl}${encodeURIComponent(entry.archivo_contenido)}`, { cache: 'no-store' });
                if (!contentResponse.ok) throw new Error(`HTTP ${contentResponse.status}`);
                const markdown = await contentResponse.text();
                feed.append(createArticleCard(entry, markdown, section, imagesBaseUrl));
            } catch (contentError) {
                feed.append(Object.assign(document.createElement('p'), {
                    className: 'feed-status feed-status--error',
                    textContent: itemErrorMessage
                }));
            }
        }
        setLoaded();
    } catch (error) {
        feed.replaceChildren(Object.assign(document.createElement('p'), {
            className: 'feed-status feed-status--error',
            textContent: errorMessage
        }));
    }
}

function loadTechProjects() {
    return loadArticleFeed({
        feed: techFeed,
        listUrl: techProjectsUrl,
        contentBaseUrl: techProjectsContentBaseUrl,
        imagesBaseUrl: techProjectsImagesBaseUrl,
        section: 'proyectos',
        isLoaded: () => techProjectsLoaded,
        setLoaded: () => { techProjectsLoaded = true; },
        errorMessage: 'No fue posible cargar los proyectos técnicos por ahora. Intenta de nuevo más tarde.',
        itemErrorMessage: 'No fue posible cargar el contenido de este proyecto.'
    });
}

function loadSolutions() {
    return loadArticleFeed({
        feed: solutionsFeed,
        listUrl: solutionsUrl,
        contentBaseUrl: solutionsContentBaseUrl,
        imagesBaseUrl: solutionsImagesBaseUrl,
        section: 'soluciones',
        isLoaded: () => solutionsLoaded,
        setLoaded: () => { solutionsLoaded = true; },
        errorMessage: 'No fue posible cargar las soluciones por ahora. Intenta de nuevo más tarde.',
        itemErrorMessage: 'No fue posible cargar el contenido de esta solución.'
    });
}

function showTopic(section, articleName) {
    const source = articleSources[section];
    if (!source || !articleName || !topicView) {
        showView('inicio');
        return;
    }
    const container = topicView.querySelector('.topic-view__inner');
    const back = document.createElement('a');
    back.className = 'button button--ghost topic-back';
    back.href = `#${section}`;
    back.dataset.view = section;
    back.textContent = `← Volver a ${source.label}`;
    const status = Object.assign(document.createElement('p'), { className: 'feed-status', textContent: 'Cargando artículo…' });
    container.replaceChildren(back, status);
    showView('topic');

    fetch(`${source.listUrl}`, { cache: 'no-store' })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
        .then((entries) => {
            const entry = entries.find((item) => item.archivo_contenido === articleName);
            if (!entry) throw new Error('Artículo no encontrado');
            return Promise.all([entry, fetch(`${source.contentBaseUrl}${encodeURIComponent(articleName)}`, { cache: 'no-store' })]);
        })
        .then(async ([entry, response]) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const markdown = await response.text();
            const header = document.createElement('header');
            header.className = 'topic-article__header';
            header.append(Object.assign(document.createElement('p'), { className: 'eyebrow', innerHTML: `<span></span> ${source.label}` }));
            header.append(Object.assign(document.createElement('h1'), { textContent: entry.titulo || 'Artículo' }));
            if (entry.subtitulo) header.append(Object.assign(document.createElement('p'), { className: 'topic-article__subtitle', textContent: entry.subtitulo }));
            const body = document.createElement('article');
            body.className = 'markdown-body topic-article__body';
            appendMarkdownBody(body, markdown, source.imagesBaseUrl);
            enableTopicImageZoom(body);
            container.replaceChildren(back, header, body);
        })
        .catch(() => {
            container.replaceChildren(back, Object.assign(document.createElement('p'), {
                className: 'feed-status feed-status--error',
                textContent: 'No fue posible cargar este artículo. Intenta de nuevo más tarde.'
            }));
        });
}

function showView(name) {
    const target = document.querySelector(`[data-page="${name}"]`);
    if (!target) return;
    views.forEach((view) => view.classList.toggle('view--active', view === target));
    document.querySelectorAll('.nav-link').forEach((link) => link.classList.toggle('active', link.dataset.view === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navPanel.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (name === 'comunicados') loadNotices();
    if (name === 'proyectos') loadTechProjects();
    if (name === 'soluciones') loadSolutions();
    if (name === 'desarrollo') loadProjects();
}

links.forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    showView(link.dataset.view);
    history.replaceState(null, '', link.getAttribute('href'));
}));
document.addEventListener('click', (event) => {
    const zoomableFigure = event.target.closest('.topic-article__body .tech-figure--zoomable');
    if (zoomableFigure) {
        openImageLightbox(zoomableFigure);
        return;
    }
    const topicLink = event.target.closest('[data-topic-link]');
    if (!topicLink) return;
    event.preventDefault();
    const [, query] = topicLink.hash.slice(1).split('?');
    const params = new URLSearchParams(query);
    showTopic(params.get('section'), params.get('article'));
    history.pushState(null, '', topicLink.hash);
});
document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const zoomableFigure = event.target.closest('.topic-article__body .tech-figure--zoomable');
    if (!zoomableFigure) return;
    event.preventDefault();
    openImageLightbox(zoomableFigure);
});
navToggle.addEventListener('click', () => {
    const open = navPanel.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
});
dropdownTrigger.addEventListener('click', () => {
    const open = dropdown.classList.toggle('is-open');
    dropdownTrigger.setAttribute('aria-expanded', String(open));
});

function routeFromHash() {
    const [view, query] = window.location.hash.slice(1).split('?');
    if (view === 'topic') {
        const params = new URLSearchParams(query);
        showTopic(params.get('section'), params.get('article'));
    } else if (view) {
        showView(view);
    }
}

window.addEventListener('hashchange', routeFromHash);
routeFromHash();
document.querySelector('#current-year').textContent = new Date().getFullYear();
