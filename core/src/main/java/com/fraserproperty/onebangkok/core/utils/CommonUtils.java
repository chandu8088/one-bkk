package com.fraserproperty.onebangkok.core.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;

public class CommonUtils {
	
	public static String removePTagFromRichText(String richText) {
		String tmpHeading = richText;
		Pattern p = Pattern.compile(".*\\R.*");
		Matcher matcher = p.matcher(tmpHeading);
		if (matcher.find()) {
			matcher.replaceAll("<br/>");
		}
		tmpHeading = StringUtils.remove(tmpHeading, "<p>");
		tmpHeading = StringUtils.remove(tmpHeading, "</p>");
		return tmpHeading;
	}

	public static String processUrl(final String urlToProcess) {
		if (!urlToProcess.isEmpty()
				&& urlToProcess.startsWith(Constants.CONTENT_ROOT_PATH)
				&& !urlToProcess.startsWith(Constants.CONTENT_DAM_PATH)
				&& !urlToProcess.endsWith(Constants.HTML_EXTENSION)
				&& !urlToProcess.contains(Constants.HTTP_PROTOCOL)
				&& !urlToProcess.contains(Constants.HTTPS_PROTOCOL)) {
			return urlToProcess.concat(Constants.HTML_EXTENSION);
		}
		return urlToProcess;
	}

}
