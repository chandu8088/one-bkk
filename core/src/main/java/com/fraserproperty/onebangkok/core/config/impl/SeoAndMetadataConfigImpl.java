package com.fraserproperty.onebangkok.core.config.impl;
import com.fraserproperty.onebangkok.core.config.SeoAndMetadataConfig;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;


@Component(service = SeoAndMetadataConfig.class,immediate = true)
@Designate(ocd = SeoAndMetadataConfigImpl.ServiceConfig.class )
public class SeoAndMetadataConfigImpl implements SeoAndMetadataConfig {

    @ObjectClassDefinition(name="One Bangkok SEO And Metadata",
            description = "OSGi Configuration for domain")
    public @interface ServiceConfig {

        @AttributeDefinition(
                name = "Domain",
                description = "Enter Domain",
                type = AttributeType.STRING)
        public String getDomain() ;

    }

    private String domain;

    @Activate
    protected void activate(ServiceConfig serviceConfig){
    	domain=serviceConfig.getDomain();

    }
    @Override
    public String getDomain() {
        return domain;
    }


}
