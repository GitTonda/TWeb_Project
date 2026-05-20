package com.example.postgres_server;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimeRepository extends JpaRepository<AnimeDetail, Long>
{
    List<AnimeDetail> findByTitleContainingIgnoreCase(String title);

    @Query(value =  "SELECT * FROM anime_details " +
                    "WHERE regexp_replace(LOWER(title), '[^a-z0-9]', '', 'g') " +
                    "LIKE LOWER(CONCAT('%', :query, '%'))", nativeQuery = true)
    List<AnimeDetail> findByFlexibleTitle(@Param("query") String query);
}