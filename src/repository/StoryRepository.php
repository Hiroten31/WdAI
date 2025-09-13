<?php

require_once "Repository.php";
require_once __DIR__.'/../models/Story.php';

class StoryRepository extends Repository {
    public function getStory(int $id): Story {
        $stmt = $this->db->connect()->prepare(
            'SELECT * FROM public.stories WHERE id=:id'
        );
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $story = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($story == false) {
            return null;
        }

        return new Story(
            $story['id'],
            $story['name'],
            $story['description'],
            $story['creation_date']
        );
    }

    public function addStory(Story $story, int $id_user) {
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.stories(name, description)
                    VALUES (?, ?)
                    RETURNING id'
        );
        $stmt->execute([
            $story->getName(),
            $story->getDescription()
        ]);

        // Podlaczenie razem z relacja
        $id_story = $stmt->fetchColumn();
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.users_stories(id_user, id_story)
                    VALUES (?, ?)'
        );
        $stmt->execute([
            $id_user,
            $id_story
        ]);
    }

    public function selectStory(int $id_story, int $id_user) {
        $stmt = $this->db->connect()->prepare(
            'UPDATE public.users_sessions SET last_story_id = :story_id WHERE user_id = :user_id'
        );
        $stmt->execute([
            $id_story,
            $id_user
        ]);
    }

    public function getStories(int $id_user): array {
        $results = [];
        $stmt = $this->db->connect()->prepare(
            'SELECT s.* 
                    FROM public.stories s 
                    INNER JOIN public.users_stories us 
                    ON s.id = us.id_story 
                    WHERE us.id_user = :id_user'
        );
        $stmt->execute(['id_user' => $id_user]);
        $stories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($stories as $story) {
            $results[] = new Story(
                $story['id'],
                $story['name'],
                $story['description'],
                $story['creation_date']
            );
        }

        return $results;
    }


}