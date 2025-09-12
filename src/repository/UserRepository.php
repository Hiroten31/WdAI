<?php

require_once "Repository.php";
require_once __DIR__.'/../models/User.php';

class UserRepository extends Repository {
    public function getUserByEmail(string $email) : ?User {
        $stmt = $this->db->connect()->prepare(
            'SELECT * FROM public.users WHERE email=:email'
        );
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if($user == false) {
            return null;
        }

        return new User(
            $user['email'],
            $user['password'],
            $user['username']
        );
    }

    // dodac ID do obiektu uzytkownika???
    public function getUserIdByEmail(string $email) : int {
        $stmt = $this->db->connect()->prepare(
            'SELECT id FROM public.users WHERE email=:email'
        );
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user['id'];
    }

    public function createAccount() {
        // TODO check if the e-mail has account
    }
}