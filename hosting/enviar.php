<?php
// Receives the project brief form (POST JSON) and emails it.
// Only shipped in the HostGator package. The destination lives in
// enviar-config.php, created on the server and never committed.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder($status, $ok, $erro = null) {
  http_response_code($status);
  echo json_encode($erro ? ['ok' => $ok, 'erro' => $erro] : ['ok' => $ok]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(405, false, 'metodo');

$config = __DIR__ . '/enviar-config.php';
if (!is_file($config)) responder(503, false, 'nao-configurado');
$cfg = require $config; // ['destino' => 'email@dominio', 'remetente' => 'nao-responda@dominio', 'smtp' => [...]]
if (empty($cfg['destino'])) responder(503, false, 'nao-configurado');

// Same site only
$origem = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origem !== '' && parse_url($origem, PHP_URL_HOST) !== $host) responder(403, false, 'origem');

$bruto = file_get_contents('php://input', false, null, 0, 20000);
$d = json_decode($bruto ?: '', true);
if (!is_array($d)) responder(400, false, 'formato');

// Bot: hidden field filled -> pretend success, send nothing
if (!empty($d['site_url'])) responder(200, true);

// Simple per-IP limit: 5 briefs per hour
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$marca = sys_get_temp_dir() . '/ods_' . hash('sha256', $ip . __DIR__);
$agora = time();
$hist = [];
if (is_file($marca)) $hist = array_filter(array_map('intval', explode(',', (string) file_get_contents($marca))), fn($t) => $t > $agora - 3600);
if (count($hist) >= 5) responder(429, false, 'limite');

function campo($d, $k, $max = 200) {
  $v = isset($d[$k]) && is_scalar($d[$k]) ? trim((string) $d[$k]) : '';
  $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v);
  return mb_substr($v, 0, $max);
}
function linha($v) { return preg_replace('/[\r\n]+/', ' ', $v); }

$c = [
  'nome' => linha(campo($d, 'nome', 120)),
  'empresa' => linha(campo($d, 'empresa', 160)),
  'email' => linha(campo($d, 'email', 160)),
  'pais' => linha(campo($d, 'pais', 80)),
  'briefing' => campo($d, 'briefing', 4000),
  'idioma' => campo($d, 'idioma', 2) === 'pt' ? 'pt' : 'en',
];
foreach (['nome', 'empresa', 'briefing'] as $k) if ($c[$k] === '') responder(422, false, $k);
if (!filter_var($c['email'], FILTER_VALIDATE_EMAIL)) responder(422, false, 'email');
if (empty($d['consentimento'])) responder(422, false, 'consentimento');

$linhas = [
  'New project brief — OperumData site (' . ($c['idioma'] === 'pt' ? 'PT' : 'EN') . ')',
  '',
  'Name: ' . $c['nome'],
  'Company: ' . $c['empresa'],
  'Email: ' . $c['email'],
  'Country: ' . ($c['pais'] !== '' ? $c['pais'] : '-'),
  '',
  'Project brief:',
  $c['briefing'],
  '',
  'Agreed that OperumData may use this information to reply: yes',
  'Sent at: ' . gmdate('Y-m-d H:i') . ' UTC',
  'Page: https://' . $host . '/' . ($c['idioma'] === 'pt' ? 'pt/' : ''),
];

$assunto = 'Project brief: ' . $c['empresa'];
$remetente = $cfg['remetente'] ?? ('nao-responda@' . $host);
$cab = [
  'From: OperumData <' . $remetente . '>',
  'Reply-To: <' . $c['email'] . '>',
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'Content-Transfer-Encoding: 8bit',
];

$assuntoMime = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
$corpo = implode("\r\n", $linhas);

// Authenticated SMTP first (e.g. Titan) when a password is set; otherwise, or
// if it fails, the server's mail(), so no brief is lost.
$ok = false;
$senha = $cfg['smtp']['senha'] ?? '';
if ($senha !== '' && $senha !== 'COLE_A_SENHA_AQUI') {
  $ok = enviar_smtp($cfg['smtp'], $cfg['destino'], $assuntoMime, $corpo, $c['email']);
  if (!$ok) error_log('enviar.php: SMTP failed, using mail()');
}
if (!$ok) {
  $ok = mail($cfg['destino'], $assuntoMime, $corpo, implode("\r\n", $cab), '-f' . $remetente);
}
if (!$ok) responder(502, false, 'envio');

$hist[] = $agora;
@file_put_contents($marca, implode(',', $hist), LOCK_EX);
responder(200, true);

// Cliente SMTP mínimo (SSL na porta 465, AUTH LOGIN). Sem bibliotecas externas.
function enviar_smtp($s, $destino, $assuntoMime, $corpo, $responder) {
  $host = $s['host'] ?? 'smtp.titan.email';
  $porta = (int) ($s['porta'] ?? 465);
  $usuario = $s['usuario'];
  $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
  $f = @stream_socket_client("ssl://$host:$porta", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
  if (!$f) return false;
  stream_set_timeout($f, 15);
  $ler = function () use ($f) {
    $r = '';
    while (($l = fgets($f, 515)) !== false) { $r .= $l; if (isset($l[3]) && $l[3] === ' ') break; }
    return $r;
  };
  $cmd = function ($c, $esperado) use ($f, $ler) {
    if ($c !== null) fwrite($f, $c . "\r\n");
    $r = $ler();
    return strpos($r, (string) $esperado) === 0;
  };
  $data = str_replace("\n.", "\n..", str_replace("\r\n", "\n", $corpo));
  $data = str_replace("\n", "\r\n", $data);
  $msg = implode("\r\n", [
    'From: OperumData <' . $usuario . '>',
    'Reply-To: <' . $responder . '>',
    'To: <' . $destino . '>',
    'Subject: ' . $assuntoMime,
    'Date: ' . date('r'),
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . substr(strrchr($usuario, '@'), 1) . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
  ]) . "\r\n\r\n" . $data;
  $ok = $cmd(null, 220)
    && $cmd('EHLO ' . ($_SERVER['HTTP_HOST'] ?? 'localhost'), 250)
    && $cmd('AUTH LOGIN', 334)
    && $cmd(base64_encode($usuario), 334)
    && $cmd(base64_encode($s['senha']), 235)
    && $cmd('MAIL FROM:<' . $usuario . '>', 250)
    && $cmd('RCPT TO:<' . $destino . '>', 250)
    && $cmd('DATA', 354)
    && $cmd($msg . "\r\n.", 250);
  @fwrite($f, "QUIT\r\n");
  fclose($f);
  return $ok;
}
