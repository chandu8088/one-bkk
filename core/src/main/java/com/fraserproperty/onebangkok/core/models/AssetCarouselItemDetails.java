package com.fraserproperty.onebangkok.core.models;


import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AssetCarouselItemDetails {

    @Inject
    private String itemType;

    @Inject
    private String image;

    @Inject
    private String imageAltText;

    @Inject
    private String videoType;

    @Inject
    private String damVideo;

    @Inject
    private String damPosterImage;

    @Inject
    private String youtubeVideoId;

    @Inject
    private String posterImage;

    public String getItemType() {
        return itemType;
    }

    public String getImage() {
        return image;
    }

    public String getImageAltText() {
        return imageAltText;
    }

    public String getVideoType() {
        return videoType;
    }

    public String getDamVideo() {
        return damVideo;
    }

    public String getDamPosterImage() {
        return damPosterImage;
    }

    public String getYoutubeVideoId() {
        return youtubeVideoId;
    }

    public String getPosterImage() {
        return posterImage;
    }
}
