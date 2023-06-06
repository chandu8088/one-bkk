package com.fraserproperty.onebangkok.core.models;


import java.util.*;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.fraserproperty.onebangkok.core.utils.CommonUtils;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class NavigationMenu {
	@SlingObject
    	private Resource currentResource;
    	@SlingObject
    	private ResourceResolver resourceResolver;
	@ScriptVariable
	private Page currentPage;

    	Resource homePageResource;

    	@ValueMapValue
    	@Default(values = StringUtils.EMPTY)
    	private String logo;

    	@ValueMapValue
    	@Default(values = StringUtils.EMPTY)
    	private String logoLink;

    	@ValueMapValue
    	@Default(values = StringUtils.EMPTY)
    	private String logoAltText;

    	@ValueMapValue
    	@Default(values = StringUtils.EMPTY)
    	private String homePagePath;

    	@ValueMapValue
    	@Default(values = StringUtils.EMPTY)
    	private String enquiryLabel;

    	@ValueMapValue
    	@Default(values = StringUtils.EMPTY)
    	private String enquiryFormId;

    	@ValueMapValue
    	@Default(values = StringUtils.EMPTY)
    	private String contactHeading;

    	@ValueMapValue
    	@Default(values = StringUtils.EMPTY)
    	private String contactRTE;

    	private String homePageTitle;

    	private static String rootPath = "/content/onebangkok";
    	private static String HIDENAV = "hideInNav";

    	Map<String,ArrayList<Page>> navigationPath;

	ArrayList<Map<String,String>> languageNav;
    	ArrayList<Page> navigationList;
    	ArrayList<Page> level1;
    	ArrayList<Page> level2;


    	@PostConstruct
    	protected void init() {

   	 	PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
    		Page homePage = pageManager.getContainingPage(homePagePath);

    		navigationPath = new HashMap<String,ArrayList<Page>>();
	    	if(homePage != null) {
	    		homePageTitle = homePage.getTitle();
    			level1 = new ArrayList<Page>();
    			Iterator<Page> level1Pages = homePage.listChildren();
    			while(level1Pages.hasNext()){
    				Page level1Page = level1Pages.next();
    				String hideInNav = level1Page.getProperties().get(HIDENAV, StringUtils.EMPTY);
	    			if(!StringUtils.equals(hideInNav, "true")){
    					level1.add(level1Page);
    					Iterator<Page> level2Pages = level1Page.listChildren();
    					level2 = new ArrayList<Page>();
    					while(level2Pages.hasNext()){
    						Page level2Page = level2Pages.next();
    						String hideNav = level2Page.getProperties().get(HIDENAV, StringUtils.EMPTY);
	    					if(!StringUtils.equals(hideNav, "true")){
    							level2.add(level2Page);
    						}
    					}
    					navigationPath.put(level1Page.getTitle(), level2);
    				}
	        	}
	        	navigationPath.put(homePage.getTitle(), level1);
    	  	}
    	}


	public Map<String,ArrayList<Page>> getNavigationPath() {
		return navigationPath;
    	}

	public ArrayList<Map<String,String>> getLanguageNav() {
		PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
		Page rootPage = pageManager.getContainingPage(rootPath);
		languageNav = new ArrayList<Map<String,String>>();
		if(rootPage != null) {
			Iterator<Page> languagePages = rootPage.listChildren();
			while(languagePages.hasNext()){
				Page langPage = languagePages.next();
				String langRoot = String.valueOf(langPage.getProperties().get("cq:isLanguageRoot"));
				if(langRoot.equalsIgnoreCase("true")) {
					HashMap<String, String> langNav = new HashMap<String, String>();
					langNav.put("pageTitle", langPage.getTitle().toUpperCase());
					langNav.put("nodeTitle", langPage.getName().toUpperCase());
					String currentPath = currentPage.getPath();
					String[] parts = currentPath.split("/");
					boolean isActive = Arrays.asList(parts).contains(langPage.getName());
					langNav.put("pageActive", String.valueOf(isActive));
					String langPath = getLangPath(currentPath, langPage.getName(), parts.length - 1);
					langNav.put("langPath", langPath);
					languageNav.add(langNav);
				}
			}
		}
		return languageNav;
	}

	public String getLangPath(String currentPath,String langNode,int len) {

        int langEndPos = StringUtils.ordinalIndexOf(currentPath,"/",len);
		String langPath = rootPath+"/"+langNode+currentPath.substring(langEndPos,currentPath.length());
		if(resourceResolver.getResource(langPath) != null) {
			return langPath;
		}
		else{
			return rootPath+"/"+langNode;
		}
	}

	public String getHomePageTitle() {
		return homePageTitle;
	}


	public String getLogo() {
		return logo;
	}


	public String getLogoLink() {
		return logoLink;
	}


	public String getLogoAltText() {
		return logoAltText;
	}


	public String getHomePagePath() {
		return homePagePath;
	}


	public String getEnquiryLabel() {
		return enquiryLabel;
	}


	public String getEnquiryFormId() {
		return enquiryFormId.replaceAll(" ", "-");
	}


	public String getContactHeading() {
		return contactHeading;
	}


	public String getContactRTE() {
		return CommonUtils.removePTagFromRichText(contactRTE);
	}
}	