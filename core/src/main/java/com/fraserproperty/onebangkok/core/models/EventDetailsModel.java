package com.fraserproperty.onebangkok.core.models;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.day.cq.wcm.api.Page;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.fraserproperty.onebangkok.core.config.GoogleMapConfig;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fraserproperty.onebangkok.core.utils.Constants;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class EventDetailsModel {
	@ScriptVariable
	private Page currentPage;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String eventCategory;
	
	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String ticketCtaLabel;
	
	@ValueMapValue
	private Date startdate;
	
	@ValueMapValue
	private Date enddate;
	
	@ValueMapValue
	private String summary;
	
	@ValueMapValue
	private String eventDescriptionHeading;
	
	@ValueMapValue
	private String eventDescription;
	
	@ValueMapValue
	private String datetimeLabel;
	
	@ValueMapValue
	private String locationLabel;
	
	@ValueMapValue
	private String locationdetails;
	
	@ValueMapValue
	private String ticketLabel;
	
	@ValueMapValue
	private String ticketDetails;
	
	private String isYearSame = "false";

	@SlingObject
	private ResourceResolver resourceResolver;
	
	@OSGiService
	GoogleMapConfig osgiConfig;
	
	private String eventCategoryName;
	
	public String getEventCategoryName() {
		TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
		Tag tag = tagManager.resolve(eventCategory);
		eventCategoryName = tag.getTitle(currentPage.getLanguage());
		return eventCategoryName;
		
	}

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

	public String getTicketCtaLabel() {
		return CommonUtils.removePTagFromRichText(ticketCtaLabel);
	}
	
	public String getGoogleMapPath() {
        return osgiConfig.getGoogleMapPath();
    }

	public String getSummary() {
		return CommonUtils.removePTagFromRichText(summary);
	}

	public String getEventDescriptionHeading() {
		return CommonUtils.removePTagFromRichText(eventDescriptionHeading);
	}

	public String getEventDescription() {
		return CommonUtils.removePTagFromRichText(eventDescription);
	}

	public String getDatetimeLabel() {
		return CommonUtils.removePTagFromRichText(datetimeLabel);
	}

	public String getLocationLabel() {
		return CommonUtils.removePTagFromRichText(locationLabel);
	}

	public String getLocationdetails() {
		return CommonUtils.removePTagFromRichText(locationdetails);
	}

	public String getTicketLabel() {
		return CommonUtils.removePTagFromRichText(ticketLabel);
	}

	public String getTicketDetails() {
		return CommonUtils.removePTagFromRichText(ticketDetails);
	}

}
