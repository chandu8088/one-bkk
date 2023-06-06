package com.fraserproperty.onebangkok.core.servlets;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMMode;
import java.io.IOException;
import java.util.Calendar;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryResult;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Component(service = Servlet.class,
        property = {
                "sling.servlet.resourceTypes=" + "cq/Page",
                "service.description" + "=Notice Alert Offer Servlet",
                "sling.servlet.methods=" + HttpConstants.METHOD_GET,
                "sling.servlet.selectors =" + "getOffers",
                "sling.servlet.extensions=" + "json"
        })
public class NoticeAlertServlet extends SlingAllMethodsServlet {

    private static final Logger LOGGER = LoggerFactory.getLogger(NoticeAlertServlet.class);
    private static final long serialVersionUID = 1L;
    private static String offersPath = "/content/experience-fragments/onebangkok/";
    int frequency = 0;
    int offerTimeCheck = 0;
    Calendar startDate = null;
    Calendar startTime = null;
    Calendar endDate = null;
    Calendar endTime = null;
    String finalPath = StringUtils.EMPTY;
    Cookie cookie;
    transient Page alertPage;

    @Override
    protected void doGet(final SlingHttpServletRequest request,
                         final SlingHttpServletResponse response) throws ServletException, IOException {
        ResourceResolver resourceResolver = request.getResourceResolver();

        try {
            String JCR2_SEARCH = "SELECT * FROM [nt:unstructured] AS comp WHERE ISDESCENDANTNODE(comp, \"/content/experience-fragments/onebangkok/\") AND [sling:resourceType] = \"onebangkok/components/noticealert\" AND status = \"active\" order by startdate desc";
            Session session = resourceResolver.adaptTo(Session.class);
            Query query = session.getWorkspace().getQueryManager().createQuery(JCR2_SEARCH, Query.JCR_SQL2);
            QueryResult queryResult = query.execute();
            NodeIterator offerNodes = queryResult.getNodes();
            while (offerNodes.hasNext()) {
                Node offerNode = offerNodes.nextNode();
                finalPath = offerNode.getPath();
                PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
                alertPage = pageManager.getContainingPage(finalPath);
                if (offerNode.hasProperty("frequency")) {
                    String property = offerNode.getProperty("frequency").getValue().toString();
                    frequency = Integer.parseInt(property);
                }

                if (offerNode.hasProperty("startTime")) {
                    startTime = offerNode.getProperty("startTime").getValue().getDate();
                }
                if (offerNode.hasProperty("startdate")) {
                    startDate = offerNode.getProperty("startdate").getValue().getDate();
                }
                if (offerNode.hasProperty("endTime")) {
                    endTime = offerNode.getProperty("endTime").getValue().getDate();
                }
                if (offerNode.hasProperty("enddate")) {
                    endDate = offerNode.getProperty("enddate").getValue().getDate();
                }
                startDate.set(startDate.get(Calendar.YEAR), startDate.get(Calendar.MONTH), startDate.get(Calendar.DATE), startTime.get(Calendar.HOUR_OF_DAY), startTime.get(Calendar.MINUTE), startTime.get(Calendar.SECOND));
                endDate.set(endDate.get(Calendar.YEAR), endDate.get(Calendar.MONTH), endDate.get(Calendar.DATE), endTime.get(Calendar.HOUR_OF_DAY), endTime.get(Calendar.MINUTE), endTime.get(Calendar.SECOND));

                Calendar currentDateTime = Calendar.getInstance();
                int startComp = startDate.compareTo(currentDateTime);
                int endComp = endDate.compareTo(currentDateTime);
                if (endComp >= 0 && startComp <=0) {
                    offerTimeCheck = 1;
                    break;
                }
            }
        } catch (RepositoryException e) {
            LOGGER.error(e.getMessage());
        }
        // Cookie
        int cookieValue = 1;
        int cookieFlag = 0;
        int cookieAge = 0;

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (int i = 0; i < cookies.length; i++) {
                Cookie cookie = cookies[i];
                String cookieName = cookie.getName();
                if (cookieName.equalsIgnoreCase("onebkkOffers")) {
                    cookieValue = Integer.parseInt(cookie.getValue());
                    cookie.setValue(String.valueOf(cookieValue + 1));
                    cookie.setPath("/");
                    cookieAge = cookie.getMaxAge();
                    cookieFlag = 1;
                    response.addCookie(cookie);
                }
            }
            if (cookieFlag == 0) {
                createCookie(response);
            }
        } else {
            createCookie(response);
        }

        //Encode the submitted form data to JSON
        JSONObject obj = new JSONObject();
        try {
            obj.put("cookie_age", cookieAge);
            obj.put("cookie_value", cookieValue);
            if (cookieValue >= 1 && cookieValue < frequency && offerTimeCheck == 1) {
                obj.put("response_path", finalPath);
                obj.put("xf_path", alertPage.getPath());
                obj.put("wcmmode", WCMMode.fromRequest(request));
                offerTimeCheck = 0;
            } else {
                obj.put("response_path", StringUtils.EMPTY);
                obj.put("xf_path", StringUtils.EMPTY);
            }

        } catch (JSONException e) {
            LOGGER.error(e.getMessage());
        }

        //Get the JSON formatted data
        String jsonData = obj.toString();

        //Return the JSON formatted data
        response.getWriter().write(jsonData);
    }

    void createCookie(SlingHttpServletResponse response) {
        cookie = new Cookie("onebkkOffers", "1");
        cookie.setMaxAge(86400);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

}