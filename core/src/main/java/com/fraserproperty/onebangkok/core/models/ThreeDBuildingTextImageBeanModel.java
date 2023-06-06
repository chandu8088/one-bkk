package com.fraserproperty.onebangkok.core.models;


import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

public class ThreeDBuildingTextImageBeanModel {

    private String textimagetitle;

    private String content;

    private String image;

    private String imagelabel;

    public String getTextimagetitle() {
        return textimagetitle;
    }

    public String getContent() {
        return CommonUtils.removePTagFromRichText(content);
    }

    public String getImage() {
        return image;
    }

    public String getImagelabel() {
        return imagelabel;
    }

    public void setTextimagetitle(String textimagetitle) {
        this.textimagetitle = textimagetitle;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setImagelabel(String imagelabel) {
        this.imagelabel = imagelabel;
    }
}
