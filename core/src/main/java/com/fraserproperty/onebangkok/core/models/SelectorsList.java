package com.fraserproperty.onebangkok.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.inject.Inject;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SelectorsList {
	@ValueMapValue
	public String selectorLabel;
	@Inject
	private String imagePath;

	private String tabTarget;

	@Inject
	private String imageAltText;

	@Inject
	private boolean defaultName;

	public boolean getDefaultName() {
		return defaultName;
	}

	public String getImagePath() {
		return imagePath;
	}

	public String getImageAltText() {
		return imageAltText;
	}

	public String getSelectorLabel() {
		return selectorLabel;
	}

	public String getTabTarget() {
		tabTarget = selectorLabel.replaceAll(" ", "-").toLowerCase();
		return tabTarget;
	}
}