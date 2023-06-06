package com.fraserproperty.onebangkok.core.servlets;
import com.adobe.granite.crypto.CryptoException;
import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.xss.XSSAPI;

import com.adobe.granite.crypto.CryptoSupport;
import com.fraserproperty.onebangkok.core.config.EnquireNewsletterConfig;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import javax.servlet.Servlet;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(service = Servlet.class)
@SlingServletResourceTypes(methods = {HttpConstants.METHOD_GET,
        HttpConstants.METHOD_POST}, resourceTypes = "/apps/onebangkok/components/page", selectors = "email", extensions = "json")
public class EnquireNewsletterFormServlet extends SlingAllMethodsServlet {
    @Reference
    transient XSSAPI xssApi;

    @Reference
    private transient CryptoSupport cryptoSupport;

    @Reference
    private transient EnquireNewsletterConfig enquireNewsletterConfig;

    private static final long serialVersionUID = -6538907413775455877L;
    private static final Logger log = LoggerFactory.getLogger(EnquireNewsletterFormServlet.class);

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        try {
            JSONObject json = new JSONObject();
            json.put("formId", xssApi.encodeForHTML(request.getParameter("formId")));
            json.put("subject", xssApi.encodeForHTML(request.getParameter("subject")));
            json.put("firstName", xssApi.encodeForHTML(request.getParameter("firstName")));
            json.put("lastName", xssApi.encodeForHTML(request.getParameter("lastName")));
            json.put("mobile", xssApi.encodeForHTML(request.getParameter("mobile")));
            String tagId= request.getParameter("department");
            String resourcepath;
            resourcepath=request.getParameter("resourcePath");
            String path = cryptoSupport.unprotect(resourcepath);
            String departmentEmail=(request.getResourceResolver().resolve(path)).getValueMap().get("others",String.class);
            Resource resource = request.getResourceResolver().resolve(path + "/departments");
            Iterable<Resource> childNodes=resource.getChildren();
            for (Resource childNode:childNodes
            ) {
                String currentTag= childNode.getValueMap().get("department",String.class);
                String currentEmail= childNode.getValueMap().get("departmentEmail",String.class);
                if(currentTag.equals(tagId))
                {
                    departmentEmail=currentEmail;
                }
            }
            String departmentName;
            TagManager tagManager = request.getResourceResolver().adaptTo(TagManager.class);
            Tag tag = tagManager.resolve(tagId);
            if(tag!=null)
                departmentName=tag.getTitle();
            else
                departmentName=tagId;
            json.put("department", departmentName);
            json.put("company", StringUtils.isNotBlank(request.getParameter("company")) ? xssApi.encodeForHTML(request.getParameter("company")) : "n/a");
            json.put("comments", xssApi.encodeForHTML(request.getParameter("comments")));
            json.put("userEmail", xssApi.encodeForHTML(request.getParameter("userEmail")));

            Resource recipientEmailResource = request.getResourceResolver().resolve(path+"/recipientemails");
            Iterable<Resource> childRecipients = recipientEmailResource.getChildren();
            ArrayList<String> reciepientEmails = new ArrayList<>();
            for (Resource child:childRecipients
            ) {
                reciepientEmails.add(child.getValueMap().get("emails",String.class));
            }
            String recipientEmail = String.join(",",reciepientEmails);
            //recipientEmail=request.getParameter("recipientEmailField");
            if(recipientEmail.isEmpty())
            {
                recipientEmail=departmentEmail;
            }
            else
            {
                recipientEmail=recipientEmail+","+departmentEmail;
            }
            json.put("recipientEmailField", recipientEmail);
            json.put("senderEmailField", enquireNewsletterConfig.senderEmail());
            String token = request.getParameter("token");


            json.put("token", token);

            String params = "secret=" + enquireNewsletterConfig.googleSecretKey()
                    + "&response=" + token;

            String siteVerifyUrl = "https://www.google.com/recaptcha/api/siteverify";

            HttpURLConnection http = (HttpURLConnection) new URL(siteVerifyUrl).openConnection();
            OutputStream out = null;
            InputStream res = null;

            http.setConnectTimeout(5000);
            http.setReadTimeout(5000);
            http.setDoOutput(true);
            http.setRequestMethod("POST");
            http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            out = http.getOutputStream();
            out.write(params.getBytes(StandardCharsets.UTF_8));
            out.flush();

            res = http.getInputStream();

            BufferedReader br = new BufferedReader(new InputStreamReader(res, StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            int cp;
            while ((cp = br.read()) != -1) {
                sb.append((char) cp);
            }
            JSONObject siteVerifyjson = new JSONObject(sb.toString());

            log.debug("siteVerifyjson :" + siteVerifyjson);
            if (siteVerifyjson.getBoolean("success")) {
                populateInfraParams(json);
                log.debug("json :" + json);
                String resPostCall = postCall(json);
                if (resPostCall.contains("204")) {
                    response.setStatus(SlingHttpServletResponse.SC_OK);
                    response.getWriter().print("successful");
                } else {
                    response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.sendError(500, "Email Failure");
                }
            } else {
                response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.sendError(500, "captcha validation failed");
            }


        } catch (JSONException | IOException | InterruptedException | CryptoException e) {
            response.sendError(500, "unsuccessful");
            log.error("{}", e);
        }
    }

    private String  postCall(JSONObject json) throws IOException, InterruptedException {
        String jsonString = json.toString();
        log.debug("adobe io :" + enquireNewsletterConfig.adobeioposturl()
                + "\n runtime login : " + enquireNewsletterConfig.runtimelogginon());
        HttpRequest httpRequest = HttpRequest.newBuilder(URI.create(enquireNewsletterConfig.adobeioposturl()))
                .header("X-Require-Whisk-Auth", enquireNewsletterConfig.enquireformactionpassword())
                .header("X-OW-EXTRA-LOGGING", enquireNewsletterConfig.runtimelogginon())
                .header("Content-Type", "application/json").POST(BodyPublishers.ofString(jsonString)).build();

        HttpResponse response = HttpClient.newHttpClient().send(httpRequest, BodyHandlers.ofString());
        log.debug("response body :"+response.body().toString());
        return response.toString();
    }

    private void populateInfraParams(JSONObject json) throws JSONException {
        json.put("crmClientId", enquireNewsletterConfig.client_id());
        json.put("crmTokenIdUrl", enquireNewsletterConfig.crmTokenIdUrl());
        json.put("crmClientSecret", enquireNewsletterConfig.client_secret());
        json.put("crmPostUrl", enquireNewsletterConfig.crmposturl());
        json.put("crmGrantType", enquireNewsletterConfig.grant_type());
        json.put("crmPassword", enquireNewsletterConfig.password());
        json.put("crmUserName", enquireNewsletterConfig.username());
        json.put("crmUrlForIdentifier", enquireNewsletterConfig.urlForIdentifier());
        json.put("sgMailTemplateId", enquireNewsletterConfig.mailTemplateId());
        json.put("sgMailKey", enquireNewsletterConfig.sgMailKey());
    }
}
