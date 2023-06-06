package com.fraserproperty.onebangkok.core.models;


import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import javax.inject.Inject;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TextWithTwoImageModel {
    @Inject
    private String formid;

    @Inject
    private String largeimage;

    @Inject
    private String l_imagealttext;

    @Inject
    private String smallimage;

    @Inject
    private String s_imagealttext;

    @Inject
    private String subtextcallout;
    @Inject
    private String subtextcontent;

    @Inject
    private String driverlabel;

    @Inject
    private String heading;

    @Inject
    private String description;

    @Inject
    private String ctalabel;

    @Inject
    private String ctaurl;

    @Inject
    private String openinnewtab;

    @Inject
    private String assetpath;


    public String getLargeimage() {
        return largeimage;
    }

    public String getL_imagealttext() {
        return l_imagealttext;
    }

    public String getSmallimage() {
        return smallimage;
    }

    public String getS_imagealttext() {
        return s_imagealttext;
    }

    public String getSubtextcallout() {
        return subtextcallout;
    }

    public String getSubtextcontent() {
        return CommonUtils.removePTagFromRichText(subtextcontent);
    }

    public String getDriverlabel() {
        return CommonUtils.removePTagFromRichText(driverlabel);
    }

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    public String getDescription() {
        return CommonUtils.removePTagFromRichText(description);
    }

    public String getCtalabel() {
        return CommonUtils.removePTagFromRichText(ctalabel);
    }

    public String getCtaurl() {
        return ctaurl;
    }

    public String getOpeninnewtab() {
        return openinnewtab;
    }
	public String getAssetpath() {
        return assetpath;
    }

    public String getFormid() {
        return formid.replaceAll(" ", "-");
    }
}