package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AlternatingImageListModel {

    @Inject
    private String desktopMainImage;

    @Inject
    private String mobileMainImage;

    @Inject
    private String altText;

    @Inject
    private String heading;

    @Inject
    private String description;

    @Inject
    private String ctaLabel;

    @Inject
    private String ctaUrl;

    @Inject
    private String newTab;

    @Inject
    private List<AlternatingImageList> altImageList = new ArrayList<>();


    public String getDesktopMainImage() {
        return desktopMainImage;
    }

    public String getMobileMainImage() {
        return mobileMainImage;
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

    public String getCtaUrl() {
        return ctaUrl;
    }

    public String getNewTab() {
        return newTab;
    }

    public List<AlternatingImageList> getAltImageList() {
        return Collections.unmodifiableList(altImageList);
    }
}
