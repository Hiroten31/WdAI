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
            $tag['id'],
            $tag['name']
        );
    }

    public function addTag(Tag $tag) {
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.tags(name) VALUES (?)'
        );
        $stmt->execute([
            $tag->getName(),
        ]);
    }

    public function getTags(): array {
        $results = [];
        $stmt = $this->db->connect()->prepare(
            'SELECT * FROM public.tags'
        );
        $stmt->execute();
        $tags = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($tags as $tag) {
            $results[] = new Tag($tag['id'], $tag['name']);
        }

        return $results;
    }
}