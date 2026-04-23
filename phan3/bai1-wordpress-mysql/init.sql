-- WordPress Database Initialization Script

-- Ensure database exists
CREATE DATABASE IF NOT EXISTS wordpress_db;
USE wordpress_db;

-- Create WordPress users table
CREATE TABLE IF NOT EXISTS wp_users (
    ID bigint(20) unsigned NOT NULL auto_increment,
    user_login varchar(60) NOT NULL default '',
    user_pass varchar(255) NOT NULL default '',
    user_email varchar(100) NOT NULL default '',
    user_url varchar(100) NOT NULL default '',
    user_registered datetime NOT NULL default '0000-00-00 00:00:00',
    user_activation_key varchar(255) NOT NULL default '',
    user_status int(11) NOT NULL default '0',
    display_name varchar(250) NOT NULL default '',
    PRIMARY KEY (ID),
    UNIQUE KEY user_login (user_login),
    UNIQUE KEY user_email (user_email)
);

-- Create posts table
CREATE TABLE IF NOT EXISTS wp_posts (
    ID bigint(20) unsigned NOT NULL auto_increment,
    post_author bigint(20) unsigned NOT NULL default '0',
    post_date datetime NOT NULL default '0000-00-00 00:00:00',
    post_date_gmt datetime NOT NULL default '0000-00-00 00:00:00',
    post_content longtext NOT NULL,
    post_title text NOT NULL,
    post_category int(4) NOT NULL default '0',
    post_excerpt text NOT NULL,
    post_status varchar(20) NOT NULL default 'publish',
    comment_status varchar(20) NOT NULL default 'open',
    ping_status varchar(20) NOT NULL default 'open',
    post_password varchar(255) NOT NULL default '',
    post_name varchar(200) NOT NULL default '',
    to_ping text NOT NULL,
    pinged text NOT NULL,
    post_modified datetime NOT NULL default '0000-00-00 00:00:00',
    post_modified_gmt datetime NOT NULL default '0000-00-00 00:00:00',
    post_content_filtered longtext NOT NULL,
    post_parent bigint(20) unsigned NOT NULL default '0',
    guid varchar(255) NOT NULL default '',
    menu_order int(11) NOT NULL default '0',
    post_type varchar(20) NOT NULL default 'post',
    post_mime_type varchar(100) NOT NULL default '',
    comment_count bigint(20) NOT NULL default '0',
    PRIMARY KEY (ID)
);

-- Grant permissions
GRANT ALL PRIVILEGES ON wordpress_db.* TO 'wp_user'@'%';
FLUSH PRIVILEGES;

-- Insert sample admin user (Optional - password: admin123)
-- Username: admin | Password: wordpress (WordPress will hash this)
INSERT INTO wp_users (user_login, user_email, user_url, user_registered, display_name) 
VALUES ('admin', 'admin@wordpress.local', 'http://wordpress.local', NOW(), 'Administrator');
