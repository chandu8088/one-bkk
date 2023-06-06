package com.fraserproperty.onebangkok.core.models;

import java.util.List;
import javax.inject.Inject;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class IconandTextModel {

    @Inject
    private String heading;

    @Inject
    private String description;
	
	@Inject
	private boolean hideSeparator;
	
	@Inject
    private String vlabel;
    @Inject
    private List<AccesibilityList> accessibilityList;

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    public String getDescription() {
        return CommonUtils.removePTagFromRichText(description);
    }
	public boolean getHideSeparator() {
		return hideSeparator;
	}
	public String getVLabel(){
	return vlabel;
	}
    public List<AccesibilityList> getAccessibilityList() {
        return accessibilityList;
    }
}
