package com.fraserproperty.onebangkok.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SocialBannerItemDetails {


    @Inject
    private String imagepath;

    @Inject
    private String imagealttext;

    public String getImagepath() {
        return imagepath;
    }

    public String getImagealttext() {
        return imagealttext;
    }


}
