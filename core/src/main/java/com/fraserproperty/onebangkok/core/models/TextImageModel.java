package com.fraserproperty.onebangkok.core.models;


import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;

import javax.inject.Inject;
import java.util.Collections;
import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TextImageModel {
    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String formid;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String layout;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String image;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String imgAltText;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String desktopImageAlignment;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String mobileImageAlignment;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String headingRTE;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String descriptionRTE;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String ctalabel;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String ctaurl;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String openinnewtab;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private String assetpath;

    @Inject
    @Via("resource")
    @Default(values = StringUtils.EMPTY)
    private List<TextImageItemsModel> infographicItems;

    public String getFormid() {
        return formid.replaceAll(" ", "-");
    }

    public String getLayout() {
        return layout;
    }

    public String getImage() {
        return image;
    }

    public String getImgAltText() {
        return imgAltText;
    }

    public String getDesktopImageAlignment() {
        return desktopImageAlignment;
    }

    public String getMobileImageAlignment() {
        return mobileImageAlignment;
    }

    public String getHeadingRTE() {
        return CommonUtils.removePTagFromRichText(headingRTE);
    }

    public String getDescriptionRTE() {
        return CommonUtils.removePTagFromRichText(descriptionRTE);
    }

    public String getCtaLabel() {
        return ctalabel;
    }

    public String getCtaUrl() {
        return ctaurl;
    }

    public String getOpeninnewtab() {
        return openinnewtab;
    }

    public List<TextImageItemsModel> getInfographicItems() {
        return Collections.unmodifiableList(infographicItems);
    }

    public String getAssetpath() {
        return assetpath;
    }
}
