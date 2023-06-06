package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fraserproperty.onebangkok.core.utils.Constants;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.query.Query;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FeatureEventModel {

    public static final String SINGLEDAYFORMAT = "dd MMM";
    public static final String MULTIDAYFORMAT = "dd MMM yyyy";
    public static final String MULTIDAY = "multiday";

    @SlingObject
    private ResourceResolver resourceResolver;

    @Inject
    private String heading;

    @Inject
    private String description;

    @Inject
    private String ctaLabel;

    @Inject
    private String ctaUrl;

    @Inject
    private String openNewTab;

    @Inject
    private String featuredEventLabel;

    @Inject
    private String eventPage;

    @Inject
    private String featureImage;

    @Inject
    private String imageAltText ;

    private String eventType;

    private String eventHeading;

    private String eventStartDate;

    private String eventEndDate;


    @PostConstruct
    public void init() throws ParseException {
        if (StringUtils.isNotBlank(eventPage)) {
            String QUERY_JCR_SQL2="SELECT * FROM [nt:unstructured] AS node WHERE ISDESCENDANTNODE(node, '"+eventPage+"') AND [sling:resourceType] = '"+ Constants.EVENTDETAILSCOMPONENT+"'";
            Iterator<Resource> result = resourceResolver.findResources(QUERY_JCR_SQL2, Query.JCR_SQL2);
            while(result.hasNext()) {
                Resource eventResource = result.next();
                eventType = eventResource.getValueMap().get(Constants.EVENTTYPE, StringUtils.EMPTY).toString();
                eventHeading = eventResource.getValueMap().get(Constants.EVENTHEADING, StringUtils.EMPTY).toString();
                String startDate = eventResource.getValueMap().get(Constants.EVENTSTARTDATE, StringUtils.EMPTY).toString();
                String endDate = eventResource.getValueMap().get(Constants.EVENTENDDATE, StringUtils.EMPTY).toString();
                SimpleDateFormat inputFormat = new SimpleDateFormat(Constants.DATEFORMAT);
                SimpleDateFormat singleDayFormat = new SimpleDateFormat(MULTIDAYFORMAT);
                SimpleDateFormat multiDayFormat = new SimpleDateFormat(SINGLEDAYFORMAT);
                if(eventType.equalsIgnoreCase(MULTIDAY)) {
                    if(StringUtils.isNotBlank(startDate)) {
                        eventStartDate = multiDayFormat.format(inputFormat.parse(startDate));
                    }
                    if(StringUtils.isNotBlank(endDate)) {
                        eventEndDate = singleDayFormat.format(inputFormat.parse(endDate));
                    }
                }
                else{
                    if(StringUtils.isNotBlank(startDate)) {
                        eventStartDate = singleDayFormat.format(inputFormat.parse(startDate));
                    }
                }
            }
        }
    }

    public String getHeading () {
        return  CommonUtils.removePTagFromRichText(heading);
    }

    public String getDescription () {
        return CommonUtils.removePTagFromRichText(description);
    }

    public String getCtaLabel () {
        return ctaLabel;
    }

    public String getCtaUrl () {
        return ctaUrl;
    }

    public String getOpenNewTab () {
        return openNewTab;
    }

    public String getFeaturedEventLabel () {
        return featuredEventLabel;
    }

    public String getEventPage () {
        return eventPage;
    }

    public String getFeatureImage () {
        return featureImage;
    }

    public String getImageAltText () {
        return imageAltText;
    }

    public String getEventHeading () {
        return eventHeading;
    }

    public String getEventStartDate () {
        return eventStartDate;
    }

    public String getEventEndDate () {
        return eventEndDate;
    }

    public String getEventType () {
        return eventType;
    }
}