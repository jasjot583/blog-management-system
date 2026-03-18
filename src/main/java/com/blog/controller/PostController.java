package com.blog.controller;

import com.blog.dto.PostDto;
import com.blog.service.PostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // CREATE POST
    @PostMapping
    public PostDto createPost(@RequestBody PostDto postDto) {
        return postService.createPost(postDto);
    }

    // GET ALL POSTS
    @GetMapping
    public List<PostDto> getPosts() {
        return postService.getAllPosts();
    }

    // GET POST BY ID
    @GetMapping("/{id}")
    public PostDto getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    // UPDATE POST
    @PutMapping("/{id}")
    public PostDto updatePost(@PathVariable Long id, @RequestBody PostDto postDto) {
        return postService.updatePost(id, postDto);
    }

    // DELETE POST
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }

    // SEARCH POSTS
    @GetMapping("/search")
    public List<PostDto> searchPosts(@RequestParam String keyword) {
        return postService.searchPosts(keyword);
    }
}