package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;
import java.util.Collections;
import java.util.List;


public class ThreeDBuildingSectionDetailsModel {

    private String identifier;

    private String summary;

    private String buttontype;


    private String ctalabel;


    private String ctaurl;


    private String openinnewtab;



    private String assetpath;


    private String enquiryfromcheckbox;


    private String enquiryformlink;


    private String additionalinformationdesktoplabel;


    private String additionalinformationmobilelabel;


    private List<ThreeDBuildingInfoTypeBeanModel> assetItems;

    public String getIdentifier() {
        return identifier;
    }

    public String getSummary() {
        return CommonUtils.removePTagFromRichText(summary);
    }

    public String getButtontype() {
        return buttontype;
    }

    public String getCtalabel() {
        return CommonUtils.removePTagFromRichText(ctalabel);
    }

    public String getCtaurl() {
        return ctaurl;
    }

    public String getOpeninnewtab() {
        return openinnewtab;
    }

    public String getAssetpath() {
        return assetpath;
    }

    public String getEnquiryfromcheckbox() {
        return enquiryfromcheckbox;
    }

    public String getEnquiryformlink() {
        return enquiryformlink.replaceAll(" ", "-");
    }

    public String getAdditionalinformationdesktoplabel() {
        return additionalinformationdesktoplabel;
    }

    public String getAdditionalinformationmobilelabel() {
        return additionalinformationmobilelabel;
    }

    public List<ThreeDBuildingInfoTypeBeanModel> getAssetItems() {
        return assetItems;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public void setButtontype(String buttontype) {
        this.buttontype = buttontype;
    }

    public void setCtalabel(String ctalabel) {
        this.ctalabel = ctalabel;
    }

    public void setCtaurl(String ctaurl) {
        this.ctaurl = ctaurl;
    }

    public void setOpeninnewtab(String openinnewtab) {
        this.openinnewtab = openinnewtab;
    }

    public void setAssetpath(String assetpath) {
        this.assetpath = assetpath;
    }

    public void setEnquiryfromcheckbox(String enquiryfromcheckbox) {
        this.enquiryfromcheckbox = enquiryfromcheckbox;
    }

    public void setEnquiryformlink(String enquiryformlink) {
        this.enquiryformlink = enquiryformlink;
    }

    public void setAdditionalinformationdesktoplabel(String additionalinformationdesktoplabel) {
        this.additionalinformationdesktoplabel = additionalinformationdesktoplabel;
    }

    public void setAdditionalinformationmobilelabel(String additionalinformationmobilelabel) {
        this.additionalinformationmobilelabel = additionalinformationmobilelabel;
    }

    public void setAssetItems(List<ThreeDBuildingInfoTypeBeanModel> assetItems) {
        this.assetItems = assetItems;
    }
}
