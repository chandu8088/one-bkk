package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FullWidthBannerModel {

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String bannerType;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String bannerLayout;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String desktopBannerImage;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String mobileBannerImage;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String imgAltText;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String desktopBannerVideo;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String mobileBannerVideo;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String mobileContentAlignment;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String headingRTE;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String descriptionRTE;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String ctaLabel;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String ctaUrl;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String openinnewtab;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String downloadLabel;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String downloadUrl;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String formid;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String enableForm;

    public String getBannerType() {
        return bannerType;
    }

    public String getBannerLayout() {
        return bannerLayout;
    }

    public String getDesktopBannerImage() {
        return desktopBannerImage;
    }

    public String getMobileBannerImage() {
        return mobileBannerImage;
    }

    public String getImgAltText() {
        return imgAltText;
    }

    public String getDesktopBannerVideo() {
        return desktopBannerVideo;
    }

    public String getMobileBannerVideo() {
        return mobileBannerVideo;
    }

    public String getMobileContentAlignment() {
        return mobileContentAlignment;
    }

    public String getHeadingRTE() {
        return CommonUtils.removePTagFromRichText(headingRTE);
    }

    public String getDescriptionRTE() {
        return CommonUtils.removePTagFromRichText(descriptionRTE);
    }

    public String getCtaLabel() {
        return ctaLabel;
    }

    public String getCtaUrl() {
        return ctaUrl;
    }

    public String getOpeninnewtab() {
        return openinnewtab;
    }

    public String getDownloadLabel() {
        return downloadLabel;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public String getFormid() {
        return formid.replaceAll(" ", "-");
    }

    public String getEnableForm() {
        return enableForm;
    }
}
