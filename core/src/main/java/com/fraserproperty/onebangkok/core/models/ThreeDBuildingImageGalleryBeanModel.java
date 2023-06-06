package com.fraserproperty.onebangkok.core.models;


import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;


public class ThreeDBuildingImageGalleryBeanModel {


    private String galleryimage;

    private String caption;

    private String alttext;

    public String getGalleryimage() {
        return galleryimage;
    }

    public String getCaption() {
        return caption;
    }

    public String getAlttext() {
        return alttext;
    }

    public void setGalleryimage(String galleryimage) {
        this.galleryimage = galleryimage;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public void setAlttext(String alttext) {
        this.alttext = alttext;
    }
}
