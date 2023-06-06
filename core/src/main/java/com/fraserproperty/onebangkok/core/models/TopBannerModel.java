package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Model(adaptables = Resource.class,defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TopBannerModel {
    @Inject
    private String imagePath;

    @Inject
    private String fullscreenImagePath;

    @Inject
    private String altText;

    @Inject
    private String subheading;

    @Inject
    private String heading;

    @Inject
    private String ctaLabel;

    @Inject
    private String ctaUrl;

    @Inject
    private String newTab;

    public String getImagePath() {
        return imagePath;
    }

    public String getFullscreenImagePath() {
        return fullscreenImagePath;
    }

    public String getAltText() {
        return altText;
    }

    public String getSubheading() {
        return CommonUtils.removePTagFromRichText(subheading);
    }

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    public String getCtaLabel() {
        return CommonUtils.removePTagFromRichText(ctaLabel);
    }

    public String getCtaUrl() {
        return ctaUrl;
    }

    public String getNewTab() {
        return newTab;
    }
}
