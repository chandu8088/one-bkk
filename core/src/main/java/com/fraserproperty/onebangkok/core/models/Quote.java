package com.fraserproperty.onebangkok.core.models;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, 
defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class Quote {

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String image;
	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String imageAltText;
	
	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String quoteText;
	
	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String name;
	
	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String designation;

	public String getImage() {
		return image;
	}
	public String getImageAltText() {
		return imageAltText;
	}

	public String getQuoteText() {
	 return CommonUtils.removePTagFromRichText(quoteText);
	}

	public String getName() {
	return name;
	}

	public String getDesignation() {
		 return designation;
	}
	
	
	
	
}
