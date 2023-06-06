package com.fraserproperty.onebangkok.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import javax.inject.Inject;
@Model(adaptables = Resource.class, 
defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TabsModel {
	@Inject
    private String group;
	
	@ChildResource
	private List<LinkModel> tabs = new ArrayList<LinkModel>();
	
public String getContentIdentifier(){
	return group.replaceAll(" ", "-").toLowerCase();
}

	public List<LinkModel> getTabs() {
		return Collections.unmodifiableList(tabs);
	}

}
