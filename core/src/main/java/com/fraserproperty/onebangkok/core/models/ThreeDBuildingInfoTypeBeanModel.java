package com.fraserproperty.onebangkok.core.models;


import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.util.Collections;
import java.util.List;


public class ThreeDBuildingInfoTypeBeanModel {

    private String itemType;

    private String textimageitemlabel;

    private List<ThreeDBuildingTextImageBeanModel> addtextimages;

    private String floorplanitemlabel;


    private String floorplanstitle;

    private String floorplanscontent;

    private List<ThreeDBuildingFloorPlansBeanModel> addfloorplans;

    private String imagegalleryitemlabel;


    private List<ThreeDBuildingImageGalleryBeanModel> addimagegallery;


    public String getItemType() {
        return itemType;
    }
    public String getTextimageitemlabel() {
        return textimageitemlabel;
    }

    public List<ThreeDBuildingTextImageBeanModel> getAddtextimages() {
        return Collections.unmodifiableList(addtextimages);
    }

    public String getFloorplanitemlabel() {
        return floorplanitemlabel;
    }

    public String getFloorplanstitle() {
        return floorplanstitle;
    }

    public String getFloorplanscontent() {
        return CommonUtils.removePTagFromRichText(floorplanscontent);
    }

    public List<ThreeDBuildingFloorPlansBeanModel> getAddfloorplans() {
        return Collections.unmodifiableList(addfloorplans);
    }

    public String getImagegalleryitemlabel() {
        return imagegalleryitemlabel;
    }

    public List<ThreeDBuildingImageGalleryBeanModel> getAddimagegallery() {
        return Collections.unmodifiableList(addimagegallery);
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    public void setTextimageitemlabel(String textimageitemlabel) {
        this.textimageitemlabel = textimageitemlabel;
    }

    public void setAddtextimages(List<ThreeDBuildingTextImageBeanModel> addtextimages) {
        this.addtextimages = addtextimages;
    }

    public void setFloorplanitemlabel(String floorplanitemlabel) {
        this.floorplanitemlabel = floorplanitemlabel;
    }

    public void setFloorplanstitle(String floorplanstitle) {
        this.floorplanstitle = floorplanstitle;
    }

    public void setFloorplanscontent(String floorplanscontent) {
        this.floorplanscontent = floorplanscontent;
    }

    public void setAddfloorplans(List<ThreeDBuildingFloorPlansBeanModel> addfloorplans) {
        this.addfloorplans = addfloorplans;
    }

    public void setImagegalleryitemlabel(String imagegalleryitemlabel) {
        this.imagegalleryitemlabel = imagegalleryitemlabel;
    }

    public void setAddimagegallery(List<ThreeDBuildingImageGalleryBeanModel> addimagegallery) {
        this.addimagegallery = addimagegallery;
    }
}
