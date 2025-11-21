package com.daw.epickeys.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class TestController {
    
    @GetMapping("/")
    public String holaMundo() {
        return new String("Hola mundo");
    }
    
}
