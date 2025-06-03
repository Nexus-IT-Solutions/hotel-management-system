# NGO-Help Backend

## Description

NGO-Help Backend is a PHP-based RESTful API built with the Slim framework. It provides the server-side functionality for the NGO-Help application.

## Requirements

* PHP 8.0 or higher
* Composer
* Git
* XAMPP (for Windows) or Apache, MySQL, PHP installed manually on Linux/macOS

## Complete Setup Guide

### 1. Clone the Repository

Clone the repository into your XAMPP `htdocs` directory (e.g., `C:/xampp/htdocs/` on Windows or `/var/www/html/` on Linux/macOS):

```sh
cd /path/to/htdocs
# Example for Windows: cd C:/xampp/htdocs
# Example for Linux/macOS: cd /var/www/html

git clone https://github.com/your-username/NGO-Help.git
```

### 2. Install Dependencies

Navigate to the PHP backend directory and install dependencies:

```sh
cd NGO-Help/backend/php
composer install
```

### 3. Environment Configuration

#### Windows

```cmd
copy .env.example .env
```

#### Linux/macOS

```sh
cp .env.example .env
```

Edit the `.env` file with your database credentials and other settings:

```
DB_HOST=localhost
DB_DATABASE=ngo_help
DB_USERNAME=root
DB_PASSWORD=
```

---

## Virtual Host Configuration

### Windows (XAMPP)

#### 1. Edit Apache's `httpd-vhosts.conf`

Open `C:\xampp\apache\conf\extra\httpd-vhosts.conf` and add:

```apache
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs"
    ServerName localhost
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/NGO-Help/backend/php"
    ServerName api.ngohelp.com
    ServerAlias www.api.ngohelp.com

    <Directory "C:/xampp/htdocs/NGO-Help/backend/php">
        Options Indexes FollowSymLinks MultiViews
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog "logs/api.ngohelp.com-error.log"
    CustomLog "logs/api.ngohelp.com-access.log" common
</VirtualHost>
```

#### 2. Update the Hosts File

Edit `C:\Windows\System32\drivers\etc\hosts` as administrator and add:

```
127.0.0.1 api.ngohelp.com
```

#### 3. Restart Apache

Use XAMPP Control Panel to restart Apache.

---

### Linux/macOS

#### 1. Edit Apache Configuration

Create or edit a file in `/etc/apache2/sites-available/api.ngohelp.com.conf`:

```apache
<VirtualHost *:80>
    ServerName api.ngohelp.com
    DocumentRoot "/var/www/html/NGO-Help/backend/php"

    <Directory "/var/www/html/NGO-Help/backend/php">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/api.ngohelp.com-error.log
    CustomLog ${APACHE_LOG_DIR}/api.ngohelp.com-access.log combined
</VirtualHost>
```

#### 2. Enable the Site and Restart Apache

```bash
sudo a2ensite api.ngohelp.com.conf
sudo systemctl reload apache2
```

#### 3. Update Hosts File

Edit `/etc/hosts` and add:

```
127.0.0.1 api.ngohelp.com
```

---

## 4. Create Database

1. Open phpMyAdmin or use MySQL CLI
2. Create a new database named `ngo_help`
3. Import any SQL schema files from the `docs/database` directory (if available)

---

## 5. Test the API

Open your browser and go to:

```
http://api.ngohelp.com
```

You should see a JSON response:

```
{"message":"Welcome to NGO-Help API","status":"running"}
```

## 6. Verify with an API Testing Tool

Use Postman or any HTTP client:

* GET `http://api.ngohelp.com` - Returns welcome message
* GET `http://api.ngohelp.com/hello` - Returns placeholder message

---

## Project Structure

```
php/
├── .env                 # Environment configuration
├── composer.json        # PHP dependencies
├── public/              # Public directory (web server entry point)
│   ├── .htaccess        # Apache configuration
│   └── index.php        # Application entry point
└── src/                 # Application source code
    ├── config/          # Configuration files
    ├── controller/      # API controllers
    ├── helpers/         # Helper functions
    ├── middleware/      # Request/response middleware
    ├── model/           # Data models
    ├── requests/        # Request validation
    └── routes/          # API route definitions
```

---

## Development Guidelines

1. Follow PSR-4 autoloading standards
2. Create new routes in `src/routes/api.php`
3. Implement controllers in `src/controller/`
4. Add models in `src/model/`

---

## Troubleshooting

* **Virtual Host Not Working**: Ensure Apache's virtual host module is enabled (check for `Include conf/extra/httpd-vhosts.conf` in httpd.conf)
* **Database Connection Errors**: Double-check `.env` credentials
* **404 Errors**: Verify `.htaccess` is configured and `mod_rewrite` is enabled
* **Permission Issues**: Ensure the web server has read/write access to `logs/`
* **Blank Screen**: Enable `display_errors = On` in `php.ini`

---

## Bash Setup Script (for Linux/macOS)

Save the following as `setup.sh` in your project root:

```bash
#!/bin/bash

# Move into PHP backend directory
cd ./backend/php

# Install Composer dependencies
composer install

# Copy .env if not present
if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created. Update with DB credentials."
fi

# Create Apache virtual host (macOS/Linux)
VHOST_PATH="/etc/apache2/sites-available/api.ngohelp.com.conf"

if [ ! -f "$VHOST_PATH" ]; then
    sudo bash -c "cat > $VHOST_PATH" <<EOL
<VirtualHost *:80>
    ServerName api.ngohelp.com
    DocumentRoot \"$(pwd)\"

    <Directory \"$(pwd)\">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/api.ngohelp.com-error.log
    CustomLog \${APACHE_LOG_DIR}/api.ngohelp.com-access.log combined
</VirtualHost>
EOL

    sudo a2ensite api.ngohelp.com.conf
    sudo systemctl reload apache2
    echo "Virtual host configured."
else
    echo "Virtual host already exists."
fi

# Add to /etc/hosts if not present
if ! grep -q "api.ngohelp.com" /etc/hosts; then
    echo "127.0.0.1 api.ngohelp.com" | sudo tee -a /etc/hosts
    echo "Host entry added."
else
    echo "Host entry already exists."
fi

echo "Setup complete. Visit: http://api.ngohelp.com"
```

Make it executable:

```bash
chmod +x setup.sh
```

Run it:

```bash
./setup.sh
```
