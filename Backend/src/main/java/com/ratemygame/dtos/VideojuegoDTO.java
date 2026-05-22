package com.ratemygame.dtos;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class VideojuegoDTO {
    private Long id;
    private String name;
    private String background_image; 
    private String description;
    private String description_raw;
    private LocalDate released;
    private Double rating;
    private Integer metacritic;
    private Integer added;
    
    private List<ItemDTO> genres;
    private List<ItemDTO> tags;
    private List<PlatformWrapperDTO> parent_platforms;
    private List<ScreenshotDTO> screenshots;

    @Data
    public static class ItemDTO {
        private Long id;
        private String name;
        private String slug;
    }

    @Data
    public static class PlatformWrapperDTO {
        private ItemDTO platform;
    }
    
    @Data
    public static class ScreenshotDTO {
        private Long id;
        private String image;
    }


}
