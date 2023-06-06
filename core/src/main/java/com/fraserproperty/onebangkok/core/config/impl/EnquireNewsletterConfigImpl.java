package com.fraserproperty.onebangkok.core.config.impl;

import com.fraserproperty.onebangkok.core.config.EnquireNewsletterConfig;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@Component(service = EnquireNewsletterConfig.class, immediate = true)
@Designate(ocd = EnquireNewsletterConfigImpl.ServiceConfig.class)
public class EnquireNewsletterConfigImpl implements EnquireNewsletterConfig {

    @ObjectClassDefinition(name = "One Bangkok Enquire/Newsletter Form Configuration",
            description = "One Bangkok Enquire/Newsletter Form Configuration")
    public @interface ServiceConfig {

        @AttributeDefinition(
                name = "Google Secret Key",
                description = "Google Secret Key",
                type = AttributeType.STRING)
        public String googleSecretKey();

        @AttributeDefinition(
                name = "Email Key",
                description = "Email Key",
                type = AttributeType.STRING)
        public String sgMailKey();

        @AttributeDefinition(
                name = "Email Template Id",
                description = "Email Template Id",
                type = AttributeType.STRING)
        public String mailTemplateId();

        @AttributeDefinition(
                name = "CRM Token Url",
                description = "CRM Token Url",
                type = AttributeType.STRING)
        public String crmTokenIdUrl();

        @AttributeDefinition(
                name = "Grant Type",
                description = "Grant Type",
                type = AttributeType.STRING)
        public String granttype();

        @AttributeDefinition(
                name = "Client Id",
                description = "Client Id",
                type = AttributeType.STRING)
        public String clientid();

        @AttributeDefinition(
                name = "Client Secret",
                description = "Client Secret",
                type = AttributeType.STRING)
        public String clientsecret();

        @AttributeDefinition(
                name = "User Name",
                description = "User Name",
                type = AttributeType.STRING)
        public String username();

        @AttributeDefinition(
                name = "Password",
                description = "Password",
                type = AttributeType.STRING)
        public String password();

        @AttributeDefinition(
                name = "URL For Identifier",
                description = "URL For Identifier",
                type = AttributeType.STRING)
        public String urlForIdentifier();

        @AttributeDefinition(
                name = "Post Url",
                description = "Post Url",
                type = AttributeType.STRING)
        public String crmposturl();

        @AttributeDefinition(
                name = "Google Captcha Site Key",
                description = "Google Captcha Site Key",
                type = AttributeType.STRING)
        public String siteKey();

        @AttributeDefinition(
                name = "Enquire Form Action Password",
                description = "Enquire Form Action Password",
                type = AttributeType.STRING)
        public String enquireformactionpassword();

        @AttributeDefinition(
                name = "Adobe IO Post Url",
                description = "Adobe IO Post Url",
                type = AttributeType.STRING)
        public String adobeioposturl();

        @AttributeDefinition(
                name = "Adobe IO Extra Logging",
                description = "Adobe IO Extra Logging",
                type = AttributeType.STRING)
        public String runtimelogginon();
        
        @AttributeDefinition(
                name = "Sender Email",
                description = "Sender Email",
                type = AttributeType.STRING)
        public String senderEmail();

    }

    private String googleSecretKey;
    private String sgMailKey;
    private String mailTemplateId;
    private String crmTokenIdUrl;
    private String grant_type;
    private String client_id;
    private String client_secret;
    private String username;
    private String password;
    private String urlForIdentifier;
    private String crmposturl;
    private String siteKey;
    private String enquireformactionpassword;
    private String adobeioposturl;
    private String runtimelogginon;
    private String senderEmail;

    @Activate
    protected void activate(ServiceConfig serviceConfig) {
        googleSecretKey = serviceConfig.googleSecretKey();
        sgMailKey = serviceConfig.sgMailKey();
        mailTemplateId = serviceConfig.mailTemplateId();
        crmTokenIdUrl = serviceConfig.crmTokenIdUrl();
        grant_type = serviceConfig.granttype();
        client_id = serviceConfig.clientid();
        client_secret = serviceConfig.clientsecret();
        username = serviceConfig.username();
        password = serviceConfig.password();
        urlForIdentifier = serviceConfig.urlForIdentifier();
        crmposturl = serviceConfig.crmposturl();
        siteKey = serviceConfig.siteKey();
        enquireformactionpassword = serviceConfig.enquireformactionpassword();
        adobeioposturl = serviceConfig.adobeioposturl();
        runtimelogginon = serviceConfig.runtimelogginon();
        senderEmail = serviceConfig.senderEmail();
    }

    @Override
    public String googleSecretKey() {
        return googleSecretKey;
    }

    @Override
    public String sgMailKey() {
        return sgMailKey;
    }

    @Override
    public String mailTemplateId() {
        return mailTemplateId;
    }

    @Override
    public String crmTokenIdUrl() {
        return crmTokenIdUrl;
    }

    @Override
    public String grant_type() {
        return grant_type;
    }

    @Override
    public String client_id() {
        return client_id;
    }

    @Override
    public String client_secret() {
        return client_secret;
    }

    @Override
    public String username() {
        return username;
    }

    @Override
    public String password() {
        return password;
    }

    @Override
    public String urlForIdentifier() {
        return urlForIdentifier;
    }

    @Override
    public String crmposturl() {
        return crmposturl;
    }

    @Override
    public String siteKey() {
        return siteKey;
    }

    @Override
    public String enquireformactionpassword() {
        return enquireformactionpassword;
    }

    @Override
    public String adobeioposturl() {
        return adobeioposturl;
    }

    @Override
    public String runtimelogginon() {
        return runtimelogginon;
    }

	@Override
	public String senderEmail() {
		return senderEmail;
	}
}
