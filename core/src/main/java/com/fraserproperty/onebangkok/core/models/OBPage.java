package com.fraserproperty.onebangkok.core.models;

import com.day.cq.commons.Externalizer;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.fraserproperty.onebangkok.core.config.SeoAndMetadataConfig;
import java.util.*;
import javax.inject.Inject;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

@Model(adaptables = {Resource.class,
        SlingHttpServletRequest.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class OBPage {
    @SlingObject
    private Resource currentResource;

    @ScriptVariable
    private Resource resource;
    @OSGiService
    SeoAndMetadataConfig osgiConfig;
    @Inject
    private Externalizer externalizer;
    @Inject
    private Page currentPage;
    @Inject
    private Page curPage;
    @SlingObject
    private ResourceResolver resourceResolver;

    @ScriptVariable
    private PageManager pageManager;

    String temp;
    String type = "";
    String[] parts;
    ArrayList<String> lastPart = new ArrayList<String>();

    public static String getPropertyString(Resource resource, String namePattern) {
        return resource.getValueMap().get(namePattern, String.class);
    }

    public String getLanguage() {
        String language = currentPage == null ? Locale.getDefault().toLanguageTag() : currentPage.getLanguage(false).toLanguageTag();
        return language;
    }

    public String getTemplateType(Page page) {
        type = page.getContentResource().getResourceType();
        parts = type.split("/");
        temp = parts[parts.length - 1];
        return temp;
    }

    public String getPageName(Page page) {
        String typePage = page.getPath();
        String[] pageParts = typePage.split("/");
        String pageName = pageParts[pageParts.length - 1];
        return pageName;

    }

    public ArrayList<String> getLastPartArray() {
        return lastPart;
    }

    private static String checkForExternalURL(final String target) {

        String localTarget = target;

        if (StringUtils.isNotBlank(target)) {
            if (target.startsWith("http")
                    || target.startsWith("https")
                    || target.startsWith("#")
                    || target.startsWith("//")) {
                return localTarget;
            }

            if (!target.startsWith("/")
                    && target.contains(".")) {
                localTarget = "//" + target;
                return localTarget;
            }
        }
        return null;
    }

    public static String getTargetUrl(final String pageUrl) {
        if (StringUtils.isNotBlank(pageUrl)) {
            final String url = checkForExternalURL(pageUrl);

            if (!StringUtils.isEmpty(url)) {
                return url;
            }

            if (pageUrl.startsWith("/")
                    && !pageUrl.contains(".")) {
                return pageUrl + ".html";
            }
        }
        return pageUrl;
    }

    public static String getThumbnailUrl(Page page, int width, int height) {
        String ck = "";

        ValueMap metadata = page.getProperties("image/file/" + JcrConstants.JCR_CONTENT);
        if (metadata != null) {
            Calendar imageLastModified = metadata.get(JcrConstants.JCR_LASTMODIFIED, Calendar.class);
            Calendar pageLastModified = page.getLastModified();
            if (pageLastModified != null && pageLastModified.after(imageLastModified)) {
                ck += pageLastModified.getTimeInMillis() / 1000;
            } else if (imageLastModified != null) {
                ck += imageLastModified.getTimeInMillis() / 1000;
            } else if (pageLastModified != null) {
                ck += pageLastModified.getTimeInMillis() / 1000;
            }
        }

        return page.getPath() + ".thumb." + width + "." + height + ".png?ck=" + ck;
    }

    ArrayList<String> languages = new ArrayList<>();

    public ArrayList<String> getLanguages() {
        temp = getTemplateType(currentPage);
        curPage = currentPage;
        while (!temp.equals("homepage")) {

            if (temp.equals("homepage"))
                break;
            else {
                curPage = curPage.getParent();
                temp = getTemplateType(curPage);
            }

        }

        Iterator<Page> childIterator = curPage.getParent().listChildren();
        while (childIterator.hasNext()) {
            Page child = childIterator.next();
            curPage = child;
            temp = getTemplateType(curPage);

            if (temp.equals("homepage")) {
                String y = curPage == null ? Locale.getDefault().toLanguageTag() : curPage.getLanguage(false).toLanguageTag();
                languages.add(y);
                lastPart.add(getPageName(curPage));
            }
        }
        return languages;
    }

    public String getCanonicalOBLink() {
        String domain = osgiConfig.getDomain();
        String canonicalLink = resourceResolver.map(getTargetUrl(currentPage.getPath()));
        if (canonicalLink.startsWith("http"))
            return canonicalLink;
        else return domain + canonicalLink;

    }

    LinkedHashMap<String, String> map = new LinkedHashMap<>();

    public LinkedHashMap<String, String> getAlternateOBLanguageLinks() {
        languages = getLanguages();
        String pageLinkURL = currentPage.getPath();
        String part[] = pageLinkURL.split("/");
        lastPart = getLastPartArray();
        for (int i = 0; i < languages.size(); i++) {
            part[3] = lastPart.get(i);
            String link = String.join("/", part);
            Page langPage = pageManager.getPage(link);
            if (null != langPage) {
                String domain = osgiConfig.getDomain();
                String alternateLinks = resourceResolver.map(getTargetUrl(link));
                if (!alternateLinks.startsWith("http"))
                    alternateLinks = domain + alternateLinks;
                map.put(languages.get(i), alternateLinks);
            }
        }
        return map;
    }

    Resource thumbnail;
    String thumbnailImage;

    public String getThumbnailMain() {

        Resource parentResource = resourceResolver.getResource(currentPage.getPath() + "/jcr:content/root");

        Iterator<Resource> resources = parentResource.listChildren();
        while (resources.hasNext()) {
            Resource res = resources.next();
            if (res.getName().equals("eventdetails") || res.getName().equals("newsarticle")) {
                thumbnail = res;
                ValueMap property = thumbnail.adaptTo(ValueMap.class);
                if (res.getName().equals("eventdetails"))
                    thumbnailImage = property.get("eventImage", String.class);
                else if (res.getName().equals("newsarticle"))
                    thumbnailImage = property.get("newsImage", String.class);
                break;
            }
        }
        String domain = osgiConfig.getDomain();
        thumbnailImage = resourceResolver.map(getTargetUrl(thumbnailImage));
        if (thumbnailImage.startsWith("http"))
            return thumbnailImage;
        else return domain + thumbnailImage;
    }


    String thumbnail_home;

    public String getThumbnailHome() {
        String domain = osgiConfig.getDomain();
        if (null != resourceResolver.getResource(resource.getPath() + "/image")) {
            thumbnail_home = getThumbnailUrl(currentPage, 800, 480);
        }


        if (StringUtils.isNotBlank(thumbnail_home)) {
            thumbnail_home = resourceResolver.map(getTargetUrl(thumbnail_home));
        }
        if (thumbnail_home !=null && thumbnail_home.startsWith("http"))
            return thumbnail_home;
        else return domain + thumbnail_home;
    }


    public String getThumbnail() {
        String template = getTemplateType(currentPage);
        if (template != null && (template.equals("newsdetailpage") || template.equals("eventdetailpage"))) {
            return getThumbnailMain();
        } else {
            return getThumbnailHome();
        }
    }


}