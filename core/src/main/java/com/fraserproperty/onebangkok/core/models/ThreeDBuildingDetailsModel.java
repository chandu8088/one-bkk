package com.fraserproperty.onebangkok.core.models;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fraserproperty.onebangkok.core.utils.Constants;
import org.apache.poi.ss.formula.functions.T;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

@Model(adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ThreeDBuildingDetailsModel {

    @Self
    protected SlingHttpServletRequest request;

    @Inject
    private String heading;

    @Inject
    private String description;

    public List<ThreeDBuildingSectionDetailsModel> getTowers() {
        return towers;
    }

    @Inject
    private String threedpageurl;

    @Inject
    private String towerdetailsrootpath;

    @SlingObject
    private ResourceResolver resourceResolver;


    List<ThreeDBuildingSectionDetailsModel> towers = new ArrayList<ThreeDBuildingSectionDetailsModel>();

    List<Page> allTowerPages = new ArrayList<Page>();

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    public String getDescription() {
        return CommonUtils.removePTagFromRichText(description);
    }

    public String getThreedpageurl() {
        return threedpageurl;
    }

    public String getTowerdetailsrootpath() {
        return towerdetailsrootpath;
    }


    @PostConstruct
    protected void init() throws ParseException {
        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        Page rootPage = pageManager.getContainingPage(towerdetailsrootpath);
        readAllTowerDetailPages(rootPage);
        getTowerDetails();
    }

    private void readAllTowerDetailPages(Page rootPage) {
//        PageManager pageManager = request.getResourceResolver().adaptTo(PageManager.class);
//        Page currentPage = pageManager.getContainingPage(request.getResource());
//        String pagePath = currentPage.getPath();

        if (rootPage != null){
            rootPage.listChildren();
            Iterator<Page> towerPages = rootPage.listChildren();
            while (towerPages.hasNext()){
                Page towerPage = towerPages.next();
                    if (towerPage.getContentResource().isResourceType(Constants.TOWERDETAILS)) {
                        allTowerPages.add(towerPage);
                    }
            }
        }
    }

    private void getTowerDetails() throws ParseException {
        for (Page allTowerPage: allTowerPages) {
            String pagePath = allTowerPage.getPath() + "/" + JcrConstants.JCR_CONTENT + "/root/towerdetails";
            Resource towerDetails = resourceResolver.getResource(pagePath);
            ThreeDBuildingSectionDetailsModel sectionDetailsModel = new ThreeDBuildingSectionDetailsModel();
            String identifier = towerDetails.getValueMap().get("identifier",String.class);
            sectionDetailsModel.setIdentifier(identifier);
            String summary = towerDetails.getValueMap().get("summary",String.class);
            sectionDetailsModel.setSummary(summary);
            String buttontype = towerDetails.getValueMap().get("buttontype",String.class);
            sectionDetailsModel.setButtontype(buttontype);
            String ctalabel = towerDetails.getValueMap().get("ctalabel",String.class);
            sectionDetailsModel.setCtalabel(ctalabel);
            String ctaurl = towerDetails.getValueMap().get("ctaurl",String.class);
            sectionDetailsModel.setCtaurl(ctaurl);
            String openinnewtab = towerDetails.getValueMap().get("openinnewtab",String.class);
            sectionDetailsModel.setOpeninnewtab(openinnewtab);
            String assetpath = towerDetails.getValueMap().get("assetpath",String.class);
            sectionDetailsModel.setAssetpath(assetpath);
            String enquiryformlink = towerDetails.getValueMap().get("enquiryformlink",String.class);
            sectionDetailsModel.setEnquiryformlink(enquiryformlink);
            String enquiryfromcheckbox = towerDetails.getValueMap().get("enquiryfromcheckbox",String.class);
            sectionDetailsModel.setEnquiryfromcheckbox(enquiryfromcheckbox);
            String additionalinformationdesktoplabel = towerDetails.getValueMap().get("additionalinformationdesktoplabel",String.class);
            sectionDetailsModel.setAdditionalinformationdesktoplabel(additionalinformationdesktoplabel);
            String additionalinformationmobilelabel = towerDetails.getValueMap().get("additionalinformationmobilelabel",String.class);
            sectionDetailsModel.setAdditionalinformationmobilelabel(additionalinformationmobilelabel);


           // towers.add(sectionDetailsModel);
            if(towerDetails.hasChildren()){
                String assetitemsPath = towerDetails.getPath()+"/assetItems";
                Resource assetItemResource = resourceResolver.getResource(assetitemsPath);
                Iterator<Resource> childResource = assetItemResource.listChildren();
                List<ThreeDBuildingInfoTypeBeanModel> assetItemsList = new ArrayList<>();
                while(childResource.hasNext()){
                    Resource child = childResource.next();
                    if(child.getValueMap().get("itemType",String.class).equals("imagegallery")){
                        ThreeDBuildingInfoTypeBeanModel infoTypeBeanModel = new ThreeDBuildingInfoTypeBeanModel();
                        infoTypeBeanModel.setItemType(child.getValueMap().get("itemType",String.class));
                        infoTypeBeanModel.setImagegalleryitemlabel(child.getValueMap().get("imagegalleryitemlabel",String.class));
                        String imagegallryPath = child.getPath()+"/addimagegallery";
                        Resource imageGallary = resourceResolver.getResource(imagegallryPath);
                        if(imageGallary!=null) {
                            Iterator<Resource> imageGallarylist = imageGallary.listChildren();
                            List<ThreeDBuildingImageGalleryBeanModel> imagelist = new ArrayList<>();
                            while (imageGallarylist.hasNext()) {
                                Resource imageGallaryItem = imageGallarylist.next();
                                ThreeDBuildingImageGalleryBeanModel imageGalleryBeanModel = new ThreeDBuildingImageGalleryBeanModel();
                                String image = imageGallaryItem.getValueMap().get("galleryimage", String.class);
                                imageGalleryBeanModel.setGalleryimage(image);
                                String caption = imageGallaryItem.getValueMap().get("caption", String.class);
                                imageGalleryBeanModel.setCaption(caption);
                                String alttext = imageGallaryItem.getValueMap().get("alttext", String.class);
                                imageGalleryBeanModel.setAlttext(alttext);
                                imagelist.add(imageGalleryBeanModel);
                            }
                            infoTypeBeanModel.setAddimagegallery(imagelist);
                        }
                        assetItemsList.add(infoTypeBeanModel);
                    }
                    else if(child.getValueMap().get("itemType",String.class).equals("textimage")){
                        ThreeDBuildingInfoTypeBeanModel infoTypeBeanModel = new ThreeDBuildingInfoTypeBeanModel();
                        infoTypeBeanModel.setItemType(child.getValueMap().get("itemType",String.class));
                        infoTypeBeanModel.setTextimageitemlabel(child.getValueMap().get("textimageitemlabel",String.class));
                        String textimagePath = child.getPath()+"/addtextimages";
                        Resource textImage = resourceResolver.getResource(textimagePath);
                        if(textImage!= null) {
                            Iterator<Resource> textImagelist = textImage.listChildren();
                            List<ThreeDBuildingTextImageBeanModel> textimagelist = new ArrayList<>();
                            while (textImagelist.hasNext()) {
                                Resource textImageItem = textImagelist.next();
                                ThreeDBuildingTextImageBeanModel textImageBeanModel = new ThreeDBuildingTextImageBeanModel();
                                String image = textImageItem.getValueMap().get("image", String.class);
                                textImageBeanModel.setImage(image);
                                String imagelabel = textImageItem.getValueMap().get("imagelabel", String.class);
                                textImageBeanModel.setImagelabel(imagelabel);
                                String textimagetitle = textImageItem.getValueMap().get("textimagetitle", String.class);
                                textImageBeanModel.setTextimagetitle(textimagetitle);
                                String content = textImageItem.getValueMap().get("content", String.class);
                                textImageBeanModel.setContent(content);
                                textimagelist.add(textImageBeanModel);
                            }
                            infoTypeBeanModel.setAddtextimages(textimagelist);
                        }
                        assetItemsList.add(infoTypeBeanModel);
                    }
                    else if(child.getValueMap().get("itemType",String.class).equals("floorplans")){
                        ThreeDBuildingInfoTypeBeanModel infoTypeBeanModel = new ThreeDBuildingInfoTypeBeanModel();
                        infoTypeBeanModel.setItemType(child.getValueMap().get("itemType",String.class));
                        infoTypeBeanModel.setFloorplanitemlabel(child.getValueMap().get("floorplanitemlabel",String.class));
                        infoTypeBeanModel.setFloorplanstitle(child.getValueMap().get("floorplanstitle",String.class));
                        infoTypeBeanModel.setFloorplanscontent(child.getValueMap().get("floorplanscontent",String.class));
                        String floorplanPath = child.getPath()+"/addfloorplans";
                        Resource floorplan = resourceResolver.getResource(floorplanPath);
                        if(floorplan!=null) {
                            Iterator<Resource> floorPlanlist = floorplan.listChildren();
                            List<ThreeDBuildingFloorPlansBeanModel> floorplanlist = new ArrayList<>();
                            while (floorPlanlist.hasNext()) {
                                Resource textImageItem = floorPlanlist.next();
                                ThreeDBuildingFloorPlansBeanModel floorPlansBeanModel = new ThreeDBuildingFloorPlansBeanModel();
                                String floorlabel = textImageItem.getValueMap().get("floorlabel", String.class);
                                floorPlansBeanModel.setFloorlabel(floorlabel);
                                String floornumber = textImageItem.getValueMap().get("floornumber", String.class);
                                floorPlansBeanModel.setFloornumber(floornumber);
                                String floorplanimage = textImageItem.getValueMap().get("floorplanimage", String.class);
                                floorPlansBeanModel.setFloorplanimage(floorplanimage);
                                String floorplanimagealttext = textImageItem.getValueMap().get("floorplanimagealttext", String.class);
                                floorPlansBeanModel.setFloorplanimagealttext(floorplanimagealttext);
                                String secondaryimage = textImageItem.getValueMap().get("secondaryimage", String.class);
                                floorPlansBeanModel.setSecondaryimage(secondaryimage);
                                String secondaryimagealttext = textImageItem.getValueMap().get("secondaryimagealttext", String.class);
                                floorPlansBeanModel.setSecondaryimagealttext(secondaryimagealttext);
                                floorplanlist.add(floorPlansBeanModel);
                            }
                            infoTypeBeanModel.setAddfloorplans(floorplanlist);
                        }

                        assetItemsList.add(infoTypeBeanModel);
                    }
                }
                sectionDetailsModel.setAssetItems(assetItemsList);
            }
            towers.add(sectionDetailsModel);
        }
    }

}


