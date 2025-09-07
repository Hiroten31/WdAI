<?php

require_once "config.php";

class Database {
    private $username;
    private $password;
    private $database;
    private $host;

    public function __construct() {
        $this->username = DB_USERNAME;
        $this->password = DB_PASSWORD;
        $this->host = DB_HOST;
        $this->database = DB_NAME;
    }

    public function connect() {
        try {
            $conn = new PDO(
                "pgsql:host=$this->host;port=5432;dbname=$this->database",
                $this->username,
                $this->password
            );

            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch(PDOException $e) {
            die("Connection failed: ".$e->getMessage());
        }
    }

}