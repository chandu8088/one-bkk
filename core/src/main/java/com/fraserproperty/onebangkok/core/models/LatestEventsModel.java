package com.fraserproperty.onebangkok.core.models;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fraserproperty.onebangkok.core.utils.Constants;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Model(adaptables = { Resource.class,
        SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LatestEventsModel {

    List<Page> allEventsPages = new ArrayList<Page>();

    private static final Logger Log = LoggerFactory.getLogger(LatestEventsModel.class);

    @ScriptVariable
    private Page currentPage;

    @Self
    protected SlingHttpServletRequest request;
    @SlingObject
    private ResourceResolver resourceResolver;

    @ValueMapValue
    private String layout;

    @ValueMapValue
    private String heading;

    @ValueMapValue
    private String articlerootpath;

    @ValueMapValue
    private String cardctalabel;
    public String getLayout() {
        return layout;
    }

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    public String getArticlerootpath() {
        return articlerootpath;
    }

    public String getCardctalabel() {
        return cardctalabel;
    }

    List<LatestEventsBeanModel> latestEvents = new ArrayList<LatestEventsBeanModel>();

    @PostConstruct
    protected void init() throws ParseException {
        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        Page rootPage = pageManager.getContainingPage(articlerootpath);
        readAllEventsDetailPages(rootPage);
        getLatestEventsDetails();
    }

    private void readAllEventsDetailPages(Page rootPage) {

        PageManager pageManager = request.getResourceResolver().adaptTo(PageManager.class);
        Page currentPage = pageManager.getContainingPage(request.getResource());
        String pagePath = currentPage.getPath();
        if (rootPage != null) {

            rootPage.listChildren();
            Iterator<Page> eventsPages = rootPage.listChildren();
            while (eventsPages.hasNext()) {

                Page eventsPage = eventsPages.next();
                if(!eventsPage.getPath().equals(pagePath)){
                    if (eventsPage.getContentResource().isResourceType(Constants.EVENTDETAILS)) {

                        allEventsPages.add(eventsPage);
                    }
                    Iterator<Page> subPages = eventsPage.listChildren();
                    while (subPages.hasNext()) {
                        Page subpage = subPages.next();
                        readAllEventsDetailPages(subpage);
                        if (subpage.getContentResource().isResourceType(Constants.EVENTDETAILS)) {
                            allEventsPages.add(subpage);
                        }

                    }
                }

            }



        }
    }

    private void getLatestEventsDetails() throws ParseException {
        List<LatestEventsBeanModel> pinnedEventsDetails = new ArrayList<LatestEventsBeanModel>();
        List<LatestEventsBeanModel> nonpinnedEventsDetails = new ArrayList<LatestEventsBeanModel>();
        for (Page allEventsPage : allEventsPages) {
            String pagePath = allEventsPage.getPath() + "/" + JcrConstants.JCR_CONTENT + "/root/eventdetails";
            if (Objects.nonNull(pagePath)) {
                Resource path = request.getResourceResolver().getResource(pagePath);
                LatestEventsBeanModel LatestEventsBeanModel = new LatestEventsBeanModel();
                if (path != null) {
                    String eventImage = path.getValueMap().get(Constants.EVENTIMAGE, StringUtils.EMPTY).toString();
                    LatestEventsBeanModel.setEventImage(eventImage);
                    String eventCategory = path.getValueMap().get(Constants.EVENTCATEGORY, StringUtils.EMPTY).toString();
                    TagManager tagManager = resourceResolver.adaptTo(TagManager.class);

                    if (!eventCategory.equals(StringUtils.EMPTY)) {
                        Tag tag = tagManager.resolve(eventCategory);
                        if (tag !=null) {
                            eventCategory = tag.getTitle(currentPage.getLanguage());
                        }
                    }

                    LatestEventsBeanModel.setEventCategory(eventCategory);
                    Boolean pinnedEvents = path.getValueMap().get(Constants.PINNEDEVENT, false);
                    LatestEventsBeanModel.setPinnedEvent(pinnedEvents);
                    String eventHeading = path.getValueMap().get(Constants.EVENTHEADING, StringUtils.EMPTY).toString();
                    LatestEventsBeanModel.setEventHeading(eventHeading);
                    String eventDescription = path.getValueMap().get(Constants.EVENTDESCRIPTION,StringUtils.EMPTY).toString();
                    LatestEventsBeanModel.setEventDescription(Jsoup.parse(eventDescription).text());
                    String summary = path.getValueMap().get(Constants.SUMMARY, StringUtils.EMPTY).toString();
                    LatestEventsBeanModel.setSummary(summary);
                    String eventtype = path.getValueMap().get(Constants.EVENTTYPE, StringUtils.EMPTY).toString();
                    LatestEventsBeanModel.setEventtype(eventtype);
                    Date start_date = path.getValueMap().get(Constants.EVENTSTARTDATE, Date.class);
                    if (start_date != null) {
                        LatestEventsBeanModel.setStartdate(start_date);
                    } else {
                        LatestEventsBeanModel.setStartdate(path.getValueMap().get(JcrConstants.JCR_LASTMODIFIED, Date.class));
                    }
                    Date end_date = path.getValueMap().get(Constants.EVENTENDDATE, Date.class);
                    if (end_date!= null) {
                        LatestEventsBeanModel.setEnddate(end_date);
                    }
                    Date startTime = path.getValueMap().get(Constants.EVENTSTARTTIME, Date.class);
                    if (startTime != null){
                        LatestEventsBeanModel.setStartTime(startTime);
                    } else {
                        LatestEventsBeanModel.setStartTime(path.getValueMap().get(JcrConstants.JCR_LASTMODIFIED, Date.class));
                    }
                    Date endTime = path.getValueMap().get(Constants.EVENTENDTIME, Date.class);
                    if (endTime != null){
                        LatestEventsBeanModel.setEndTime(endTime);
                    }


                    String altText = path.getValueMap().get(Constants.ALTTEXT, StringUtils.EMPTY).toString();
                    LatestEventsBeanModel.setAltText(altText);
                    String thumbnailImage = path.getValueMap().get(Constants.THUMBNAILIMAGE, StringUtils.EMPTY).toString();
                    if (!thumbnailImage.equals(StringUtils.EMPTY)) {
                        LatestEventsBeanModel.setThumbnailImage(thumbnailImage);
                    } else {
                        LatestEventsBeanModel.setThumbnailImage(eventImage);
                    }
                    String thumbnailalttext = path.getValueMap().get(Constants.THUMBNAILALTTEXT, StringUtils.EMPTY).toString();
                    LatestEventsBeanModel.setThumbnailalttext(thumbnailalttext);
                    LatestEventsBeanModel.setCtaUrl(allEventsPage.getPath());



                    if (pinnedEvents.equals(true)) {
                        pinnedEventsDetails.add(LatestEventsBeanModel);
                    } else {
                        nonpinnedEventsDetails.add(LatestEventsBeanModel);
                    }

                }

            }
        }
        sortbypinned(pinnedEventsDetails, nonpinnedEventsDetails);

    }

    private void sortbypinned(List<LatestEventsBeanModel> pinnedEventsDetails,
                              List<LatestEventsBeanModel> nonpinnedEventsDetails) {

        Collections.sort(pinnedEventsDetails, new Comparator<LatestEventsBeanModel>() {

            public int compare(LatestEventsBeanModel o1, LatestEventsBeanModel o2) {

                Boolean pinnedEvent1 = ((LatestEventsBeanModel) o1).getPinnedEvent();
                Boolean pinnedEvent2 = ((LatestEventsBeanModel) o2).getPinnedEvent();
                int sComp = pinnedEvent1.compareTo(pinnedEvent2);

                if (sComp != 0) {
                    return sComp;
                }

                Date date1 = ((LatestEventsBeanModel) o1).getStartdate();
                Date date2 = ((LatestEventsBeanModel) o2).getStartdate();
                return date2.compareTo(date1);

            }
        });

        Collections.sort(nonpinnedEventsDetails, new Comparator<LatestEventsBeanModel>() {
            public int compare(final LatestEventsBeanModel object1, final LatestEventsBeanModel object2) {
                return object2.getStartdate().compareTo(object1.getStartdate());
            }
        });
        pinnedEventsDetails.addAll(nonpinnedEventsDetails);
        latestEvents.addAll(pinnedEventsDetails);
    }

    public List<LatestEventsBeanModel> getLatestEvents() {
        return latestEvents;
    }
}
