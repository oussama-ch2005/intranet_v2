package com.ingecys.intranet_v2.controller;

import com.ingecys.intranet_v2.DTO.UserResponse;
import com.ingecys.intranet_v2.entity.User;
import com.ingecys.intranet_v2.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor

public class UserController {
    private  final UserService userService;
    @GetMapping
    public ResponseEntity<List<UserResponse>> ListerTous(){
        return ResponseEntity.ok(userService.findAll());

    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id){
        return ResponseEntity.ok(userService.findById(id));
    }
}
