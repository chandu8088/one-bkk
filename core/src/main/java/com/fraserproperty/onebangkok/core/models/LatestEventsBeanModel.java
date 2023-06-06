package com.fraserproperty.onebangkok.core.models;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fraserproperty.onebangkok.core.utils.Constants;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import java.sql.Time;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class LatestEventsBeanModel {

    @SlingObject
    private ResourceResolver resourceResolver;

    private String eventCategory;

    private Boolean pinnedEvent;

    private String eventHeading;

    private String summary;

    private String eventImage;

    private String altText;

    private String thumbnailImage;

    private String thumbnailalttext;

    private String eventDescriptionHeading;

    private String eventDescription;

    private Date startdate;

    private Date enddate;

    private Date startTime;

    private Date endTime;

    private String ctaUrl;

    private String eventtype;

    private String isYearSame = "false";

    public String getIsYearSame() {
        SimpleDateFormat formatter = new SimpleDateFormat(Constants.YYYY);
        String sDate = formatter.format(startdate);
        String eDate = StringUtils.EMPTY;
        if (enddate != null) {
            eDate = formatter.format(enddate);
        }


        if(sDate.equals(eDate) && !eDate.equals(StringUtils.EMPTY)) {
            isYearSame = "true";
        }
        return isYearSame;
    }

    public void setIsYearSame(String isYearSame) {
        this.isYearSame = isYearSame;
    }

    public String getEventCategory() {
        return eventCategory;
    }

    public void setEventCategory(String eventCategory) {
        this.eventCategory = eventCategory;
    }

    public Boolean getPinnedEvent() {
        return pinnedEvent;
    }

    public void setPinnedEvent(Boolean pinnedEvent) {
        this.pinnedEvent = pinnedEvent;
    }

    public String getEventHeading() {
        return eventHeading;
    }

    public void setEventHeading(String eventHeading) {
        this.eventHeading = eventHeading;
    }

    public String getSummary() {
        return CommonUtils.removePTagFromRichText(summary);
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getEventImage() {
        return eventImage;
    }

    public void setEventImage(String eventImage) {
        this.eventImage = eventImage;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public String getThumbnailImage() {
        return thumbnailImage;
    }

    public void setThumbnailImage(String thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
    }

    public String getThumbnailalttext() {
        return thumbnailalttext;
    }

    public void setThumbnailalttext(String thumbnailalttext) {
        this.thumbnailalttext = thumbnailalttext;
    }

    public String getEventDescriptionHeading() {
        return eventDescriptionHeading;
    }

    public void setEventDescriptionHeading(String eventDescriptionHeading) {
        this.eventDescriptionHeading = eventDescriptionHeading;
    }

    public Date getStartdate() {
        return startdate;
    }

    public void setStartdate(Date startdate) {
        this.startdate = startdate;
    }

    public Date getEnddate() {
        return enddate;
    }

    public void setEnddate(Date enddate) {
        this.enddate = enddate;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getCtaUrl() {
        return ctaUrl;
    }

    public void setCtaUrl(String ctaUrl) {
        this.ctaUrl = ctaUrl;
    }

    public String getEventtype() {
        return eventtype;
    }

    public void setEventtype(String eventtype) {
        this.eventtype = eventtype;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }
}
