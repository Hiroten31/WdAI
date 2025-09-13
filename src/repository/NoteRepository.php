<?php

require_once "Repository.php";
require_once __DIR__.'/../models/Note.php';

class NoteRepository extends Repository {
    public function getNote(int $id): Note {
        $stmt = $this->db->connect()->prepare(
            'SELECT * FROM public.notes WHERE id=:id'
        );
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $note = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($note == false) {
            return null;
        }

        return new Note (
            $note['id'],
            $note['name'],
            $note['description'],
            $note['parent_id'],
            $note['reference_to']
        );
    }

    public function addNote(Note $note, $id_story, string $tags) {
        // Dodanie notatki do bazy
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.notes(name, description, parent_id, reference_to)
                    VALUES (?, ?, ?, ?) RETURNING id'
        );
        $stmt->execute([
            $note->getName(),
            $note->getDescription(),
            $note->getParentId(),
            $note->getReferenceTo()
        ]);
        $id_note = $stmt->fetchColumn();
        // Dodanie relacji pod ktora historia sie znajduje
        $stmt = $this->db->connect()->prepare(
            'INSERT INTO public.stories_notes(id_story, id_note) VALUES (?, ?)'
        );
        $stmt->execute([$id_story, $id_note]);

        // Dodanie tagow do notatki
        foreach ($tags as $tag) {
            $stmt = $this->db->connect()->prepare(
                'INSERT INTO public.notes_tags(id_note, id_tag) VALUES (?, ?)'
            );
            $stmt->execute([$id_note, $tag->getId()]);
        }

    }

    public function selectNote(int $id_note, int $id_user) {
        $stmt = $this->db->connect()->prepare(
            'UPDATE public.users_sessions SET last_note_id = :note_id WHERE user_id = :user_id'
        );
        $stmt->execute([
            ':note_id' => $id_note,
            ':user_id' => $id_user
        ]);
    }

    public function getNotes(int $id_story): array {
        $results = [];
        $stmt = $this->db->connect()->prepare(
            'SELECT n.* 
                    FROM public.notes n
                    INNER JOIN public.stories_notes sn 
                    ON n.id = sn.id_note
                    WHERE sn.id_story = :id_story'
        );
        $stmt->execute(['id_story' => $id_story]);
        $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($notes as $note) {
            $results[] = new Note(
                $note['id'],
                $note['name'],
                $note['description'],
                $note['parent_id'],
                $note['reference_to']);
        }

        return $results;
    }
}