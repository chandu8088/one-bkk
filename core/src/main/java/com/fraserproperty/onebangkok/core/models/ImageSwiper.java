package com.fraserproperty.onebangkok.core.models;


import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ImageSwiper {
    @Inject
    private String defaultimage;

    @Inject
    private String revealimage;

    public String getDefaultimage() {
        return defaultimage;
    }

    public String getRevealimage() {
        return revealimage;
    }
}
