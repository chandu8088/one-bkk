package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AlternatingImageList {
    @Inject
    private String imagePath;

    @Inject
    private String imageAltText;

    @Inject
    private String itemHeading;

    @Inject
    private String itemDescription;

    public String getImagePath() {
        return imagePath;
    }

    public String getImageAltText() {
        return imageAltText;
    }

    public String getItemHeading() {
        return CommonUtils.removePTagFromRichText(itemHeading);
    }

    public String getItemDescription() {
        return CommonUtils.removePTagFromRichText(itemDescription);
    }
}
