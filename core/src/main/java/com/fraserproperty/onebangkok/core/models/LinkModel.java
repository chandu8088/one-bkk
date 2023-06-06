package com.fraserproperty.onebangkok.core.models;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LinkModel {

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String image;
    
    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String link;
    
    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String openInNewTab;
    
    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String emails;
	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String departmentEmail;
	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String department;
    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
	private String altText;

	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String text;
	
	@ValueMapValue
    @Default(values = StringUtils.EMPTY)
	private String descriptionRTE;
	
	private String path;
	
	private String tabTarget;
	
	public String getImage() {
		return image;
	}

	public String getLink() {
		return link;
	}

	public String getOpenInNewTab() {
		return openInNewTab;
	}

	public String getAltText() {
		return altText;
	}

	public String getText() {
		return CommonUtils.removePTagFromRichText(text);
	}

	public String getDescriptionRTE() {
		return CommonUtils.removePTagFromRichText(descriptionRTE);
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
	public String getTabTarget() {
		tabTarget = text.replaceAll(" ", "-").toLowerCase();
		return tabTarget;
	}

	public String getEmails() {
		return emails;
	}
	public String getDepartmentEmail() {
		return departmentEmail;
	}
	public String getDepartment() {
		return department;
	}

    
}