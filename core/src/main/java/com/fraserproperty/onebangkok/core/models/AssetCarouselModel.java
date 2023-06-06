package com.fraserproperty.onebangkok.core.models;


import org.apache.commons.lang.RandomStringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.util.Collections;
import java.util.List;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AssetCarouselModel {

    @Inject
    private String enableAutoCarousel;

    @Inject
    private List<AssetCarouselItemDetails> assetItems ;

    private String carouselId;

    public String getEnableAutoCarousel() {
        return enableAutoCarousel;
    }

    public List<AssetCarouselItemDetails> getAssetItems() {
        return Collections.unmodifiableList(assetItems);
    }

    public String getCarouselId() {
        carouselId = RandomStringUtils.randomAlphanumeric(6);
        return carouselId;
    }
}
