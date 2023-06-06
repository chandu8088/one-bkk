package com.fraserproperty.onebangkok.core.models;


import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

public class ThreeDBuildingFloorPlansBeanModel {

    private String floorlabel;

    private String floornumber;

    private String floorplanimage;

    private String floorplanimagealttext;

    private String secondaryimage;

    private String secondaryimagealttext;

    public String getFloorlabel() {
        return floorlabel;
    }

    public String getFloornumber() {
        return floornumber;
    }

    public String getFloorplanimage() {
        return floorplanimage;
    }

    public String getFloorplanimagealttext() {
        return floorplanimagealttext;
    }

    public String getSecondaryimage() {
        return secondaryimage;
    }

    public String getSecondaryimagealttext() {
        return secondaryimagealttext;
    }

    public void setFloorlabel(String floorlabel) {
        this.floorlabel = floorlabel;
    }

    public void setFloornumber(String floornumber) {
        this.floornumber = floornumber;
    }

    public void setFloorplanimage(String floorplanimage) {
        this.floorplanimage = floorplanimage;
    }

    public void setFloorplanimagealttext(String floorplanimagealttext) {
        this.floorplanimagealttext = floorplanimagealttext;
    }

    public void setSecondaryimage(String secondaryimage) {
        this.secondaryimage = secondaryimage;
    }

    public void setSecondaryimagealttext(String secondaryimagealttext) {
        this.secondaryimagealttext = secondaryimagealttext;
    }
}
