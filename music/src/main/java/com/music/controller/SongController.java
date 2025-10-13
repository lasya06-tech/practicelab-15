package com.music.controller;

import com.music.model.Song;
import com.music.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/songs")
@CrossOrigin(origins = "*") // Allow frontend requests
public class SongController {

    @Autowired
    private SongService songService;

    // Get all songs
    @GetMapping
    public List<Song> getAllSongs() {
        return songService.getAllSongs();
    }

    // Get song by ID
    @GetMapping("/{id}")
    public ResponseEntity<Song> getSongById(@PathVariable Long id) {
        return songService.getSongById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add new song
    @PostMapping
    public Song addSong(@RequestBody Song song) {
        return songService.addSong(song);
    }

    // Update song
    @PutMapping("/{id}")
    public ResponseEntity<Song> updateSong(@PathVariable Long id, @RequestBody Song updatedSong) {
        return songService.updateSong(id, updatedSong)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete song
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSong(@PathVariable Long id) {
        boolean deleted = songService.deleteSong(id);
        if (!deleted) return ResponseEntity.notFound().build();
        return ResponseEntity.ok("Song deleted successfully");
    }
}