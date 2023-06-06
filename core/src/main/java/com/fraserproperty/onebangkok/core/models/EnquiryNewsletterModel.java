package com.fraserproperty.onebangkok.core.models;

import java.util.*;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import com.adobe.granite.crypto.CryptoException;
import com.adobe.granite.crypto.CryptoSupport;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.fraserproperty.onebangkok.core.config.EnquireNewsletterConfig;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
		defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class EnquiryNewsletterModel {
	private static final Logger Log = LoggerFactory.getLogger(EnquiryNewsletterModel.class);

	@Inject
	private CryptoSupport cryptoSupport;
	@SlingObject
	private Resource currentResource;
	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String formid;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String heading;
	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String others;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String description;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String failuremessage;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String failuremessagedesc;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String termsandcondition;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String productinformationcheckboxcontent;

	@SlingObject
	private ResourceResolver resourceResolver;

	@ChildResource
	private List<LinkModel> recipientemails = new ArrayList<LinkModel>();
	@ChildResource
	private List<LinkModel> departments = new ArrayList<LinkModel>();

	private String recipientEmail = StringUtils.EMPTY;
	private LinkedHashMap<String,String> tagsName = new LinkedHashMap<String,String>() ;
	private String lang = StringUtils.EMPTY;
	private String senderEmail = StringUtils.EMPTY;
	private String resourcePath;

	@OSGiService
	EnquireNewsletterConfig enquireNewsletterConfig;

	@Inject
	private Page currentPage;

	@PostConstruct
	protected void init() {

		// Recipient Email
		TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
		for (LinkModel departmentName: departments) {
			Tag tag = tagManager.resolve(departmentName.getDepartment());
			if(tag != null) {
				tagsName.put((tag.getTitle(currentPage.getLanguage())),departmentName.getDepartment());
			}
		}
		if(recipientemails.size()!=0) {
			for (LinkModel recipientemail : recipientemails) {
				recipientEmail = recipientEmail + "," + recipientemail.getEmails();
			}

			if (recipientEmail.startsWith(",")) {
				recipientEmail = recipientEmail.substring(1);
			}
		}
		try {
			resourcePath=cryptoSupport.protect(currentResource.getPath());
		} catch (CryptoException e) {
			Log.error(e.getMessage());
		}
	}

	public String getFormid() {
		return formid.replaceAll(" ", "-");
	}

	public String getSiteKey() {
		return enquireNewsletterConfig.siteKey();
	}

	public String getHeading() {
		return CommonUtils.removePTagFromRichText(heading);
	}

	public String getDescription() {
		return CommonUtils.removePTagFromRichText(description);
	}

	public String getFailuremessage() {
		return CommonUtils.removePTagFromRichText(failuremessage);
	}

	public String getFailuremessagedesc() {
		return CommonUtils.removePTagFromRichText(failuremessagedesc);
	}

	public String getTermsandcondition() {
		return CommonUtils.removePTagFromRichText(termsandcondition);
	}

	public String getProductinformationcheckboxcontent() {
		return CommonUtils.removePTagFromRichText(productinformationcheckboxcontent);
	}

	public List<LinkModel> getRecipientemails() {
		return Collections.unmodifiableList(recipientemails);
	}
	public List<LinkModel> getDepartments() {
		return Collections.unmodifiableList(departments);
	}

	public String getRecipientEmail() {
		return recipientEmail;
	}

	public String getLanguage() {
		lang = currentPage.getLanguage().toString();
		return lang;
	}

	public String getPath() {
		String path = currentPage.getPath();
		return path;
	}

	public String getSenderEmail() {
		senderEmail = enquireNewsletterConfig.senderEmail();
		return senderEmail;
	}
	public LinkedHashMap<String,String> getTags()
	{
		tagsName.put("Others","Others");
		return tagsName;
	}
	public String getResourcePath()
	{
		return resourcePath;
	}

}
