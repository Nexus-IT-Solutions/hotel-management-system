<?php
require_once __DIR__ . '/../vendor/autoload.php';

use DI\Container;
use Slim\Factory\AppFactory;
use Dotenv\Dotenv;
use Slim\Middleware\ContentLengthMiddleware;
use App\Middleware\RequestResponseLoggerMiddleware;
use App\Helper\LoggerFactory;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Create Container using PHP-DI
$container = new Container();

if (class_exists(LoggerFactory::class)) {
    $loggerFactory = new LoggerFactory('App');

    // Set up application logger
    $container->set('logger', $loggerFactory->getLogger());

    // Set up HTTP logger specifically for requests/responses
    $container->set('httpLogger', $loggerFactory->getHttpLogger());
}

// Set the container on AppFactory
AppFactory::setContainer($container);

// Create Slim App instance
$app = AppFactory::create();

// Configure error middleware based on environment
$environment = $_ENV['ENVIRONMENT'] ?? 'production';

switch ($environment) {
    case 'development':
        // Show all errors in development
        $app->addErrorMiddleware(
            displayErrorDetails: true,
            logErrors: true,
            logErrorDetails: true,
            logger: $container->has('logger') ? $container->get('logger') : null
        );
        break;

    case 'production':
    default:
        // Production: Don't display errors, minimal logging
        $app->addErrorMiddleware(
            displayErrorDetails: false,
            logErrors: true,
            logErrorDetails: false,
            logger: $container->has('logger') ? $container->get('logger') : null
        );
        break;
}

// Add HTTP logger middleware if httpLogger exists
if ($container->has('httpLogger')) {
    $app->add(new RequestResponseLoggerMiddleware($container->get('httpLogger')));
}

// Add middleware for security headers and CORS
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        ->withHeader('X-Frame-Options', 'DENY')
        ->withHeader('X-Content-Type-Options', 'nosniff');
});

// Add Content Length middleware
$contentLengthMiddleware = new ContentLengthMiddleware();
$app->add($contentLengthMiddleware);


$container->set(PDO::class, function () {
    $host = $_ENV['DB_HOST'];
    $db   = $_ENV['DB_NAME'];
    $user = $_ENV['DB_USER'];
    $pass = $_ENV['DB_PASS'];
    $dsn  = "mysql:host=$host;dbname=$db;charset=utf8mb4";

    return new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
});

// Default welcome route
$app->get('/', function ($request, $response) {
    $data = ['message' => 'Welcome to NGO-Help API', 'status' => 'running'];
    $payload = json_encode($data);
    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/hello', function ($request, $response, $args) {
    $data = ['message' => 'This is a hello route.'];
    $payload = json_encode($data);
    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json');
});

// Load routes
$routesFile = __DIR__ . '/../src/routes/api.php';
if (file_exists($routesFile)) {
    (require_once $routesFile)($app);
} else {
    // Log missing routes file if logger is available
    if ($container->has('logger')) {
        $container->get('logger')->warning('API routes file not found: ' . $routesFile);
    }
}

// Run the application
$app->run();