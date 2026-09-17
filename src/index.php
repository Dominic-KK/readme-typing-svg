<?php declare(strict_types=1);

require "../vendor/autoload.php";

// 若存在 .env 则加载环境变量
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

$controller = new RendererController($_REQUEST);
$controller->setHeaders();
echo $controller->render();
