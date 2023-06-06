package com.fraserproperty.onebangkok.core.models;

import com.day.crx.JcrConstants;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fraserproperty.onebangkok.core.utils.Constants;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class ReportDownloadModel {

    List<Resource> allPdfAssets = new ArrayList<>();
    private static final Logger Log = LoggerFactory.getLogger(ReportDownloadModel.class);
    List<ReportDownloadBeanModel> pdfDetails = new ArrayList<>();
    @Self
    protected SlingHttpServletRequest request;

    @SlingObject
    private ResourceResolver resourceResolver;

    @SlingObject
    private Resource currentResource;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String heading;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String description;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String assetrootPath;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String filterHeading;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String filterDefaultText;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String downloadctaLabel;

    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String noresultsMessage;

    @PostConstruct
    protected void init() {
        if(!assetrootPath.equals(StringUtils.EMPTY)) {
            Resource assetResource = resourceResolver.getResource(assetrootPath);
            if (assetResource != null) {
                readAllPdfAssets(assetResource);
                getPdfAssetDetails();
            }
        }
    }

    private void readAllPdfAssets(Resource assetResource) {
        Iterator<Resource> assets = assetResource.listChildren();
        while (assets.hasNext()) {
            Resource asset = assets.next();

            if (asset.getPath().endsWith(".pdf")) {
                allPdfAssets.add(asset);
            }
            Iterator<Resource> childAssets = asset.listChildren();
            while (childAssets.hasNext()) {
                Resource childAsset = childAssets.next();
                readAllPdfAssets(childAsset);
                if (childAsset.getPath().endsWith(".pdf")) {
                    allPdfAssets.add(childAsset);
                }
            }
        }
    }

    private void getPdfAssetDetails() {
        for (Resource pdfAsset : allPdfAssets) {
            ReportDownloadBeanModel reportdownload = new ReportDownloadBeanModel();
            String pdfName = pdfAsset.getName();
            String metaDatapath = pdfAsset.getPath()+ "/" + JcrConstants.JCR_CONTENT + "/" +"metadata";
            Resource metadataResource = resourceResolver.getResource(metaDatapath);
            String pdfmetaDataName = metadataResource != null ? metadataResource.getValueMap().get("dc:title", StringUtils.EMPTY).toString() : StringUtils.EMPTY;
            if(!pdfmetaDataName.equals(StringUtils.EMPTY)){
                reportdownload.setPdfName(pdfmetaDataName);
            }
            else {
                reportdownload.setPdfName(pdfName);
            }
            String year = pdfAsset.getParent().getName();
            reportdownload.setYear(year);
            String ctaUrl = pdfAsset.getPath();
            reportdownload.setCtaUrl(ctaUrl);
            String thumbnail_path = pdfAsset.getPath() + "/" + JcrConstants.JCR_CONTENT + "/" +Constants.METADATA ;
            Resource thumbnail_resource_property = resourceResolver.getResource(thumbnail_path);
            String thumbnail_image= thumbnail_resource_property != null ? thumbnail_resource_property.getValueMap().get(Constants.THUMBNAIL, StringUtils.EMPTY).toString() : StringUtils.EMPTY;
            if (!thumbnail_image.equals(StringUtils.EMPTY)) {
                reportdownload.setPdfImage(thumbnail_image);
            }
            else{
                String pdfImage = pdfAsset.getPath() + "/" + JcrConstants.JCR_CONTENT + "/" + Constants.RENDITIONIMAGEPATH;
                reportdownload.setPdfImage(pdfImage);
            }
            pdfDetails.add(reportdownload);
        }
    }

    public String getHeading() {
        return CommonUtils.removePTagFromRichText(heading);
    }

    public String getDescription() {
        return CommonUtils.removePTagFromRichText(description);
    }


    public String getAssetrootPath() {
        return assetrootPath;
    }

    public String getFilterHeading() {
        return filterHeading;
    }

    public String getFilterDefaultText() {
        return filterDefaultText;
    }

    public String getDownloadctaLabel() {
        return downloadctaLabel;
    }

    public String getNoresultsMessage() {
        return CommonUtils.removePTagFromRichText(noresultsMessage);
    }

    public List<ReportDownloadBeanModel> getPdfDetails() {
        return pdfDetails;
    }
}
