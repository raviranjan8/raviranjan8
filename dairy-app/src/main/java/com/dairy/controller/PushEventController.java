package com.dairy.controller;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.dairy.model.Base;
import com.dairy.model.Order;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(allowedHeaders = "*")
@Controller
@RequestMapping("/push")
public class PushEventController {

	@Autowired
	TaskExecutor executor;
	
	private static Map<String, SseEmitter> emitterList = new HashMap<String, SseEmitter>();
	private static Map<String, SseEmitter> emitterListOther = new HashMap<String, SseEmitter>();
	
	//for order notification
    @GetMapping("/sse/{id}" )
    public SseEmitter handleSse(@PathVariable("id") String id) {
    	System.out.println(">>>>>>>>>>>>>>"+id);
    	SseEmitter emitter = new SseEmitter(-1l);
    	emitterList.put(id, emitter);
        return emitter;
    } 
    
    //for other kins of notification like product
    @GetMapping("/sseOther/{id}" )
    public SseEmitter handleSseOther(@PathVariable("id") String id) {
    	SseEmitter emitter = new SseEmitter(-1l);
    	emitterListOther.put(id, emitter);
        return emitter;
    } 
    
    
    static ObjectMapper obj = new ObjectMapper();
    public static void pushMessages(Base base, Boolean other) {
    	String id = null;
    	if(base instanceof Order) {
    		id = ((Order)base).getMobile()+"";
    	}
    	Map<String, SseEmitter> map=null;
    	if(other) {
    		map = emitterList;
    	}else {
    		map = emitterListOther;
    	}
    	SseEmitter emitter = map.get(id);
    	if(null != emitter) {
			try {
	            String jsonStr = obj.writeValueAsString(base);
				emitter.send(SseEmitter.event().name("message").data(jsonStr, MediaType.TEXT_EVENT_STREAM));
			} catch (Exception e) {
				map.remove(id);
				e.printStackTrace();
			}
    	}
    	//to send notification to all admins
    	//the Admin type will be send in the {id} itself like ADMIN9021717570
    	Map<String, SseEmitter> tempMap = map.entrySet().stream().filter(p ->  p.getKey().startsWith("ADMIN")).collect(Collectors.toMap(p -> p.getKey(), p -> p.getValue())); 
    	if(null != tempMap) {
	    	Iterator<SseEmitter> itr = tempMap.values().iterator();
	    	while(itr.hasNext()) {
	    		try {
		        	String jsonStr = obj.writeValueAsString(base);
		        	itr.next().send(SseEmitter.event().name("message").data(jsonStr, MediaType.TEXT_EVENT_STREAM));
	        	} catch (Exception e) {
	        		itr.remove();
					e.printStackTrace();
				}
	    	}
    	}
    }
    
    
    
}