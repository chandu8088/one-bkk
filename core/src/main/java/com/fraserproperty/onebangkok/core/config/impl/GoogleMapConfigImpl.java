package com.fraserproperty.onebangkok.core.config.impl;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import com.fraserproperty.onebangkok.core.config.GoogleMapConfig;

@Component(service = GoogleMapConfig.class,immediate = true)
@Designate(ocd = GoogleMapConfigImpl.ServiceConfig.class )
public class GoogleMapConfigImpl implements GoogleMapConfig {

    @ObjectClassDefinition(name="One Bangkok Google Map Path",
            description = "OSGi Configuration for Google Map Path")
    public @interface ServiceConfig {

        @AttributeDefinition(
                name = "Google Map Path",
                description = "Enter Google Map Path",
                type = AttributeType.STRING)
        public String getGoogleMapPath() ;

    }

    private String googleMapPath;

    @Activate
    protected void activate(ServiceConfig serviceConfig){
    	googleMapPath=serviceConfig.getGoogleMapPath();

    }
    @Override
    public String getGoogleMapPath() {
        return googleMapPath;
    }


}
