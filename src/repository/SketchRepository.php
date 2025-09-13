<?php

require_once "Repository.php";
require_once __DIR__.'/../models/Sketch.php';

class SketchRepository extends Repository {
    public function getSketch(int $id): Sketch {
        $stmt = $this->db->connect()->prepare(
            'SELECT * FROM public.sketches WHERE id=:id'
        );
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $sketch = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($sketch == false) {
            return null;
        }

        return new Sketch(
            $sketch['id'],
            $sketch['name'],
            $sketch['description'],
            $sketch['parent_note_id'],
            $sketch['image']
        );
    }

    public function addSketch(Sketch $sketch) {
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.sketches(name, description, parent_note_id, image)
                    VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([
            $sketch->getName(),
            $sketch->getDescription(),
            $sketch->getParentNoteId(),
            $sketch->getImage()
        ]);
    }

    public function getSketches(int $id_story): array {
        $results = [];
        $stmt = $this->db->connect()->prepare(
            'SELECT s.* 
                    FROM public.sketches s
                    INNER JOIN public.stories_sketches ss 
                    ON s.id = ss.id_sketch
                    WHERE ss.id_story = :id_story'
        );
        $stmt->execute(['id_story' => $id_story]);
        $sketches = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($sketches as $sketch) {
            $results[] = new Sketch(
                $sketch['id'],
                $sketch['name'],
                $sketch['description'],
                $sketch['parent_note_id'],
                $sketch['image']
            );
        }

        return $results;
    }
}