package com.fraserproperty.onebangkok.core.models;

import javax.inject.Inject;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AccesibilityList {

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String imagePath;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String itemHeading;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String itemDescription;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String imageAltText;

    public String getImagePath() {
        return imagePath;
    }

    public String getItemHeading() {
        return CommonUtils.removePTagFromRichText(itemHeading);
    }

    public String getItemDescription() {
        return CommonUtils.removePTagFromRichText(itemDescription);
    }

    public String getImageAltText() {
        return imageAltText;
    }
}
