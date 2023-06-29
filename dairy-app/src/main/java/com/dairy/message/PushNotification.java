package com.dairy.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.dairy.model.Order;

public class PushNotification implements Runnable{

	@Autowired
	SseEmitter emitter;
	
	public SseEmitter getEmitter() {
		return emitter;
	}

	public void setEmitter(SseEmitter emitter) {
		this.emitter = emitter;
	}

	private Order order;
	
	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	@Override
	public void run() {
		try {
            emitter.send(SseEmitter.event().name("message").data(order.getId() + " @ " + order.getCreatedDate()+" @ "+order.getTotalPrice()));
            // we could send more events
            //emitter.complete();
        } catch (Exception ex) {
            emitter.completeWithError(ex);
        }
	}

}
