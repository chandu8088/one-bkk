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
public class BlocksModel {
	
@Inject
private String heading;



@Inject
private String descriptionRTE;



@Inject
private List<BlocksList> blocksList = new ArrayList<>();



public String getHeading() {
return CommonUtils.removePTagFromRichText(heading);
}




public List<BlocksList> getBlocksList() {
return Collections.unmodifiableList(blocksList);
}

}