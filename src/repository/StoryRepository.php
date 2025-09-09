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
            $story['name'],
            $story['description']
        );
    }

    public function addStory(Story $story) {
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.stories(name, description)
                    VALUES (?, ?)'
        );
        $stmt->execute([
            $story->getName(),
            $story->getDescription()
        ]);
    }

    public function getStories(): array {
        $results = [];
        $stmt = $this->db->connect()->prepare(
            'SELECT * FROM public.stories'
        );
        $stmt->execute();
        $stories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($stories as $story) {
            $results[] = new Story($story['name'], $story['description']);
        }

        return $results;
    }
}