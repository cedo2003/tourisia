<?php
require_once 'config/database.php';

try {
    // Création de la base de données si elle n'existe pas
    $pdo->exec("CREATE DATABASE IF NOT EXISTS tourisia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE tourisia");

    // Création de la table users (on la supprime d'abord pour être sûr d'avoir la bonne structure)
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $pdo->exec("DROP TABLE IF EXISTS users");

    $sql = "CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) DEFAULT NULL,
        location VARCHAR(100) DEFAULT NULL,
        bio TEXT DEFAULT NULL,
        avatar VARCHAR(255) DEFAULT NULL,
        cover_image VARCHAR(255) DEFAULT NULL,
        trips_count INT DEFAULT 0,
        countries_count INT DEFAULT 0,
        wishlist_count INT DEFAULT 0,
        reviews_count INT DEFAULT 0,
        oauth_provider VARCHAR(50) DEFAULT 'email',
        oauth_id VARCHAR(255) DEFAULT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB";

    $pdo->exec($sql);
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    echo "Base de données et table 'users' créées avec succès !";

} catch (PDOException $e) {
    die("Erreur lors de la configuration : " . $e->getMessage());
}
?>