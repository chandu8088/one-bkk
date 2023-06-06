package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CarouselItemList {

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String imagePath;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String imageAltText;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String title;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String subTitle;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String description;

    public String getImagePath() {
        return imagePath;
    }

    public String getImageAltText() {
        return imageAltText;
    }

    public String getTitle() {
        return title;
    }

    public String getSubTitle() {
        return CommonUtils.removePTagFromRichText(subTitle);
    }

    public String getDescription() {
        return CommonUtils.removePTagFromRichText(description);
    }
}
