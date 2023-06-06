package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;



import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;



@Model(adaptables = Resource.class,defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SelectorsModel {
	
	@Inject
    private String group;

    @Inject
    private String heading;


    @Inject
    private String descriptionRTE;


    @Inject
    private List<SelectorsList> selectorsList = new ArrayList<>();


public String getContentIdentifier(){
	return group.replaceAll(" ", "-").toLowerCase();
}

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }


    public String getDescription() {
        return CommonUtils.removePTagFromRichText(descriptionRTE);
    }


    public List<SelectorsList> getSelectorsList() {
        return Collections.unmodifiableList(selectorsList);
    }


}
 