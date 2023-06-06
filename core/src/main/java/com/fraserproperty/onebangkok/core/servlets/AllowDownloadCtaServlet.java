package com.fraserproperty.onebangkok.core.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Component;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import java.io.IOException;

@Component(service = Servlet.class)
@SlingServletResourceTypes(
        methods = {HttpConstants.METHOD_GET, HttpConstants.METHOD_POST},
        resourceTypes = "/apps/onebangkok/components/page",
        selectors = "download",
        extensions = "json"
)
public class AllowDownloadCtaServlet extends SlingAllMethodsServlet {
    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        createCookie(response);

    }


    void createCookie(SlingHttpServletResponse response) {
        Cookie cookie = new Cookie("onebkkdownload", "true");
        cookie.setMaxAge(12 * 60 * 60);
        cookie.setValue("true");
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        response.getWriter().write("hello world");
        response.getWriter().write("the value is "+request.getParameter("a"));
    }
}
