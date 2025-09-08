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
            $sketch['title'],
            $sketch['description'],
            $sketch['tag'],
            $sketch['parent'],
            $sketch['image']
        );
    }

    public function addSketch(Sketch $sketch) {
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.sketches(name, description, parent_note_id, image)
                    VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([
            $sketch->getTitle(),
            $sketch->getDescription(),
            $sketch->getParent(),
            $sketch->getImage()
        ]);
    }

    public function getSketches(): array {
        $results = [];
        $stmt = $this->db->connect()->prepare(
            'SELECT * FROM public.sketches'
        );
        $stmt->execute();
        $sketches = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($sketches as $sketch) {
            $results[] = new Sketch($sketch['name'], $sketch['description'], $sketch['tag'], $sketch['parent'], $sketch['image']);
        }

        return $results;
    }
}