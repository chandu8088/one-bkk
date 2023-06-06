package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Model(adaptables = Resource.class,defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ImageGridModel {
    @Inject
    private String heading;

    @Inject
    private String description;




    @Inject
    private List<ImageGridList> imagegridList = new ArrayList<>();

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

    public String getDescription() {
        return CommonUtils.removePTagFromRichText(description);
    }

    public List<ImageGridList> getImagegridList() {
        return Collections.unmodifiableList(imagegridList);
    }
}
