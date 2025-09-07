<?php

require 'Routing.php';

$path = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($path, PHP_URL_PATH);

Routing::get('index', 'DefaultController');
Routing::get('home', 'DefaultController');
Routing::get('overview', 'DefaultController');
Routing::get('sketches', 'DefaultController');
Routing::get('note', 'DefaultController');
Routing::post('login', 'SecurityController');

Routing::run($path);