package com.fraserproperty.onebangkok.core.models;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.Collections;
import java.util.Comparator;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.fraserproperty.onebangkok.core.utils.CommonUtils;
import com.fraserproperty.onebangkok.core.utils.Constants;

@Model(adaptables = Resource.class, 
	defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HistoryModel {

	@ChildResource
	private List<LinkModel> historyList = new ArrayList<LinkModel>();

	private List<HistoryBeanModel> historyListItems = new ArrayList<HistoryBeanModel>();

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String rootpath;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String selectiontype;

	@ValueMapValue
	@Default(values = StringUtils.EMPTY)
	private String heading;

	@SlingObject
	private ResourceResolver resourceResolver;

	List<LinkModel> allChildPages = new ArrayList<LinkModel>();

	SimpleDateFormat inputFormat = new SimpleDateFormat(Constants.DATEFORMAT);

	@PostConstruct
	protected void init() throws ParseException {
		if (selectiontype.equals(Constants.HISTORY)) {
			getHistorytems(historyList);
		} else {
			getFolderItems();
		}
	}

	private void getFolderItems() throws ParseException {
		readAllNewsDetailPages(rootpath);

		for (LinkModel linkModel : allChildPages) {
			HistoryBeanModel historyBeanModel = new HistoryBeanModel();
			String historyItem = linkModel.getPath();
			Resource path = resourceResolver.getResource(historyItem);
			if (Objects.nonNull(path.getChild(Constants.MASTER_VARIATION))) {
				ValueMap child = path.getChild(Constants.MASTER_VARIATION).getValueMap();

				String title = child.get(Constants.TITLE, StringUtils.EMPTY);
				historyBeanModel.setTitle(title);
				String description = CommonUtils.removePTagFromRichText(child.get(Constants.DESCRIPTION, StringUtils.EMPTY));
				historyBeanModel.setDescription(description);
				String image = child.get(Constants.IMAGE, StringUtils.EMPTY);
				historyBeanModel.setImage(image);
				String imgAlt = child.get(Constants.ALTTEXT, StringUtils.EMPTY);
				historyBeanModel.setImgAlt(imgAlt);
				String startYear = child.get(Constants.STARTYEAR, StringUtils.EMPTY).toString();

				String endYear = child.get(Constants.ENDYEAR, StringUtils.EMPTY);
				String year = startYear;
				if (!endYear.equals(StringUtils.EMPTY)) {
					year = year + Constants.HYPHEN + endYear;
				}
				historyBeanModel.setStartYear(year);
				historyBeanModel.setEndYear(endYear);
			}
			historyListItems.add(historyBeanModel);
		}
		Collections.sort(historyListItems, new Comparator<HistoryBeanModel>() {
			public int compare(final HistoryBeanModel object1, final HistoryBeanModel object2) {
				return object1.getStartYear().compareTo(object2.getStartYear());
			}
		});

	}

	private void readAllNewsDetailPages(String rootPath) {

		if (rootPath != null) {
			Resource path = resourceResolver.getResource(rootPath);

			Iterator<Resource> childNodes = path.listChildren();
			while (childNodes.hasNext()) {
				LinkModel linkModel = new LinkModel();
				Resource childNode = childNodes.next();
				if (childNode.getName().equals(Constants.JCRCONTENT)) {
					Boolean isContentFragment = childNode.getValueMap().containsKey(Constants.CONTENTFRAGMENT)
							? childNode.getValueMap().get(Constants.CONTENTFRAGMENT, Boolean.class)
							: false;
					if (isContentFragment == true) {
						linkModel.setPath(childNode.getParent().getPath());
						allChildPages.add(linkModel);
					}
				}
				Iterator<Resource> subChilds = childNode.listChildren();
				while (subChilds.hasNext()) {
					Resource subchild = subChilds.next();

					if (subchild.getName().equals(Constants.JCRCONTENT)) {
						Boolean isChildContentFragment = subchild.getValueMap().containsKey(Constants.CONTENTFRAGMENT)
								? subchild.getValueMap().get(Constants.CONTENTFRAGMENT, Boolean.class)
								: false;
						if (isChildContentFragment == true) {
							linkModel.setPath(subchild.getParent().getPath());
							allChildPages.add(linkModel);
						}
					}
					readAllNewsDetailPages(subchild.getPath());

				}

			}

		}

	}

	private void getHistorytems(List<LinkModel> historyList2) throws ParseException {

		for (LinkModel linkModel : historyList) {
			HistoryBeanModel historyBeanModel = new HistoryBeanModel();
			String historyItem = linkModel.getLink();
			Resource path = resourceResolver.getResource(historyItem);
			if (Objects.nonNull(path.getChild(Constants.MASTER_VARIATION))) {
				ValueMap child = path.getChild(Constants.MASTER_VARIATION).getValueMap();

				String title = child.get(Constants.TITLE, StringUtils.EMPTY);
				historyBeanModel.setTitle(title);
				String description = child.get(Constants.DESCRIPTION, StringUtils.EMPTY);
				historyBeanModel.setDescription(description);
				String image = child.get(Constants.IMAGE, StringUtils.EMPTY);
				historyBeanModel.setImage(image);
				String imgAlt = child.get(Constants.ALTTEXT, StringUtils.EMPTY);
				historyBeanModel.setImgAlt(imgAlt);
				String startYear = child.get(Constants.STARTYEAR, StringUtils.EMPTY).toString();

				String endYear = child.get(Constants.ENDYEAR, StringUtils.EMPTY);
				String year = startYear;
				if (!endYear.equals(StringUtils.EMPTY)) {
					year = year + Constants.HYPHEN + endYear;
				}
				historyBeanModel.setStartYear(year);
				historyBeanModel.setEndYear(endYear);
			}
			historyListItems.add(historyBeanModel);
		}

	}

	public List<LinkModel> getHistoryList() {
		return Collections.unmodifiableList(historyList);
	}

	public List<HistoryBeanModel> getHistoryListItems() {
		return Collections.unmodifiableList(historyListItems);
	}

	public String getHeading() {
		return CommonUtils.removePTagFromRichText(heading);
	}

}
