import { defineConfig } from 'vite';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

// Injects content.js into index.html as static HTML (good for SEO and no-JS readers).
function staticContent() {
  const load = async () => {
    const bust = `?t=${Date.now()}`;
    const { default: content } = await import(pathToFileURL(root + 'src/content.js').href + bust);
    const render = await import(pathToFileURL(root + 'src/render.js').href + bust);
    return { content, render };
  };
  return {
    name: 'static-content',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const { content, render } = await load();
        return html.replace('<!--head-->', render.renderHead(content)).replace('<!--body-->', render.renderBody(content));
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('src/content.js') || file.endsWith('src/render.js')) server.ws.send({ type: 'full-reload' });
    },
  };
}

export default defineConfig({
  // Repo name for GitHub Pages project sites. Change if you rename the repo.
  base: '/isaac-portfolio/',
  plugins: [staticContent()],
  build: { target: 'es2020', cssCodeSplit: false },
});
