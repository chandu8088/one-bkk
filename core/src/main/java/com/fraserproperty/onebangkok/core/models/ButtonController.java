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

public class ButtonController {
    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String formid;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String buttonlayout;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String buttontype;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String ctalabel;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String ctaurl;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String openinnewtab;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String assetpath;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String ctadesktopalignment;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String ctamobilealignment;

    public String getFormid() {
        return formid.replaceAll(" ", "-");
    }

    public String getButtonlayout() {
        return buttonlayout;
    }

    public String getButtontype() {
        return buttontype;
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

    public String getCtadesktopalignment() {
        return ctadesktopalignment;
    }

    public String getCtamobilealignment() {
        return ctamobilealignment;
    }
}
