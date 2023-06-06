package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TextImageCarouselModel {

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String heading;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private String description;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private List<CarouselItemList> carouselItemList = new ArrayList<>();

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    public String getDescription() {
        return CommonUtils.removePTagFromRichText(description);
    }

    public List<CarouselItemList> getCarouselItemList() {
        return Collections.unmodifiableList(carouselItemList);
    }
}
