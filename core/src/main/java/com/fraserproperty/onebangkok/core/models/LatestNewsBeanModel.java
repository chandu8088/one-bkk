package com.fraserproperty.onebangkok.core.models;

import java.util.Date;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;

public class LatestNewsBeanModel {

	private String newsImage;
	
	private Boolean pinnedNews;
	
	private String newsHeading;
	
	private String summary;
	
	private Date date;

	private String requiredDate;
	
	private String altText;
	
	private String thumbnailImage;
	
	private String thumbnailalttext;
	
	private String ctaUrl;

	public String getNewsImage() {
		return newsImage;
	}

	public void setNewsImage(String newsImage) {
		this.newsImage = newsImage;
	}

	public Boolean getPinnedNews() {
		return pinnedNews;
	}

	public void setPinnedNews(Boolean pinnedNews) {
		this.pinnedNews = pinnedNews;
	}

	public String getNewsHeading() {
		return newsHeading;
	}

	public void setNewsHeading(String newsHeading) {
		this.newsHeading = newsHeading;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = CommonUtils.removePTagFromRichText(summary);
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getRequiredDate() {
		return requiredDate;
	}

	public void setRequiredDate(String requiredDate) {
		this.requiredDate = requiredDate;
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

	public String getCtaUrl() {
		return ctaUrl;
	}

	public void setCtaUrl(String ctaUrl) {
		this.ctaUrl = ctaUrl;
	}
}
