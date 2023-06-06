package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;



import javax.inject.Inject;



@Model(adaptables = Resource.class,defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class BlocksList {

@Inject
private String imagePath;



@Inject
private String imageAltText;

@Inject
private String blockContent;

public String getImagePath() {
return imagePath;
}



public String getImageAltText() {
return imageAltText;
}

public String getBlockContent() {
return CommonUtils.removePTagFromRichText(blockContent);
}






}