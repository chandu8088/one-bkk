package com.fraserproperty.onebangkok.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import javax.annotation.PostConstruct;

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

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fraserproperty.onebangkok.core.utils.Constants;
import org.jsoup.Jsoup;

@Model(adaptables = { Resource.class,
		SlingHttpServletRequest.class }, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LatestNewsModel {

	List<Page> allNewsPages = new ArrayList<Page>();
	@Self
	protected SlingHttpServletRequest request;
	@SlingObject
	private ResourceResolver resourceResolver;

	@SlingObject
	private Resource currentResource;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String articlerootpath;
	
	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String heading;
	
	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String mainctalabel;
	
	List<LatestNewsBeanModel> latestNews = new ArrayList<LatestNewsBeanModel>();

	@PostConstruct
	protected void init() {
		PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
		Page rootPage = pageManager.getContainingPage(articlerootpath);
		readAllNewsDetailPages(rootPage);
		getLatestNewsDetails();
	}

	private void readAllNewsDetailPages(Page rootPage) {
		PageManager pageManager = request.getResourceResolver().adaptTo(PageManager.class);
		Page currentPage = pageManager.getContainingPage(request.getResource());
		String pagePath = currentPage.getPath();

		if (rootPage != null) {

			rootPage.listChildren();
			Iterator<Page> newsPages = rootPage.listChildren();
			while (newsPages.hasNext()) {
				Page newsPage = newsPages.next();
				if (!newsPage.getPath().equals(pagePath)){
					if (newsPage.getContentResource().isResourceType(Constants.NEWSPAGE)) {
						allNewsPages.add(newsPage);
					}
					Iterator<Page> subPages = newsPage.listChildren();
					while (subPages.hasNext()) {
						Page subpage = subPages.next();
						readAllNewsDetailPages(subpage);
						if (subpage.getContentResource().isResourceType(Constants.NEWSPAGE)) {
							allNewsPages.add(subpage);
						}

					}
				}

			}

		}
	}

	private void getLatestNewsDetails() {
		List<LatestNewsBeanModel> pinnedNewsDetails = new ArrayList<LatestNewsBeanModel>();
		List<LatestNewsBeanModel> nonpinnedNewsDetails = new ArrayList<LatestNewsBeanModel>();
		for (Page allNewsPage : allNewsPages) {
			String pagePath = allNewsPage.getPath() + "/" + JcrConstants.JCR_CONTENT + "/root/newsarticle";
			if (Objects.nonNull(pagePath)) {
				Resource path = request.getResourceResolver().getResource(pagePath);
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
					latestNewsBeanModel.setCtaUrl(allNewsPage.getPath());

					latestNewsBeanModel.setNewsImage(newsImage);
					if (pinnedNews.equals(true)) {
						pinnedNewsDetails.add(latestNewsBeanModel);
					} else {
						nonpinnedNewsDetails.add(latestNewsBeanModel);
					}

				}

			}
		}
		sortbypinned(pinnedNewsDetails, nonpinnedNewsDetails);

	}

	private void sortbypinned(List<LatestNewsBeanModel> pinnedNewsDetails,
			List<LatestNewsBeanModel> nonpinnedNewsDetails) {
		Collections.sort(pinnedNewsDetails, new Comparator<LatestNewsBeanModel>() {

			public int compare(LatestNewsBeanModel o1, LatestNewsBeanModel o2) {

				Boolean pinnedNews1 = ((LatestNewsBeanModel) o1).getPinnedNews();
				Boolean pinnedNews2 = ((LatestNewsBeanModel) o2).getPinnedNews();
				int sComp = pinnedNews1.compareTo(pinnedNews2);

				if (sComp != 0) {
					return sComp;
				}

				Date date1 = ((LatestNewsBeanModel) o1).getDate();
				Date date2 = ((LatestNewsBeanModel) o2).getDate();
				return date2.compareTo(date1);

			}
		});

		Collections.sort(nonpinnedNewsDetails, new Comparator<LatestNewsBeanModel>() {
			public int compare(final LatestNewsBeanModel object1, final LatestNewsBeanModel object2) {
				return object2.getDate().compareTo(object1.getDate());
			}
		});
		pinnedNewsDetails.addAll(nonpinnedNewsDetails);
		latestNews.addAll(pinnedNewsDetails);
	}

	public List<LatestNewsBeanModel> getLatestNews() {
		return latestNews;
	}

	public String getHeading() {
		return CommonUtils.removePTagFromRichText(heading);
	}

	public String getMainctalabel() {
		return CommonUtils.removePTagFromRichText(mainctalabel);
	}


}
