package com.dairy.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/m")
public class MVCMobileMainController {
	
	@GetMapping
	public String index() {
		return "/m/index.html";
	}

}
