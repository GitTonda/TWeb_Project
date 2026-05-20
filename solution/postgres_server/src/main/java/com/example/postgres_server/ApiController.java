package com.example.postgres_server;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.util.HashMap;
import java.util.List;
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

    @Operation(summary = "Test Postgres Connection", description = "Fetches a single AnimeDetail record to verify database connectivity.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved anime data")
    @ApiResponse(responseCode = "500", description = "Database connection failed")
    @GetMapping("/test-postgres")
    public Map<String, Object> testPostgres()
    {
        Map<String, Object> response = new HashMap<>();
        try
        {
            AnimeDetail test = animeRepository.findAll().stream().findFirst().orElse(null);
            response.put("success", true);
            response.put("service", "Postgres Server");
            response.put("data", test);
        }
        catch (Exception e)
        {
            response.put("success", false);
            response.put("error", e.getMessage());
        }

        return response;
    }

    @Operation(summary = "Search Anime", description = "Searches the Postgres database for anime titles containing the provided query string.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved a list of matching anime")
    @GetMapping("/search")
    public Map<String, Object> searchAnime(@org.springframework.web.bind.annotation.RequestParam("q") String query)
    {
        Map<String, Object> response = new HashMap<>();
        try
        {
            String sanitizedQuery = query.replaceAll("[^a-zA-Z0-9]", "");
            List<AnimeDetail> results = animeRepository.findByFlexibleTitle(sanitizedQuery);
            response.put("success", true);
            response.put("count", results.size());
            response.put("data", results);
        }
        catch (Exception e)
        {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return response;
    }
}