package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class Panoramic3DMapModel {

    @Inject
    private String backgroundImage;

    @Inject
    private String altText;

    @Inject
    private String heading;

    @Inject
    private String description;

    @Inject
    private String ctaLabel;

    @Inject
    private String pageUrl;

    public String getBackgroundImage() {
        return backgroundImage;
    }

    public String getAltText() {
        return altText;
    }

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    public String getDescription() {
        return CommonUtils.removePTagFromRichText(description);
    }

    public String getCtaLabel() {
        return CommonUtils.removePTagFromRichText(ctaLabel);
    }

    public String getPageUrl() {
        return CommonUtils.processUrl(pageUrl);
    }
}
