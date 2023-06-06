package com.fraserproperty.onebangkok.core.models;

import com.day.cq.commons.jcr.JcrConstants;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fraserproperty.onebangkok.core.utils.Constants;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import javax.annotation.PostConstruct;
import javax.jcr.query.Query;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class EventListModel {

    List<LatestEventsBeanModel> upcommingEventDetails = new ArrayList<>();
    List<LatestEventsBeanModel> pastEventDetails = new ArrayList<>();
    List<LatestEventsBeanModel> upComingPinnedEvents = new ArrayList<>();
    List<LatestEventsBeanModel> upCommingUnpinnedEvents = new ArrayList<>();
    List<LatestEventsBeanModel> pastPinnedEvents = new ArrayList<>();
    List<LatestEventsBeanModel> pastUnpinnedEvents = new ArrayList<>();
    Map<Integer, List<LatestEventsBeanModel>> upCommingEvents = new HashMap<>();
    Map<Integer, List<LatestEventsBeanModel>> pastEvents = new HashMap<>();
    private static final Logger LOGGER = LoggerFactory.getLogger(EventListModel.class);
    @Self
    protected SlingHttpServletRequest request;

    @SlingObject
    private ResourceResolver resourceResolver;

    @SlingObject
    private Resource currentResource;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String heading;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String upcomingEventLabel;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String pastEvenstLabel;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String eventRootpath;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String cardCtaLabel;

    @PostConstruct
    protected void init() {
        if (!eventRootpath.equals(StringUtils.EMPTY)) {
            String QUERY_JCR_SQL2 = "SELECT * FROM [nt:unstructured] AS node WHERE ISDESCENDANTNODE(node, '" + eventRootpath + "') AND [sling:resourceType] = '" + Constants.EVENTDETAILSCOMPONENT + "'";
            Iterator<Resource> eventPages = resourceResolver.findResources(QUERY_JCR_SQL2, Query.JCR_SQL2);
            try {
                getAllEventDetails(eventPages);
            } catch (ParseException e) {
                LOGGER.error(e.getMessage());
            }
            upCommingEvents = generateEventListMap(upcommingEventDetails);
            pastEvents = generateEventListMap(pastEventDetails);
        }
    }

    private void getAllEventDetails(Iterator<Resource> eventPages) throws ParseException {
        while (eventPages.hasNext()) {
            Resource eventPage = eventPages.next();
            LatestEventsBeanModel latestEventsBeanModel = new LatestEventsBeanModel();
            if (eventPage != null) {
                String eventImage = eventPage.getValueMap().get(Constants.EVENTIMAGE, StringUtils.EMPTY).toString();
                latestEventsBeanModel.setEventImage(eventImage);
                Boolean pinnedEvent = eventPage.getValueMap().get(Constants.PINNEDEVENT, false);
                latestEventsBeanModel.setPinnedEvent(pinnedEvent);
                String eventDescription = eventPage.getValueMap().get(Constants.EVENTDESCRIPTION, StringUtils.EMPTY).toString();
                latestEventsBeanModel.setEventDescription(Jsoup.parse(eventDescription).text());
                String eventHeading = eventPage.getValueMap().get(Constants.EVENTHEADING, StringUtils.EMPTY).toString();
                latestEventsBeanModel.setEventHeading(eventHeading);
                String eventType = eventPage.getValueMap().get(Constants.EVENTTYPE, StringUtils.EMPTY).toString();
                latestEventsBeanModel.setEventtype(eventType);
                Date startDate = eventPage.getValueMap().get(Constants.EVENTSTARTDATE, Date.class);
                if (startDate != null) {
                    latestEventsBeanModel.setStartdate(startDate);
                } else {
                    latestEventsBeanModel.setStartdate(eventPage.getValueMap().get(JcrConstants.JCR_LASTMODIFIED, Date.class));
                }
                Date endDate = eventPage.getValueMap().get(Constants.EVENTENDDATE, Date.class);
                if (endDate != null) {
                    latestEventsBeanModel.setEnddate(endDate);
                }
                Date startTime = eventPage.getValueMap().get(Constants.EVENTSTARTTIME, Date.class);
                if (startTime != null) {
                    latestEventsBeanModel.setStartTime(startTime);
                } else {
                    latestEventsBeanModel.setStartTime(eventPage.getValueMap().get(JcrConstants.JCR_LASTMODIFIED, Date.class));
                }
                Date endTime = eventPage.getValueMap().get(Constants.EVENTENDTIME, Date.class);
                if (endTime != null) {
                    latestEventsBeanModel.setEndTime(endTime);
                }
                String alttext = eventPage.getValueMap().get(Constants.ALTTEXT, StringUtils.EMPTY).toString();
                latestEventsBeanModel.setAltText(alttext);
                String thumbnailImage = eventPage.getValueMap().get(Constants.THUMBNAILIMAGE, StringUtils.EMPTY).toString();
                if (!thumbnailImage.equals(StringUtils.EMPTY)) {
                    latestEventsBeanModel.setThumbnailImage(thumbnailImage);
                } else {
                    latestEventsBeanModel.setThumbnailImage(eventImage);
                }
                String thumbnailaltText = eventPage.getValueMap().get(Constants.THUMBNAILALTTEXT, StringUtils.EMPTY).toString();
                latestEventsBeanModel.setThumbnailalttext(thumbnailaltText);
                latestEventsBeanModel.setCtaUrl(eventPage.getPath().split("/jcr")[0]);
                SimpleDateFormat formatter = new SimpleDateFormat(Constants.YEARFORMAT);
                Date date = new Date();
                Date currentDate = formatter.parse(formatter.format(date));
                classifyEventDetails(currentDate, latestEventsBeanModel);
            }

        }
        upComingPinnedEvents.addAll(upCommingUnpinnedEvents);
        pastPinnedEvents.addAll(pastUnpinnedEvents);
        upcommingEventDetails.addAll(upComingPinnedEvents);
        pastEventDetails.addAll(pastPinnedEvents);
    }

    private void sortEventDetails(List<LatestEventsBeanModel> eventList) {
        eventList.sort(new Comparator<LatestEventsBeanModel>() {
            @Override
            public int compare(LatestEventsBeanModel o1, LatestEventsBeanModel o2) {
                return o2.getStartdate().compareTo(o1.getStartdate());
            }
        });
    }

    private void classifyEventDetails(Date currentDate, LatestEventsBeanModel latestEventsBeanModel) {

        Date endDate = latestEventsBeanModel.getEnddate();
        Date startDate = latestEventsBeanModel.getStartdate();
        Boolean pinnedEvent = latestEventsBeanModel.getPinnedEvent();
        if (endDate != null) {
            if (endDate.after(currentDate)) {
                if (pinnedEvent) {
                    upComingPinnedEvents.add(latestEventsBeanModel);
                } else {
                    upCommingUnpinnedEvents.add(latestEventsBeanModel);
                }
            } else {
                if (pinnedEvent) {
                    pastPinnedEvents.add(latestEventsBeanModel);
                } else {
                    pastUnpinnedEvents.add(latestEventsBeanModel);
                }
            }
        } else {
            if (startDate.before(currentDate)) {
                if (pinnedEvent) {
                    pastPinnedEvents.add(latestEventsBeanModel);
                } else {
                    pastUnpinnedEvents.add(latestEventsBeanModel);
                }
            } else {
                if (pinnedEvent) {
                    upComingPinnedEvents.add(latestEventsBeanModel);
                } else {
                    upCommingUnpinnedEvents.add(latestEventsBeanModel);
                }
            }
        }
        sortEventDetails(upComingPinnedEvents);
        sortEventDetails(upCommingUnpinnedEvents);
        sortEventDetails(pastPinnedEvents);
        sortEventDetails(pastUnpinnedEvents);
    }

    private Map<Integer, List<LatestEventsBeanModel>> generateEventListMap(List<LatestEventsBeanModel> eventList) {
        Map<Integer, List<LatestEventsBeanModel>> eventListMap = new HashMap<>();
        int i = 0;
        int k = 0;
        List<LatestEventsBeanModel> temp_list = new ArrayList<>();
        for (LatestEventsBeanModel latest : eventList) {
            if (i % 6 == 0 && i != 0) {
                eventListMap.put(k, new ArrayList<>(temp_list));
                k++;
                temp_list.clear();
                temp_list.add(latest);
                i++;
            } else {
                temp_list.add(latest);
                eventListMap.put(k, new ArrayList<>(temp_list));
                i++;
            }
        }
        return eventListMap;
    }

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    public String getUpcomingEventLabel() {
        return upcomingEventLabel;
    }

    public String getPastEvenstLabel() {
        return pastEvenstLabel;
    }

    public String getEventRootpath() {
        return eventRootpath;
    }

    public String getCardCtaLabel() {
        return cardCtaLabel;
    }

    public Map<Integer, List<LatestEventsBeanModel>> getUpCommingEvents() {
        return upCommingEvents;
    }

    public Map<Integer, List<LatestEventsBeanModel>> getPastEvents() {
        return pastEvents;
    }
}
