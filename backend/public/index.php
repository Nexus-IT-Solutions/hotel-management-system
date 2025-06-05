<?php
require_once __DIR__ . '/../vendor/autoload.php';

use DI\Container;
use Slim\Factory\AppFactory;
use Dotenv\Dotenv;
use Slim\Middleware\ContentLengthMiddleware;

require_once __DIR__ . '/../src/middleware/RequestResponseLoggerMiddleware.php';
require_once __DIR__ . '/../src/helper/ErrorHandler.php';
require_once __DIR__ . '/../src/helper/LoggerFactory.php';

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
// Get environment setting
$environment = $_ENV['ENVIRONMENT'] ?? 'production';
// Add custom error handling middleware
$errorHandler = new ErrorHandler(
    $container->get('logger'),
    $environment
);

// Configure error middleware with custom handler
$errorMiddleware = $app->addErrorMiddleware(
    displayErrorDetails: $environment === 'development',
    logErrors: true,
    logErrorDetails: $environment === 'development',
    logger: $container->get('logger')
);

// Set custom error handler
$errorMiddleware->setDefaultErrorHandler($errorHandler);

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
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

// Add content length middleware
$app->add(new ContentLengthMiddleware());

// Default welcome route
$app->get('/', function ($request, $response) {
    $data = ['message' => 'Welcome to Hotel Management and Booking API', 'status' => 'running'];
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

// Include routes
(require_once __DIR__ . '/../src/routes/api.php')($app);

// Run the application
$app->run();