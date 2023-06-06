package com.fraserproperty.onebangkok.core.models;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;


import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node; 
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.Page;
import javax.inject.Inject;
import javax.inject.Named;

import javax.inject.Inject;
import javax.jcr.nodetype.NodeDefinition;
import java.util.ArrayList;
import java.util.List;



@Model(adaptables = { Resource.class,
        SlingHttpServletRequest.class },
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SeparatorModel {
    @SlingObject
    private Resource currentResource;

    @Inject
    private Page currentPage;

	

    @SlingObject
    private ResourceResolver resourceResolver;


    @ValueMapValue
    @Default(values = StringUtils.EMPTY)
    private String slabel;

    String temp;
    String gproperty;
  String path;
    String type;
    String f_path;
    @PostConstruct
    protected void init() {


        InheritanceValueMap ivm = new HierarchyNodeInheritanceValueMap(currentPage.getContentResource());

        type=currentPage.getContentResource().getResourceType();
        path=currentResource.getParent().getPath();
        String[] parts_paths = path.split("/");
        f_path=parts_paths[parts_paths.length-1];
        String[] parts = type.split("/");
        temp=parts[parts.length-1];
        if(temp.equals("newsdetailpage")) {
            gproperty = ivm.getInherited("news", String.class);
        }
        else if(temp.equals("eventdetailpage")) {
            gproperty = ivm.getInherited("event", String.class);
        }
        }

    public String getSLabel() {
        if(temp.equals("newsdetailpage")||temp.equals("eventdetailpage"))
        {
            if(f_path.equals("container"))
            return slabel;
            else return gproperty;
        }
        else return slabel;

    }



}