// Acessibilidade WCAG 2.1 AA · axe-core via Puppeteer
// Lança Chromium headless, injecta session mock e corre axe em cada página.
// Falha o processo (exit 1) se houver violações de severidade serious|critical.

import puppeteer from 'puppeteer';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve as resolvePath } from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AXE_SOURCE = await readFile(
  resolvePath(__dirname, '..', 'node_modules', 'axe-core', 'axe.min.js'),
  'utf8'
);

const PORT = 8765;
const BASE = `http://localhost:${PORT}`;

const SESSION = {
  name: 'Bernardo Vidal',
  role: 'Admin total · perfil de demonstração',
  email: 'bernardo.vidal@sggov.gov.pt',
  perfil: 'admin_demo',
  unit: 'DAPL · demonstração',
  ministerio: null,
  note: null,
  loginAt: Date.now(),
};

const PAGES = [
  { url: '/index.html', needsSession: false },
  { url: '/hub.html', needsSession: true },
  { url: '/HORIZONTE.html', needsSession: true },
  { url: '/PROSPETIVA.html', needsSession: true },
  { url: '/RADAR.html', needsSession: true },
  { url: '/FICHA.html', needsSession: true },
  { url: '/CONTENCIOSO.html', needsSession: true },
  { url: '/GABINETES.html', needsSession: true },
  { url: '/ALERTAS.html', needsSession: true },
  { url: '/ADMIN.html', needsSession: true },
];

// Severidades que falham o build
const FAIL_SEVERITIES = new Set(['serious', 'critical']);

// Regras a ignorar (revisar caso a caso antes de adicionar)
const IGNORE_RULES = [
  'color-contrast', // verificar manualmente após mudança estética
];

async function isServerUp() {
  return new Promise((resolve) => {
    const req = http.get(`${BASE}/index.html`, (res) => {
      resolve(res.statusCode === 200);
      res.resume();
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => { req.destroy(); resolve(false); });
  });
}

async function startServer() {
  if (await isServerUp()) return null;
  const proc = spawn(process.platform === 'win32' ? 'python' : 'python3',
    ['-m', 'http.server', String(PORT)],
    { stdio: 'ignore', detached: false });
  // Espera servidor ficar pronto (até 5s)
  for (let i = 0; i < 25; i++) {
    if (await isServerUp()) return proc;
    await wait(200);
  }
  proc.kill();
  throw new Error('Servidor HTTP não arrancou em 5s');
}

function fmtNode(node) {
  return node.target.join(' ');
}

async function audit(browser, page) {
  const fullUrl = BASE + page.url;
  const tab = await browser.newPage();

  if (page.needsSession) {
    await tab.evaluateOnNewDocument((sess) => {
      try { window.localStorage.setItem('vigil-demo-session', JSON.stringify(sess)); } catch {}
    }, SESSION);
  }

  await tab.goto(fullUrl, { waitUntil: 'networkidle0' });

  // Injecta axe-core directamente (evita require.resolve em paths com espaços)
  await tab.evaluate(AXE_SOURCE);

  const results = await tab.evaluate(async (ignoreRules) => {
    return await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      rules: Object.fromEntries(ignoreRules.map(id => [id, { enabled: false }])),
    });
  }, IGNORE_RULES);

  await tab.close();

  const failing = results.violations.filter(v => FAIL_SEVERITIES.has(v.impact));
  return { page: page.url, total: results.violations.length, failing, allViolations: results.violations };
}

function printViolations(viols) {
  for (const v of viols) {
    console.log(`  · [${v.impact}] ${v.id} — ${v.help}`);
    console.log(`    ${v.helpUrl}`);
    v.nodes.slice(0, 3).forEach(n => console.log(`      ↳ ${fmtNode(n)}`));
    if (v.nodes.length > 3) console.log(`      ↳ … +${v.nodes.length - 3} nós`);
  }
}

async function main() {
  let serverProc = null;
  try {
    serverProc = await startServer();
    if (serverProc) console.log(`Servidor HTTP iniciado em ${BASE}`);
    else console.log(`Servidor já a correr em ${BASE}`);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });

    let totalFailing = 0;
    let totalViolations = 0;

    for (const p of PAGES) {
      const r = await audit(browser, p);
      totalViolations += r.total;
      totalFailing += r.failing.length;

      const status = r.failing.length === 0 ? '✓' : '✗';
      console.log(`\n${status} ${r.page} — ${r.total} violação(ões) · ${r.failing.length} bloqueante(s)`);
      if (r.allViolations.length) printViolations(r.allViolations);
    }

    await browser.close();

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Total: ${totalViolations} violações · ${totalFailing} bloqueantes (serious|critical)`);
    console.log(`Regras ignoradas: ${IGNORE_RULES.join(', ') || '—'}`);

    if (totalFailing > 0) {
      console.error(`\nFALHA: ${totalFailing} violação(ões) bloqueante(s).`);
      process.exit(1);
    } else {
      console.log('\nOK: zero violações bloqueantes.');
      process.exit(0);
    }
  } finally {
    if (serverProc) {
      try { serverProc.kill(); } catch {}
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
