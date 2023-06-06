package com.fraserproperty.onebangkok.core.models;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.util.Collections;
import java.util.List;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MetricsModel {

    @Inject
    private String heading;

    @Inject
    private String descriptionRTE;

    @Inject
    private List<MetricsItemDetails> items ;


    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }
  
    public String getDescription() {
        return CommonUtils.removePTagFromRichText(descriptionRTE);
    }

    public List<MetricsItemDetails> getItems() {
        return Collections.unmodifiableList(items);
    }
}
