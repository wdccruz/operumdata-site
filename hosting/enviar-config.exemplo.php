<?php
// Copy to enviar-config.php on the server (same folder as enviar.php).
// Never committed. The .htaccess blocks web access to it.
return [
  'destino' => 'parceiros@operumdata.com',
  'remetente' => 'nao-responda@operumdata.com',
  // Optional authenticated SMTP. Without a password the server's mail() is used.
  'smtp' => [
    'host' => 'smtp.titan.email',
    'porta' => 465,
    'usuario' => 'parceiros@operumdata.com',
    'senha' => '', // fill in on the server only
  ],
];
