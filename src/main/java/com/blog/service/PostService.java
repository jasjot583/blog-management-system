package com.blog.service;

import com.blog.dto.PostDto;
import com.blog.entity.Post;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // CREATE POST
    public PostDto createPost(PostDto postDto) {

        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());

        Post savedPost = postRepository.save(post);

        return new PostDto(
                savedPost.getId(),
                savedPost.getTitle(),
                savedPost.getContent()
        );
    }

    // GET ALL POSTS
    public List<PostDto> getAllPosts() {

        List<Post> posts = postRepository.findAll();

        return posts.stream()
                .map(post -> new PostDto(
                        post.getId(),
                        post.getTitle(),
                        post.getContent()
                ))
                .collect(Collectors.toList());
    }

    // GET POST BY ID
    public PostDto getPostById(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id " + id));

        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getContent()
        );
    }

    // UPDATE POST
    public PostDto updatePost(Long id, PostDto postDto) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id " + id));

        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());

        Post updatedPost = postRepository.save(post);

        return new PostDto(
                updatedPost.getId(),
                updatedPost.getTitle(),
                updatedPost.getContent()
        );
    }

    // DELETE POST
    public void deletePost(Long id) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id " + id));

        postRepository.delete(post);
    }

    // SEARCH POSTS BY TITLE
    public List<PostDto> searchPosts(String keyword) {

        List<Post> posts = postRepository.findByTitleContaining(keyword);

        return posts.stream()
                .map(post -> new PostDto(
                        post.getId(),
                        post.getTitle(),
                        post.getContent()
                ))
                .collect(Collectors.toList());
    }
}