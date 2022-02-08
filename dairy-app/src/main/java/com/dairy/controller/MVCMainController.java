package com.dairy.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MVCMainController {

	@GetMapping("/home")
	public String greeting() {
		return "index.html";
	}

}
