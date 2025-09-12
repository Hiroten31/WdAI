<?php

require_once "Repository.php";
require_once __DIR__.'/../models/Tag.php';

class TagRepository extends Repository {
    public function getTag(int $id): Tag {
        $stmt = $this->db->connect()->prepare(
            'SELECT * FROM public.tags WHERE id=:id'
        );
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $tag = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($tag == false) {
            return null;
        }

        return new Tag(
            $tag['name'],
            $tag['description']
        );
    }

    public function addTag(Tag $tag, int $id_user) {
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.tags(name, description) VALUES (?, ?) RETURNING id'
        );
        $stmt->execute([
            $tag->getName(),
            $tag->getDescription()
        ]);
        $id_tag = $stmt->fetchColumn();

        $stmt = $this->db->connect()->prepare(
            'SELECT last_story_id FROM public.users_sessions WHERE user_id=:id_user'
        );
        $stmt->execute([
            'id_user' => $id_user
        ]);
        $id_story = $stmt->fetchColumn();

        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.tags_stories(id_tag, id_story)
                    VALUES (?, ?)'
        );
        $stmt->execute([
            $id_tag,
            $id_story
        ]);
    }

    public function getTags(int $id_user): array {
        $results = [];
        $stmt = $this->db->connect()->prepare(
            'SELECT last_story_id FROM public.users_sessions WHERE user_id=:id_user'
        );
        $stmt->execute([
            'id_user' => $id_user
        ]);
        $id_story = $stmt->fetchColumn();
        // TEN IF DO USUNIECIA, BO ZAKLADKI BEDA WYLACZONE JESLI NIE MA WYBRANEGO PROJEKTU!!!
        if(!$id_story) {
            $id_story = null;
        }


        $stmt = $this->db->connect()->prepare(
            'SELECT t.id, t.name, t.description FROM public.tags t
                    LEFT JOIN public.tags_stories ts 
                    ON t.id = ts.id_tag AND ts.id_story = :story_id
                    WHERE ts.id_story IS NOT NULL OR t.id IN (1,2,3)'
        );
        $stmt->execute(['story_id' => $id_story]);
        $tags = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($tags as $tag) {
            $results[] = new Tag($tag['id'], $tag['name'], $tag['description']);
        }

        return $results;
    }
}