<?php 
return function($app): void{ 
    // Define API routes here. This file is responsible for registering all API endpoints.
    (require_once __DIR__ . '/v1/AuthRouter.php')($app);
   
    };
