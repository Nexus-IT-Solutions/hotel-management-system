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
            'user' => 'kwamegilbert',
            'pass' => 'AVNS_3Ef_86iNbvRl40hFkO-',
            'port' => '27062',
            'charset' => 'utf8',
            'ssl_mode' => 'require',
        ],
        'development' => [
            'adapter' => 'pgsql',
            'host' => 'pg-35d61f6f-nolex-hotel-management.g.aivencloud.com',
            'name' => 'hotel_db',
            'user' => 'kwamegilbert',
            'pass' => 'AVNS_3Ef_86iNbvRl40hFkO-',
            'port' => '27062',
            'charset' => 'utf8',
            'ssl_mode' => 'require',
        ],
        'testing' => [
            'adapter' => 'pgsql',
            'host' => 'pg-35d61f6f-nolex-hotel-management.g.aivencloud.com',
            'name' => 'hotel_db',
            'user' => 'kwamegilbert',
            'pass' => 'AVNS_3Ef_86iNbvRl40hFkO-',
            'port' => '27062',
            'charset' => 'utf8',
            'ssl_mode' => 'require',
        ]
    ],
    'version_order' => 'creation'
];