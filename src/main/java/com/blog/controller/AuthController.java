package com.blog.controller;

import com.blog.dto.LoginDto;
import com.blog.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // REGISTER USER
    @PostMapping("/register")
    public String register(@RequestBody com.blog.entity.User user) {
        return authService.register(user);
    }

    // LOGIN USER
    @PostMapping("/login")
    public String login(@RequestBody LoginDto loginDto) {

        String token = authService.login(
                loginDto.getEmail(),
                loginDto.getPassword());

        return token;
    }
}