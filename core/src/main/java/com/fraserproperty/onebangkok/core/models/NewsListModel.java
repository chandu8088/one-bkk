package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fraserproperty.onebangkok.core.utils.Constants;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Model(adaptables = {Resource.class,
        SlingHttpServletRequest.class}, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
        resourceType = "onebangkok/components/newslist"
)
@Exporter(name = "jackson", extensions = "json")
public class NewsListModel {

    List<Page> allNewsPages = new ArrayList<Page>();
    List<LatestNewsBeanModel> pinnedNewsList = new ArrayList<LatestNewsBeanModel>();
    List<LatestNewsBeanModel> unpinnedNewsList = new ArrayList<LatestNewsBeanModel>();
    List<LatestNewsBeanModel> newsList = new ArrayList<>();
    private static final Logger Log = LoggerFactory.getLogger(NewsListModel.class);

    private String newsDetails;

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
    private String rootpath;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String filterHeading;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String filterDefaultText;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String newsTilesctaLabel;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String noresultsMessage;

    @PostConstruct
    protected void init() throws JSONException {
        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        Page rootPage = pageManager.getContainingPage(rootpath);
        readAllNewsDetailsPages(rootPage);
        getLatestNewsDetails();
        JSONArray newslist_obj = new JSONArray();
        if (newsList != null) {
            SimpleDateFormat yearformatter = new SimpleDateFormat(Constants.YYYY);
            DateFormat sdf = new SimpleDateFormat("MMMM dd, yyyy'T'HH:mm:ss", Locale.getDefault());
            sdf.setTimeZone(TimeZone.getTimeZone("GMT+7"));
            for (LatestNewsBeanModel news : newsList) {
                String imagePath = news.getThumbnailImage();
                String heading = news.getNewsHeading();
                String summary = news.getSummary();
                String thumbnailaltText = news.getThumbnailalttext();
                String year = yearformatter.format(news.getDate());
                String ctaUrl = CommonUtils.processUrl(news.getCtaUrl());
                String [] dateArray = sdf.format(news.getDate()).split("T");
                String date = dateArray[0];
                JSONObject json = new JSONObject();
                json.put("url", imagePath);
                json.put("heading", heading);
                json.put("summary", summary);
                json.put("year", year);
                json.put("date", date);
                json.put("thumbnailalttext", thumbnailaltText);
                json.put("ctaUrl", resourceResolver.map(ctaUrl));
                json.put("ctaLabel", newsTilesctaLabel);
                newslist_obj.put(json);
            }
            newsDetails = newslist_obj.toString();
        }
    }

    private void readAllNewsDetailsPages(Page rootPage) {
        if (rootPage != null) {
            Iterator<Page> newsPages = rootPage.listChildren();
            while (newsPages.hasNext()) {
                Page newsPage = newsPages.next();
                if (newsPage.getContentResource().isResourceType(Constants.NEWSPAGE)) {
                    allNewsPages.add(newsPage);
                }
                Iterator<Page> subPages = newsPage.listChildren();
                while (subPages.hasNext()) {
                    Page subPage = subPages.next();
                    readAllNewsDetailsPages(subPage);
                    if (subPage.getContentResource().isResourceType(Constants.NEWSPAGE)) {
                        allNewsPages.add(subPage);
                    }
                }
            }
        }
    }

    private void getLatestNewsDetails() {
        for (Page newsPage : allNewsPages) {
            String pagePath = newsPage.getPath() + "/" + JcrConstants.JCR_CONTENT + "/root/newsarticle";
            if (Objects.nonNull(pagePath)) {
                Resource path = resourceResolver.getResource(pagePath);

                LatestNewsBeanModel latestNewsBeanModel = new LatestNewsBeanModel();
                if (path != null) {
                    String newsImage = path.getValueMap().get(Constants.NEWSIMAGE, StringUtils.EMPTY).toString();
                    latestNewsBeanModel.setNewsImage(newsImage);
                    Boolean pinnedNews = path.getValueMap().get(Constants.PINNEDNEWS, false);
                    latestNewsBeanModel.setPinnedNews(pinnedNews);
                    String newsHeading = path.getValueMap().get(Constants.NEWSHEADING, StringUtils.EMPTY).toString();
                    latestNewsBeanModel.setNewsHeading(newsHeading);
                    String summary = path.getValueMap().get(Constants.SUMMARY, StringUtils.EMPTY).toString();
                    latestNewsBeanModel.setSummary(Jsoup.parse(summary).text());
                    Date date = path.getValueMap().get(Constants.DATE, Date.class);
                    if (date != null) {
                        latestNewsBeanModel.setDate(date);
                    } else {
                        latestNewsBeanModel.setDate(path.getValueMap().get(JcrConstants.JCR_LASTMODIFIED, Date.class));
                    }
                    String altText = path.getValueMap().get(Constants.ALTTEXT, StringUtils.EMPTY).toString();
                    latestNewsBeanModel.setAltText(altText);
                    String thumbnailImage = path.getValueMap().get(Constants.THUMBNAILIMAGE, StringUtils.EMPTY).toString();
                    if (!thumbnailImage.equals(StringUtils.EMPTY)) {
                        latestNewsBeanModel.setThumbnailImage(thumbnailImage);
                    } else {
                        latestNewsBeanModel.setThumbnailImage(newsImage);
                    }
                    String thumbnailalttext = path.getValueMap().get(Constants.THUMBNAILALTTEXT, StringUtils.EMPTY).toString();
                    latestNewsBeanModel.setThumbnailalttext(thumbnailalttext);
                    latestNewsBeanModel.setCtaUrl(newsPage.getPath());
                    if(pinnedNews.equals(true)){
                        pinnedNewsList.add(latestNewsBeanModel);
                    }
                    else{
                        unpinnedNewsList.add(latestNewsBeanModel);
                    }
                }
            }
        }
        sortNewsList(pinnedNewsList);
        sortNewsList(unpinnedNewsList);
        pinnedNewsList.addAll(unpinnedNewsList);
        newsList.addAll(pinnedNewsList);
    }
    private void sortNewsList(List<LatestNewsBeanModel> newsList) {
        newsList.sort(new Comparator<LatestNewsBeanModel>() {
            @Override
            public int compare(LatestNewsBeanModel o1, LatestNewsBeanModel o2) {
                return o2.getDate().compareTo(o1.getDate());
            }
        });
    }

    public String getNewsDetails() {
        return newsDetails;
    }

    @JsonIgnore
    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    @JsonIgnore
    public String getRootpath() {
        return rootpath;
    }

    @JsonIgnore
    public String getFilterHeading() {
        return filterHeading;
    }

    @JsonIgnore
    public String getFilterDefaultText() {
        return filterDefaultText;
    }

    @JsonIgnore
    public String getNewsTilesctaLabel() {
        return newsTilesctaLabel;
    }

    @JsonIgnore
    public String getNoresultsMessage() {
        return CommonUtils.removePTagFromRichText(noresultsMessage);
    }

    @JsonIgnore
    public List<LatestNewsBeanModel> getNewsList() {
        return newsList;
    }
}
