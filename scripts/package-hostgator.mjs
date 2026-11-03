// Gera o pacote para hospedagem Apache (HostGator / cPanel):
//   pnpm package:hostgator                       → https://operumdata.com/
//   SITE_URL=https://www.exemplo/ pnpm package:hostgator
// Saída: hosting/out/ (arquivos) e hosting/operumdata-site-hostgator.zip
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const SITE_URL = process.env.SITE_URL || "https://operumdata.com/";
if (!/^https:\/\/[^/]+\/$/.test(SITE_URL)) throw new Error(`SITE_URL deve ser https://dominio/ (com barra final): ${SITE_URL}`);
const OUT_DIR = "hosting/out";
const env = { ...process.env, SITE_URL, OUT_DIR };

execSync("pnpm export:pages", { stdio: "inherit", env });
execSync("node scripts/check-pages.mjs", { stdio: "inherit", env });
fs.copyFileSync(path.join(root, "hosting/htaccess"), path.join(root, OUT_DIR, ".htaccess"));

const zip = path.join(root, "hosting/operumdata-site-hostgator.zip");
fs.rmSync(zip, { force: true });
execSync(`cd ${OUT_DIR} && zip -qr ${zip} . -x '.DS_Store'`, { stdio: "inherit", shell: "/bin/bash" });
console.log(`Pacote pronto para ${SITE_URL}: ${path.relative(root, zip)}`);
