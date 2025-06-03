<?php

return
[
    'paths' => [
        'migrations' => '%%PHINX_CONFIG_DIR%%/db/migrations',
        'seeds' => '%%PHINX_CONFIG_DIR%%/db/seeds'
    ],
    'environments' => [
        'default_migration_table' => 'phinxlog',
        'default_environment' => 'development',
        'production' => [
            'adapter' => 'pgsql',
            'host' => 'pg-35d61f6f-nolex-hotel-management.g.aivencloud.com',
            'name' => 'hotel_db',
            'user' => 'avnadmin',
            'pass' => 'AVNS_L7_yvJO-HeauHjEh59d',
            'port' => '27062',
            'charset' => 'utf8',
            'ssl_mode' => 'require',
            'schema' => 'hotel_db',
        ],
        'development' => [
            'adapter' => 'pgsql',
            'host' => 'pg-35d61f6f-nolex-hotel-management.g.aivencloud.com',
            'name' => 'hotel_db',
            'user' => 'avnadmin',
            'pass' => 'AVNS_L7_yvJO-HeauHjEh59d',
            'port' => '27062',
            'charset' => 'utf8',
            'ssl_mode' => 'require',
            'schema' => 'hotel_db',
        ],
        'testing' => [
            'adapter' => 'pgsql',
            'host' => 'pg-35d61f6f-nolex-hotel-management.g.aivencloud.com',
            'name' => 'hotel_db',
            'user' => 'avnadmin',
            'pass' => 'AVNS_L7_yvJO-HeauHjEh59d',
            'port' => '27062',
            'charset' => 'utf8',
            'ssl_mode' => 'require',
            'schema' => 'hotel_db',
        ]
    ],
    'version_order' => 'creation'
];