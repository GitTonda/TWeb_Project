package com.example.postgres_server;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "anime_details")
public class AnimeDetail
{
    @Id
    private Long mal_id;
    private String title;
    private String type;
    private String status;
    private Double score;

    public Long getMal_id() { return mal_id; }
    public void setMal_id(Long mal_id) { this.mal_id = mal_id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
}