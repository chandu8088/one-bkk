package com.fraserproperty.onebangkok.core.models;


import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MetricsItemDetails {

    @Inject
    private String itemimage;

    @Inject
    private String itemheading;

    @Inject
    private String itemvalue;

    @Inject
    private String itemmetric;

    public String getItemimage() {
        return itemimage;
    }

    public String getItemheading() {
        return CommonUtils.removePTagFromRichText(itemheading).trim();

    }

    public String getItemvalue() {
        return CommonUtils.removePTagFromRichText(itemvalue).trim();
    }

    public String getItemmetric() {
        return CommonUtils.removePTagFromRichText(itemmetric).trim();
    }
}
