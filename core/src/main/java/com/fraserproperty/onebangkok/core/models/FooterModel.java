package com.fraserproperty.onebangkok.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.Page;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;

@Model(adaptables = { Resource.class,
		SlingHttpServletRequest.class }, 
		defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FooterModel {

	@SlingObject
	private Resource currentResource;

	@Inject
	private Page currentPage;

	@SlingObject
	private ResourceResolver resourceResolver;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String formid;

	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String heading;
	
	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String description;
	
	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String addresslabel;
	
	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String addressdetails;
	
	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String contactlabel;
	
	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String contactnumber;

	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String placeholder;
	
	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String newsletterHeading;
	
	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String newsletterDescription;

	@ChildResource
	private List<LinkModel> brandImgs = new ArrayList<LinkModel>();

	@ChildResource
	private List<LinkModel> socialShare = new ArrayList<LinkModel>();

	@ChildResource
	private List<LinkModel> footerLinks = new ArrayList<LinkModel>();

	public List<LinkModel> getBrandImgs() {
		return Collections.unmodifiableList(brandImgs);
	}

	public List<LinkModel> getSocialShare() {
		return Collections.unmodifiableList(socialShare);
	}

	public List<LinkModel> getFooterLinks() {
		return Collections.unmodifiableList(footerLinks);
	}

	String hideContact;

	String hideNewsletter;
	String contactHeading;
	String contactRTE;

	@PostConstruct
	protected void init() {
		hideContact = currentPage.getProperties().get("hideContact", StringUtils.EMPTY);
		hideNewsletter = currentPage.getProperties().get("hideNewsLetter", StringUtils.EMPTY);
		InheritanceValueMap ivm = new HierarchyNodeInheritanceValueMap(currentPage.getContentResource());
		String siteRootPath = ivm.getInherited("siteRootPath", String.class);
		if (siteRootPath != null) {
		Resource path = resourceResolver.getResource(siteRootPath + "/jcr:content/root/navigation");
		if(path != null) {
		contactHeading = path.getValueMap().get("contactHeading",StringUtils.EMPTY);
		contactRTE = CommonUtils.removePTagFromRichText(path.getValueMap().get("contactRTE",StringUtils.EMPTY));
		}
		}
	}

	public String getHideContact() {
		return hideContact;
	}

	public String getHideNewsletter() {
		return hideNewsletter;
	}

	public String getContactHeading() {
		return contactHeading;
	}

	public String getContactRTE() {
		return contactRTE;
	}

	public String getFormid() {
		return formid.replaceAll(" ", "-");
	}

	public String getHeading() {
		return CommonUtils.removePTagFromRichText(heading);
	}

	public String getDescription() {
		return CommonUtils.removePTagFromRichText(description);
	}

	public String getAddresslabel() {
		return CommonUtils.removePTagFromRichText(addresslabel);
	}

	public String getAddressdetails() {
		return CommonUtils.removePTagFromRichText(addressdetails);
	}

	public String getContactlabel() {
		return CommonUtils.removePTagFromRichText(contactlabel);
	}

	public String getContactnumber() {
		return CommonUtils.removePTagFromRichText(contactnumber);
	}

	public String getPlaceholder() {
		return CommonUtils.removePTagFromRichText(placeholder);
	}

	public String getNewsletterHeading() {
		return CommonUtils.removePTagFromRichText(newsletterHeading);
	}

	public String getNewsletterDescription() {
		return CommonUtils.removePTagFromRichText(newsletterDescription);
	}

}
