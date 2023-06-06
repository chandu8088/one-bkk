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
public class TextImageItemsModel {

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String iconPosition;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String icon;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String iconLabel;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String iconDescription;

    private String iconLabelId;

    public String getIconPosition() {
        return iconPosition;
    }

    public String getIcon() {
        return icon;
    }

    public String getIconLabel() {
        return iconLabel;
    }

    public String getIconDescription() {
        return CommonUtils.removePTagFromRichText(iconDescription);
    }

    public String getIconLabelId() {
        iconLabelId = iconLabel.replaceAll("[^a-zA-Z0-9]", "");
        return iconLabelId;
    }


}