package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.Collections;
import java.util.List;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
        resourceType = "onebangkok/components/socialbanner" )

@Exporter(name = "jackson", extensions = "json")
public class SocialBannerItemModel {

    @SlingObject
    private Resource currentResource;

    @Inject
    private String heading;

    @Inject
    @Default(values = StringUtils.EMPTY)
    private List<SocialBannerItemDetails> items ;

    private String node_name = StringUtils.EMPTY;
    private String imagedetails;
    public String getImagedetails() {

        return imagedetails;
    }
    @JsonIgnore
    public String getNode_name() {
        node_name = currentResource.getName();
        return node_name;
    }

    @JsonIgnore
    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    @JsonIgnore
    public List<SocialBannerItemDetails> getItems() {
        return Collections.unmodifiableList(items);
    }

    @PostConstruct
    protected void init() throws JSONException {

        JSONArray imagedetails_obj = new JSONArray();
        if (items!=null) {
            for (SocialBannerItemDetails temp : items) {
                String imagepath = temp.getImagepath();
                String imagealtext = temp.getImagealttext();
                JSONObject json = new JSONObject();
                json.put("url", imagepath);
                json.put("ImageAltText", imagealtext);

                imagedetails_obj.put(json);
            }
            imagedetails = imagedetails_obj.toString();

        }
    }

}
