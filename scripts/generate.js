import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import nunjucks from 'nunjucks';

const root = path.resolve(process.cwd());
const distDir = path.join(root, 'dist');
const cssSrc = path.join(root, 'styles', 'slds2-temp.css');

async function loadContentMarkdown(mdPath) {
  const raw = await fs.readFile(mdPath, 'utf8');
  const parsed = matter(raw);
  return { frontmatter: parsed.data, body: parsed.content };
}

async function ensureDist() {
  await fs.emptyDir(distDir);
  await fs.ensureDir(path.join(distDir, 'css'));
  await fs.copyFile(cssSrc, path.join(distDir, 'css', 'slds2-temp.css'));
}

function configureTemplates() {
  nunjucks.configure(path.join(root, 'templates'), { autoescape: true, noCache: true });
}

async function renderFeaturePage({ content, assets }) {
  const template = 'feature.njk';
  const outPath = path.join(distDir, 'feature', `${slugify(content.metadata.title)}.html`);
  await fs.ensureDir(path.dirname(outPath));
  const html = nunjucks.render(template, {
    title: content.metadata.title,
    description: content.metadata.description,
    labels: content.labels,
    assets
  });
  await fs.writeFile(outPath, html, 'utf8');
  return outPath;
}

function slugify(input) {
  return String(input).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  await ensureDist();
  configureTemplates();

  // Minimal MVP: generate one feature page from example content
  const mdPath = path.join(root, 'content', 'feature', 'example-feature', 'content.md');
  const content = await loadContentMarkdown(mdPath);

  // Stub assets for MVP; in the full app, resolve from questionnaire/setup-definition
  const assets = {
    screenshotUrl: 'https://via.placeholder.com/1280x720?text=Screenshot',
    videoUrl: '',
    helpTopicUrl: 'https://help.salesforce.com/',
    releaseNotesUrl: '',
    trailhead: []
  };

  const out = await renderFeaturePage({ content: content.frontmatter, assets });
  console.log(`Generated: ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


