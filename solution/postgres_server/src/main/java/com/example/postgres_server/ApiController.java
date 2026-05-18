package com.example.postgres_server;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController
{
    private final AnimeRepository animeRepository;

    public ApiController(AnimeRepository animeRepository)
    {
        this.animeRepository = animeRepository;
    }

    @GetMapping("/test-postgres")
    public Map<String, Object> testPostgres()
    {
        Map<String, Object> response = new HashMap<>();
        try
        {
            AnimeDetail test = animeRepository.findAll().stream().findFirst().orElse(null);
            response.put("success", true);
            response.put("service", "Postgres Server");
        }
        catch (Exception e)
        {
            response.put("success", false);
            response.put("error", e.getMessage());
        }

        return response;
    }
}