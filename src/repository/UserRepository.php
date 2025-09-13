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
            $user['id'],
            $user['username'],
            $user['email'],
            $user['password'],
            $user['admin']
        );
    }

    // Potrzebne, zeby nie zapisywac hasla w ciasteczkach (dla bezpieczenstwa???)
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

    public function getLastStory(int $user_id) : ?Story {
        $stmt = $this->db->connect()->prepare(
            'SELECT s.*
                    FROM public.stories s
                    JOIN public.users_sessions us ON s.id = us.last_story_id
                    WHERE us.user_id = :user_id;'
        );
        $stmt->execute([
            'user_id' => $user_id
        ]);

        $lastStory = $stmt->fetch(PDO::FETCH_ASSOC);

        if($lastStory) {
            return new Story(
                $lastStory['id'],
                $lastStory['name'],
                $lastStory['description'],
                $lastStory['creation_date']
            );
        } else {
            $stmt = $this->db->connect()->prepare(
                'SELECT 1 FROM public.users_sessions WHERE user_id = :user_id'
            );
            $stmt->execute(['user_id' => $user_id]);

            if (!$stmt->fetch()) {
                $stmt = $this->db->connect()->prepare(
                    'INSERT INTO public.users_sessions (user_id, last_story_id) VALUES (:user_id, NULL)'
                );
                $stmt->execute(['user_id' => $user_id]);
            }
            return null;
        }

    }

    public function getLastNote(int $user_id) : ?Note {
        $stmt = $this->db->connect()->prepare(
            'SELECT n.*
                    FROM public.notes n
                    JOIN public.users_sessions us ON n.id = us.last_note_id
                    WHERE us.user_id = :user_id;'
        );
        $stmt->execute([
            'user_id' => $user_id
        ]);
        $lastNote = $stmt->fetch(PDO::FETCH_ASSOC);

        if($lastNote) {
            return new Note(
                $lastNote['id'],
                $lastNote['name'],
                $lastNote['description'],
                $lastNote['parent_id'],
                $lastNote['creation_date']
            );
        } else {
            return null;
        }

    }
}