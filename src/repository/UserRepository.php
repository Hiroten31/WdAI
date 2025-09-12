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
            $user['username'],
            $user['email'],
            $user['password']
        );
    }

    public function getUserIdByEmail(string $email) : int {
        $stmt = $this->db->connect()->prepare(
            'SELECT id FROM public.users WHERE email=:email'
        );
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user['id'];
    }

    public function checkMails(String $email) : bool {
        $stmt = $this->db->connect()->prepare(
            'SELECT email FROM public.users WHERE email=:email'
        );
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        if($stmt->rowCount() == 0) {
            return false;
        }
        return true;
    }

    public function addAccount(User $user) {
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.users(username, email, password, admin)
                    VALUES (?, ?, ?, false)'
        );
        $stmt->execute([
            $user->getUsername(),
            $user->getEmail(),
            $user->getPassword()
        ]);
    }
}